"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Loader } from "lucide-react"

export default function MobilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUserRole = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Get user role from metadata
      const role = user.user_metadata?.role || "employee"

      // Route based on role
      if (role === "driver") {
        router.push("/mobile/driver")
      } else {
        // employee, or any other non-driver role
        router.push("/mobile/employee")
      }
    }

    checkUserRole()
  }, [router])

  return (
    <div className="h-screen flex items-center justify-center">
      <Loader className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}
