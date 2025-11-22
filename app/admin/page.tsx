"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Truck, Activity } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { getActiveTrips } from "@/lib/trips"
import { getVehicles } from "@/lib/vehicles"
import { getAllIncidents } from "@/lib/incidents"

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    activeTrips: 0,
    overdue: 0,
    vehicles: 0,
    incidents: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [incidents, setIncidents] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trips, vehicles, allIncidents] = await Promise.all([getActiveTrips(), getVehicles(), getAllIncidents()])

        setDashboardData({
          activeTrips: trips?.length || 0,
          overdue: 0,
          vehicles: vehicles?.length || 0,
          incidents: allIncidents?.length || 0,
        })
        setIncidents(allIncidents || [])
      } catch (error) {
        console.log("[v0] Error loading dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const tripData = [
    { time: "00:00", trips: 2 },
    { time: "06:00", trips: 8 },
    { time: "12:00", trips: 15 },
    { time: "18:00", trips: 12 },
    { time: "23:59", trips: 5 },
  ]

  const vehicleStatus = [
    { name: "Active", value: dashboardData.vehicles, color: "#3b82f6" },
    { name: "Maintenance", value: 0, color: "#ef4444" },
    { name: "Idle", value: 0, color: "#6b7280" },
  ]

  const driverCompliance = [
    { name: "Compliant", value: 30 },
    { name: "Warning", value: 3 },
    { name: "Violation", value: 1 },
  ]

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Fleet Dashboard</h1>
        <p className="text-muted-foreground">Real-time fleet operations overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Active Trips</h3>
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">{dashboardData.activeTrips}</p>
          <p className="text-sm text-muted-foreground">In progress</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Total Vehicles</h3>
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{dashboardData.vehicles}</p>
          <p className="text-sm text-muted-foreground">In fleet</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Incidents</h3>
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-3xl font-bold">{dashboardData.incidents}</p>
          <p className="text-sm text-muted-foreground">Reported</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Alert Status</h3>
            <AlertTriangle className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">5</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trip Activity */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Trip Activity (Last 24 hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tripData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Line type="monotone" dataKey="trips" stroke="var(--color-accent)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Status */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Vehicle Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={vehicleStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                {vehicleStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 text-sm mt-4">
            {vehicleStatus.map((status) => (
              <div key={status.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: status.color }}></div>
                <span>
                  {status.name}: {status.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Recent Incidents</h3>
        <div className="space-y-3">
          {incidents.slice(0, 3).map((incident) => (
            <div key={incident.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
              <AlertTriangle
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${incident.severity === "critical" ? "text-destructive" : "text-accent"}`}
              />
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {incident.type} - {incident.description}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(incident.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {incidents.length === 0 && <p className="text-muted-foreground text-center py-4">No incidents reported</p>}
        </div>
      </div>
    </div>
  )
}
