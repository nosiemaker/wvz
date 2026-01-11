"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, Clock, Fuel, Coffee, Play, Square, User, Truck } from "lucide-react"
import { getTripDetails, getTripLogs } from "@/lib/trips"


export default function TripDetailClient() {
    const params = useParams()
    const router = useRouter()
    const tripId = params.id as string

    const [trip, setTrip] = useState<any>(null)
    const [logs, setLogs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
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

        if (tripId) {
            loadData()
        }
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
            </div>
        )
    }

    const totalDistance = trip.end_mileage && trip.start_mileage
        ? trip.end_mileage - trip.start_mileage
        : null

    return (
        <div className="pb-20">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-muted rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Trip Details</h1>
                        <p className="text-sm text-muted-foreground">View complete trip information</p>
                    </div>
                </div>

                {/* Trip Info Card */}
                <div className="bg-card border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="font-semibold">{trip.bookings?.destination || "Unknown"}</p>
                                <p className="text-sm text-muted-foreground">{trip.bookings?.purpose || "No purpose"}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase zmw{trip.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }`}>
                            {trip.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                        <div>
                            <p className="text-xs text-muted-foreground">Requested By</p>
                            <div className="flex items-center gap-1 mt-1">
                                <User className="w-3 h-3 text-muted-foreground" />
                                <p className="text-sm font-medium">{trip.bookings?.requester?.full_name || "Unknown"}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Vehicle</p>
                            <div className="flex items-center gap-1 mt-1">
                                <Truck className="w-3 h-3 text-muted-foreground" />
                                <p className="text-sm font-medium">{trip.vehicles?.plate_number || "Unknown"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                        <div>
                            <p className="text-xs text-muted-foreground">Start Time</p>
                            <p className="text-sm font-medium">{new Date(trip.start_time).toLocaleString()}</p>
                        </div>
                        {trip.end_time && (
                            <div>
                                <p className="text-xs text-muted-foreground">End Time</p>
                                <p className="text-sm font-medium">{new Date(trip.end_time).toLocaleString()}</p>
                            </div>
                        )}
                    </div>

                    {totalDistance && (
                        <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">Total Distance</p>
                            <p className="text-2xl font-bold text-primary">{totalDistance} km</p>
                            <p className="text-xs text-muted-foreground">
                                Start: {trip.start_mileage} km → End: {trip.end_mileage} km
                            </p>
                        </div>
                    )}
                </div>

                {/* Trip Logs */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Trip Activity Log ({logs.length})
                    </h3>

                    {logs.length === 0 ? (
                        <div className="bg-card border border-dashed rounded-lg p-6 text-center">
                            <p className="text-muted-foreground">No activity logs recorded</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {logs.map((log, index) => (
                                <div
                                    key={log.id}
                                    className={`border rounded-lg p-3 zmw{getLogColor(log.event_type)}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            {getLogIcon(log.event_type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold capitalize">{log.event_type}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(log.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            {log.reason && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Reason: {log.reason}
                                                </p>
                                            )}
                                            {log.notes && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Notes: {log.notes}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(log.timestamp).toLocaleDateString()}
                                            </p>
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
