
import { createClient } from "@/lib/client"

export async function startTrip(params: {
  vehicleId: string | null;
  bookingId?: string;
  startMileage?: number;
  startLocation?: string;
  destination?: string;
  purpose?: string;
}) {
  const { vehicleId, bookingId, startMileage, startLocation, destination, purpose } = params;
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("trips")
    .insert({
      driver_id: user.id,
      vehicle_id: vehicleId,
      booking_id: bookingId,
      start_time: new Date().toISOString(),
      start_mileage: startMileage,
      start_location: startLocation,
      destination: destination,
      purpose: purpose,
      status: "active",
    })
    .select()

  if (error) throw error
  return data[0]
}

export async function logTripEvent(tripId: string, eventType: string, reason?: string, notes?: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from("trip_logs")
    .insert({
      trip_id: tripId,
      event_type: eventType,
      reason: reason,
      notes: notes,
      timestamp: new Date().toISOString()
    })

  if (error) throw error
  return { success: true }
}


export async function endTrip(tripId: string, endMileage: number) {
  const supabase = createClient()

  // 1. Update Trip
  const { data: trip, error } = await supabase
    .from("trips")
    .update({
      end_time: new Date().toISOString(),
      end_mileage: endMileage,
      status: "completed",
    })
    .eq("id", tripId)
    .select("booking_id")
    .single()

  if (error) throw error

  // 2. Update Parent Booking (so it leaves "Pending Assignments")
  if (trip?.booking_id) {
    const { error: bookingError } = await supabase
      .from("bookings")
      .update({
        status: "completed",
        end_mileage: endMileage
      })
      .eq("id", trip.booking_id)

    if (bookingError) {
      console.warn("Failed to update parent booking status", bookingError)
    }
  }
}

export async function getTripLogs(tripId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("trip_logs")
    .select("*")
    .eq("trip_id", tripId)
    .order("timestamp", { ascending: true })

  if (error) throw error
  return data
}

export async function getTripDetails(tripId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("trips")
    .select("*, vehicles(*), bookings(*, requester:users!bookings_requester_id_fkey(full_name, email))")
    .eq("id", tripId)
    .single()

  if (error) throw error
  return data
}

export async function getActiveTrips() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get trips where user is the assigned driver
  // Note: Self-drive logic is handled separately if needed
  const { data, error } = await supabase
    .from("trips")
    .select("*, vehicles(*), bookings(requester_id, is_self_drive)")
    .eq("driver_id", user.id)
    .eq("status", "active")

  if (error) throw error
  return data
}

export async function getAllTrips() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get trips where user is the assigned driver OR the requester
  // Complex OR filter with joined table is tricky, so we do two queries and merge for MVP simplicity/robustness

  // 1. Trips where I am the driver
  const { data: driverTrips, error: err1 } = await supabase
    .from("trips")
    .select("*, vehicles(*), users(full_name), bookings!inner(requester_id, is_self_drive)")
    .eq("driver_id", user.id)
    .order("created_at", { ascending: false })

  if (err1) throw err1

  // 2. Trips where I am the requester (via booking)
  // We use !inner to ensure we filter by the joined booking's requester_id
  const { data: requesterTrips, error: err2 } = await supabase
    .from("trips")
    .select("*, vehicles(*), users(full_name), bookings!inner(requester_id, is_self_drive)")
    .eq("bookings.requester_id", user.id)
    .order("created_at", { ascending: false })

  if (err2) throw err2

  // Merge and dedupe by ID
  const allTrips = [...(driverTrips || []), ...(requesterTrips || [])]
  const uniqueTrips = Array.from(new Map(allTrips.map(item => [item.id, item])).values())

  // Re-sort by date
  return uniqueTrips.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
