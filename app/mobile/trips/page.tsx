"use client"

import { useState, useEffect } from "react"
import { Play, Square, Pause, MapPin, Clock, Fuel, Coffee, AlertTriangle, CheckCircle, Loader } from "lucide-react"
import { getAllTrips, getActiveTrips, endTrip, logTripEvent } from "@/lib/trips"
import { useRouter } from "next/navigation"

export default function TripsPage() {
  const [activeTrip, setActiveTrip] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showLogModal, setShowLogModal] = useState(false)
  const [showEndModal, setShowEndModal] = useState(false)
  const [endMileage, setEndMileage] = useState("")
  const [logType, setLogType] = useState("stop") // stop, resume
  const [logReason, setLogReason] = useState("Food")

  const router = useRouter()

  const loadData = async () => {
    try {
      const [active, historyData] = await Promise.all([
        getActiveTrips(),
        getAllTrips()
      ])
      // api returns array for active trips, we assume single active trip for now
      setActiveTrip(active && active.length > 0 ? active[0] : null)
      setHistory(historyData || [])
    } catch (error) {
      console.error("[v0] Error loading trips:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleLogEvent = async () => {
    if (!activeTrip) return
    try {
      await logTripEvent(activeTrip.id, logType, logReason)
      setShowLogModal(false)
      await loadData()
    } catch (e) {
      alert("Failed to log event")
    }
  }

  const handleEndTrip = async () => {
    if (!activeTrip || !endMileage) return
    try {
      await endTrip(activeTrip.id, parseInt(endMileage))
      setShowEndModal(false)
      setEndMileage("")
      await loadData()
    } catch (e) {
      alert("Failed to end trip")
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="pb-20 p-4 space-y-6">

      {/* Active Trip Card */}
      {activeTrip ? (
        <div className="bg-primary text-primary-foreground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Trip in Progress</h2>
              <p className="opacity-90 text-sm">Started: {new Date(activeTrip.start_time).toLocaleTimeString()}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <MapPin className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm opacity-80">Vehicle</p>
              <p className="font-semibold text-lg">{activeTrip.vehicles?.registration}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setLogType('stop'); setShowLogModal(true) }}
                className="bg-white/20 hover:bg-white/30 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Pause className="w-5 h-5" />
                Log Stop
              </button>
              <button
                onClick={() => setShowEndModal(true)}
                className="bg-white text-primary hover:bg-gray-100 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Square className="w-5 h-5 fill-current" />
                End Trip
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 border border-dashed border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <CarIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No Active Trip</h3>
          <p className="text-muted-foreground text-sm mb-4">Go to your bookings to start a verified trip.</p>
          <button
            onClick={() => router.push('/mobile/bookings')}
            className="text-primary font-semibold hover:underline"
          >
            View Approved Bookings
          </button>
        </div>
      )}

      {/* History List */}
      <div>
        <h2 className="font-bold text-lg mb-3">Recent History</h2>
        <div className="space-y-3">
          {history.map(trip => (
            <div key={trip.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">{trip.vehicles?.registration}</p>
                  <p className="text-xs text-muted-foreground">{new Date(trip.start_time).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase">
                  {trip.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-lg">Log Trip Event</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Reason</label>
              <select
                className="w-full bg-input border border-border rounded-lg p-3"
                value={logReason}
                onChange={(e) => setLogReason(e.target.value)}
              >
                <option value="Food">Food / Lunch</option>
                <option value="Fuel">Refueling</option>
                <option value="Rest">Rest Stop</option>
                <option value="Police">Police Check</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogModal(false)} className="flex-1 py-3 font-semibold">Cancel</button>
              <button onClick={handleLogEvent} className="flex-1 bg-primary text-primary-foreground rounded-lg py-3 font-semibold">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* End Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-lg">End Trip</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Final Odometer Reading</label>
              <input
                type="number"
                className="w-full bg-input border border-border rounded-lg p-3"
                placeholder="e.g. 12050"
                value={endMileage}
                onChange={(e) => setEndMileage(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEndModal(false)} className="flex-1 py-3 font-semibold">Cancel</button>
              <button onClick={handleEndTrip} className="flex-1 bg-destructive text-destructive-foreground rounded-lg py-3 font-semibold">End Trip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CarIcon(props: any) {
  return <Car {...props} />
}
import { Car } from "lucide-react"
