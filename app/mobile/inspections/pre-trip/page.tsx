"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PreTripIndex() {
    const router = useRouter()

    useEffect(() => {
        // In a real app, this would create a new inspection ID or let user select a trip.
        // For standard UI demo, we'll redirect to a mock ID.
        router.push('/mobile/inspections/pre-trip/new-inspection')
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm font-medium text-slate-500">Initializing Pre-Trip Inspection...</p>
            </div>
        </div>
    )
}
