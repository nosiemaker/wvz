"use client"

import { useState } from "react"
import { FileText, Download, Printer } from "lucide-react"

export default function ComplianceReportsPage() {
  const [reports] = useState([
    {
      id: "RPT-001",
      title: "Monthly Compliance Report - November 2025",
      type: "Monthly Summary",
      date: "2025-11-25",
      drivers: 34,
      violations: 4,
      compliant: 30,
    },
    {
      id: "RPT-002",
      title: "License Expiry Alert Report",
      type: "Document Compliance",
      date: "2025-11-20",
      drivers: 16,
      violations: 0,
      compliant: 18,
    },
    {
      id: "RPT-003",
      title: "Inspection Compliance Report - Q3 2025",
      type: "Inspection Summary",
      date: "2025-11-15",
      drivers: 34,
      violations: 2,
      compliant: 32,
    },
    {
      id: "RPT-004",
      title: "Driver Training Completion Status",
      type: "Training Status",
      date: "2025-11-10",
      drivers: 28,
      violations: 6,
      compliant: 28,
    },
  ])

  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Reports</h1>
        <p className="text-muted-foreground">Generate and view compliance documentation</p>
      </div>

      {/* Generate Report */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Generate New Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Report Type</label>
            <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:border-primary outline-none">
              <option>Monthly Compliance</option>
              <option>Driver Violation Summary</option>
              <option>License Expiry Alert</option>
              <option>Inspection Compliance</option>
              <option>Training Status</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Period</label>
            <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:border-primary outline-none">
              <option>November 2025</option>
              <option>October 2025</option>
              <option>September 2025</option>
              <option>Q3 2025</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-accent text-accent-foreground font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        <h3 className="font-semibold">Recent Reports</h3>
        {reports.map((report) => (
          <div
            key={report.id}
            className={`bg-card border rounded-lg p-6 cursor-pointer transition-colors ${selectedReport === report.id ? "border-primary bg-primary/5" : "border-border hover:border-primary"
              }`}
            onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">{report.title}</h4>
                  <p className="text-sm text-muted-foreground">{report.type}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{new Date(report.date).toLocaleDateString()}</span>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Drivers</p>
                <p className="font-semibold">{report.drivers}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Violations</p>
                <p className={`font-semibold ${report.violations > 0 ? "text-destructive" : "text-primary"}`}>
                  {report.violations}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Compliant</p>
                <p className="font-semibold text-primary">{report.compliant}</p>
              </div>
            </div>

            {/* Expand Details */}
            {selectedReport === report.id && (
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Compliance Rate:</span>
                  <span className="font-semibold">{((report.compliant / report.drivers) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(report.compliant / report.drivers) * 100}%` }}
                  ></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted font-semibold text-sm">
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted font-semibold text-sm">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
