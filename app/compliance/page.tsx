"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ComplianceDashboard() {
  const [violationTrend] = useState([
    { month: "Jul", violations: 8 },
    { month: "Aug", violations: 6 },
    { month: "Sep", violations: 5 },
    { month: "Oct", violations: 7 },
    { month: "Nov", violations: 4 },
  ])

  const [licenseExpiry] = useState([
    { range: "0-30 days", count: 3 },
    { range: "31-60 days", count: 5 },
    { range: "61-90 days", count: 8 },
    { range: "90+ days", count: 18 },
  ])

  const [complianceMetrics] = useState({
    totalDrivers: 34,
    compliant: 30,
    warnings: 3,
    violations: 1,
    licenseExpiring: 16,
    certificationExpiring: 8,
  })

  const complianceRate = (complianceMetrics.compliant / complianceMetrics.totalDrivers) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
        <p className="text-muted-foreground">Fleet-wide compliance monitoring and oversight</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Compliance Rate</h3>
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{complianceRate.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">
            {complianceMetrics.compliant} of {complianceMetrics.totalDrivers} drivers
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Violations</h3>
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-destructive">{complianceMetrics.violations}</p>
          <p className="text-sm text-muted-foreground">Active violations</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Warnings</h3>
            <AlertTriangle className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-accent">{complianceMetrics.warnings}</p>
          <p className="text-sm text-muted-foreground">Drivers on warning</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">License Expiring</h3>
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-accent">{complianceMetrics.licenseExpiring}</p>
          <p className="text-sm text-muted-foreground">In next 90 days</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Violation Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Violation Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={violationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Line type="monotone" dataKey="violations" stroke="var(--color-destructive)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* License Expiry Status */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">License Expiry Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={licenseExpiry}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="range" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Overall Compliance Summary</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Compliant Drivers</span>
              <span className="text-sm font-semibold text-primary">{complianceMetrics.compliant}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full"
                style={{ width: `zmw{(complianceMetrics.compliant / complianceMetrics.totalDrivers) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Drivers with Warnings</span>
              <span className="text-sm font-semibold text-accent">{complianceMetrics.warnings}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-accent h-3 rounded-full"
                style={{ width: `zmw{(complianceMetrics.warnings / complianceMetrics.totalDrivers) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Drivers with Violations</span>
              <span className="text-sm font-semibold text-destructive">{complianceMetrics.violations}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-destructive h-3 rounded-full"
                style={{ width: `zmw{(complianceMetrics.violations / complianceMetrics.totalDrivers) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
