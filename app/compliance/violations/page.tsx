"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

export default function ViolationsPage() {
  const [violations] = useState([
    {
      id: "VIO-001",
      driver: "Mike Johnson",
      driverId: "DRV-003",
      type: "Speeding",
      severity: "high",
      date: "2025-11-25",
      location: "Highway NH1, Mumbai-Pune",
      points: 3,
      status: "active",
      description: "Exceeded speed limit by 15 km/h",
    },
    {
      id: "VIO-002",
      driver: "Sarah Williams",
      driverId: "DRV-004",
      type: "Rash Driving",
      severity: "medium",
      date: "2025-11-24",
      location: "Urban Area, Pune",
      points: 2,
      status: "resolved",
      description: "Aggressive lane change without signal",
    },
    {
      id: "VIO-003",
      driver: "James Brown",
      driverId: "DRV-005",
      type: "Document Violation",
      severity: "medium",
      date: "2025-11-23",
      location: "Toll Gate, Mumbai-Pune",
      points: 1,
      status: "active",
      description: "Missing vehicle insurance document during inspection",
    },
  ])

  const [filterSeverity, setFilterSeverity] = useState("all")

  const filteredViolations =
    filterSeverity === "all" ? violations : violations.filter((v) => v.severity === filterSeverity)

  const getSeverityColor = (severity: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-semibold"
    if (severity === "high") return `${baseStyle} bg-destructive/10 text-destructive`
    if (severity === "medium") return `${baseStyle} bg-accent/10 text-accent`
    return `${baseStyle} bg-primary/10 text-primary`
  }

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-semibold"
    if (status === "active") return `${baseStyle} bg-accent/10 text-accent`
    return `${baseStyle} bg-primary/10 text-primary`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Violations Management</h1>
        <p className="text-muted-foreground">Track and manage driver violations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterSeverity("all")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filterSeverity === "all" ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterSeverity("high")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filterSeverity === "high"
              ? "bg-destructive text-destructive-foreground"
              : "border border-border hover:bg-muted"
          }`}
        >
          High
        </button>
        <button
          onClick={() => setFilterSeverity("medium")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filterSeverity === "medium" ? "bg-accent text-accent-foreground" : "border border-border hover:bg-muted"
          }`}
        >
          Medium
        </button>
      </div>

      {/* Violations List */}
      <div className="space-y-4">
        {filteredViolations.map((violation) => (
          <div key={violation.id} className="bg-card border border-border rounded-lg p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-6 h-6 mt-1 ${violation.severity === "high" ? "text-destructive" : "text-accent"}`}
                />
                <div>
                  <h3 className="font-semibold text-lg">{violation.type}</h3>
                  <p className="text-sm text-muted-foreground">{violation.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={getSeverityColor(violation.severity)}>
                  {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                </span>
                <span className={getStatusBadge(violation.status)}>
                  {violation.status.charAt(0).toUpperCase() + violation.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Driver</p>
                <p className="font-semibold">{violation.driver}</p>
                <p className="text-xs text-muted-foreground">{violation.driverId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="font-semibold">{new Date(violation.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="font-semibold">{violation.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Points</p>
                <p className={`font-bold text-lg ${violation.points > 2 ? "text-destructive" : "text-accent"}`}>
                  {violation.points}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm">{violation.description}</p>
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
                View History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
