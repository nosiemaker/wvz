"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClipboardCheck, Car, Calendar, ArrowRight, CheckCircle2 } from "lucide-react"

export default function VehicleInspectionPage() {
    const router = useRouter()

    // Mock allocated vehicle
    const vehicle = {
        name: "Toyota Land Cruiser",
        plate: "CAA 9371",
        allocationDate: "02/01/26",
        status: "Active"
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                    <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Vehicle Inspection</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                    Perform mandatory pre-trip and post-trip inspections for your allocated vehicle.
                </p>
            </div>

            <div className="p-6 space-y-8">
                {/* Allocated Vehicle Card */}
                <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">
                        Allocated Vehicle
                    </h3>
                    <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl shadow-slate-200">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-black italic tracking-wide">{vehicle.name}</h3>
                                <p className="text-white/60 text-sm font-bold tracking-widest uppercase mt-1">{vehicle.plate}</p>
                            </div>
                            <div className="bg-white/10 p-2.5 rounded-xl">
                                <Car size={24} className="text-white" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-white/50 text-xs font-medium border-t border-white/10 pt-4">
                            <Calendar size={14} />
                            Assigned on {vehicle.allocationDate}
                        </div>
                    </div>
                </div>

                {/* Inspection Actions */}
                <div className="space-y-4">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-0 pl-1">
                        Start Inspection
                    </h3>

                    <button
                        onClick={() => router.push('/mobile/inspections/pre-trip')}
                        className="w-full group relative bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.99] text-left overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <ClipboardCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-slate-800 italic">Pre-Trip Inspection</h4>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">Before starting your journey</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </button>

                    <button
                        onClick={() => router.push('/mobile/inspections/post-trip')} // Assuming post-trip route exists or using similar structure
                        className="w-full group relative bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.99] text-left overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-slate-800 italic">Post-Trip Inspection</h4>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">After completing your journey</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-slate-300 group-hover:text-green-500 transition-colors" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
