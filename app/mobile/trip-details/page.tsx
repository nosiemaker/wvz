"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, Clock, Fuel, Coffee, Play, Square, User, Truck } from "lucide-react"
import { getTripDetails, getTripLogs } from "@/lib/trips"

function TripDetailsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const tripId = searchParams.get("id")

    const [trip, setTrip] = useState<any>(null)
    const [logs, setLogs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            if (!tripId) return

            try {
                const [tripData, logsData] = await Promise.all([
                    getTripDetails(tripId),
                    getTripLogs(tripId)
                ])
                setTrip(tripData)
                setLogs(logsData || [])
            } catch (error) {
                console.error("Error loading trip details:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [tripId])

    const getLogIcon = (eventType: string) => {
        switch (eventType) {
            case "start":
                return <Play className="w-4 h-4 text-green-600" />
            case "stop":
                return <Coffee className="w-4 h-4 text-orange-600" />
            case "resume":
                return <Play className="w-4 h-4 text-blue-600" />
            case "end":
                return <Square className="w-4 h-4 text-red-600" />
            default:
                return <Clock className="w-4 h-4 text-gray-600" />
        }
    }

    const getLogColor = (eventType: string) => {
        switch (eventType) {
            case "start":
                return "bg-green-50 border-green-200"
            case "stop":
                return "bg-orange-50 border-orange-200"
            case "resume":
                return "bg-blue-50 border-blue-200"
            case "end":
                return "bg-red-50 border-red-200"
            default:
                return "bg-gray-50 border-gray-200"
        }
    }

    if (!tripId) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-muted-foreground">No trip ID provided</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading trip details...</p>
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Trip not found</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                    Go Back
                </button>
            </div>
        )
    }

    const totalDistance = trip.end_mileage && trip.start_mileage
        ? trip.end_mileage - trip.start_mileage
        : null

    return (
        <div className="pb-20 bg-slate-50 min-h-screen">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">Trip Details</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                            {new Date(trip.start_time).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Trip Info Card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mt-1">
                                <MapPin className="w-5 h-5 text-[#EE401D]" />
                            </div>
                            <div>
                                <p className="font-black text-slate-800 text-lg leading-tight">{trip.bookings?.destination || "Unknown"}</p>
                                <p className="text-sm font-semibold text-slate-400 mt-1">{trip.bookings?.purpose || "No purpose specified"}</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${trip.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }`}>
                            {trip.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Driver</p>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <p className="text-sm font-bold text-slate-700">{trip.bookings?.requester?.full_name || "Unknown"}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Vehicle</p>
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-slate-400" />
                                <p className="text-sm font-bold text-slate-700">{trip.vehicles?.plate_number || "Unknown"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Start</p>
                            <p className="text-sm font-bold text-slate-700">{new Date(trip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-xs font-semibold text-slate-400">{trip.start_mileage?.toLocaleString()} km</p>
                        </div>
                        {trip.end_time && (
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">End</p>
                                <p className="text-sm font-bold text-slate-700">{new Date(trip.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p className="text-xs font-semibold text-slate-400">{trip.end_mileage?.toLocaleString()} km</p>
                            </div>
                        )}
                    </div>

                    {totalDistance !== null && (
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs font-bold text-slate-500">Total Distance</span>
                            <span className="text-xl font-black text-[#EE401D]">{totalDistance.toLocaleString()} <span className="text-sm text-slate-400 font-bold">km</span></span>
                        </div>
                    )}
                </div>

                {/* Trip Logs */}
                <div className="space-y-3">
                    <h3 className="font-black text-sm text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Activity Log ({logs.length})
                    </h3>

                    {logs.length === 0 ? (
                        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                            <p className="text-slate-400 font-bold text-sm">No activity logs recorded</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className={`border rounded-2xl p-4 shadow-sm transition-all ${getLogColor(log.event_type)}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 bg-white rounded-full p-1 shadow-sm">
                                            {getLogIcon(log.event_type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-black text-slate-700 capitalize text-sm">{log.event_type}</p>
                                                <p className="text-[10px] font-bold text-slate-400">
                                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            {log.reason && (
                                                <p className="text-xs font-bold text-slate-600 mb-0.5">
                                                    Reason: {log.reason}
                                                </p>
                                            )}
                                            {log.notes && (
                                                <div className="mt-1 p-2 bg-white/50 rounded-lg text-xs text-slate-500 italic">
                                                    "{log.notes}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function TripDetailsPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><p>Loading...</p></div>}>
            <TripDetailsContent />
        </Suspense>
    )
}
