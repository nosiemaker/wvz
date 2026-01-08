"use client"

import { useState, useEffect } from "react"
import {
  Car, Wrench, AlertTriangle, DollarSign, TrendingUp,
  TrendingDown, Fuel, Users, Calendar, ArrowRight, Activity
} from "lucide-react"
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
    monthlyFuelCost: 45230, // Mock for now
    utilizationRate: 0,
    avgCostPerVehicle: 1245 // Mock for now
  })

  const [upcomingMaintenance, setUpcomingMaintenance] = useState<any[]>([])
  const [recentAlerts, setRecentAlerts] = useState<any[]>([])
  const [recentIncidents, setRecentIncidents] = useState<any[]>([])

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

        // Calculate stats
        const inMaintenance = vehicles?.filter((v: any) => v.status === "maintenance")?.length || 0
        const vehiclesWithService = vehicles?.filter((v: any) => v.next_service_date)
          .map((v: any) => {
            const dueDate = new Date(v.next_service_date)
            const diffTime = dueDate.getTime() - new Date().getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return {
              id: v.id,
              vehicle: `${v.make} ${v.model} - ${v.registration}`,
              type: "General Service",
              dueDate: v.next_service_date,
              daysLeft: diffDays,
              status: diffDays < 7 ? "urgent" : diffDays < 15 ? "soon" : "scheduled"
            }
          })
          .sort((a: any, b: any) => a.daysLeft - b.daysLeft)
          .slice(0, 3)

        // Calculate total KM from trips (delta between start and end mileage)
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
          avgCostPerVehicle: 1245
        })

        setUpcomingMaintenance(vehiclesWithService || [])
        setRecentIncidents(incidents?.slice(0, 3) || [])

        // Map incidents to alerts
        const alerts = incidents?.slice(0, 3).map((inc: any) => ({
          id: inc.id,
          type: inc.severity === 'critical' ? 'error' : 'warning',
          message: `${inc.type}: ${inc.description}`,
          time: new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })) || []

        setRecentAlerts(alerts)

      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const costTrend = [
    { month: "Jul", cost: 52000 },
    { month: "Aug", cost: 48000 },
    { month: "Sep", cost: 51000 },
    { month: "Oct", cost: 47000 },
    { month: "Nov", cost: 49000 },
    { month: "Dec", cost: 45230 }
  ]

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#EE401D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold italic animate-pulse tracking-widest uppercase text-xs">Synchronizing Fleet Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
          <h2 className="text-[20px] font-black text-slate-800 tracking-tight uppercase">Fleet Overview</h2>
        </div>
        <p className="text-slate-500 font-medium text-sm pl-4">Real-time supervision of fleet operations and health.</p>
      </div>

      {/* KPI Cards - Premium Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vehicles */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Car size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black bg-slate-100 text-slate-600 uppercase tracking-widest px-2 py-1 rounded-full">Total</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-[36px] font-black text-slate-800 leading-none tracking-tight">{stats.totalVehicles}</h3>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Fleet Size</p>
          </div>
        </div>

        {/* Active Trips */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-[36px] font-black text-slate-800 leading-none tracking-tight">{stats.activeTrips}</h3>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Active Trips</p>
          </div>
        </div>

        {/* In Maintenance */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:rotate-12 transition-transform">
              <Wrench size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black bg-orange-50 text-orange-600 uppercase tracking-widest px-2 py-1 rounded-full">Service</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-[36px] font-black text-slate-800 leading-none tracking-tight">{stats.inMaintenance}</h3>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">In Maintenance</p>
          </div>
        </div>

        {/* Available */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black bg-blue-50 text-blue-600 uppercase tracking-widest px-2 py-1 rounded-full">{stats.totalDrivers}</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-[36px] font-black text-slate-800 leading-none tracking-tight">{stats.totalDrivers}</h3>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Registered Drivers</p>
          </div>
        </div>
      </div>

      {/* Split Section: Metrics & Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Distance</p>
                <p className="text-2xl font-black text-slate-800">{stats.monthlyKm.toLocaleString()} <span className="text-sm text-slate-400 font-bold">km</span></p>
              </div>
              <div className="bg-green-50 p-2 rounded-xl text-green-600">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50">
              <span className="text-[11px] font-bold text-slate-400">All-time fleet mileage</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuel Consumption</p>
                <p className="text-2xl font-black text-slate-800 italic">ZM {stats.monthlyFuelCost.toLocaleString()}</p>
              </div>
              <div className="bg-orange-50 p-2 rounded-xl text-orange-600">
                <Fuel size={18} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 text-right">
              <span className="text-[10px] font-black text-slate-300 uppercase italic">Estimation</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Utilization</p>
                <p className="text-2xl font-black text-slate-800">{stats.utilizationRate}%</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Activity size={18} />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.utilizationRate}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Safety Index</p>
                <p className="text-2xl font-black text-slate-800 text-green-600">98.2</p>
              </div>
              <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                <DollarSign size={18} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50">
              <span className="text-[11px] font-black text-green-500 uppercase">Excellent</span>
            </div>
          </div>
        </div>

        {/* Upcoming Maintenance List */}
        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] lg:row-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-black text-slate-800 italic">Upcoming Service</h3>
            <button className="text-[12px] font-bold text-[#EE401D] hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingMaintenance.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-xs font-bold uppercase italic">No pending services</p>
              </div>
            ) : upcomingMaintenance.map((item) => (
              <div key={item.id} className="group flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md transition-all cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.status === "urgent" ? "bg-red-100 text-red-600" :
                  item.status === "soon" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                  }`}>
                  <Wrench size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-black text-slate-800 truncate">{item.vehicle}</h4>
                  <p className="text-[12px] font-medium text-slate-500 mt-0.5">{item.type}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar size={12} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-400">{new Date(item.dueDate).toLocaleDateString()}</span>
                    <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ml-auto ${item.status === "urgent" ? "bg-red-100 text-red-600" :
                      item.status === "soon" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                      }`}>
                      {item.daysLeft <= 0 ? 'Today' : `${item.daysLeft}d left`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Trend (Simple Visual) */}
        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-black text-slate-800 italic uppercase">Financial Trend</h3>
          </div>
          <div className="flex items-end gap-2 h-32 mt-8">
            {costTrend.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full relative">
                  <div
                    className="w-full bg-slate-100 rounded-t-xl group-hover:bg-[#EE401D]/20 transition-colors cursor-pointer"
                    style={{ height: `${(item.cost / 60000) * 100}px` }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-slate-800 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ height: `${(item.cost / 60000) * 100}px` }}
                    ></div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts (Incidents) */}
      <div className="bg-slate-900 rounded-[28px] p-6 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EE401D] opacity-10 blur-[100px] pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <AlertTriangle className="text-[#EE401D]" />
          <h3 className="text-[18px] font-black italic tracking-wide">Critical System Alerts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {recentAlerts.length === 0 ? (
            <div className="col-span-3 text-center py-6 opacity-40">
              <p className="text-xs font-bold uppercase tracking-widest">System Operational - No active alerts</p>
            </div>
          ) : recentAlerts.map((alert) => (
            <div key={alert.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${alert.type === "error" ? "bg-red-500/20 text-red-400" :
                  alert.type === "warning" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
                  }`}>
                  {alert.type}
                </span>
                <span className="text-[11px] font-bold text-white/40">{alert.time}</span>
              </div>
              <p className="text-[13px] font-bold leading-relaxed opacity-90 truncate">
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
