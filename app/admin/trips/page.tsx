"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, MapPin, Truck, AlertTriangle } from "lucide-react"
import { getAdminAllTrips, getTripLogs } from "@/lib/trips"

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTrip, setActiveTrip] = useState<any | null>(null)
  const [tripLogs, setTripLogs] = useState<any[]>([])
  const [logsLoading, setLogsLoading] = useState(false)

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await getAdminAllTrips()
        setTrips(data || [])
      } catch (error) {
        console.error("Failed to load trips:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTrips()
  }, [])

  useEffect(() => {
    const loadLogs = async () => {
      if (!activeTrip?.id) {
        setTripLogs([])
        return
      }
      setLogsLoading(true)
      try {
        const data = await getTripLogs(activeTrip.id)
        setTripLogs(data || [])
      } catch (error) {
        console.error("Failed to load trip logs:", error)
        setTripLogs([])
      } finally {
        setLogsLoading(false)
      }
    }
    loadLogs()
  }, [activeTrip])

  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold"
    if (status === "active") return base + " bg-green-100 text-green-700"
    if (status === "completed") return base + " bg-slate-100 text-slate-600"
    return base + " bg-amber-100 text-amber-700"
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#EE401D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trips</h1>
        <p className="text-muted-foreground">All trips recorded across the fleet</p>
      </div>

      {trips.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-10 text-center text-muted-foreground">
          No trips recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => {
            const startDate = trip.start_time ? new Date(trip.start_time) : null
            const endDate = trip.end_time ? new Date(trip.end_time) : null
            const distance =
              trip.start_mileage && trip.end_mileage
                ? trip.end_mileage - trip.start_mileage
                : null

            return (
              <div key={trip.id} className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Truck className="w-6 h-6 mt-1 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {trip.destination || trip.start_location || "Trip"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {trip.vehicles?.registration || "No vehicle"} · {trip.users?.full_name || "Unknown driver"}
                      </p>
                    </div>
                  </div>
                  <span className={getStatusBadge(trip.status || "pending")}>
                    {(trip.status || "pending").charAt(0).toUpperCase() + (trip.status || "pending").slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{startDate ? startDate.toLocaleDateString() : "Unknown date"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {startDate ? startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{trip.start_location || "Office"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    <span>{distance !== null ? distance.toLocaleString() + " KM" : "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setActiveTrip(trip)}
                    className="text-primary hover:underline text-sm font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold">Trip Details</h3>
              <p className="text-sm text-muted-foreground">{activeTrip.id}</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Driver</p>
                <p className="font-semibold">{activeTrip.users?.full_name || "Unknown driver"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Vehicle</p>
                <p className="font-semibold">{activeTrip.vehicles?.registration || "No vehicle"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Start</p>
                <p className="font-semibold">
                  {activeTrip.start_time ? new Date(activeTrip.start_time).toLocaleString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">End</p>
                <p className="font-semibold">
                  {activeTrip.end_time ? new Date(activeTrip.end_time).toLocaleString() : "In Progress"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Start Mileage</p>
                <p className="font-semibold">{activeTrip.start_mileage ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Mileage</p>
                <p className="font-semibold">{activeTrip.end_mileage ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Destination</p>
                <p className="font-semibold">{activeTrip.destination || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Purpose</p>
                <p className="font-semibold">{activeTrip.purpose || "N/A"}</p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <p className="text-muted-foreground text-sm mb-2">Trip Logs</p>
              {logsLoading ? (
                <div className="text-sm text-muted-foreground">Loading logs...</div>
              ) : tripLogs.length === 0 ? (
                <div className="text-sm text-muted-foreground">No logs recorded.</div>
              ) : (
                <div className="space-y-2">
                  {tripLogs.map((log) => (
                    <div key={log.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{log.event_type}</span>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Unknown time"}
                        </span>
                      </div>
                      {log.reason && <div className="text-muted-foreground">Reason: {log.reason}</div>}
                      {log.notes && <div className="text-muted-foreground">Notes: {log.notes}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveTrip(null)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
