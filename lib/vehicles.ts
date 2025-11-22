"use server"

import { createClient } from "@/lib/server"

export async function getVehicles() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getVehicleStats() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("vehicles")
    .select("status, COUNT(*) as count", { count: "exact" })
    .group_by("status")

  if (error) throw error
  return data
}
