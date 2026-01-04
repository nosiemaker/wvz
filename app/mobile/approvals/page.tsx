"use client"

import { useState, useEffect } from "react"
import { getPendingSupervisorApprovals, approveBooking, rejectBooking } from "@/lib/bookings"
import { CheckCircle, XCircle, Clock, MapPin, User, FileText, ArrowLeft, Loader, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ApprovalsPage() {
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const router = useRouter()

    const loadData = async () => {
        try {
            const data = await getPendingSupervisorApprovals()
            setRequests(data || [])
        } catch (error) {
            console.error("Failed to load approvals", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleApprove = async (id: string) => {
        setProcessingId(id)
        try {
            await approveBooking(id)
            await loadData() // Refresh list
        } catch (error) {
            alert("Failed to approve")
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (id: string) => {
        const reason = prompt("Please enter a rejection reason:")
        if (!reason) return

        setProcessingId(id)
        try {
            await rejectBooking(id, reason)
            await loadData()
        } catch (error) {
            alert("Failed to reject")
        } finally {
            setProcessingId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="pb-20 min-h-screen bg-[#F8F9FA] p-4">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/mobile/employee">
                    <ArrowLeft className="w-6 h-6 text-slate-800" />
                </Link>
                <h1 className="text-2xl font-black text-slate-800">Pending Approvals</h1>
            </div>

            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <CheckCircle className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-bold">No pending requests</p>
                    <p className="text-sm">You're all caught up!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div key={request.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            {/* Header: Requester Info */}
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-50">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                    {request.requester?.full_name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{request.requester?.full_name || "Unknown User"}</h3>
                                    <p className="text-xs text-slate-400 font-semibold uppercase">{request.requester?.job_title || "Staff Member"}</p>
                                </div>
                                <div className="ml-auto bg-orange-50 text-orange-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                                    Needs Review
                                </div>
                            </div>

                            {/* Trip Details */}
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mb-5">
                                <div className="col-span-2 flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 uppercase">Destination</span>
                                        <span className="font-semibold text-slate-800">{request.destination}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 uppercase">Start</span>
                                        <span className="font-semibold text-slate-800">{new Date(request.start_date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 uppercase">Purpose</span>
                                        <span className="font-semibold text-slate-800 truncate w-full">{request.purpose}</span>
                                    </div>
                                </div>

                                {request.is_self_drive && (
                                    <div className="col-span-2 bg-slate-50 p-2 rounded-lg flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-500" />
                                        <span className="text-xs font-bold text-slate-600">Requesting Self-Drive</span>
                                    </div>
                                )}
                                {request.cost_center && (
                                    <div className="col-span-2 border border-slate-100 p-2 rounded-lg">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost Center</span>
                                        <span className="text-xs font-bold text-slate-800">{request.cost_center}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleReject(request.id)}
                                    disabled={processingId === request.id}
                                    className="flex-1 py-3 border-2 border-slate-100 text-slate-500 font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleApprove(request.id)}
                                    disabled={processingId === request.id}
                                    className="flex-[2] py-3 bg-[#EE401D] text-white font-bold rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-orange-900/20 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processingId === request.id ? "Processing..." : "Approve Request"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
