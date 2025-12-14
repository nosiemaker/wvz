"use server"

import { createClient } from "@/lib/server"
import { revalidatePath } from "next/cache"

export type TripRequestData = {
  startDate: string
  endDate: string
  purpose: string
  destination: string
  passengers: number
  isSelfDrive: boolean
  vehicleId?: string // Optional, for self-drive or specific requests
}

export async function createTripRequest(data: TripRequestData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // For simplicity MVP, we set status to 'pending_supervisor'
  // In a real app, we might check if user has a supervisor assigned.
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
      vehicle_id: data.vehicleId || null, // Might be null initially
      status: "pending_supervisor",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating trip request:", error)
    throw new Error("Failed to create trip request")
  }

  revalidatePath("/mobile/dashboard")
  revalidatePath("/mobile/requests")
  return booking
}

export async function getMyRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(*)")
    .eq("requester_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getPendingSupervisorApprovals() {
  const supabase = await createClient()
  // In RLS, managers should see all. We filter by status.
  const { data, error } = await supabase
    .from("bookings")
    .select("*, users!bookings_requester_id_fkey(full_name, email)")
    .eq("status", "pending_supervisor")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function approveBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "pending_allocation",
      supervisor_id: user?.id
    })
    .eq("id", bookingId)

  if (error) throw error
  revalidatePath("/compliance") // Assuming supervisor uses this portal for now
}

export async function rejectBooking(bookingId: string, reason: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("bookings")
    .update({ status: "rejected" }) // We might want to store rejection reason in a logs table or column
    .eq("id", bookingId)

  if (error) throw error
  revalidatePath("/compliance")
}

export async function getPendingAllocations() {
  const supabase = await createClient()
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
  const supabase = await createClient()

  const updateData: any = {
    status: "approved", // Ready for trip
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
  revalidatePath("/admin/bookings")
}

export async function getAllBookings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(*), users!bookings_driver_id_fkey(full_name, email), requester:users!bookings_requester_id_fkey(full_name)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
