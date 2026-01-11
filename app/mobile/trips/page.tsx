"use client"

import { useState, useEffect } from "react"
import { Square, MapPin, Clock, Loader, Calendar, History, Compass, ChevronRight, Truck, Car, RotateCw, Coffee } from "lucide-react"
import { getAllTrips, getActiveTrips, logTripEvent } from "@/lib/trips"
import { useRouter } from "next/navigation"

export default function TripsPage() {
  const [activeTrip, setActiveTrip] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showLogModal, setShowLogModal] = useState(false)
  const [logType, setLogType] = useState("stop")
  const [logReason, setLogReason] = useState("Food")

  const router = useRouter()

  const loadData = async () => {
    try {
      const [active, historyData] = await Promise.all([
        getActiveTrips(),
        getAllTrips()
      ])
      setActiveTrip(active && active.length > 0 ? active[0] : null)
      setHistory(historyData || [])
    } catch (error) {
      console.error("[Trips] Error loading trips:", error)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "bg-green-500", text: "text-white", label: "Active" }
      case "completed":
        return { bg: "bg-slate-400", text: "text-white", label: "Completed" }
      default:
        return { bg: "bg-slate-100", text: "text-slate-600", label: status }
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader className="w-8 h-8 animate-spin text-[#EE401D]" />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
            <h2 className="text-[20px] font-black text-slate-800 tracking-tight">My Trips</h2>
          </div>
          <button onClick={loadData} className="p-2 active:scale-90 transition-transform">
            <RotateCw size={20} className="text-[#00897B]" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
            <p className="text-[28px] font-black text-slate-800">{history.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm">
            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active</p>
            <p className="text-[28px] font-black text-green-600">{activeTrip ? 1 : 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
            <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Completed</p>
            <p className="text-[28px] font-black text-purple-600">{history.filter(t => t.status === "completed").length}</p>
          </div>
        </div>
      </div>

      {/* Active Trip Card */}
      {activeTrip && (
        <div className="px-4 py-4">
          <div className="bg-gradient-to-br from-[#3E2723] to-[#5D4037] rounded-[28px] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-8 -translate-y-12"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-[2px]">Active Trip</span>
                </div>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  In Progress
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Car size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Vehicle</p>
                    <p className="text-[18px] font-black text-white">{activeTrip.vehicles?.registration || "---"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">From</p>
                    <p className="text-[14px] font-black text-white">{activeTrip.start_location || "Office"}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">To</p>
                    <p className="text-[14px] font-black text-white">{activeTrip.destination || "---"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Compass size={16} className="text-white/50" />
                  <span className="text-[12px] font-black text-white/70">Start: {activeTrip.start_mileage?.toLocaleString() || "---"} KM</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLogModal(true)}
                  className="flex-1 py-4 bg-white/20 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Coffee size={16} />
                  Log Stop
                </button>
                <button
                  onClick={() => router.push("/mobile/inspections/post-trip/" + activeTrip.id)}
                  className="flex-1 py-4 bg-[#EE401D] text-white rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                >
                  <Square size={16} />
                  End Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip History List */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4 mt-4">
          <History size={16} className="text-slate-400" />
          <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[2px]">Trip History</h3>
        </div>

        <div className="space-y-3">
          {history.length > 0 ? history.map((trip) => {
            const status = getStatusBadge(trip.status)
            const distance = trip.end_mileage && trip.start_mileage
              ? (trip.end_mileage - trip.start_mileage)
              : null

            return (
              <div
                key={trip.id}
                className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 active:bg-slate-50 transition-colors"
                onClick={() => router.push("/mobile/trip-details?id=" + trip.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Truck size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[16px] font-black text-slate-800 tracking-tight">
                        {trip.destination || trip.start_location || "Trip"}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400">
                        {trip.vehicles?.registration || "No vehicle"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest " +
                      status.bg +
                      " " +
                      status.text
                    }
                  >
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-black text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(trip.start_time).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {new Date(trip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-300" />
                    <span className="text-[12px] font-bold text-slate-500 italic">
                      {trip.purpose || "Official trip"}
                    </span>
                  </div>
                  {distance !== null && (
                    <div className="bg-purple-50 px-3 py-1 rounded-full border border-purple-100/50">
                      <span className="text-[12px] font-black text-purple-600">
                        {distance.toLocaleString()} KM
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          }) : (
            <div className="py-16 text-center bg-slate-50/50 rounded-[28px] border-2 border-dashed border-slate-100">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                <Truck className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-400 font-black text-[12px] uppercase tracking-[2px]">No trips yet</p>
              <p className="text-slate-300 font-bold text-[11px] mt-1">Start a trip from the dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-sm p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <h3 className="font-black text-2xl text-slate-800 tracking-tighter">Log Event</h3>
              <p className="text-slate-500 text-sm font-bold">Select the reason for your stop</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Reason</label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-full h-[60px] px-8 focus:outline-none focus:ring-4 focus:ring-[#EE401D]/10 transition-all font-black text-slate-800 appearance-none cursor-pointer"
                    value={logReason}
                    onChange={(e) => setLogReason(e.target.value)}
                  >
                    <option value="Food">Food / Lunch</option>
                    <option value="Fuel">Refueling</option>
                    <option value="Rest">Rest Stop</option>
                    <option value="Police">Police Check</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogModal(false)}
                className="flex-1 h-[60px] font-black text-slate-400 active:scale-95 transition-transform uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleLogEvent}
                className="flex-1 h-[60px] bg-[#EE401D] text-white rounded-full font-black shadow-xl shadow-red-900/30 active:scale-95 transition-transform uppercase tracking-wider"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
