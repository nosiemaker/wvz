"use client"

import { useState } from "react"
import { AlertTriangle, MapPin, Calendar, User, Eye, Plus, MessageSquare, History } from "lucide-react"

export default function ViolationsPage() {
  const [violations] = useState([
    {
      id: "VIO-001",
      driver: "Mike Johnson",
      driverId: "DRV-003",
      type: "Speeding",
      severity: "high",
      date: "2025-11-25",
      location: "Highway NH1, Mumbai-Pune",
      points: 3,
      status: "active",
      description: "Exceeded speed limit by 15 km/h",
    },
    {
      id: "VIO-002",
      driver: "Sarah Williams",
      driverId: "DRV-004",
      type: "Rash Driving",
      severity: "medium",
      date: "2025-11-24",
      location: "Urban Area, Pune",
      points: 2,
      status: "resolved",
      description: "Aggressive lane change without signal",
    },
    {
      id: "VIO-003",
      driver: "James Brown",
      driverId: "DRV-005",
      type: "Document Violation",
      severity: "medium",
      date: "2025-11-23",
      location: "Toll Gate, Mumbai-Pune",
      points: 1,
      status: "active",
      description: "Missing vehicle insurance document during inspection",
    },
  ])

  const [filterSeverity, setFilterSeverity] = useState("all")

  const filteredViolations =
    filterSeverity === "all" ? violations : violations.filter((v) => v.severity === filterSeverity)

  const getSeverityStyle = (severity: string) => {
    if (severity === "high") return "bg-red-50 text-red-600 border-red-100"
    if (severity === "medium") return "bg-orange-50 text-orange-600 border-orange-100"
    return "bg-blue-50 text-blue-600 border-blue-100"
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 opacity-10 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-[#EE401D] rounded-full"></div>
              <h1 className="text-3xl font-black tracking-tight uppercase italic">Violation Protocols</h1>
            </div>
            <p className="text-slate-400 font-medium max-w-md font-mono text-sm">
              Operational infraction tracking and safety enforcement records.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#EE401D] text-white px-6 py-3 rounded-2xl font-black uppercase text-xs shadow-lg shadow-red-600/20 hover:-translate-y-1 transition-all">
            <Plus size={18} />
            Initialize Log
          </button>
        </div>
      </div>

      {/* Filters Overlay */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-100 w-fit">
        {["all", "high", "medium"].map((severity) => (
          <button
            key={severity}
            onClick={() => setFilterSeverity(severity)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterSeverity === severity
              ? "bg-slate-900 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100"
              }`}
          >
            {severity}
          </button>
        ))}
      </div>

      {/* Violations Feed */}
      <div className="grid gap-6">
        {filteredViolations.map((violation) => (
          <div key={violation.id} className="group bg-white rounded-[32px] border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Side: Type & ID */}
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${violation.severity === 'high' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                    <AlertTriangle size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{violation.type}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{violation.id}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSeverityStyle(violation.severity)}`}>
                    {violation.severity} SEVERITY
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${violation.status === 'active' ? 'bg-slate-900 text-white border-slate-900' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                    {violation.status}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 pt-8 border-t border-slate-50">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <User size={12} /> Personnel
                  </p>
                  <p className="text-sm font-black text-slate-800 italic uppercase">{violation.driver}</p>
                  <p className="text-[10px] font-bold text-slate-400 font-mono">{violation.driverId}</p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} /> Incident Date
                  </p>
                  <p className="text-sm font-black text-slate-800 italic">{new Date(violation.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <MapPin size={12} /> Zone
                  </p>
                  <p className="text-sm font-black text-slate-800 italic truncate">{violation.location}</p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <AlertOctagon size={12} /> Impact Points
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-black italic ${violation.points >= 3 ? 'text-red-500' : 'text-slate-800'}`}>-{violation.points}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Penalty</span>
                  </div>
                </div>
              </div>

              {/* Description Block */}
              <div className="mt-8 p-6 rounded-[24px] bg-slate-50/50 border border-slate-100 group-hover:bg-white transition-colors">
                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                  "{violation.description}"
                </p>
              </div>

              {/* Actions Button Row */}
              <div className="flex flex-wrap items-center gap-3 mt-8">
                <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                  <Eye size={14} />
                  Investigate Detail
                </button>
                <button className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                  <MessageSquare size={14} />
                  Add Protocol Note
                </button>
                <button className="flex items-center gap-2 bg-white text-slate-400 border border-transparent px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all ml-auto">
                  <History size={14} />
                  View History
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredViolations.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
          <AlertTriangle size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] italic">No Protocol Deviations Found</p>
        </div>
      )}
    </div>
  )
}

import { AlertOctagon } from "lucide-react"
