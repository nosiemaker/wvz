
import { createClient } from "@/lib/client"

export async function createIncident(vehicleId: string, type: string, severity: string, description: string) {
  const supabase = createClient()

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
  return data
}

export async function getAllIncidents() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("incidents")
    .select("*, vehicles(*), users(full_name)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
