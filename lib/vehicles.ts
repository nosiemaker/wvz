
import { createClient } from "@/lib/client"

export async function getVehicles() {
  const supabase = createClient()

  const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getVehicleStats() {
  const supabase = createClient()

  const { data, error } = await supabase.from("vehicles").select("status")

  if (error) throw error

  // Aggregate stats in JavaScript
  const statsMap = (data || []).reduce((acc: Record<string, number>, curr) => {
    const status = curr.status || "unknown"
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // Convert to array format matching typical database group-by result
  return Object.entries(statsMap).map(([status, count]) => ({ status, count }))
}

export async function createVehicle(vehicleData: any) {
  const supabase = createClient()

  const { data, error } = await supabase.from("vehicles").insert([vehicleData]).select().single()

  if (error) throw error
  return data
}
