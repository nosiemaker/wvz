"use server"

import { createClient } from "@/lib/server"
import { revalidatePath } from "next/cache"

export async function createIncident(vehicleId: string, type: string, severity: string, description: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("incidents")
    .insert({
      driver_id: user.id,
      vehicle_id: vehicleId,
      type,
      severity,
      description,
    })
    .select()

  if (error) throw error
  revalidatePath("/admin/incidents")
  return data
}

export async function getAllIncidents() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("incidents")
    .select("*, vehicles(*), users(full_name)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
