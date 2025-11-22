"use client"

import { useState } from "react"
import { FileText, Download, Eye, Filter } from "lucide-react"

export default function ReportsPage() {
  const [reports] = useState([
    {
      id: "RPT-001",
      title: "Monthly Cost Summary - November 2025",
      type: "Cost Summary",
      date: "2025-11-25",
      period: "Nov 2025",
      status: "ready",
      size: "2.4 MB",
    },
    {
      id: "RPT-002",
      title: "Fuel Expense Report - Cost Center CC-001",
      type: "Fuel Analysis",
      date: "2025-11-24",
      period: "Oct 2025",
      status: "ready",
      size: "1.8 MB",
    },
    {
      id: "RPT-003",
      title: "Vehicle Maintenance Analysis",
      type: "Maintenance",
      date: "2025-11-20",
      period: "Oct 2025",
      status: "ready",
      size: "3.1 MB",
    },
    {
      id: "RPT-004",
      title: "Trip Expense Audit Report",
      type: "Trip Analysis",
      date: "2025-11-15",
      period: "Sep 2025",
      status: "ready",
      size: "2.7 MB",
    },
  ])

  const [selectedReports, setSelectedReports] = useState<string[]>([])

  const handleSelectReport = (id: string) => {
    setSelectedReports((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <p className="text-muted-foreground">Generate and download expense reports</p>
      </div>

      {/* Generate New Report */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Generate New Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Report Type</label>
            <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:border-primary outline-none">
              <option>Cost Summary Report</option>
              <option>Fuel Expense Report</option>
              <option>Maintenance Report</option>
              <option>Trip Expense Report</option>
              <option>Driver Cost Analysis</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Period</label>
            <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:border-primary outline-none">
              <option>January 2025</option>
              <option>February 2025</option>
              <option>March 2025</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Cost Center</label>
            <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:border-primary outline-none">
              <option>All Cost Centers</option>
              <option>CC-001</option>
              <option>CC-002</option>
              <option>CC-003</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Export Format</label>
            <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:border-primary outline-none">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>
          </div>
        </div>
        <button className="mt-4 w-full bg-accent text-accent-foreground font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
          Generate Report
        </button>
      </div>

      {/* Recent Reports */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recent Reports</h3>
          <button className="flex items-center gap-2 text-accent hover:opacity-80 transition-opacity">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Reports List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" className="rounded border-border bg-input" />
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Report</th>
                  <th className="px-6 py-3 text-left font-semibold">Type</th>
                  <th className="px-6 py-3 text-left font-semibold">Period</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Size</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, idx) => (
                  <tr key={report.id} className={idx !== reports.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleSelectReport(report.id)}
                        className="rounded border-border bg-input"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">{report.title}</p>
                          <p className="text-xs text-muted-foreground">{report.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{report.type}</td>
                    <td className="px-6 py-4 text-sm">{report.period}</td>
                    <td className="px-6 py-4 text-sm">{new Date(report.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{report.size}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-muted rounded text-primary">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded text-accent">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
