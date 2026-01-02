"use server"

import { createClient } from "@/lib/server"
import { revalidatePath } from "next/cache"

export async function startTrip(params: {
  vehicleId: string | null;
  bookingId?: string;
  startMileage?: number;
  startLocation?: string;
  destination?: string;
  purpose?: string;
}) {
  const { vehicleId, bookingId, startMileage, startLocation, destination, purpose } = params;
  const supabase = await createClient()

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
  revalidatePath("/mobile/trips")
  return data[0]
}

export async function logTripEvent(tripId: string, eventType: string, reason?: string, notes?: string) {
  const supabase = await createClient()

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
  const supabase = await createClient()

  const { error } = await supabase
    .from("trips")
    .update({
      end_time: new Date().toISOString(),
      end_mileage: endMileage,
      status: "completed",
    })
    .eq("id", tripId)

  if (error) throw error
  revalidatePath("/mobile/trips")
}

export async function getTripLogs(tripId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("trip_logs")
    .select("*")
    .eq("trip_id", tripId)
    .order("timestamp", { ascending: true })

  if (error) throw error
  return data
}

export async function getTripDetails(tripId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("trips")
    .select("*, vehicles(*), bookings(*, requester:users!bookings_requester_id_fkey(full_name, email))")
    .eq("id", tripId)
    .single()

  if (error) throw error
  return data
}

export async function getActiveTrips() {
  const supabase = await createClient()

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
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get trips where user is the assigned driver
  const { data, error } = await supabase
    .from("trips")
    .select("*, vehicles(*), users(full_name), bookings(requester_id, is_self_drive)")
    .eq("driver_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
