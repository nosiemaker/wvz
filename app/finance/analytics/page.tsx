"use client"

import { useState } from "react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Filter, Download } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [costPerKmData] = useState([
    { week: "W1", cost: 8.2 },
    { week: "W2", cost: 8.5 },
    { week: "W3", cost: 8.1 },
    { week: "W4", cost: 8.8 },
    { week: "W5", cost: 8.4 },
    { week: "W6", cost: 8.6 },
  ])

  const [maintenanceData] = useState([
    { month: "Jan", cost: 8000 },
    { month: "Feb", cost: 7200 },
    { month: "Mar", cost: 8500 },
    { month: "Apr", cost: 9000 },
    { month: "May", cost: 6500 },
    { month: "Jun", cost: 7800 },
  ])

  const [fuelEfficiency] = useState([
    { vehicle: "WRJ 2024", efficiency: 12.5, cost: 42000 },
    { vehicle: "MH-02-AB-1234", efficiency: 11.8, cost: 38000 },
    { vehicle: "MH-05-CD-5678", efficiency: 13.2, cost: 35000 },
    { vehicle: "Other Vehicles", efficiency: 12.1, cost: 85000 },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Analytics</h1>
        <p className="text-muted-foreground">Detailed fleet cost analysis and insights</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:border-primary outline-none"
        >
          <option value="1month">Last 1 Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 1 Year</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted ml-auto">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Per KM Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Cost Per KM Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costPerKmData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Line type="monotone" dataKey="cost" stroke="var(--color-primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Costs */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Maintenance Cost Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={maintenanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Bar dataKey="cost" fill="var(--color-destructive)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fuel Efficiency by Vehicle */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Fuel Efficiency by Vehicle</h3>
        <div className="space-y-3">
          {fuelEfficiency.map((vehicle, idx) => (
            <div key={vehicle.vehicle} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{vehicle.vehicle}</p>
                <p className="text-sm text-accent font-semibold">
                  {vehicle.efficiency.toFixed(1)} km/l | ₹{vehicle.cost.toLocaleString()}
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(vehicle.efficiency / 14) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
