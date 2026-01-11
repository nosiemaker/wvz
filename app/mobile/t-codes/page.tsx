"use client"

import { useState } from "react"
import { Hash, Calendar, FileText, CheckCircle, Clock, RotateCw, ChevronRight } from "lucide-react"

interface TCodeEntry {
    id: string
    code: string
    description: string
    category: string
    amount: string
    date: string
    status: "active" | "used" | "expired"
    validUntil: string
}

export default function TCodesPage() {
    const [tcodes] = useState<TCodeEntry[]>([
        {
            id: "1",
            code: "T-2026-0142",
            description: "Field Office Operations - Eastern Province",
            category: "Operations",
            amount: "K 2,500.00",
            date: "02/01/26",
            status: "active",
            validUntil: "31/01/26"
        },
        {
            id: "2",
            code: "T-2026-0138",
            description: "Community Health Outreach - Chipata",
            category: "Health",
            amount: "K 4,200.00",
            date: "28/12/25",
            status: "used",
            validUntil: "15/01/26"
        },
        {
            id: "3",
            code: "T-2025-0891",
            description: "Education Program Support",
            category: "Education",
            amount: "K 1,800.00",
            date: "15/12/25",
            status: "expired",
            validUntil: "25/12/25"
        },
        {
            id: "4",
            code: "T-2026-0155",
            description: "Emergency Response - Northern Region",
            category: "Emergency",
            amount: "K 6,500.00",
            date: "01/01/26",
            status: "active",
            validUntil: "28/02/26"
        },
    ])

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-50 text-green-600 border-green-100"
            case "used":
                return "bg-blue-50 text-blue-600 border-blue-100"
            case "expired":
                return "bg-red-50 text-red-500 border-red-100"
            default:
                return "bg-slate-50 text-slate-600 border-slate-100"
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Operations":
                return "bg-purple-500"
            case "Health":
                return "bg-emerald-500"
            case "Education":
                return "bg-blue-500"
            case "Emergency":
                return "bg-red-500"
            default:
                return "bg-slate-500"
        }
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                    <h2 className="text-[18px] font-black text-slate-800 tracking-tight">T-Codes</h2>
                </div>
                <p className="text-[13px] font-bold text-slate-400 italic ml-4">
                    Transaction codes for cost center allocation and expense tracking
                </p>
            </div>

            {/* Quick Stats */}
            <div className="px-6 py-4 flex gap-3 overflow-x-auto">
                <div className="flex-shrink-0 bg-green-50 rounded-2xl px-5 py-3 border border-green-100">
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active</p>
                    <p className="text-[24px] font-black text-green-700">8</p>
                </div>
                <div className="flex-shrink-0 bg-blue-50 rounded-2xl px-5 py-3 border border-blue-100">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Used</p>
                    <p className="text-[24px] font-black text-blue-700">24</p>
                </div>
                <div className="flex-shrink-0 bg-red-50 rounded-2xl px-5 py-3 border border-red-100">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Expired</p>
                    <p className="text-[24px] font-black text-red-600">3</p>
                </div>
            </div>

            {/* T-Code List */}
            <div className="divide-y divide-slate-50">
                {tcodes.map((entry) => (
                    <div key={entry.id} className="p-6 space-y-4 active:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className={"w-2 h-8 rounded-full " + getCategoryColor(entry.category)}></div>
                                    <div>
                                        <span className="text-[18px] font-[900] italic tracking-tight text-slate-800 block">
                                            {entry.code}
                                        </span>
                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            {entry.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border " +
                                    getStatusStyle(entry.status)
                                }
                            >
                                {entry.status === "active" ? <CheckCircle size={12} /> : <Clock size={12} />}
                                {entry.status}
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                            <div className="flex items-start gap-3">
                                <FileText size={16} className="text-slate-400 mt-0.5" />
                                <span className="text-[14px] font-bold italic text-slate-600 leading-relaxed">{entry.description}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-[16px] font-black text-slate-800">{entry.amount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-[12px] font-black text-slate-400">Valid: {entry.validUntil}</span>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-slate-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
