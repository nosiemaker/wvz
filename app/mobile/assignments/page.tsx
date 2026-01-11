"use client"

import { useState, useEffect } from "react"
import { Car, Calendar, MapPin, User, Clock, CheckCircle, Play, RotateCw, ChevronRight, Compass, Hash, Loader, StopCircle } from "lucide-react"
import { getMyAssignedBookings } from "@/lib/bookings"
import { startTrip, endTrip } from "@/lib/trips"

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    const loadData = async () => {
        try {
            const data = await getMyAssignedBookings()
            setAssignments(data || [])
        } catch (error) {
            console.error("Failed to load assignments", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleStartTrip = async (entry: any) => {
        // For MVP, using prompt.
        const mileageStr = prompt("Enter Current Odometer Reading (Start Mileage):")
        if (!mileageStr) return

        const mileage = parseInt(mileageStr)
        if (isNaN(mileage)) return

        setProcessingId(entry.id)
        try {
            const confirmInspection = confirm("Have you completed the Pre-Trip Inspection Checklist?")
            if (!confirmInspection) return

            // Use the unified startTrip from lib/trips
            await startTrip({
                vehicleId: entry.vehicle_id, // Assigned vehicle
                bookingId: entry.id,
                startMileage: mileage,
                startLocation: "Assigned Location",
                destination: entry.destination,
                purpose: entry.purpose
            })
            await loadData()
        } catch (error) {
            console.error(error)
            alert("Failed to start trip")
        } finally {
            setProcessingId(null)
        }
    }

    const handleCompleteTrip = async (entry: any) => {
        const mileageStr = prompt("Enter Final Odometer Reading (End Mileage):")
        if (!mileageStr) return

        const mileage = parseInt(mileageStr)
        if (isNaN(mileage)) return

        setProcessingId(entry.id)
        try {
            // Find the active trip ID associated with this booking
            const activeTrip = entry.trips?.find((t: any) => t.status === 'active')

            if (activeTrip) {
                await endTrip(activeTrip.id, mileage)
            } else {
                // Fallback if no trip record found (legacy data), just force close the booking
                // We import completeTrip from bookings for this fallback if needed, but better to enforce Trips
                alert("No active trip record found to end. Contact support.")
            }

            await loadData()
        } catch (error) {
            console.error(error)
            alert("Failed to complete trip")
        } finally {
            setProcessingId(null)
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "in_progress":
                return "bg-green-500 text-white"
            case "approved":
                return "bg-blue-500 text-white"
            case "completed":
                return "bg-slate-400 text-white"
            default:
                return "bg-slate-100 text-slate-600"
        }
    }

    const getStatusBorderStyle = (status: string) => {
        switch (status) {
            case "in_progress":
                return "border-l-green-500"
            case "approved":
                return "border-l-blue-500"
            case "completed":
                return "border-l-slate-300"
            default:
                return "border-l-slate-200"
        }
    }

    const activeCount = assignments.filter(a => a.status === "in_progress").length
    const upcomingCount = assignments.filter(a => a.status === "approved").length

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="bg-[#F8F9FA] min-h-screen pb-20">
            {/* Header */}
            <div className="p-6 bg-white border-b border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                        <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Assignments</h2>
                    </div>
                    <button onClick={loadData}>
                        <RotateCw size={20} className="text-[#00897B]" />
                    </button>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1 bg-green-50 rounded-2xl p-4 border border-green-100">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active</p>
                        </div>
                        <p className="text-[32px] font-black text-green-700">{activeCount}</p>
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock size={12} className="text-blue-500" />
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Upcoming</p>
                        </div>
                        <p className="text-[32px] font-black text-blue-700">{upcomingCount}</p>
                    </div>
                </div>
            </div>

            {/* Assignment List */}
            <div className="p-4 space-y-4">
                {assignments.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>No active assignments.</p>
                    </div>
                ) : (
                    assignments.map((entry) => (
                        <div key={entry.id} className={`bg-white rounded-[28px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden border-l-4 zmw{getStatusBorderStyle(entry.status)}`}>
                            <div className="p-6 space-y-4">
                                {/* Header Row */}
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Calendar size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-[2px]">Date</span>
                                            <span className="text-[11px] font-black text-slate-800">{new Date(entry.start_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest zmw{getStatusStyle(entry.status)}`}>
                                        {entry.status === 'in_progress' ? 'ON TRIP' : entry.status}
                                    </div>
                                </div>

                                {/* Destination */}
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-6 bg-[#EE401D] rounded-full"></div>
                                    <h3 className="text-[22px] font-black text-slate-800 tracking-tighter">{entry.destination}</h3>
                                </div>

                                {/* Purpose */}
                                <div className="bg-slate-50 rounded-[20px] p-4 border border-slate-100/50">
                                    <div className="flex items-start gap-3">
                                        <User size={16} className="text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-[14px] font-black text-slate-700 mb-1">Requester: {entry.requester?.full_name}</p>
                                            <p className="text-[13px] font-bold italic text-slate-500 leading-relaxed">{entry.purpose}</p>
                                        </div>
                                    </div>
                                    {entry.cost_center && (
                                        <div className="mt-2 text-[10px] font-bold bg-white inline-block px-2 py-1 rounded text-slate-600 border border-slate-200">
                                            {entry.cost_center}
                                        </div>
                                    )}
                                </div>

                                {/* Footer Stats - Vehicle */}
                                {entry.vehicles && (
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-[#3E2723] text-white flex items-center justify-center text-[10px] font-black shadow-lg">
                                                V
                                            </div>
                                            <span className="font-black text-slate-800 text-[15px] tracking-tighter uppercase">{entry.vehicles.registration}</span>
                                        </div>
                                        {entry.status === 'in_progress' && (
                                            <div className="flex items-center gap-2">
                                                <Compass size={18} className="text-[#EE401D]" />
                                                <span className="text-[14px] font-black text-slate-800">Start: {entry.start_mileage} KM</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {entry.status === "in_progress" && (
                                    <button
                                        onClick={() => handleCompleteTrip(entry)}
                                        disabled={processingId === entry.id}
                                        className="w-full py-4 bg-slate-900 text-white rounded-[20px] text-[12px] font-black uppercase tracking-[1.5px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform hover:opacity-90 disabled:opacity-70"
                                    >
                                        {processingId === entry.id ? (
                                            <Loader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <StopCircle size={14} className="fill-current" />
                                                Complete Trip
                                            </>
                                        )}
                                    </button>
                                )}
                                {(entry.status === "approved" || entry.status === "pending_allocation") && (
                                    <button
                                        onClick={() => handleStartTrip(entry)}
                                        disabled={processingId === entry.id}
                                        className="w-full py-4 bg-[#EE401D] text-white rounded-[20px] text-[12px] font-black uppercase tracking-[1.5px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform hover:opacity-90 disabled:opacity-70"
                                    >
                                        {processingId === entry.id ? (
                                            <Loader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Play size={14} className="fill-current" />
                                                Start Trip
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
