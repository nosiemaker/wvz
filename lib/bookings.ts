"use server"

import { createClient } from "@/lib/server"
import { revalidatePath } from "next/cache"

export async function createBooking(vehicleId: string, startDate: string, endDate: string, costCenter: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      driver_id: user.id,
      vehicle_id: vehicleId,
      start_date: startDate,
      end_date: endDate,
      cost_center: costCenter,
      status: "pending",
    })
    .select()

  if (error) throw error
  revalidatePath("/mobile/bookings")
  return data
}

export async function getBookings() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(*)")
    .eq("driver_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function approveBooking(bookingId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("bookings").update({ status: "approved" }).eq("id", bookingId)

  if (error) throw error
  revalidatePath("/admin/bookings")
}

export async function getAllBookings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(*), users(full_name, email)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
