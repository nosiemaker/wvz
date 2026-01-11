"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, DollarSign, Fuel, FileText } from "lucide-react"

export default function FinanceDashboard() {
  const [fuelData] = useState([
    { month: "Jan", amount: 45000 },
    { month: "Feb", amount: 52000 },
    { month: "Mar", amount: 48000 },
    { month: "Apr", amount: 61000 },
    { month: "May", amount: 55000 },
    { month: "Jun", amount: 67000 },
  ])

  const [costBreakdown] = useState([
    { name: "Fuel", value: 42, color: "#3b82f6" },
    { name: "Maintenance", value: 28, color: "#ef4444" },
    { name: "Driver Salary", value: 20, color: "#10b981" },
    { name: "Insurance", value: 10, color: "#f59e0b" },
  ])

  const [costCenters] = useState([
    { center: "CC-001", fuel: 18000, maintenance: 8000, drivers: 9000, insurance: 3000, total: 38000 },
    { center: "CC-002", fuel: 16500, maintenance: 7200, drivers: 8500, insurance: 2800, total: 35000 },
    { center: "CC-003", fuel: 15000, maintenance: 6500, drivers: 7800, insurance: 2600, total: 32000 },
  ])

  const [metrics] = useState({
    totalSpend: 450000,
    monthlyAverage: 52500,
    costPerKm: 8.5,
    topCostCenter: "CC-001",
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>
        <p className="text-muted-foreground">Fleet financial analytics and cost tracking</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Total Spend</h3>
            <DollarSign className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">K{(metrics.totalSpend / 1000).toFixed(1)}k</p>
          <p className="text-sm text-muted-foreground">Last 6 months</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Monthly Avg</h3>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">K{(metrics.monthlyAverage / 1000).toFixed(1)}k</p>
          <p className="text-sm text-muted-foreground">Average cost</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Cost Per KM</h3>
            <Fuel className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">K{metrics.costPerKm}</p>
          <p className="text-sm text-muted-foreground">Per kilometer</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Top Center</h3>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{metrics.topCostCenter}</p>
          <p className="text-sm text-muted-foreground">Highest expenses</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fuel Spend Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Fuel Spend Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fuelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Bar dataKey="amount" fill="var(--color-accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={costBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-zmw{index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 text-sm mt-4">
            {costBreakdown.map((cost) => (
              <div key={cost.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: cost.color }}></div>
                  <span>{cost.name}</span>
                </div>
                <span className="font-semibold">{cost.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Center Analytics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Cost Center Analytics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Cost Center</th>
                <th className="px-4 py-3 text-right font-semibold">Fuel (K)</th>
                <th className="px-4 py-3 text-right font-semibold">Maintenance (K)</th>
                <th className="px-4 py-3 text-right font-semibold">Drivers (K)</th>
                <th className="px-4 py-3 text-right font-semibold">Insurance (K)</th>
                <th className="px-4 py-3 text-right font-semibold">Total (K)</th>
              </tr>
            </thead>
            <tbody>
              {costCenters.map((cc, idx) => (
                <tr key={cc.center} className={idx !== costCenters.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-4 py-3 font-semibold">{cc.center}</td>
                  <td className="px-4 py-3 text-right">{cc.fuel.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{cc.maintenance.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{cc.drivers.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{cc.insurance.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-bold text-accent">{cc.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
