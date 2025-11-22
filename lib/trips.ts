"use server"

import { createClient } from "@/lib/server"
import { revalidatePath } from "next/cache"

export async function startTrip(vehicleId: string, bookingId?: string) {
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
      status: "active",
    })
    .select()

  if (error) throw error
  revalidatePath("/mobile/trips")
  return data[0]
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

export async function getActiveTrips() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("trips")
    .select("*, vehicles(*)")
    .eq("driver_id", user.id)
    .eq("status", "active")

  if (error) throw error
  return data
}

export async function getAllTrips() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("trips")
    .select("*, vehicles(*), users(full_name)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
