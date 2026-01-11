"use client"

import { useState, useEffect } from "react"
import { Check, X, Calendar, MapPin, Loader, User, Search, Filter } from "lucide-react"
import { getPendingSupervisorApprovals, approveBooking, rejectBooking, getAllBookings } from "@/lib/bookings"

export default function TripRequestsPage() {
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        loadRequests()
    }, [])

    const loadRequests = async () => {
        try {
            // For this view, we want ALL bookings to show the full history/status table
            // In a real app we might paginate this or filter by supervisor ID
            const data = await getAllBookings()
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
            await loadRequests()
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

    // Helper to get status badge style
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending_supervisor: "bg-yellow-100 text-yellow-800",
            pending_allocation: "bg-blue-100 text-blue-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            completed: "bg-slate-100 text-slate-800",
            cancelled: "bg-gray-100 text-gray-800"
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase zmw{styles[status] || "bg-gray-100 text-gray-800"}`}>
                {status.replace("_", " ")}
            </span>
        )
    }

    const filteredRequests = filter === "all"
        ? requests
        : requests.filter(r => r.status === filter)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Trip Requests</h1>
                    <p className="text-muted-foreground">Detailed log of all trip requests and statuses.</p>
                </div>
                {/* Filter */}
                <div className="flex items-center bg-card border rounded-md px-2">
                    <Filter className="w-4 h-4 text-muted-foreground mr-2" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent border-none text-sm focus:ring-0 py-2 pr-8"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending_supervisor">Pending Supervisor</option>
                        <option value="pending_allocation">Pending Allocation</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-4 py-3">Details</th>
                                <th className="px-4 py-3">Requester</th>
                                <th className="px-4 py-3 text-center">Dates</th>
                                <th className="px-4 py-3 text-center">Allocation</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No requests found matching your filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-muted/5 transition-colors">
                                        {/* Details */}
                                        <td className="px-4 py-4 max-w-[250px]">
                                            <div className="font-semibold text-foreground flex items-center gap-2">
                                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                                {request.destination}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {request.purpose}
                                            </div>
                                            {request.cost_center && (
                                                <div className="text-[10px] text-muted-foreground mt-1 bg-muted inline-block px-1 rounded">
                                                    {request.cost_center}
                                                </div>
                                            )}
                                        </td>

                                        {/* Requester */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {request.requester?.full_name?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">{request.requester?.full_name}</div>
                                                    <div className="text-xs text-muted-foreground">Generic Employee</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Dates */}
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            <div className="text-xs font-medium">
                                                {new Date(request.start_date).toLocaleDateString()}
                                            </div>
                                            {request.start_date !== request.end_date && (
                                                <div className="text-[10px] text-muted-foreground">
                                                    - {new Date(request.end_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </td>

                                        {/* Allocation */}
                                        <td className="px-4 py-4 text-center">
                                            {request.vehicles ? (
                                                <div className="text-xs">
                                                    <div className="font-semibold">{request.vehicles.plate_number}</div>
                                                    <div className="text-[10px] text-muted-foreground">{request.vehicles.make} {request.vehicles.model}</div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-opacity-50 text-xs">-</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4 text-center">
                                            {getStatusBadge(request.status)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4 text-right">
                                            {request.status === "pending_supervisor" ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(request.id)}
                                                        disabled={!!processingId}
                                                        className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded border border-green-200 font-medium transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                </div>
                                            ) : request.status === "pending_allocation" ? (
                                                <span className="text-xs text-muted-foreground italic">
                                                    Waiting for Fleet
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground/30">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
