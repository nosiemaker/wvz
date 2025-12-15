"use client"

import { useState } from "react"
import { FileText, AlertTriangle, CheckCircle, Calendar, DollarSign, Plus, Search, Filter } from "lucide-react"

export default function ContractsPage() {
    const [filter, setFilter] = useState("all")

    // Mock contracts data
    const contracts = [
        {
            id: 1,
            vehicle: "ABC123 - Toyota Land Cruiser",
            type: "insurance",
            provider: "Madison Insurance",
            policyNumber: "POL-2024-5678",
            startDate: "2024-07-01",
            endDate: "2025-06-30",
            cost: 12500,
            status: "active",
            daysUntilExpiry: 167
        },
        {
            id: 2,
            vehicle: "XYZ789 - Nissan Patrol",
            type: "maintenance",
            provider: "Toyota Service Center",
            policyNumber: "MAINT-2024-1234",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            cost: 8000,
            status: "expiring_soon",
            daysUntilExpiry: 16
        },
        {
            id: 3,
            vehicle: "DEF456 - Isuzu D-Max",
            type: "lease",
            provider: "Leasing Solutions Ltd",
            policyNumber: "LEASE-2023-9876",
            startDate: "2023-03-01",
            endDate: "2026-02-28",
            cost: 45000,
            status: "active",
            daysUntilExpiry: 440
        },
        {
            id: 4,
            vehicle: "GHI012 - Toyota Hilux",
            type: "insurance",
            provider: "National Insurance",
            policyNumber: "POL-2024-3456",
            startDate: "2024-09-01",
            endDate: "2025-08-31",
            cost: 9800,
            status: "active",
            daysUntilExpiry: 228
        },
        {
            id: 5,
            vehicle: "JKL345 - Ford Ranger",
            type: "maintenance",
            provider: "Quick Service Workshop",
            policyNumber: "MAINT-2024-7890",
            startDate: "2024-06-01",
            endDate: "2024-11-30",
            cost: 6500,
            status: "expired",
            daysUntilExpiry: -45
        }
    ]

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            insurance: "bg-blue-100 text-blue-700",
            maintenance: "bg-orange-100 text-orange-700",
            lease: "bg-purple-100 text-purple-700"
        }
        return colors[type] || "bg-gray-100 text-gray-700"
    }

    const getStatusBadge = (status: string, days: number) => {
        if (status === "expired") {
            return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                EXPIRED
            </span>
        }
        if (status === "expiring_soon") {
            return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                EXPIRES IN {days} DAYS
            </span>
        }
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            ACTIVE
        </span>
    }

    const filteredContracts = filter === "all"
        ? contracts
        : contracts.filter(c => c.type === filter)

    const stats = {
        total: contracts.length,
        active: contracts.filter(c => c.status === "active").length,
        expiringSoon: contracts.filter(c => c.status === "expiring_soon").length,
        expired: contracts.filter(c => c.status === "expired").length
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Contracts Management</h1>
                    <p className="text-muted-foreground">Track all vehicle contracts and expiry dates</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Contract
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total Contracts</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Expiring Soon</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.expiringSoon}</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Expired</p>
                    <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-card border rounded-md px-3 py-2 flex-1 max-w-md">
                    <Search className="w-4 h-4 text-muted-foreground mr-2" />
                    <input
                        type="text"
                        placeholder="Search contracts..."
                        className="bg-transparent border-none outline-none flex-1"
                    />
                </div>
                <div className="flex items-center bg-card border rounded-md px-2">
                    <Filter className="w-4 h-4 text-muted-foreground mr-2" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent border-none text-sm focus:ring-0 py-2 pr-8"
                    >
                        <option value="all">All Types</option>
                        <option value="insurance">Insurance</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="lease">Leasing</option>
                    </select>
                </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-card border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium">Vehicle</th>
                            <th className="text-left px-4 py-3 font-medium">Type</th>
                            <th className="text-left px-4 py-3 font-medium">Provider</th>
                            <th className="text-left px-4 py-3 font-medium">Policy Number</th>
                            <th className="text-center px-4 py-3 font-medium">Expiry Date</th>
                            <th className="text-right px-4 py-3 font-medium">Annual Cost</th>
                            <th className="text-center px-4 py-3 font-medium">Status</th>
                            <th className="text-right px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredContracts.map((contract) => (
                            <tr key={contract.id} className="hover:bg-muted/5">
                                <td className="px-4 py-4">
                                    <p className="font-semibold">{contract.vehicle}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getTypeColor(contract.type)}`}>
                                        {contract.type}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="font-medium">{contract.provider}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-muted-foreground">{contract.policyNumber}</p>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Calendar className="w-3 h-3 text-muted-foreground" />
                                        <span>{new Date(contract.endDate).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <p className="font-bold">${contract.cost.toLocaleString()}</p>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    {getStatusBadge(contract.status, contract.daysUntilExpiry)}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <button className="text-primary hover:underline text-sm">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
