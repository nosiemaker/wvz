
import { createClient } from "@/lib/client"

export type TripRequestData = {
  startDate: string
  endDate: string
  purpose: string
  destination: string
  passengers: number
  isSelfDrive: boolean
  vehicleId?: string
  costCenter: string
}

export async function createTripRequest(data: TripRequestData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get user profile to check capabilities and supervisor
  const { data: profile } = await supabase
    .from("users")
    .select("can_drive, supervisor_id, role")
    .eq("id", user.id)
    .single()

  if (data.isSelfDrive && !profile?.can_drive) {
    throw new Error("User is not authorized for self-drive")
  }

  // Determine initial status
  let initialStatus = "pending_allocation"
  if (profile?.supervisor_id) {
    initialStatus = "pending_supervisor"
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      requester_id: user.id,
      start_date: data.startDate,
      end_date: data.endDate,
      purpose: data.purpose,
      destination: data.destination,
      passengers: data.passengers,
      is_self_drive: data.isSelfDrive,
      vehicle_id: data.vehicleId || null,
      cost_center: data.costCenter,
      status: initialStatus,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating trip request:", error)
    throw new Error("Failed to create trip request")
  }

  return booking
}

export async function getMyRequests() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(*), trips(*)")
    .eq("requester_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getPendingSupervisorApprovals() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Fetch bookings where status is pending_supervisor AND the requester reports to the current user
  const { data, error } = await supabase
    .from("bookings")
    .select("*, requester:users!bookings_requester_id_fkey(full_name, email, supervisor_id, job_title)")
    .eq("status", "pending_supervisor")
    .eq("requester.supervisor_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("Relationship filter failed, falling back to role check.", error)
    // Fallback for managers seeing all requests if structure is loose
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
    if (["manager", "admin", "compliance"].includes(profile?.role)) {
      const { data: allPending } = await supabase
        .from("bookings")
        .select("*, requester:users!bookings_requester_id_fkey(full_name, email, job_title)")
        .eq("status", "pending_supervisor")
        .order("created_at", { ascending: false })
      return allPending
    }
    return []
  }

  return data
}

export async function approveBooking(bookingId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "pending_allocation",
      supervisor_id: user?.id,
      approved_by: user?.id
    })
    .eq("id", bookingId)

  if (error) throw error
}

export async function rejectBooking(bookingId: string, reason: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from("bookings")
    .update({
      status: "rejected",
      rejection_reason: reason
    })
    .eq("id", bookingId)

  if (error) throw error
}

export async function getPendingAllocations() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("*, users!bookings_requester_id_fkey(full_name, email)")
    .eq("status", "pending_allocation")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function allocateBooking(
  bookingId: string,
  vehicleId: string,
  driverId: string,
  isExternal: boolean = false,
  externalDetails?: any
) {
  const supabase = createClient()

  const updateData: any = {
    status: "approved",
    vehicle_id: vehicleId,
    driver_id: driverId,
  }

  if (isExternal && externalDetails) {
    updateData.external_resource_details = externalDetails
  }

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)

  if (error) throw error
}

export async function getAllBookings() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(*), users!bookings_driver_id_fkey(full_name, email), requester:users!bookings_requester_id_fkey(full_name)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getMyAssignedBookings() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(*), requester:users!bookings_requester_id_fkey(full_name, email), trips(*)")
    .eq("driver_id", user.id)
    .in("status", ["approved", "pending_allocation", "in_progress"]) // Exclude "completed"
    .order("start_date", { ascending: true })

  if (error) throw error
  return data
}

export async function startTrip(bookingId: string, startMileage: number) {
  const supabase = createClient()

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "in_progress",
      start_mileage: startMileage
    })
    .eq("id", bookingId)

  if (error) throw error
}

export async function completeTrip(bookingId: string, endMileage: number) {
  const supabase = createClient()

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "completed",
      end_mileage: endMileage
    })
    .eq("id", bookingId)

  if (error) throw error
}

export async function getFinanceStats() {
  const supabase = createClient()

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("cost_center, start_mileage, end_mileage, vehicles(plate_number)")
    .eq("status", "completed")
    .not("cost_center", "is", null)

  if (error) throw error

  const costCenters: Record<string, { count: number, mileage: number }> = {}
  let totalMileage = 0

  bookings?.forEach(b => {
    const center = b.cost_center || "Unallocated"
    if (!costCenters[center]) costCenters[center] = { count: 0, mileage: 0 }

    const dist = (b.end_mileage && b.start_mileage) ? (b.end_mileage - b.start_mileage) : 0

    costCenters[center].count += 1
    costCenters[center].mileage += dist
    totalMileage += dist
  })

  // Format for Chart
  const allocation = Object.keys(costCenters).map(k => ({
    name: k,
    cost: costCenters[k].mileage * 15, // Mock rate K15 per km
    percentage: totalMileage > 0 ? Math.round((costCenters[k].mileage / totalMileage) * 100) : 0,
    count: costCenters[k].count
  })).sort((a, b) => b.cost - a.cost)

  // Use mock totals if DB is empty
  if (totalMileage === 0) {
    return {
      totalCost: 125430,
      totalMileage: 45200,
      totalTrips: 125,
      costCenters: [
        { name: "Operations", cost: 45600, percentage: 36, count: 45 },
        { name: "Programs", cost: 38200, percentage: 30, count: 38 },
        { name: "Admin", cost: 25400, percentage: 20, count: 25 },
        { name: "Field", cost: 16230, percentage: 14, count: 17 },
      ]
    }
  }

  return {
    totalCost: totalMileage * 15,
    totalMileage,
    totalTrips: bookings?.length || 0,
    costCenters: allocation
  }
}
