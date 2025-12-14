"use client"

import { useState, useEffect } from "react"
import { Check, X, Calendar, MapPin, Loader, User } from "lucide-react"
import { getPendingSupervisorApprovals, approveBooking, rejectBooking } from "@/lib/bookings"

export default function TripRequestsPage() {
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    useEffect(() => {
        loadRequests()
    }, [])

    const loadRequests = async () => {
        try {
            const data = await getPendingSupervisorApprovals()
            setRequests(data || [])
        } catch (error) {
            console.error("Error loading requests:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleApprove = async (id: string) => {
        setProcessingId(id)
        try {
            await approveBooking(id)
            await loadRequests() // Reload list
        } catch (error) {
            console.error("Error approving:", error)
            alert("Failed to approve booking")
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (id: string) => {
        if (!confirm("Are you sure you want to reject this request?")) return

        setProcessingId(id)
        try {
            await rejectBooking(id, "Rejected by supervisor")
            await loadRequests()
        } catch (error) {
            console.error("Error rejecting:", error)
            alert("Failed to reject booking")
        } finally {
            setProcessingId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Trip Requests</h1>
                <p className="text-muted-foreground">Review and approve employee trip requests</p>
            </div>

            <div className="space-y-4">
                {requests.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
                        No pending requests found.
                    </div>
                ) : (
                    requests.map((request) => (
                        <div key={request.id} className="bg-card border border-border rounded-lg p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-3 flex-1">
                                    {/* Header: User & Purpose */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{request.users?.full_name || "Unknown User"}</h3>
                                            <p className="text-sm text-muted-foreground">{request.users?.email}</p>
                                        </div>
                                    </div>

                                    {/* Trip Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-2">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                            <div>
                                                <span className="text-xs text-muted-foreground block">Destination</span>
                                                <span className="font-medium">{request.destination}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                                            <div>
                                                <span className="text-xs text-muted-foreground block">Dates</span>
                                                <span className="font-medium">
                                                    {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Purpose Section */}
                                    <div className="bg-muted/50 p-3 rounded-md text-sm mt-2">
                                        <span className="font-semibold text-xs uppercase text-muted-foreground block mb-1">Purpose</span>
                                        <p>{request.purpose || "No purpose provided."}</p>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex gap-2">
                                        {request.is_self_drive && (
                                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">Self Drive Request</span>
                                        )}
                                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                                            {request.passengers} Passenger(s)
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2 min-w-[140px]">
                                    <button
                                        onClick={() => handleApprove(request.id)}
                                        disabled={!!processingId}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        {processingId === request.id ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(request.id)}
                                        disabled={!!processingId}
                                        className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
