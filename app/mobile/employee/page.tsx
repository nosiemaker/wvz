"use client"

import { useState, useEffect } from "react"
import { MapPin, Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, History, FileText, ChevronRight } from "lucide-react"
import { getMyRequests } from "@/lib/bookings"
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

    const pendingRequests = requests.filter(r => r.status === "pending_supervisor" || r.status === "pending_allocation")
    const approvedRequests = requests.filter(r => r.status === "approved")
    const completedRequests = requests.filter(r => r.status === "completed")

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EE401D]"></div>
            </div>
        )
    }

    return (
        <div className="bg-[#F8F9FA] min-h-screen pb-24">
            {/* Top Stat Section */}
            <div className="bg-white p-6 pb-8 rounded-b-[32px] shadow-sm border-b border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overview</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-3xl font-black text-[#EE401D]">{pendingRequests.length}</span>
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider">Pending</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-3xl font-black text-green-600">{approvedRequests.length}</span>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-wider">Approved</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-3xl font-black text-slate-600">{completedRequests.length}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Done</span>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Quick Actions */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[2px] ml-1">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push("/mobile/bookings/create")}
                            className="bg-[#EE401D] text-white p-5 rounded-[24px] shadow-xl shadow-orange-900/20 active:scale-95 transition-transform text-left group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform"></div>
                            <Plus className="w-8 h-8 mb-4 stroke-[3px]" />
                            <div className="font-black text-lg leading-tight">New<br />Request</div>
                        </button>

                        <button
                            onClick={() => router.push("/mobile/bookings")}
                            className="bg-white text-slate-800 p-5 rounded-[24px] border border-slate-200 shadow-sm active:scale-95 transition-transform text-left"
                        >
                            <History className="w-8 h-8 mb-4 text-slate-400" />
                            <div className="font-black text-lg leading-tight">View<br />History</div>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[2px]">Recent Requests</h3>
                        <button onClick={() => router.push("/mobile/bookings")} className="text-[10px] font-bold text-[#EE401D] uppercase tracking-wider flex items-center gap-1">
                            View All <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    {requests.length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Calendar className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-400">No requests yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {requests.slice(0, 3).map((request) => {
                                const statusLabel = request.status === "approved"
                                    ? "Approved"
                                    : request.status === "completed"
                                        ? "Completed"
                                        : request.status === "rejected"
                                            ? "Rejected"
                                            : request.status.includes("pending")
                                                ? "Pending"
                                                : request.status

                                const statusClasses = request.status === "approved"
                                    ? "bg-green-50 text-green-600"
                                    : request.status === "completed"
                                        ? "bg-slate-100 text-slate-600"
                                        : request.status === "rejected"
                                            ? "bg-red-50 text-red-600"
                                            : request.status.includes("pending")
                                                ? "bg-orange-50 text-orange-500"
                                                : "bg-slate-50 text-slate-500"

                                const iconWrapClasses = request.status === "approved"
                                    ? "bg-green-100 text-green-600"
                                    : request.status === "completed"
                                        ? "bg-slate-100 text-slate-500"
                                        : request.status === "rejected"
                                            ? "bg-red-100 text-red-600"
                                            : request.status.includes("pending")
                                                ? "bg-orange-50 text-orange-500"
                                                : "bg-slate-100 text-slate-500"

                                const StatusIcon = request.status === "approved"
                                    ? CheckCircle
                                    : request.status === "completed"
                                        ? CheckCircle
                                        : request.status === "rejected"
                                            ? XCircle
                                            : request.status.includes("pending")
                                                ? Clock
                                                : FileText

                                return (
                                <div key={request.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={"w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 " + iconWrapClasses}>
                                            <StatusIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{request.destination}</h4>
                                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                                                {new Date(request.start_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={"px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider " + statusClasses}>
                                        {statusLabel}
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
