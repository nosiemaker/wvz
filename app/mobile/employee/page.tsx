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
        <div className="bg-[#F8F9FA] min-h-screen pb-24">
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                            <h1 className="text-[26px] font-black text-slate-800 tracking-tighter">My Trips</h1>
                        </div>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[2px] ml-3.5">Request and track your trips</p>
                    </div>
                </div>

                {/* Quick Request Button - High Fidelity */}
                <button
                    onClick={() => router.push("/mobile/bookings/create")}
                    className="w-full h-[68px] bg-[#EE401D] text-white px-8 rounded-[24px] font-black text-[18px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-red-900/40 uppercase tracking-[2px]"
                >
                    <Plus className="w-6 h-6 stroke-[3px]" />
                    Request New Trip
                </button>

                {/* Pending Requests Section */}
                {pendingRequests.length > 0 && (
                    <div className="space-y-5">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[2px] flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#EE401D]" />
                                Pending Requests
                            </h3>
                            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-full">{pendingRequests.length}</span>
                        </div>
                        <div className="space-y-4">
                            {pendingRequests.map((request) => (
                                <div key={request.id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-[20px] font-black text-slate-800 tracking-tight leading-none">{request.destination}</h4>
                                            <p className="text-[13px] text-slate-500 font-bold italic">{request.purpose || "Official business trip."}</p>
                                        </div>
                                        <div className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-inner">
                                            {request.status.replace("_", " ")}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-4 text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-[11px] font-black uppercase tracking-wider">{new Date(request.start_date).toLocaleDateString()}</span>
                                            </div>
                                            {request.cost_center && (
                                                <div className="bg-slate-50 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border border-slate-100">
                                                    {request.cost_center}
                                                </div>
                                            )}
                                        </div>
                                        <button className="text-[11px] font-black text-[#EE401D] uppercase tracking-widest hover:underline">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming/Approved Section */}
                {upcomingTrips.length > 0 && (
                    <div className="space-y-5">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[2px] flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Approved Trips
                            </h3>
                            <span className="bg-green-50 text-green-600 text-[10px] font-black px-2.5 py-1 rounded-full">{upcomingTrips.length}</span>
                        </div>
                        <div className="space-y-4">
                            {upcomingTrips.map((trip) => (
                                <div key={trip.id} className="bg-white rounded-[32px] border border-green-100 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-full translate-x-12 -translate-y-12 -z-0"></div>
                                    <div className="relative z-10 flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-[20px] font-black text-slate-800 tracking-tight leading-none">{trip.destination}</h4>
                                            <p className="text-[13px] text-slate-500 font-bold italic">{trip.purpose || "Official business trip."}</p>
                                        </div>
                                        <div className="bg-green-500 text-white px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-900/10">
                                            APPROVED
                                        </div>
                                    </div>
                                    <div className="relative z-10 flex items-center justify-between pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-4 text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-green-500" />
                                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">{new Date(trip.start_date).toLocaleDateString()}</span>
                                            </div>
                                            {trip.vehicles && (
                                                <div className="bg-[#3E2723] text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight shadow-lg shadow-brown-900/20">
                                                    {trip.vehicles.plate_number || trip.vehicles.registration}
                                                </div>
                                            )}
                                        </div>
                                        <button className="text-[11px] font-black text-green-600 uppercase tracking-widest hover:underline">
                                            View Ticket
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {requests.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="font-black text-xl text-slate-800 mb-2">No Trip Requests Yet</p>
                        <p className="text-sm font-bold text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                            Click the button above to request your first trip
                        </p>
                    </div>
                )}

                {/* Recent History Shortcut */}
                {requests.length > 5 && (
                    <button
                        onClick={() => router.push("/mobile/bookings")}
                        className="w-full py-4 bg-slate-50 text-slate-500 rounded-[20px] text-[11px] font-black uppercase tracking-[2px] transition-all active:scale-95 border border-slate-100"
                    >
                        View older requests ({requests.length - 3})
                    </button>
                )}
            </div>
        </div>
    )
}
