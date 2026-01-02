"use client"

import { useState } from "react"
import { Car, Calendar, MapPin, User, Clock, CheckCircle, Play, RotateCw, ChevronRight, Compass, Hash } from "lucide-react"

interface AssignmentEntry {
    id: string
    vehicle: string
    plate: string
    vehicleCode: string
    driver: string
    destination: string
    purpose: string
    startDate: string
    endDate: string
    odometer: string
    tripCount: number
    status: "active" | "upcoming" | "completed"
}

export default function AssignmentsPage() {
    const [assignments] = useState<AssignmentEntry[]>([
        {
            id: "1",
            vehicle: "Toyota Land Cruiser",
            plate: "CAA 9371",
            vehicleCode: "V01",
            driver: "Ruth Zulu",
            destination: "Lusaka",
            purpose: "Security and Admin follow ups and operations across regional offices.",
            startDate: "02/01/26",
            endDate: "Active",
            odometer: "1,291 KM",
            tripCount: 33,
            status: "active"
        },
        {
            id: "2",
            vehicle: "Nissan Patrol",
            plate: "BAB 1245",
            vehicleCode: "V05",
            driver: "John Banda",
            destination: "Chipata",
            purpose: "Community Health Outreach program delivery and monitoring.",
            startDate: "05/01/26",
            endDate: "10/01/26",
            odometer: "0 KM",
            tripCount: 0,
            status: "upcoming"
        },
        {
            id: "3",
            vehicle: "Toyota Hilux",
            plate: "CAC 5567",
            vehicleCode: "V12",
            driver: "Grace Mwale",
            destination: "Ndola",
            purpose: "Education program assessment and school visits.",
            startDate: "28/12/25",
            endDate: "31/12/25",
            odometer: "847 KM",
            tripCount: 12,
            status: "completed"
        },
        {
            id: "4",
            vehicle: "Ford Ranger",
            plate: "BAD 7788",
            vehicleCode: "V08",
            driver: "Peter Tembo",
            destination: "Livingstone",
            purpose: "Emergency response coordination and supplies delivery.",
            startDate: "03/01/26",
            endDate: "08/01/26",
            odometer: "0 KM",
            tripCount: 0,
            status: "upcoming"
        },
    ])

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500 text-white"
            case "upcoming":
                return "bg-blue-500 text-white"
            case "completed":
                return "bg-slate-400 text-white"
            default:
                return "bg-slate-100 text-slate-600"
        }
    }

    const getStatusBorderStyle = (status: string) => {
        switch (status) {
            case "active":
                return "border-l-green-500"
            case "upcoming":
                return "border-l-blue-500"
            case "completed":
                return "border-l-slate-300"
            default:
                return "border-l-slate-200"
        }
    }

    const activeCount = assignments.filter(a => a.status === "active").length
    const upcomingCount = assignments.filter(a => a.status === "upcoming").length

    return (
        <div className="bg-[#F8F9FA] min-h-screen">
            {/* Header */}
            <div className="p-6 bg-white border-b border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                        <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Assignments</h2>
                    </div>
                    <RotateCw size={20} className="text-[#00897B]" />
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
                {assignments.map((entry) => (
                    <div key={entry.id} className={`bg-white rounded-[28px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden border-l-4 ${getStatusBorderStyle(entry.status)}`}>
                        <div className="p-6 space-y-4">
                            {/* Header Row */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Calendar size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-[2px]">Assignment Date</span>
                                        <span className="text-[11px] font-black text-slate-800">{entry.startDate}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Clock size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-[2px]">Return Date</span>
                                        <span className="text-[11px] font-black text-slate-800">{entry.endDate}</span>
                                    </div>
                                </div>
                                <div className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(entry.status)}`}>
                                    {entry.status}
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
                                        <p className="text-[14px] font-black text-slate-700 mb-1">{entry.driver}</p>
                                        <p className="text-[13px] font-bold italic text-slate-500 leading-relaxed">{entry.purpose}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Stats */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#3E2723] text-white flex items-center justify-center text-[10px] font-black shadow-lg">
                                        {entry.vehicleCode}
                                    </div>
                                    <span className="font-black text-slate-800 text-[15px] tracking-tighter uppercase">{entry.plate}</span>
                                </div>
                                <div className="flex gap-5">
                                    <div className="flex items-center gap-2">
                                        <Compass size={18} className="text-[#EE401D]" />
                                        <span className="text-[14px] font-black text-slate-800">{entry.odometer}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Hash size={16} className="text-slate-300" />
                                        <span className="text-[14px] font-black text-slate-800">{entry.tripCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button for Active */}
                            {entry.status === "active" && (
                                <button className="w-full py-4 bg-slate-900 text-white rounded-[20px] text-[12px] font-black uppercase tracking-[1.5px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform">
                                    <Play size={14} className="fill-current" />
                                    Continue Trip
                                </button>
                            )}
                            {entry.status === "upcoming" && (
                                <button className="w-full py-4 bg-blue-500 text-white rounded-[20px] text-[12px] font-black uppercase tracking-[1.5px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform">
                                    <CheckCircle size={14} />
                                    Accept Assignment
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
