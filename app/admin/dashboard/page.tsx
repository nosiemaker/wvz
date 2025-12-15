"use client"

import { Car, Wrench, AlertTriangle, DollarSign, TrendingUp, TrendingDown, Calendar, Fuel, Users } from "lucide-react"

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
        { id: 1, vehicle: "ABC123", type: "Oil Change", dueDate: "2024-12-18", daysLeft: 3, status: "urgent" },
        { id: 2, vehicle: "XYZ789", type: "Tire Rotation", dueDate: "2024-12-22", daysLeft: 7, status: "soon" },
        { id: 3, vehicle: "DEF456", type: "Brake Inspection", dueDate: "2024-12-28", daysLeft: 13, status: "scheduled" }
    ]

    const recentAlerts = [
        { id: 1, type: "warning", message: "Vehicle GHI012 exceeded speed limit", time: "2 hours ago" },
        { id: 2, type: "info", message: "Insurance for JKL345 expires in 15 days", time: "5 hours ago" },
        { id: 3, type: "error", message: "Fuel card transaction failed for MNO678", time: "1 day ago" }
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
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Fleet Dashboard</h1>
                <p className="text-muted-foreground">Real-time overview of your entire fleet</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Car className="w-8 h-8 opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
                    </div>
                    <p className="text-4xl font-bold">{stats.totalVehicles}</p>
                    <p className="text-sm opacity-90 mt-1">Total Vehicles</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-8 h-8 opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-4xl font-bold">{stats.activeTrips}</p>
                    <p className="text-sm opacity-90 mt-1">Active Trips</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Wrench className="w-8 h-8 opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Service</span>
                    </div>
                    <p className="text-4xl font-bold">{stats.inMaintenance}</p>
                    <p className="text-sm opacity-90 mt-1">In Maintenance</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="w-8 h-8 opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Ready</span>
                    </div>
                    <p className="text-4xl font-bold">{stats.available}</p>
                    <p className="text-sm opacity-90 mt-1">Available</p>
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Monthly Distance</p>
                            <p className="text-2xl font-bold">{stats.monthlyKm.toLocaleString()} km</p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">+12% from last month</p>
                </div>

                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Fuel Cost</p>
                            <p className="text-2xl font-bold">${stats.monthlyFuelCost.toLocaleString()}</p>
                        </div>
                        <Fuel className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="text-xs text-red-600 mt-2">+5% from last month</p>
                </div>

                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Utilization Rate</p>
                            <p className="text-2xl font-bold">{stats.utilizationRate}%</p>
                        </div>
                        <TrendingDown className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Target: 75%</p>
                </div>

                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Avg Cost/Vehicle</p>
                            <p className="text-2xl font-bold">${stats.avgCostPerVehicle}</p>
                        </div>
                        <DollarSign className="w-6 h-6 text-purple-500" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">-3% from last month</p>
                </div>
            </div>

            {/* Charts and Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cost Trend Chart */}
                <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">Monthly Cost Trend</h3>
                    <div className="space-y-3">
                        {costTrend.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-12">{item.month}</span>
                                <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full flex items-center justify-end pr-2"
                                        style={{ width: `${(item.cost / 55000) * 100}%` }}
                                    >
                                        <span className="text-xs text-white font-semibold">${(item.cost / 1000).toFixed(0)}k</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Maintenance */}
                <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">Upcoming Maintenance</h3>
                    <div className="space-y-3">
                        {upcomingMaintenance.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === "urgent" ? "bg-red-100" :
                                            item.status === "soon" ? "bg-yellow-100" : "bg-blue-100"
                                        }`}>
                                        <Wrench className={`w-5 h-5 ${item.status === "urgent" ? "text-red-600" :
                                                item.status === "soon" ? "text-yellow-600" : "text-blue-600"
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.vehicle}</p>
                                        <p className="text-sm text-muted-foreground">{item.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{item.daysLeft} days</p>
                                    <p className="text-xs text-muted-foreground">{new Date(item.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-card border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Recent Alerts</h3>
                <div className="space-y-3">
                    {recentAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <AlertTriangle className={`w-5 h-5 mt-0.5 ${alert.type === "error" ? "text-red-500" :
                                    alert.type === "warning" ? "text-yellow-500" : "text-blue-500"
                                }`} />
                            <div className="flex-1">
                                <p className="font-medium">{alert.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
