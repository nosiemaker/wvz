"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, PieChart, Download, Filter } from "lucide-react"

export default function FinanceDashboard() {
    const [timeRange, setTimeRange] = useState("month")

    const mockData = {
        totalCost: 125430,
        fuelCost: 45230,
        maintenanceCost: 28900,
        otherCosts: 51300,
        costPerKm: 2.45,
        costPerVehicle: 2787,
        topVehicles: [
            { id: 1, plate: "ABC123", cost: 8450, km: 3200 },
            { id: 2, plate: "XYZ789", cost: 7890, km: 2950 },
            { id: 3, plate: "DEF456", cost: 7120, km: 2800 },
        ],
        costCenters: [
            { name: "Operations", cost: 45600, percentage: 36 },
            { name: "Programs", cost: 38200, percentage: 30 },
            { name: "Admin", cost: 25400, percentage: 20 },
            { name: "Field", cost: 16230, percentage: 14 },
        ],
        monthlyTrend: [
            { month: "Jul", cost: 98000 },
            { month: "Aug", cost: 105000 },
            { month: "Sep", cost: 112000 },
            { month: "Oct", cost: 118000 },
            { month: "Nov", cost: 125430 },
        ]
    }

    return (
        <div className="pb-20">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Finance Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Fleet cost analytics</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 border rounded-lg hover:bg-muted">
                            <Filter className="w-5 h-5" />
                        </button>
                        <button className="p-2 border rounded-lg hover:bg-muted">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Time Range */}
                <div className="flex gap-2">
                    {["week", "month", "quarter", "year"].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors ${timeRange === range
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                {/* Total Cost Card */}
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm opacity-90">Total Fleet Cost</p>
                            <p className="text-4xl font-bold">K{mockData.totalCost.toLocaleString()}</p>
                            <p className="text-sm opacity-75 mt-1">This month</p>
                        </div>
                        <DollarSign className="w-10 h-10 opacity-75" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>+8.2% from last month</span>
                    </div>
                </div>

                {/* Cost Breakdown */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-card border rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Fuel</p>
                        <p className="text-2xl font-bold text-blue-600">K{mockData.fuelCost.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{((mockData.fuelCost / mockData.totalCost) * 100).toFixed(0)}%</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Maintenance</p>
                        <p className="text-2xl font-bold text-orange-600">K{mockData.maintenanceCost.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{((mockData.maintenanceCost / mockData.totalCost) * 100).toFixed(0)}%</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Other</p>
                        <p className="text-2xl font-bold text-green-600">K{mockData.otherCosts.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{((mockData.otherCosts / mockData.totalCost) * 100).toFixed(0)}%</p>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card border rounded-lg p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Cost per KM</p>
                        <p className="text-3xl font-bold text-primary">K{mockData.costPerKm}</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Cost per Vehicle</p>
                        <p className="text-3xl font-bold text-primary">K{mockData.costPerVehicle}</p>
                    </div>
                </div>

                {/* Top Vehicles by Cost */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Top Vehicles by Cost</h3>
                    {mockData.topVehicles.map((vehicle, index) => (
                        <div key={vehicle.id} className="bg-card border rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-semibold">{vehicle.plate}</p>
                                    <p className="text-xs text-muted-foreground">{vehicle.km.toLocaleString()} km</p>
                                </div>
                            </div>
                            <p className="text-lg font-bold">K{vehicle.cost.toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                {/* Cost Center Allocation */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        <h3 className="font-semibold">Cost Center Allocation</h3>
                    </div>
                    {mockData.costCenters.map((center) => (
                        <div key={center.name} className="bg-card border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold">{center.name}</p>
                                <p className="font-bold">K{center.cost.toLocaleString()}</p>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${center.percentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{center.percentage}% of total</p>
                        </div>
                    ))}
                </div>

                {/* Monthly Trend */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Cost Trend</h3>
                    <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-end justify-between gap-2 h-32">
                            {mockData.monthlyTrend.map((data, index) => (
                                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                                        style={{ height: `${(data.cost / 130000) * 100}%` }}
                                    />
                                    <p className="text-xs text-muted-foreground">{data.month}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Export Button */}
                <button className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-bold hover:opacity-90 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Export to Excel
                </button>
            </div>
        </div>
    )
}
