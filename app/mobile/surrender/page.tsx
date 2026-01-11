"use client"

import { useState } from "react"
import { Car, Calendar, User, Clock, CheckCircle, AlertCircle, RotateCw } from "lucide-react"

interface SurrenderEntry {
    id: string
    vehicle: string
    plate: string
    surrenderedBy: string
    date: string
    time: string
    reason: string
    status: "pending" | "completed" | "rejected"
    condition: string
}

export default function SurrenderPage() {
    const [surrenders] = useState<SurrenderEntry[]>([
        {
            id: "1",
            vehicle: "Toyota Land Cruiser",
            plate: "CAA 9371",
            surrenderedBy: "Ruth Zulu",
            date: "02/01/26",
            time: "16:30",
            reason: "End of Assignment",
            status: "completed",
            condition: "Good"
        },
        {
            id: "2",
            vehicle: "Nissan Patrol",
            plate: "BAB 1245",
            surrenderedBy: "John Banda",
            date: "28/12/25",
            time: "09:15",
            reason: "Vehicle Service Due",
            status: "completed",
            condition: "Fair - Minor scratches"
        },
        {
            id: "3",
            vehicle: "Toyota Hilux",
            plate: "CAC 5567",
            surrenderedBy: "Grace Mwale",
            date: "25/12/25",
            time: "14:00",
            reason: "End of Contract",
            status: "pending",
            condition: "Pending Inspection"
        },
    ])

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-50 text-green-600 border-green-100"
            case "pending":
                return "bg-amber-50 text-amber-600 border-amber-100"
            case "rejected":
                return "bg-red-50 text-red-600 border-red-100"
            default:
                return "bg-slate-50 text-slate-600 border-slate-100"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle size={14} />
            case "pending":
                return <Clock size={14} />
            default:
                return <AlertCircle size={14} />
        }
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header Stats */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                    <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Vehicle Surrenders</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                        <p className="text-[28px] font-black text-slate-800">12</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm">
                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Completed</p>
                        <p className="text-[28px] font-black text-green-600">9</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pending</p>
                        <p className="text-[28px] font-black text-amber-600">3</p>
                    </div>
                </div>
            </div>

            {/* Surrender List */}
            <div className="divide-y divide-slate-50">
                {surrenders.map((entry) => (
                    <div key={entry.id} className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <Car size={20} className="text-black" />
                                    <span className="text-[18px] font-[900] italic tracking-tight text-slate-800">
                                        {entry.vehicle}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 ml-8">
                                    <span className="text-[14px] font-black text-slate-500 uppercase tracking-tight">
                                        {entry.plate}
                                    </span>
                                </div>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border zmw{getStatusStyle(entry.status)}`}>
                                {getStatusIcon(entry.status)}
                                {entry.status}
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <User size={16} className="text-slate-400" />
                                <span className="text-[14px] font-black italic text-slate-600">{entry.surrenderedBy}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar size={16} className="text-slate-400" />
                                <span className="text-[14px] font-black italic text-slate-500">{entry.date} at {entry.time}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <AlertCircle size={16} className="text-slate-400" />
                                <span className="text-[14px] font-bold italic text-slate-500">{entry.reason}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Condition: {entry.condition}
                            </span>
                            <RotateCw size={20} className="text-[#00897B]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
