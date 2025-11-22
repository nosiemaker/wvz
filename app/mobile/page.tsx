"use client"

import { useState, useEffect } from "react"
import { MapPin, AlertCircle, Calendar, Bell, Truck, LogOut } from "lucide-react"
import { getActiveTrips } from "@/lib/trips"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function MobilePage() {
  const [activeTrip, setActiveTrip] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const trips = await getActiveTrips()
        if (trips && trips.length > 0) {
          setActiveTrip(trips[0])
        }
      } catch (error) {
        console.log("[v0] Error loading trips:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTrips()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  const pendingInspections = [
    { id: "INS-001", type: "Pre-Trip", dueDate: "Today", status: "pending" },
    { id: "INS-002", type: "Post-Trip", dueDate: "Today", status: "pending" },
  ]

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="pb-20">
      {/* Active Trip Card */}
      <div className="p-4 space-y-4">
        {activeTrip ? (
          <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Active Trip</h2>
                <p className="text-primary-foreground/80 text-sm">{activeTrip.id}</p>
              </div>
              <div className="bg-primary-foreground text-primary px-3 py-1 rounded-full text-xs font-semibold">
                Active
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="text-sm opacity-90">Vehicle</p>
                  <p className="font-semibold">
                    {activeTrip.vehicles?.make} {activeTrip.vehicles?.model}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm opacity-90">Status</p>
                  <p className="font-semibold">{activeTrip.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs opacity-90">Start Time</p>
                  <p className="text-lg font-bold">{new Date(activeTrip.start_time).toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-xs opacity-90">Duration</p>
                  <p className="text-lg font-bold">Active</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button className="flex-1 bg-primary-foreground text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Pause Trip
              </button>
              <button className="flex-1 bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-foreground/30 transition-colors">
                End Trip
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground">No active trips</p>
            <button
              onClick={() => router.push("/mobile/trips")}
              className="mt-4 w-full bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Start a Trip
            </button>
          </div>
        )}

        {/* Notifications */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h3>
          <div className="bg-accent/10 border border-accent rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Pre-Trip Inspection Due</p>
              <p className="text-xs text-muted-foreground">Complete your pre-trip inspection before proceeding</p>
            </div>
          </div>
        </div>

        {/* Pending Inspections */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Pending Inspections ({pendingInspections.length})
          </h3>
          {pendingInspections.map((inspection) => (
            <div
              key={inspection.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{inspection.type}</p>
                <p className="text-sm text-muted-foreground">Due: {inspection.dueDate}</p>
              </div>
              <button className="px-3 py-1 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Complete
              </button>
            </div>
          ))}
        </div>

        {/* Driver Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Violation Points</p>
            <p className="text-2xl font-bold text-destructive">3</p>
            <p className="text-xs text-muted-foreground">of 12</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">License Valid</p>
            <p className="text-2xl font-bold text-primary">325</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Report Incident
          </button>
          <button
            onClick={handleLogout}
            className="bg-destructive text-destructive-foreground px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
