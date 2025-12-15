"use client"

import { useState } from "react"
import { ArrowLeft, FileText, Calendar, Wrench, Camera, AlertCircle, CheckCircle, Download, Upload, Fuel, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function VehicleDetailPage() {
    const [activeTab, setActiveTab] = useState("overview")

    // Mock vehicle data
    const vehicle = {
        id: "1",
        plateNumber: "ABC123",
        make: "Toyota",
        model: "Land Cruiser",
        year: 2022,
        vin: "JTMRFREV5MD123456",
        color: "White",
        fuelType: "Diesel",
        status: "active",
        mileage: 45230,
        lastService: "2024-11-15",
        nextService: "2025-02-15",
        insurance: {
            provider: "Madison Insurance",
            policyNumber: "POL-2024-5678",
            expiryDate: "2025-06-30",
            status: "active"
        },
        documents: [
            { id: 1, name: "Vehicle Registration", type: "registration", uploadDate: "2024-01-15", url: "#" },
            { id: 2, name: "Insurance Certificate", type: "insurance", uploadDate: "2024-06-01", url: "#" },
            { id: 3, name: "Road Tax Receipt", type: "tax", uploadDate: "2024-03-20", url: "#" }
        ],
        maintenanceHistory: [
            { id: 1, date: "2024-11-15", type: "Oil Change", cost: 450, workshop: "Toyota Service Center", mileage: 45000 },
            { id: 2, date: "2024-09-10", type: "Tire Replacement", cost: 2800, workshop: "Quick Tires", mileage: 42000 },
            { id: 3, date: "2024-06-05", type: "Brake Service", cost: 1200, workshop: "Toyota Service Center", mileage: 38000 }
        ],
        photos: [
            "/placeholder-car-1.jpg",
            "/placeholder-car-2.jpg",
            "/placeholder-car-3.jpg"
        ]
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/vehicles" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{vehicle.plateNumber}</h1>
                        <p className="text-muted-foreground">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border rounded-lg hover:bg-muted">
                        <Upload className="w-4 h-4 inline mr-2" />
                        Upload Document
                    </button>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                        Schedule Service
                    </button>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Current Mileage</p>
                            <p className="text-2xl font-bold">{vehicle.mileage.toLocaleString()} km</p>
                        </div>
                        <Fuel className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Next Service</p>
                            <p className="text-lg font-semibold">{new Date(vehicle.nextService).toLocaleDateString()}</p>
                        </div>
                        <Wrench className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Insurance Status</p>
                            <p className="text-lg font-semibold text-green-600">Active</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Monthly Cost</p>
                            <p className="text-2xl font-bold">$1,245</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
                <div className="flex gap-6">
                    {["overview", "documents", "maintenance", "photos"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-1 border-b-2 transition-colors capitalize ${activeTab === tab
                                    ? "border-primary text-primary font-semibold"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border rounded-lg p-6 space-y-4">
                        <h3 className="font-bold text-lg">Vehicle Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">VIN</p>
                                <p className="font-medium">{vehicle.vin}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Color</p>
                                <p className="font-medium">{vehicle.color}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Fuel Type</p>
                                <p className="font-medium">{vehicle.fuelType}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase">
                                    {vehicle.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-6 space-y-4">
                        <h3 className="font-bold text-lg">Insurance Details</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Provider</p>
                                <p className="font-medium">{vehicle.insurance.provider}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Policy Number</p>
                                <p className="font-medium">{vehicle.insurance.policyNumber}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Expiry Date</p>
                                <p className="font-medium">{new Date(vehicle.insurance.expiryDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "documents" && (
                <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">Documents</h3>
                    <div className="space-y-3">
                        {vehicle.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="font-medium">{doc.name}</p>
                                        <p className="text-xs text-muted-foreground">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button className="text-primary hover:underline text-sm flex items-center gap-1">
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "maintenance" && (
                <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">Maintenance History</h3>
                    <div className="space-y-3">
                        {vehicle.maintenanceHistory.map((record) => (
                            <div key={record.id} className="flex items-start justify-between p-4 border rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Wrench className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{record.type}</p>
                                        <p className="text-sm text-muted-foreground">{record.workshop}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(record.date).toLocaleDateString()} • {record.mileage.toLocaleString()} km
                                        </p>
                                    </div>
                                </div>
                                <p className="font-bold text-lg">${record.cost}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "photos" && (
                <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">Photo Gallery</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                                <Camera className="w-12 h-12 text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
