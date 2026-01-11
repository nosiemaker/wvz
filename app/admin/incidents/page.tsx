"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([
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
      notes: [] as string[],
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
      notes: [] as string[],
    },
  ])
  const [activeIncident, setActiveIncident] = useState<any | null>(null)
  const [noteTarget, setNoteTarget] = useState<any | null>(null)
  const [noteText, setNoteText] = useState("")

  const getSeverityColor = (severity: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-semibold"
    if (severity === "high") return baseStyle + " bg-destructive/10 text-destructive"
    if (severity === "medium") return baseStyle + " bg-accent/10 text-accent"
    return baseStyle + " bg-primary/10 text-primary"
  }

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-semibold"
    if (status === "investigating") return baseStyle + " bg-accent/10 text-accent"
    if (status === "pending") return baseStyle + " bg-primary/10 text-primary"
    return baseStyle + " bg-muted text-muted-foreground"
  }

  const handleInvestigate = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? { ...incident, status: "investigating" }
          : incident
      )
    )
  }

  const handleAddNote = () => {
    if (!noteTarget) return
    const trimmed = noteText.trim()
    if (!trimmed) return
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === noteTarget.id
          ? { ...incident, notes: [trimmed, ...incident.notes] }
          : incident
      )
    )
    setNoteText("")
    setNoteTarget(null)
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
                  className={
                    "w-6 h-6 mt-1 " +
                    (incident.severity === "high" ? "text-destructive" : "text-accent")
                  }
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
              <button
                onClick={() => handleInvestigate(incident.id)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 text-sm"
              >
                Investigate
              </button>
              <button
                onClick={() => setNoteTarget(incident)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted font-semibold text-sm"
              >
                Add Note
              </button>
              <button
                onClick={() => setActiveIncident(incident)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted font-semibold text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-100 shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold">Incident Details</h3>
              <p className="text-sm text-muted-foreground">{activeIncident.id}</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-semibold">{activeIncident.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-semibold capitalize">{activeIncident.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Driver</p>
                <p className="font-semibold">{activeIncident.driver}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Vehicle</p>
                <p className="font-semibold">{activeIncident.vehicle}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-semibold">{new Date(activeIncident.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-semibold">{activeIncident.time}</p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <p className="text-muted-foreground text-sm mb-2">Description</p>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                {activeIncident.description}
              </div>
            </div>
            <div className="px-6 pb-6">
              <p className="text-muted-foreground text-sm mb-2">Notes</p>
              {activeIncident.notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes added yet.</p>
              ) : (
                <div className="space-y-2">
                  {activeIncident.notes.map((note: string, idx: number) => (
                    <div key={idx} className="rounded-lg border border-slate-100 bg-white p-3 text-sm">
                      {note}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveIncident(null)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {noteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold">Add Note</h3>
              <p className="text-sm text-muted-foreground">{noteTarget.id}</p>
            </div>
            <div className="p-6 space-y-3">
              <label className="text-sm font-medium">Note</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full min-h-[120px] rounded-lg border border-border bg-background p-3 text-sm"
                placeholder="Enter incident note..."
              />
            </div>
            <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => { setNoteText(""); setNoteTarget(null) }}
                className="px-4 py-2 rounded-lg border border-border"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
