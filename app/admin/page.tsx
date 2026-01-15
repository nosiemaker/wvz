"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Car, Wrench, AlertTriangle, DollarSign, TrendingUp,
  Fuel, Users, Calendar, Activity, ChevronRight, MapPin
} from "lucide-react"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { getVehicles } from "@/lib/vehicles"
import { getAdminActiveTrips, getAdminAllTrips } from "@/lib/trips"
import { getAllIncidents } from "@/lib/incidents"
import { createClient } from "@/lib/client"

export default function FleetDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeTrips: 0,
    inMaintenance: 0,
    totalDrivers: 0,
    monthlyKm: 0,
    monthlyFuelCost: 45230,
    utilizationRate: 0,
    safetyScore: 98.2
  })

  const [statusData, setStatusData] = useState<any[]>([])
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<any[]>([])
  const [recentAlerts, setRecentAlerts] = useState<any[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const supabase = createClient()

        const [
          vehicles,
          activeTrips,
          allTrips,
          incidents,
          { data: drivers }
        ] = await Promise.all([
          getVehicles(),
          getAdminActiveTrips(),
          getAdminAllTrips(),
          getAllIncidents(),
          supabase.from("users").select("*").eq("role", "driver")
        ])

        // Calculate status distribution for Pie Chart
        const statusCounts = (vehicles || []).reduce((acc: any, v: any) => {
          const status = v.status || 'available'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})

        const chartData = [
          { name: 'Active', value: statusCounts.active || 0, color: '#22c55e' },
          { name: 'Maintenance', value: statusCounts.maintenance || 0, color: '#f97316' },
          { name: 'Available', value: (vehicles?.length || 0) - (statusCounts.active || 0) - (statusCounts.maintenance || 0), color: '#3b82f6' }
        ].filter(d => d.value > 0)

        setStatusData(chartData)

        // Calculate stats
        const inMaintenance = statusCounts.maintenance || 0
        const vehiclesWithService = (vehicles || []).filter((v: any) => v.next_service_date)
          .map((v: any) => {
            const dueDate = new Date(v.next_service_date)
            const diffTime = dueDate.getTime() - new Date().getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return {
              id: v.id,
              vehicle: v.make + " " + v.model + " - " + v.registration,
              type: "General Service",
              dueDate: v.next_service_date,
              daysLeft: diffDays,
              status: diffDays < 7 ? "urgent" : diffDays < 15 ? "soon" : "scheduled"
            }
          })
          .sort((a: any, b: any) => a.daysLeft - b.daysLeft)
          .slice(0, 3)

        const totalKm = allTrips?.reduce((acc: number, trip: any) => {
          if (trip.start_mileage && trip.end_mileage) {
            return acc + (trip.end_mileage - trip.start_mileage)
          }
          return acc
        }, 0) || 0

        const activeCount = activeTrips?.length || 0
        const vehicleCount = vehicles?.length || 0
        const utilization = vehicleCount > 0 ? Math.round((activeCount / vehicleCount) * 100) : 0

        setStats({
          totalVehicles: vehicleCount,
          activeTrips: activeCount,
          inMaintenance: inMaintenance,
          totalDrivers: drivers?.length || 0,
          monthlyKm: totalKm,
          monthlyFuelCost: 45230,
          utilizationRate: utilization,
          safetyScore: 98.2
        })

        setUpcomingMaintenance(vehiclesWithService || [])

        const alerts = (incidents || []).slice(0, 3).map((inc: any) => ({
          id: inc.id,
          type: inc.severity === 'critical' ? 'error' : 'warning',
          message: inc.type + ": " + inc.description,
          time: new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))

        setRecentAlerts(alerts)

      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const costTrendData = [
    { month: "Jul", cost: 52000, km: 12400 },
    { month: "Aug", cost: 48000, km: 11800 },
    { month: "Sep", cost: 51000, km: 12100 },
    { month: "Oct", cost: 47000, km: 11500 },
    { month: "Nov", cost: 49000, km: 11900 },
    { month: "Dec", cost: 45230, km: 10800 }
  ]

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#EE401D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold italic animate-pulse tracking-widest uppercase text-xs">Synchronizing Fleet Intelligence...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EE401D] opacity-10 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-[#EE401D] rounded-full"></div>
              <h1 className="text-3xl font-black tracking-tight uppercase italic">Command Center</h1>
            </div>
            <p className="text-slate-400 font-medium max-w-md">
              Real-time fleet performance, operational efficiency, and predictive maintenance monitoring.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
                <p className="text-lg font-black text-white italic">OPERATIONAL</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Asset", value: stats.totalVehicles, icon: Car, color: "slate", link: "/admin/vehicles" },
          { label: "Active Deploy", value: stats.activeTrips, icon: MapPin, color: "green", link: "/admin/trips", trend: "+4% from prev" },
          { label: "Maintenance", value: stats.inMaintenance, icon: Wrench, color: "orange", link: "/admin/vehicles?status=maintenance" },
          { label: "Fleet Crew", value: stats.totalDrivers, icon: Users, color: "blue", link: "/admin/staff" }
        ].map((kpi, i) => (
          <Link href={kpi.link} key={i}>
            <div className={`bg-white rounded-[28px] p-6 border border-slate-100 shadow-[0_12px_32px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-${kpi.color}-50 flex items-center justify-center text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
                  <kpi.icon size={22} strokeWidth={2.5} />
                </div>
                {kpi.trend && <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase italic">{kpi.trend}</span>}
              </div>
              <div className="space-y-1">
                <h3 className="text-[40px] font-black text-slate-900 leading-none italic">{kpi.value}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cost & KM Analysis Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 italic uppercase">Efficiency Analysis</h3>
              <p className="text-sm font-bold text-slate-400">Monthly Operating Cost vs deployment distance</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black uppercase text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrendData}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EE401D" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#EE401D" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '16px' }}
                  itemStyle={{ fontWeight: 'black', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="cost" stroke="#EE401D" strokeWidth={4} fillOpacity={1} fill="url(#colorCost)" dot={{ r: 4, fill: '#EE401D', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="km" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorKm)" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-6 pt-6 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EE401D]"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase">Operating Cost (ZMW)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase">Mileage (KM)</span>
            </div>
          </div>
        </div>

        {/* Fleet Distribution Pie Chart */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
          <h3 className="text-xl font-black text-slate-900 italic uppercase mb-2">Fleet Pulse</h3>
          <p className="text-sm font-bold text-slate-400 mb-8">Real-time status distribution</p>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900 italic">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Radar */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 italic uppercase">Maintenance Radar</h3>
              <p className="text-sm font-bold text-slate-400">Predictive service monitoring queue</p>
            </div>
            <Link href="/admin/vehicles" className="text-xs font-black text-[#EE401D] uppercase hover:underline">Full Audit</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingMaintenance.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-slate-300 font-black uppercase italic italic">All vehicles in spec</p>
              </div>
            ) : upcomingMaintenance.map((item) => (
              <div key={item.id} className="group p-5 rounded-3xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-500 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.status === "urgent" ? "bg-red-500 text-white" :
                    item.status === "soon" ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
                    }`}>
                    <Wrench size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-md font-black text-slate-900 truncate uppercase mt-1">{item.vehicle}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${item.status === "urgent" ? "bg-red-100 text-red-600" :
                        item.status === "soon" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                        }`}>
                        {item.status} - {item.daysLeft <= 0 ? "OVERDUE" : `T-${item.daysLeft} DAYS`}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Utilization Gauge & Activity Feed */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#EE401D]/20 via-transparent to-transparent"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-black italic uppercase mb-2 underline decoration-[#EE401D] decoration-4 underline-offset-8">Fleet Intel</h3>
            <p className="text-xs font-bold text-slate-400 mb-8">System optimization metrics</p>

            <div className="space-y-6">
              <div className="relative flex items-center justify-center py-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * stats.utilizationRate) / 100}
                    className="text-[#EE401D] drop-shadow-[0_0_8px_rgba(238,64,29,0.5)] transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black italic">{stats.utilizationRate}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Utilized</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Safety Index</p>
                  <p className="text-xl font-black text-green-400 italic">98.2</p>
                </div>
                <div className={`bg-white/5 p-4 rounded-2xl border border-white/10 transition-colors ${recentAlerts.length > 0 ? 'border-red-500/30' : ''}`}>
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Alerts</p>
                  <p className={`text-xl font-black italic ${recentAlerts.length > 0 ? 'text-red-500' : 'text-slate-200'}`}>{recentAlerts.length}</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/admin/incidents" className="relative z-10 flex items-center justify-between p-4 mt-6 rounded-2xl bg-[#EE401D]/10 hover:bg-[#EE401D]/20 border border-[#EE401D]/20 transition-all group">
            <span className="text-[10px] font-black uppercase tracking-widest italic group-hover:translate-x-1 transition-transform">Analyze Fleet Safety Logs</span>
            <Activity size={16} className="text-[#EE401D]" />
          </Link>
        </div>

        {/* Global Operations Timeline - New Feature */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 italic uppercase">Operations Timeline</h3>
              <p className="text-sm font-bold text-slate-400">Chronological feed of mission critical events</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Monitoring</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'TRIP_START', user: 'Chanda M.', vehicle: 'Toyota Hilux - BAA 1234', time: '10 mins ago', color: 'bg-green-500' },
              { type: 'MAINTENANCE', user: 'Lombe K.', vehicle: 'Ford Ranger - ABC 5678', time: '45 mins ago', color: 'bg-orange-500' },
              { type: 'INCIDENT', user: 'Bwalya T.', vehicle: 'Toyota Land Cruiser', time: '2 hours ago', color: 'bg-red-500' },
              { type: 'TRIP_END', user: 'Mwewa F.', vehicle: 'Nissan Navara', time: '3 hours ago', color: 'bg-blue-500' },
            ].map((event, i) => (
              <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-slate-100 group">
                <div className={`absolute left-[-4px] top-0 w-2 h-2 rounded-full ${event.color} shadow-[0_0_8px_rgba(0,0,0,0.1)] group-hover:scale-150 transition-transform`}></div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{event.time}</p>
                <h4 className="text-sm font-black text-slate-900 mb-1">{event.type.replace('_', ' ')}</h4>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  <span className="text-slate-800">{event.user}</span> operating <span className="italic">{event.vehicle}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
