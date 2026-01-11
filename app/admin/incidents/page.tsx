"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

export default function IncidentsPage() {
  const [incidents] = useState([
    {
      id: "INC-001",
      type: "Accident",
      driver: "John Doe",
      vehicle: "WRJ 2024",
      date: "2025-11-25",
      time: "14:30",
      severity: "high",
      status: "investigating",
      description: "Minor collision at intersection",
    },
    {
      id: "INC-002",
      type: "Speeding Violation",
      driver: "Mike Johnson",
      vehicle: "MH-05-CD-5678",
      date: "2025-11-25",
      time: "10:15",
      severity: "medium",
      status: "pending",
      description: "Exceeded speed limit by 15 km/h",
    },
  ])

  const getSeverityColor = (severity: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-semibold"
    if (severity === "high") return `zmw{baseStyle} bg-destructive/10 text-destructive`
    if (severity === "medium") return `zmw{baseStyle} bg-accent/10 text-accent`
    return `zmw{baseStyle} bg-primary/10 text-primary`
  }

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-semibold"
    if (status === "investigating") return `zmw{baseStyle} bg-accent/10 text-accent`
    if (status === "pending") return `zmw{baseStyle} bg-primary/10 text-primary`
    return `zmw{baseStyle} bg-muted text-muted-foreground`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Incident Management</h1>
        <p className="text-muted-foreground">Track and manage all reported incidents</p>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-card border border-border rounded-lg p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-6 h-6 mt-1 zmw{incident.severity === "high" ? "text-destructive" : "text-accent"}`}
                />
                <div>
                  <h3 className="font-semibold text-lg">{incident.type}</h3>
                  <p className="text-sm text-muted-foreground">{incident.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={getSeverityColor(incident.severity)}>
                  {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)} Severity
                </span>
                <span className={getStatusBadge(incident.status)}>
                  {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Driver</p>
                <p className="font-semibold">{incident.driver}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="font-semibold">{incident.vehicle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold">{new Date(incident.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-semibold">{incident.time}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm">{incident.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 text-sm">
                Investigate
              </button>
              <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted font-semibold text-sm">
                Add Note
              </button>
              <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted font-semibold text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
