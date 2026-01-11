"use client"

import { useState } from "react"
import { Shield, AlertTriangle, CheckCircle, Calendar, FileText } from "lucide-react"

export default function ComplianceDashboard() {
    const mockData = {
        stats: {
            totalDrivers: 45,
            validLicenses: 42,
            expiringLicenses: 3,
            expiredLicenses: 0,
            totalVehicles: 45,
            validInsurance: 43,
            expiringInsurance: 2,
            validRoadTax: 44,
            validFitness: 42,
        },
        expiringLicenses: [
            { id: 1, driver: "John Doe", licenseNumber: "DL-123", expiryDate: "2025-01-15", daysLeft: 31 },
            { id: 2, driver: "Jane Smith", licenseNumber: "DL-456", expiryDate: "2025-02-20", daysLeft: 67 },
            { id: 3, driver: "Mike Johnson", licenseNumber: "DL-789", expiryDate: "2025-03-10", daysLeft: 85 },
        ],
        expiringDocuments: [
            { id: 1, vehicle: "ABC123", type: "Insurance", expiryDate: "2025-01-20", daysLeft: 36 },
            { id: 2, vehicle: "XYZ789", type: "Road Tax", expiryDate: "2025-02-15", daysLeft: 62 },
        ],
        inspectionCompliance: {
            completed: 38,
            pending: 7,
            total: 45,
            rate: 84
        }
    }

    const getDaysLeftColor = (days: number) => {
        if (days <= 30) return "text-red-600"
        if (days <= 60) return "text-orange-600"
        return "text-yellow-600"
    }

    return (
        <div className="pb-20">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Compliance Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Monitor licenses, documents & inspections</p>
                </div>

                {/* License Stats */}
                <div className="bg-card border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Driver Licenses
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{mockData.stats.validLicenses}</p>
                            <p className="text-xs text-muted-foreground">Valid</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{mockData.stats.expiringLicenses}</p>
                            <p className="text-xs text-muted-foreground">Expiring</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">{mockData.stats.expiredLicenses}</p>
                            <p className="text-xs text-muted-foreground">Expired</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{mockData.stats.totalDrivers}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                    </div>
                </div>

                {/* Vehicle Documents */}
                <div className="bg-card border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Vehicle Documents
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{mockData.stats.validInsurance}</p>
                            <p className="text-xs text-muted-foreground">Insurance</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{mockData.stats.validRoadTax}</p>
                            <p className="text-xs text-muted-foreground">Road Tax</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{mockData.stats.validFitness}</p>
                            <p className="text-xs text-muted-foreground">Fitness</p>
                        </div>
                    </div>
                </div>

                {/* Inspection Compliance */}
                <div className="bg-card border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Inspection Compliance Rate</h3>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-4xl font-bold text-primary">{mockData.inspectionCompliance.rate}%</p>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                                {mockData.inspectionCompliance.completed}/{mockData.inspectionCompliance.total} completed
                            </p>
                            <p className="text-xs text-orange-600">{mockData.inspectionCompliance.pending} pending</p>
                        </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                        <div
                            className="bg-primary h-3 rounded-full"
                            style={{ width: `zmw{mockData.inspectionCompliance.rate}%` }}
                        />
                    </div>
                </div>

                {/* Expiring Licenses */}
                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        Expiring Driver Licenses ({mockData.expiringLicenses.length})
                    </h3>
                    {mockData.expiringLicenses.map((license) => (
                        <div key={license.id} className="bg-card border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-semibold">{license.driver}</p>
                                    <p className="text-sm text-muted-foreground">{license.licenseNumber}</p>
                                </div>
                                <span className={`font-bold zmw{getDaysLeftColor(license.daysLeft)}`}>
                                    {license.daysLeft} days
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                    Expires: {new Date(license.expiryDate).toLocaleDateString()}
                                </span>
                                <button className="text-primary font-semibold hover:underline">
                                    Send Reminder
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Expiring Documents */}
                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        Expiring Vehicle Documents ({mockData.expiringDocuments.length})
                    </h3>
                    {mockData.expiringDocuments.map((doc) => (
                        <div key={doc.id} className="bg-card border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-semibold">{doc.vehicle} - {doc.type}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`font-bold zmw{getDaysLeftColor(doc.daysLeft)}`}>
                                    {doc.daysLeft} days
                                </span>
                            </div>
                            <button className="w-full bg-accent text-accent-foreground py-2 rounded-lg text-sm font-semibold hover:opacity-90">
                                Schedule Renewal
                            </button>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90">
                        Send All Reminders
                    </button>
                    <button className="bg-accent text-accent-foreground py-3 rounded-lg font-bold hover:opacity-90">
                        Export Report
                    </button>
                </div>
            </div>
        </div>
    )
}
