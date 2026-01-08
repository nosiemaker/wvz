"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PostTripIndex() {
    const router = useRouter()

    useEffect(() => {
        router.push('/mobile/inspections/post-trip/new-inspection')
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm font-medium text-slate-500">Initializing Post-Trip Inspection...</p>
            </div>
        </div>
    )
}
