"use client"

import { Car, Wrench, AlertTriangle, DollarSign, TrendingUp, TrendingDown, Fuel, Users, Calendar, ArrowRight } from "lucide-react"

export default function FleetDashboardPage() {
    // Mock dashboard data
    const stats = {
        totalVehicles: 45,
        activeTrips: 12,
        inMaintenance: 3,
        available: 30,
        monthlyKm: 125430,
        monthlyFuelCost: 45230,
        utilizationRate: 67,
        avgCostPerVehicle: 1245
    }

    const upcomingMaintenance = [
        { id: 1, vehicle: "Toyota Hilux - ABC 123", type: "Oil Change", dueDate: "2024-12-18", daysLeft: 3, status: "urgent" },
        { id: 2, vehicle: "Nissan Patrol - XYZ 789", type: "Tire Rotation", dueDate: "2024-12-22", daysLeft: 7, status: "soon" },
        { id: 3, vehicle: "Ford Ranger - DEF 456", type: "Brake Inspection", dueDate: "2024-12-28", daysLeft: 13, status: "scheduled" }
    ]

    const recentAlerts = [
        { id: 1, type: "warning", message: "Vehicle GHI 012 exceeded speed limit", time: "2 hours ago" },
        { id: 2, type: "info", message: "Insurance for JKL 345 expires in 15 days", time: "5 hours ago" },
        { id: 3, type: "error", message: "Fuel card transaction failed for MNO 678", time: "1 day ago" }
    ]

    const costTrend = [
        { month: "Jul", cost: 52000 },
        { month: "Aug", cost: 48000 },
        { month: "Sep", cost: 51000 },
        { month: "Oct", cost: 47000 },
        { month: "Nov", cost: 49000 },
        { month: "Dec", cost: 45230 }
    ]

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
                            <TrendingUp size={20} strokeWidth={2.5} />
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
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 uppercase tracking-widest px-2 py-1 rounded-full">Ready</span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-[36px] font-black text-slate-800 leading-none tracking-tight">{stats.available}</h3>
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Drivers/Vehicles</p>
                    </div>
                </div>
            </div>

            {/* Split Section: Metrics & Maintenance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Secondary Metrics */}
                <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Dist.</p>
                                <p className="text-2xl font-black text-slate-800">{stats.monthlyKm.toLocaleString()} <span className="text-sm text-slate-400 font-bold">km</span></p>
                            </div>
                            <div className="bg-green-50 p-2 rounded-xl text-green-600">
                                <TrendingUp size={18} />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50">
                            <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12% vs last month</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuel Cost</p>
                                <p className="text-2xl font-black text-slate-800">ZM {stats.monthlyFuelCost.toLocaleString()}</p>
                            </div>
                            <div className="bg-orange-50 p-2 rounded-xl text-orange-600">
                                <Fuel size={18} />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50">
                            <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">+5% vs last month</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Utilization</p>
                                <p className="text-2xl font-black text-slate-800">{stats.utilizationRate}%</p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                                <TrendingDown size={18} />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50">
                            <p className="text-[11px] font-bold text-slate-400 italic">Target: 75%</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Cost / Vehicle</p>
                                <p className="text-2xl font-black text-slate-800">ZM {stats.avgCostPerVehicle}</p>
                            </div>
                            <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                                <DollarSign size={18} />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50">
                            <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">-3% vs last month</span>
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
                        {upcomingMaintenance.map((item) => (
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
                                            {item.daysLeft} Days Left
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
                        <h3 className="text-[16px] font-black text-slate-800 italic">Financial Overview</h3>
                    </div>
                    <div className="space-y-4">
                        {costTrend.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <span className="text-[12px] font-black text-slate-400 w-8">{item.month}</span>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-slate-800 rounded-full"
                                        style={{ width: `${(item.cost / 60000) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-[12px] font-bold text-slate-600 w-16 text-right">
                                    {(item.cost / 1000).toFixed(1)}k
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-slate-900 rounded-[28px] p-6 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="text-[#EE401D]" />
                    <h3 className="text-[18px] font-black italic tracking-wide">System Alerts</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recentAlerts.map((alert) => (
                        <div key={alert.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${alert.type === "error" ? "bg-red-500/20 text-red-400" :
                                        alert.type === "warning" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
                                    }`}>
                                    {alert.type}
                                </span>
                                <span className="text-[11px] font-bold text-white/40">{alert.time}</span>
                            </div>
                            <p className="text-[13px] font-bold leading-relaxed opacity-90">
                                {alert.message}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
