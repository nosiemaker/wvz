"use client"

import { useState, useEffect } from "react"
import { MapPin, AlertCircle, Calendar, Bell, Truck, LogOut, Play, Square, Pause, User } from "lucide-react"
import { getMyAssignedBookings } from "@/lib/bookings"
import { getActiveTrips } from "@/lib/trips"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function DriverDashboard() {
    const [assignedBookings, setAssignedBookings] = useState<any[]>([])
    const [activeTrip, setActiveTrip] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadData = async () => {
            try {
                const [bookings, trips] = await Promise.all([
                    getMyAssignedBookings(),
                    getActiveTrips()
                ])
                setAssignedBookings(bookings || [])
                setActiveTrip(trips && trips.length > 0 ? trips[0] : null)
            } catch (error) {
                console.log("Error loading data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    const handleLogout = async () => {
        await logout()
    }

    const pendingInspections = [
        { id: "INS-001", type: "Pre-Trip", dueDate: "Today", status: "pending" },
    ]

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            approved: "bg-green-100 text-green-700",
            pending_allocation: "bg-blue-100 text-blue-700",
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${styles[status] || "bg-gray-100 text-gray-700"}`}>
                {status.replace("_", " ")}
            </span>
        )
    }

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    return (
        <div className="pb-20">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Manage your assigned trips</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-muted rounded-lg"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* Active Trip Card */}
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
                            <button
                                onClick={() => router.push("/mobile/trips")}
                                className="flex-1 bg-primary-foreground text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <Pause className="w-4 h-4" />
                                Log Stop
                            </button>
                            <button
                                onClick={() => router.push("/mobile/trips")}
                                className="flex-1 bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-foreground/30 transition-colors flex items-center justify-center gap-2"
                            >
                                <Square className="w-4 h-4" />
                                End Trip
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Assigned Trips */}
                {assignedBookings.length > 0 ? (
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            Assigned Trips ({assignedBookings.length})
                        </h3>
                        <div className="space-y-2">
                            {assignedBookings.map((booking) => (
                                <div key={booking.id} className="bg-card border border-border rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-start gap-3 flex-1">
                                            <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-semibold">{booking.destination}</p>
                                                <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <User className="w-3 h-3 text-muted-foreground" />
                                                    <p className="text-xs text-muted-foreground">
                                                        Requested by: {booking.requester?.full_name || "Unknown"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(booking.start_date).toLocaleDateString()}
                                        </div>
                                        {booking.vehicles && (
                                            <div className="bg-muted px-2 py-0.5 rounded font-medium">
                                                {booking.vehicles.plate_number}
                                            </div>
                                        )}
                                    </div>

                                    {booking.status === "approved" && (
                                        <button
                                            onClick={() => router.push(`/mobile/bookings`)}
                                            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-4 h-4" />
                                            Start Trip
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : !activeTrip ? (
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                        <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="font-semibold text-lg mb-2">No Assigned Trips</p>
                        <p className="text-sm text-muted-foreground">You have no trips assigned by the fleet manager yet</p>
                    </div>
                ) : null}

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
                <div className="space-y-2">
                    <button
                        onClick={() => router.push("/mobile/incidents")}
                        className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Report Incident
                    </button>
                </div>
            </div>
        </div>
    )
}
