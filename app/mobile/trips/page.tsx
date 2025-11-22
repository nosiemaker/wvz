"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { getAllTrips } from "@/lib/trips"
import Link from "next/link"

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await getAllTrips()
        setTrips(data || [])
      } catch (error) {
        console.log("[v0] Error loading trips:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTrips()
  }, [])

  const getStatusColor = (status: string) => {
    return status === "completed" ? "text-primary" : "text-muted-foreground"
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading trips...</p>
      </div>
    )
  }

  return (
    <div className="pb-20">
      <div className="p-4 space-y-4">
        {/* Start Trip Button */}
        <Link href="/mobile/trips">
          <button className="w-full bg-accent text-accent-foreground px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5" />
            Start New Trip
          </button>
        </Link>

        {/* Trip History */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Trip History ({trips.length})</h2>
          {trips.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No trips yet</p>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{trip.id}</p>
                    <p className="font-semibold">{new Date(trip.start_time).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-semibold ${getStatusColor(trip.status)}`}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicle</p>
                    <p className="font-semibold">{trip.vehicles?.registration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Start KM</p>
                    <p className="font-semibold">{trip.start_mileage || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End KM</p>
                    <p className="font-semibold">{trip.end_mileage || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button className="text-accent font-semibold py-2 rounded-lg hover:bg-accent/10 transition-colors">
                    View Details
                  </button>
                  <button className="text-accent font-semibold py-2 rounded-lg hover:bg-accent/10 transition-colors">
                    Upload Receipts
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
