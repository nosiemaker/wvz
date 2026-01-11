"use client"

import { useMemo, useState } from "react"
import { FileText, AlertTriangle, CheckCircle, Calendar, DollarSign, Plus, Search, Filter } from "lucide-react"

export default function ContractsPage() {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeContract, setActiveContract] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    vehicle: "",
    type: "insurance",
    provider: "",
    policyNumber: "",
    startDate: "",
    endDate: "",
    cost: ""
  })

  // Mock contracts data
  const [contracts, setContracts] = useState([
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
  ])

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

  const filteredContracts = useMemo(() => {
    const base = filter === "all" ? contracts : contracts.filter(c => c.type === filter)
    if (!search.trim()) return base
    const term = search.trim().toLowerCase()
    return base.filter((c) =>
      [c.vehicle, c.provider, c.policyNumber, c.type].some((field) =>
        String(field).toLowerCase().includes(term)
      )
    )
  }, [contracts, filter, search])

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === "active").length,
    expiringSoon: contracts.filter(c => c.status === "expiring_soon").length,
    expired: contracts.filter(c => c.status === "expired").length
  }

  const handleAddContract = (e: React.FormEvent) => {
    e.preventDefault()
    const costValue = parseInt(formData.cost || "0", 10)
    const endDate = formData.endDate || new Date().toISOString().slice(0, 10)
    const daysUntilExpiry = Math.ceil(
      (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    const status =
      daysUntilExpiry < 0 ? "expired" : daysUntilExpiry <= 30 ? "expiring_soon" : "active"

    setContracts((prev) => [
      {
        id: prev.length + 1,
        vehicle: formData.vehicle || "Unassigned Vehicle",
        type: formData.type,
        provider: formData.provider || "Unknown Provider",
        policyNumber: formData.policyNumber || "N/A",
        startDate: formData.startDate || new Date().toISOString().slice(0, 10),
        endDate: endDate,
        cost: Number.isNaN(costValue) ? 0 : costValue,
        status: status,
        daysUntilExpiry: daysUntilExpiry
      },
      ...prev
    ])

    setFormData({
      vehicle: "",
      type: "insurance",
      provider: "",
      policyNumber: "",
      startDate: "",
      endDate: "",
      cost: ""
    })
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Contracts Management</h1>
                    <p className="text-muted-foreground">Track all vehicle contracts and expiry dates</p>
                </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2"
        >
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                                    <p className="font-bold">ZMW {contract.cost.toLocaleString()}</p>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    {getStatusBadge(contract.status, contract.daysUntilExpiry)}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <button
                                      onClick={() => setActiveContract(contract)}
                                      className="text-primary hover:underline text-sm"
                                    >
                                      View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-100 shadow-2xl">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold">Add Contract</h3>
                    <p className="text-sm text-muted-foreground">Create a contract entry (UI only).</p>
                  </div>
                  <form onSubmit={handleAddContract} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Vehicle</label>
                        <input
                          value={formData.vehicle}
                          onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                          placeholder="Plate - Model"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                        >
                          <option value="insurance">Insurance</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="lease">Lease</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Provider</label>
                        <input
                          value={formData.provider}
                          onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                          placeholder="Provider name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Policy Number</label>
                        <input
                          value={formData.policyNumber}
                          onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                          placeholder="POL-2025-0001"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Date</label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Annual Cost (ZMW)</label>
                        <input
                          type="number"
                          value={formData.cost}
                          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 rounded-lg border border-border"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                      >
                        Save Contract
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeContract && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-100 shadow-2xl">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold">Contract Details</h3>
                    <p className="text-sm text-muted-foreground">{activeContract.policyNumber}</p>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Vehicle</p>
                      <p className="font-semibold">{activeContract.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-semibold capitalize">{activeContract.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Provider</p>
                      <p className="font-semibold">{activeContract.provider}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Annual Cost</p>
                      <p className="font-semibold">ZMW {activeContract.cost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-semibold">{new Date(activeContract.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-semibold">{new Date(activeContract.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setActiveContract(null)}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
    )
}
