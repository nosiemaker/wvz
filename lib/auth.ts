
import { createClient } from "@/lib/client"

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  // Client-side redirect happens in the UI or via router, or we can force reload
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login"
  }
}

export async function getCurrentUser() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  return { ...user, profile }
}

export async function getDrivers() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "driver")
    .order("full_name", { ascending: true })

  if (error) throw error
  return data
}
export async function getUser(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function updateUser(id: string, userData: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}
