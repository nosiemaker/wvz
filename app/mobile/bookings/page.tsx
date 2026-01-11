"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, ChevronRight, MapPin, Loader, Play, CheckCircle } from "lucide-react"
import { getMyRequests, getMyAssignedBookings } from "@/lib/bookings"
import { startTrip } from "@/lib/trips"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/client"

export default function BookingsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>("employee")
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        const role = user?.user_metadata?.role || "employee"
        setUserRole(role)

        // Load different data based on role
        if (role === "driver") {
          const data = await getMyAssignedBookings()
          setRequests(data || [])
        } else {
          const data = await getMyRequests()
          setRequests(data || [])
        }
      } catch (error) {
        console.log("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleStartTrip = async (e: React.MouseEvent, request: any) => {
    e.stopPropagation()
    e.preventDefault()
    if (!confirm("Start this trip now?")) return

    setProcessingId(request.id)
    try {
      // use vehicle_id if exists, else null (for external)
      const vehicleId = request.vehicle_id || null
      await startTrip({
        vehicleId: vehicleId,
        bookingId: request.id,
        destination: request.destination,
        purpose: request.purpose,
      })
      router.push("/mobile/trips")
    } catch (error: any) {
      console.error("Error starting trip:", error)
      alert("Failed to start trip: " + (error.message || "Unknown error"))
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-600"
      case "pending_supervisor":
        return "bg-orange-500/10 text-orange-600"
      case "pending_allocation":
        return "bg-blue-500/10 text-blue-600"
      case "rejected":
        return "bg-red-500/10 text-red-600"
      case "completed":
        return "bg-gray-500/10 text-gray-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    if (!status) return "Unknown"
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20">
      <div className="p-4 space-y-4">
        {/* Create Request Button - Only for employees */}
        {userRole !== "driver" && (
          <Link href="/mobile/bookings/create">
            <button className="w-full bg-accent text-accent-foreground px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
              <Plus className="w-5 h-5" />
              Request New Trip
            </button>
          </Link>
        )}

        {/* Requests List */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">
            {userRole === "driver"
              ? "My Assigned Trips (" + requests.length + ")"
              : "My Trips (" + requests.length + ")"}
          </h2>
          {requests.length === 0 ? (
            <div className="text-center py-10 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground mb-2">
                {userRole === "driver" ? "No assigned trips" : "No trip requests yet"}
              </p>
              <p className="text-xs text-muted-foreground">
                {userRole === "driver"
                  ? "You have no trips assigned by the fleet manager"
                  : "Start by requesting a new trip above"}
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-accent transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">{request.destination || "No destination"}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{request.purpose || "No purpose specified"}</p>
                    </div>
                  </div>
                  <span
                    className={
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider " +
                      getStatusColor(request.status)
                    }
                  >
                    {getStatusLabel(request.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-3 border-t border-border pt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(request.start_date).toLocaleDateString()}</span>
                  </div>

                  {request.vehicles && (
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground">Assigned Vehicle</p>
                      <p className="font-semibold">{request.vehicles.registration} - {request.vehicles.model}</p>
                    </div>
                  )}

                  {!request.vehicles && request.status === 'approved' && !request.external_resource_details && (
                    <div className="text-sm text-orange-600 font-medium">
                      Vehicle assignment pending (Self-drive?)
                    </div>
                  )}
                  {request.external_resource_details && (
                    <div className="text-sm text-purple-600 font-medium">
                      External Provider: {request.external_resource_details.provider}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {(() => {
                  // Check if trip exists for this booking
                  const existingTrip = request.trips && request.trips.length > 0 ? request.trips[0] : null

                  if (existingTrip) {
                    // Trip exists - show status or view details
                    if (existingTrip.status === "completed") {
                      return (
                        <button
                          onClick={() => router.push("/mobile/trip-details?id=" + existingTrip.id)}
                          className="w-full bg-green-500/10 text-green-700 font-semibold py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-green-500/20 transition-colors border border-green-200"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Trip Completed - View Details
                        </button>
                      )
                    } else if (existingTrip.status === "active") {
                      return (
                        <button
                          onClick={() => router.push("/mobile/trips")}
                          className="w-full bg-blue-500/10 text-blue-700 font-semibold py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-200"
                        >
                          <Play className="w-4 h-4" />
                          Trip In Progress - Manage
                        </button>
                      )
                    }
                  }

                  // No trip exists yet
                  if (request.status === 'approved') {
                    // Start Button Logic:
                    // 1. Drivers see it (via Assigned Trips)
                    // 2. Staff (Requesters) only see it if it's Self-Drive
                    const canStart = userRole === 'driver' || request.is_self_drive;

                    if (!canStart) {
                      return (
                        <div className="w-full bg-slate-100 text-slate-500 font-semibold py-3 flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm">
                          <CheckCircle className="w-4 h-4 text-slate-400" />
                          Waiting for Driver to Start
                        </div>
                      )
                    }

                    return (
                      <button
                        onClick={(e) => handleStartTrip(e, request)}
                        disabled={!!processingId}
                        className="w-full bg-primary text-primary-foreground font-bold py-3 flex items-center justify-center gap-2 rounded-lg hover:opacity-90 transition-opacity shadow-md"
                      >
                        {processingId === request.id ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Start Trip
                      </button>
                    )
                  } else {
                    return (
                      <button className="w-full bg-muted/50 text-accent font-semibold py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-muted transition-colors text-sm">
                        View Status
                      </button>
                    )
                  }
                })()}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
