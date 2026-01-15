"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  AlertTriangle, CheckCircle, Clock, Shield, Activity,
  ChevronRight, FileText, UserCheck, AlertOctagon, TrendingUp
} from "lucide-react"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie
} from "recharts"

export default function ComplianceDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  const [violationTrend] = useState([
    { month: "Jul", violations: 8, warnings: 12 },
    { month: "Aug", violations: 6, warnings: 15 },
    { month: "Sep", violations: 5, warnings: 10 },
    { month: "Oct", violations: 7, warnings: 18 },
    { month: "Nov", violations: 4, warnings: 12 },
    { month: "Dec", violations: 3, warnings: 8 },
  ])

  const [licenseExpiry] = useState([
    { range: "0-30 days", count: 3, color: "#ef4444" },
    { range: "31-60 days", count: 5, color: "#f97316" },
    { range: "61-90 days", count: 8, color: "#3b82f6" },
    { range: "90+ days", count: 18, color: "#22c55e" },
  ])

  useEffect(() => {
    // Simulate loading for premium feel
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold italic animate-pulse tracking-widest uppercase text-xs text-center">
            Synchronizing Policy Intelligence...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-10 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              <h1 className="text-3xl font-black tracking-tight uppercase italic">Compliance Intelligence</h1>
            </div>
            <p className="text-slate-400 font-medium max-w-md font-mono text-sm">
              SYSTEM OVERWATCH: Active policy monitoring and driver certification audit.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Level</p>
                <p className="text-lg font-black text-white italic">HIGH SHIELD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Compliance Rate", value: "88.2%", icon: UserCheck, color: "green", trend: "+2.1%", sub: "30/34 Active Drivers" },
          { label: "Active Violations", value: "01", icon: AlertOctagon, color: "red", trend: "-1 prev", sub: "Critical Severity" },
          { label: "Policy Warnings", value: "03", icon: AlertTriangle, color: "orange", trend: "+1 prev", sub: "Minor Infractions" },
          { label: "License Expiry", value: "16", icon: Clock, color: "blue", trend: "Audit Required", sub: "Next 90 Days" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-[0_12px_32px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110
                ${kpi.color === 'green' ? 'bg-green-50 text-green-600' :
                  kpi.color === 'red' ? 'bg-red-50 text-red-600' :
                    kpi.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                      'bg-blue-50 text-blue-600'}`}>
                <kpi.icon size={22} strokeWidth={2.5} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase italic
                ${kpi.color === 'green' ? 'bg-green-50 text-green-600' :
                  kpi.color === 'red' ? 'bg-green-50 text-green-600' :
                    'bg-slate-50 text-slate-500'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-[36px] font-black text-slate-900 leading-none italic">{kpi.value}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-[11px] font-bold text-slate-500 mt-2">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Violation & Warning Trend Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 italic uppercase">Safety Trend Analysis</h3>
              <p className="text-sm font-bold text-slate-400">Historical violations vs. warnings frequency</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black uppercase text-slate-600 outline-none cursor-pointer">
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={violationTrend}>
                <defs>
                  <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '16px' }}
                  itemStyle={{ fontWeight: 'black', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="violations" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorViolations)" dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="warnings" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorWarnings)" dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-6 pt-6 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase">Violations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase">Warnings</span>
            </div>
          </div>
        </div>

        {/* License Expiry Bar Chart */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
          <h3 className="text-xl font-black text-slate-900 italic uppercase mb-2">Certification Radar</h3>
          <p className="text-sm font-bold text-slate-400 mb-8">License expiry status breakdown</p>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={licenseExpiry}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {licenseExpiry.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {licenseExpiry.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{item.range}</span>
                </div>
                <span className="text-sm font-black text-slate-900 italic">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Activity Feed / Alerts */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 italic uppercase text-white underline decoration-blue-500 decoration-4 underline-offset-8">Critical Overwatch</h3>
              <p className="text-xs font-bold text-slate-400 mt-2">Active compliance alerts and system notifications</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Monitoring</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: 'VIOLATION', driver: 'Chanda M.', detail: 'Overspeeding (120km/h in 80 zone)', time: '20 mins ago', color: 'bg-red-500' },
              { type: 'LICENSE', driver: 'Lombe K.', detail: 'License expires in 2 days', time: '1 hour ago', color: 'bg-orange-500' },
              { type: 'CERTIFICATION', driver: 'Bwalya T.', detail: 'DDC Certification missing', time: '4 hours ago', color: 'bg-blue-500' },
            ].map((alert, i) => (
              <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-white/10 group">
                <div className={`absolute left-[-4px] top-0 w-2 h-2 rounded-full ${alert.color} shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:scale-150 transition-transform`}></div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{alert.time}</p>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-black text-white">{alert.type}</h4>
                  <span className="text-[9px] font-bold text-slate-500 px-1 border border-slate-700 rounded capitalize">{alert.driver}</span>
                </div>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  {alert.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
