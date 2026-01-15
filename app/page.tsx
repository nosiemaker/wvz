"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"

export default function RootPage() {
    const router = useRouter()

    useEffect(() => {
        const redirectUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.replace("/auth/login")
                return
            }

            const role = user.user_metadata?.role || "employee"

            if (role === "admin") {
                router.replace("/admin")
            } else if (role === "finance") {
                router.replace("/finance")
            } else if (role === "compliance") {
                router.replace("/compliance")
            } else {
                router.replace("/mobile")
            }
        }

        redirectUser()
    }, [router])

    return (
        <div className="h-screen flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
}
