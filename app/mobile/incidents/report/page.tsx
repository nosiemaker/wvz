"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, MapPin, AlertTriangle } from "lucide-react"

export default function ReportIncidentPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        incidentType: "",
        severity: "",
        description: "",
        location: "",
        policeReport: "",
    })
    const [photos, setPhotos] = useState<string[]>([])

    const incidentTypes = [
        { value: "accident", label: "Accident" },
        { value: "breakdown", label: "Vehicle Breakdown" },
        { value: "traffic_violation", label: "Traffic Violation" },
        { value: "theft", label: "Theft/Vandalism" },
        { value: "other", label: "Other" },
    ]

    const severityLevels = [
        { value: "minor", label: "Minor", color: "bg-yellow-100 text-yellow-700" },
        { value: "major", label: "Major", color: "bg-orange-100 text-orange-700" },
        { value: "critical", label: "Critical", color: "bg-red-100 text-red-700" },
    ]

    const handleAddPhoto = () => {
        setPhotos([...photos, `/placeholder-incident-${photos.length + 1}.jpg`])
    }

    const handleSubmit = () => {
        alert("Incident reported successfully! Fleet manager has been notified.")
        router.push("/mobile/driver")
    }

    return (
        <div className="pb-20">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Report Incident</h1>
                    <p className="text-sm text-muted-foreground">Document any incidents immediately</p>
                </div>

                {/* Incident Type */}
                <div className="space-y-2">
                    <label className="font-semibold">Incident Type *</label>
                    <select
                        value={formData.incidentType}
                        onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                        className="w-full p-3 border rounded-lg bg-background"
                    >
                        <option value="">Select incident type</option>
                        {incidentTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                {/* Severity */}
                <div className="space-y-2">
                    <label className="font-semibold">Severity *</label>
                    <div className="grid grid-cols-3 gap-2">
                        {severityLevels.map((level) => (
                            <button
                                key={level.value}
                                onClick={() => setFormData({ ...formData, severity: level.value })}
                                className={`p-3 rounded-lg font-semibold transition-all ${formData.severity === level.value
                                        ? level.color + " ring-2 ring-offset-2"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {level.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="font-semibold">Description *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full min-h-[120px] p-3 border rounded-lg bg-background"
                        placeholder="Describe what happened in detail..."
                    />
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="font-semibold">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full pl-10 p-3 border rounded-lg bg-background"
                            placeholder="Where did this occur?"
                        />
                    </div>
                </div>

                {/* Photos */}
                <div className="space-y-2">
                    <label className="font-semibold">Photos</label>
                    <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, index) => (
                            <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                                <img src={photo} alt={`Incident ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                        {photos.length < 6 && (
                            <button
                                onClick={handleAddPhoto}
                                className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:bg-muted transition-colors"
                            >
                                <Camera className="w-6 h-6 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground">Add Photo</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Police Report */}
                {formData.severity === "critical" && (
                    <div className="space-y-2">
                        <label className="font-semibold">Police Report Number</label>
                        <input
                            type="text"
                            value={formData.policeReport}
                            onChange={(e) => setFormData({ ...formData, policeReport: e.target.value })}
                            className="w-full p-3 border rounded-lg bg-background"
                            placeholder="Enter police report number if applicable"
                        />
                    </div>
                )}

                {/* Warning */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-900">
                        <p className="font-semibold">Important</p>
                        <p>Fleet manager and insurance team will be notified immediately. Provide accurate information.</p>
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!formData.incidentType || !formData.severity || !formData.description}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Incident Report
                </button>
            </div>
        </div>
    )
}
