"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, PieChart, Download, Filter, Loader } from "lucide-react"
import { getFinanceStats } from "@/lib/bookings"

export default function FinanceDashboard() {
    const [timeRange, setTimeRange] = useState("month")
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const stats = await getFinanceStats()
                setData(stats)
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>

    if (!data) return <div>Failed to load data</div>

    return (
        <div className="pb-20">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Finance Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Fleet cost analytics (Est. K15/km)</p>
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
                            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors zmw{timeRange === range
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
                            <p className="text-sm opacity-90">Total Estimated Cost</p>
                            <p className="text-4xl font-bold">K{data.totalCost.toLocaleString()}</p>
                            <p className="text-sm opacity-75 mt-1">{data.totalTrips} Completed Trips</p>
                        </div>
                        <DollarSign className="w-10 h-10 opacity-75" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>Based on {data.totalMileage} km total mileage</span>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card border rounded-lg p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Total Mileage</p>
                        <p className="text-3xl font-bold text-primary">{data.totalMileage.toLocaleString()} km</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Avg Cost/Trip</p>
                        <p className="text-3xl font-bold text-primary">K{data.totalTrips > 0 ? Math.round(data.totalCost / data.totalTrips).toLocaleString() : 0}</p>
                    </div>
                </div>

                {/* Cost Center Allocation */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        <h3 className="font-semibold">Cost Center Allocation</h3>
                    </div>
                    {data.costCenters.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No data available for this period.</p>
                    ) : (
                        data.costCenters.map((center: any) => (
                            <div key={center.name} className="bg-card border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold">{center.name}</p>
                                    <p className="font-bold">K{center.cost.toLocaleString()}</p>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: `zmw{center.percentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <p className="text-xs text-muted-foreground">{center.percentage}% of total cost</p>
                                    <p className="text-xs text-muted-foreground">{center.count} trips</p>
                                </div>
                            </div>
                        ))
                    )}
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
