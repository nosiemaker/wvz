"use client"

import { useState, useEffect } from "react"
import { MapPin, Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle, LogOut } from "lucide-react"
import { getMyRequests } from "@/lib/bookings"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function EmployeeDashboard() {
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const data = await getMyRequests()
                setRequests(data || [])
            } catch (error) {
                console.log("Error loading requests:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadRequests()
    }, [])

    const handleLogout = async () => {
        await logout()
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case "rejected":
                return <XCircle className="w-5 h-5 text-red-500" />
            case "pending_supervisor":
            case "pending_allocation":
                return <Clock className="w-5 h-5 text-yellow-500" />
            default:
                return <AlertCircle className="w-5 h-5 text-muted-foreground" />
        }
    }

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending_supervisor: "bg-yellow-100 text-yellow-700",
            pending_allocation: "bg-blue-100 text-blue-700",
            approved: "bg-green-100 text-green-700",
            rejected: "bg-red-100 text-red-700",
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${styles[status] || "bg-gray-100 text-gray-700"}`}>
                {status.replace("_", " ")}
            </span>
        )
    }

    const pendingRequests = requests.filter(r => r.status === "pending_supervisor" || r.status === "pending_allocation")
    const upcomingTrips = requests.filter(r => r.status === "approved")

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
                        <h1 className="text-2xl font-bold">My Trips</h1>
                        <p className="text-sm text-muted-foreground">Request and track your trips</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-muted rounded-lg"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Request Button */}
                <button
                    onClick={() => router.push("/mobile/bookings/create")}
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg"
                >
                    <Plus className="w-6 h-6" />
                    Request New Trip
                </button>

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            Pending Requests ({pendingRequests.length})
                        </h3>
                        <div className="space-y-2">
                            {pendingRequests.map((request) => (
                                <div key={request.id} className="bg-card border border-border rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-start gap-3">
                                            {getStatusIcon(request.status)}
                                            <div>
                                                <p className="font-semibold">{request.destination}</p>
                                                <p className="text-sm text-muted-foreground">{request.purpose}</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(request.status)}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(request.start_date).toLocaleDateString()}
                                        </div>
                                        {request.cost_center && (
                                            <div className="bg-muted px-2 py-0.5 rounded">
                                                {request.cost_center}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Trips */}
                {upcomingTrips.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Approved Trips ({upcomingTrips.length})
                        </h3>
                        <div className="space-y-2">
                            {upcomingTrips.map((trip) => (
                                <div key={trip.id} className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="font-semibold">{trip.destination}</p>
                                                <p className="text-sm text-muted-foreground">{trip.purpose}</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(trip.status)}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(trip.start_date).toLocaleDateString()}
                                        </div>
                                        {trip.vehicles && (
                                            <div className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded font-medium">
                                                {trip.vehicles.plate_number}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {requests.length === 0 && (
                    <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
                        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="font-semibold text-lg mb-2">No Trip Requests Yet</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Click the button above to request your first trip
                        </p>
                    </div>
                )}

                {/* Recent History */}
                {requests.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold">Recent Requests</h3>
                        <div className="space-y-2">
                            {requests.slice(0, 3).map((request) => (
                                <div key={request.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(request.status)}
                                        <div>
                                            <p className="font-medium text-sm">{request.destination}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(request.start_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(request.status)}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => router.push("/mobile/bookings")}
                            className="w-full text-primary hover:underline text-sm font-medium"
                        >
                            View All Requests
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
