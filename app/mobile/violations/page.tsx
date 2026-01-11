"use client"

import { useState } from "react"
import { AlertTriangle, Calendar, MapPin, Car, User, Clock, XCircle, AlertCircle, RotateCw } from "lucide-react"

interface ViolationEntry {
    id: string
    type: string
    description: string
    driver: string
    vehicle: string
    plate: string
    date: string
    location: string
    points: number
    severity: "low" | "medium" | "high" | "critical"
    status: "pending" | "reviewed" | "disputed"
}

export default function ViolationsPage() {
    const [violations] = useState<ViolationEntry[]>([
        {
            id: "1",
            type: "Speeding",
            description: "Exceeded speed limit by 25km/h in a 60km/h zone",
            driver: "John Banda",
            vehicle: "Toyota Hilux",
            plate: "CAA 9371",
            date: "01/01/26",
            location: "Great East Road, Lusaka",
            points: 3,
            severity: "medium",
            status: "pending"
        },
        {
            id: "2",
            type: "Late Return",
            description: "Vehicle returned 4 hours after scheduled time",
            driver: "Grace Mwale",
            vehicle: "Nissan Patrol",
            plate: "BAB 1245",
            date: "28/12/25",
            location: "World Vision Office",
            points: 2,
            severity: "low",
            status: "reviewed"
        },
        {
            id: "3",
            type: "Missed Inspection",
            description: "Failed to complete pre-trip inspection before departure",
            driver: "Peter Tembo",
            vehicle: "Toyota Land Cruiser",
            plate: "CAC 5567",
            date: "25/12/25",
            location: "Chipata Field Office",
            points: 4,
            severity: "high",
            status: "disputed"
        },
        {
            id: "4",
            type: "Harsh Braking",
            description: "Multiple harsh braking events detected during trip",
            driver: "Ruth Zulu",
            vehicle: "Ford Ranger",
            plate: "BAD 7788",
            date: "20/12/25",
            location: "Cairo Road, Lusaka",
            points: 1,
            severity: "low",
            status: "reviewed"
        },
    ])
    const [activeViolation, setActiveViolation] = useState<ViolationEntry | null>(null)

    const getSeverityStyle = (severity: string) => {
        switch (severity) {
            case "low":
                return "bg-yellow-50 text-yellow-600 border-yellow-200"
            case "medium":
                return "bg-orange-50 text-orange-600 border-orange-200"
            case "high":
                return "bg-red-50 text-red-600 border-red-200"
            case "critical":
                return "bg-red-100 text-red-700 border-red-300"
            default:
                return "bg-slate-50 text-slate-600 border-slate-200"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "reviewed":
                return <AlertCircle size={14} className="text-green-500" />
            case "disputed":
                return <XCircle size={14} className="text-amber-500" />
            default:
                return <Clock size={14} className="text-slate-400" />
        }
    }

    const totalPoints = violations.reduce((sum, v) => sum + v.points, 0)

    return (
        <div className="bg-white min-h-screen">
            {/* Header with Points Summary */}
            <div className="p-6 bg-gradient-to-br from-red-50 to-white border-b border-red-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                        <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Driving Violations</h2>
                    </div>
                    <RotateCw size={20} className="text-[#00897B]" />
                </div>

                <div className="bg-white rounded-3xl p-5 border border-red-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Points</p>
                            <p className="text-[42px] font-black text-red-500 leading-none">{totalPoints}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">This Month</p>
                            <p className="text-[28px] font-black text-slate-800">4</p>
                            <p className="text-[11px] font-bold text-slate-400">violations</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Point Threshold: 15</span>
                            <span className="text-green-600">Status: Good Standing</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Violation List */}
            <div className="divide-y divide-slate-50">
                {violations.map((entry) => (
                    <div key={entry.id} className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={20} className="text-[#EE401D]" />
                                    <span className="text-[18px] font-[900] italic tracking-tight text-slate-800">
                                        {entry.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 ml-8">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-[12px] font-black text-slate-400 uppercase tracking-wider">
                                        {entry.date}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div
                                    className={
                                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border " +
                                        getSeverityStyle(entry.severity)
                                    }
                                >
                                    {entry.severity}
                                </div>
                                <div className="flex items-center gap-1.5 text-[12px] font-black text-slate-500">
                                    {getStatusIcon(entry.status)}
                                    <span className="uppercase tracking-wider">{entry.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                            <p className="text-[14px] font-bold italic text-slate-600 leading-relaxed">
                                {entry.description}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-slate-400" />
                                    <span className="text-[12px] font-black text-slate-600">{entry.driver}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Car size={14} className="text-slate-400" />
                                    <span className="text-[12px] font-black text-slate-600">{entry.plate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span className="text-[12px] font-bold text-slate-500 italic">{entry.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Points Deducted:</span>
                                <span className="text-[18px] font-black text-red-500">-{entry.points}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveViolation(entry)}
                                className="text-[11px] font-black text-[#EE401D] uppercase tracking-widest"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {activeViolation && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[16px] font-black text-slate-800">Violation Details</h3>
                            <button
                                type="button"
                                onClick={() => setActiveViolation(null)}
                                className="text-slate-400"
                            >
                                <XCircle size={22} />
                            </button>
                        </div>
                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</p>
                                <p className="text-[14px] font-bold text-slate-800">{activeViolation.type}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</p>
                                <p className="text-[13px] font-semibold text-slate-600">{activeViolation.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Driver</p>
                                    <p className="text-[13px] font-semibold text-slate-700">{activeViolation.driver}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle</p>
                                    <p className="text-[13px] font-semibold text-slate-700">{activeViolation.vehicle}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Plate</p>
                                    <p className="text-[13px] font-semibold text-slate-700">{activeViolation.plate}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</p>
                                    <p className="text-[13px] font-semibold text-slate-700">{activeViolation.date}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                                <p className="text-[13px] font-semibold text-slate-700">{activeViolation.location}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setActiveViolation(null)}
                            className="mt-6 w-full rounded-xl bg-[#EE401D] py-3 text-[12px] font-black uppercase tracking-widest text-white"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
