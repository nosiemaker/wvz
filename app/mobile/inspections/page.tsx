"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

export default function InspectionsPage() {
  const [inspections] = useState([
    {
      id: "INS-001",
      type: "Pre-Trip",
      vehicle: "Toyota Hiace - WRJ 2024",
      date: "2025-11-25",
      status: "pending",
      items: 12,
      completed: 0,
    },
    {
      id: "INS-002",
      type: "Post-Trip",
      vehicle: "Tata 407 - MH-02-AB-1234",
      date: "2025-11-24",
      status: "completed",
      items: 15,
      completed: 15,
    },
  ])

  const getStatusIcon = (status: string) => {
    return status === "completed" ? (
      <CheckCircle className="w-5 h-5 text-primary" />
    ) : (
      <Clock className="w-5 h-5 text-accent" />
    )
  }

  return (
    <div className="pb-20">
      <div className="p-4 space-y-4">
        {/* Inspection Checklist */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Inspections</h2>
          {inspections.map((inspection) => (
            <div key={inspection.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getStatusIcon(inspection.status)}
                  <div>
                    <p className="font-semibold">{inspection.type} Inspection</p>
                    <p className="text-xs text-muted-foreground">{new Date(inspection.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted">{inspection.status}</span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-1">Vehicle</p>
                <p className="font-semibold">{inspection.vehicle}</p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Progress</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `zmw{(inspection.completed / inspection.items) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {inspection.completed} of {inspection.items} items
                </p>
              </div>

              <button
                className={`w-full font-semibold py-2 rounded-lg transition-colors zmw{
                  inspection.status === "completed"
                    ? "text-primary hover:bg-primary/10"
                    : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
              >
                {inspection.status === "completed" ? "View Report" : "Complete Inspection"}
              </button>
            </div>
          ))}
        </div>

        {/* Inspection Guidelines */}
        <div className="bg-primary/10 border border-primary rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Inspection Checklist</h3>
          </div>
          <ul className="text-sm space-y-2">
            <li>• Check vehicle lights and wipers</li>
            <li>• Inspect tires for damage</li>
            <li>• Verify brake functionality</li>
            <li>• Check fuel and fluid levels</li>
            <li>• Inspect mirrors and windows</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
