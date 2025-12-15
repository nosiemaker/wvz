"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Upload, CheckCircle, AlertCircle } from "lucide-react"

export default function LicenseUploadPage() {
    const router = useRouter()
    const [licenseData, setLicenseData] = useState({
        licenseNumber: "",
        licenseClass: "",
        issueDate: "",
        expiryDate: "",
        issuingAuthority: "",
    })
    const [photo, setPhoto] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handlePhotoUpload = () => {
        // Mock photo upload
        setPhoto("/placeholder-license.jpg")
        // Simulate OCR extraction
        setTimeout(() => {
            setLicenseData({
                licenseNumber: "DL-2024-123456",
                licenseClass: "B, C",
                issueDate: "2020-01-15",
                expiryDate: "2030-01-15",
                issuingAuthority: "Road Transport and Safety Agency (RTSA)",
            })
        }, 1000)
    }

    const handleSubmit = () => {
        setIsSubmitting(true)
        setTimeout(() => {
            alert("License submitted for verification! You'll be notified once approved.")
            router.push("/mobile/profile")
        }, 1500)
    }

    return (
        <div className="pb-20">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Upload Driver's License</h1>
                    <p className="text-sm text-muted-foreground">Required for vehicle access</p>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                    <label className="font-semibold">License Photo</label>
                    {!photo ? (
                        <button
                            onClick={handlePhotoUpload}
                            className="w-full border-2 border-dashed rounded-lg p-8 hover:bg-muted transition-colors"
                        >
                            <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="font-semibold">Take Photo or Upload</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Scan your driver's license
                            </p>
                        </button>
                    ) : (
                        <div className="relative border rounded-lg overflow-hidden">
                            <img src={photo} alt="License" className="w-full h-48 object-cover" />
                            <button
                                onClick={() => setPhoto(null)}
                                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                            >
                                Remove
                            </button>
                            <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                OCR Scanning...
                            </div>
                        </div>
                    )}
                </div>

                {/* License Details */}
                {photo && (
                    <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900">
                                <p className="font-semibold">Auto-extracted information</p>
                                <p className="text-xs">Please verify and correct if needed</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">License Number</label>
                            <input
                                type="text"
                                value={licenseData.licenseNumber}
                                onChange={(e) => setLicenseData({ ...licenseData, licenseNumber: e.target.value })}
                                className="w-full p-3 border rounded-lg bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">License Class</label>
                            <input
                                type="text"
                                value={licenseData.licenseClass}
                                onChange={(e) => setLicenseData({ ...licenseData, licenseClass: e.target.value })}
                                className="w-full p-3 border rounded-lg bg-background"
                                placeholder="e.g., B, C, D"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Issue Date</label>
                                <input
                                    type="date"
                                    value={licenseData.issueDate}
                                    onChange={(e) => setLicenseData({ ...licenseData, issueDate: e.target.value })}
                                    className="w-full p-3 border rounded-lg bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Expiry Date</label>
                                <input
                                    type="date"
                                    value={licenseData.expiryDate}
                                    onChange={(e) => setLicenseData({ ...licenseData, expiryDate: e.target.value })}
                                    className="w-full p-3 border rounded-lg bg-background"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Issuing Authority</label>
                            <input
                                type="text"
                                value={licenseData.issuingAuthority}
                                onChange={(e) => setLicenseData({ ...licenseData, issuingAuthority: e.target.value })}
                                className="w-full p-3 border rounded-lg bg-background"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit for Verification"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
