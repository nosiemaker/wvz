"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { MapPin, AlertCircle, Calendar, Bell, Truck } from "lucide-react"

export default function Home() {
  const [isDemo, setIsDemo] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL

        if (!hasSupabase) {
          setIsDemo(true)
          setIsLoading(false)
          return
        }

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // Get user role to redirect to appropriate portal
        const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
        const role = profile?.role || "driver"

        if (role === "admin") {
          router.push("/admin")
        } else if (role === "finance") {
          router.push("/finance")
        } else if (role === "compliance") {
          router.push("/compliance")
        } else {
          router.push("/mobile")
        }
      } catch (error) {
        console.error("Error checking session:", error)
        // Fallback or error state
        setIsLoading(false)
      }
    }

    checkSession()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If we are here and not demo, we are likely redirecting or something failed, 
  // but if we strictly follow the logic, we only render this dashboard in demo mode (no supabase config).
  if (!isDemo) return null

  const activeTrip = {
    id: "TRIP-2025-001",
    vehicle: "Toyota Hiace - WRJ 2024",
    status: "Active",
    origin: "Warehouse A, Mumbai",
    destination: "Distribution Center B, Pune",
    startTime: "09:30 AM",
    currentMileage: 45820,
    nextCheckpoint: "Toll Gate - Mumbai-Pune",
    distanceRemaining: 85.5,
  }

  const pendingInspections = [
    { id: "INS-001", type: "Pre-Trip", dueDate: "Today", status: "pending" },
    { id: "INS-002", type: "Post-Trip", dueDate: "Today", status: "pending" },
  ]

  return (
    <div className="pb-20">
      {/* Active Trip Card */}
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Active Trip</h2>
              <p className="text-primary-foreground/80 text-sm">{activeTrip.id}</p>
            </div>
            <div className="bg-primary-foreground text-primary px-3 py-1 rounded-full text-xs font-semibold">
              {activeTrip.status}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 mt-0.5" />
              <div>
                <p className="text-sm opacity-90">Vehicle</p>
                <p className="font-semibold">{activeTrip.vehicle}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm opacity-90">Route</p>
                <p className="font-semibold">{activeTrip.origin}</p>
                <div className="text-xs opacity-75 my-1">→</div>
                <p className="font-semibold">{activeTrip.destination}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs opacity-90">Distance Remaining</p>
                <p className="text-lg font-bold">{activeTrip.distanceRemaining} km</p>
              </div>
              <div>
                <p className="text-xs opacity-90">Current Mileage</p>
                <p className="text-lg font-bold">{activeTrip.currentMileage} km</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-primary-foreground text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Pause Trip
            </button>
            <button className="flex-1 bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-foreground/30 transition-colors">
              Details
            </button>
          </div>
        </div>

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
          <button className="bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Request Waiver
          </button>
        </div>
      </div>
    </div>
  )
}
