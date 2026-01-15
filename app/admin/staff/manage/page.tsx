"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save, User, Shield, Award, Trash2 } from "lucide-react"
import { getUser, updateUser } from "@/lib/auth"

function EditStaffContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get("id")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        license_number: "",
        license_class: "",
        license_expiry: "",
        role: "driver"
    })

    useEffect(() => {
        const loadStaff = async () => {
            if (!id) return
            try {
                const data = await getUser(id as string)
                if (data) {
                    setFormData({
                        full_name: data.full_name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        license_number: data.license_number || "",
                        license_class: data.license_class || "",
                        license_expiry: data.license_expiry || "",
                        role: data.role || "driver"
                    })
                }
            } catch (error) {
                console.error("Error loading staff:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadStaff()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return
        setIsSaving(true)

        try {
            await updateUser(id as string, formData)
            alert("Staff profile updated successfully!")
            router.push("/admin/staff")
        } catch (error: any) {
            console.error("Error updating staff:", error)
            alert(error.message || "Failed to update staff profile.")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-[#EE401D] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm font-medium text-slate-500">Loading Staff Profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} className="text-slate-500" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Manage Staff Member</h1>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Edit profile details, contact information, and system access roles.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info Card */}
                <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <User size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 italic">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                            <input
                                required
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="e.g. John Banda"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                            <input
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="e.g. +260 97..."
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Email (Read-only)</label>
                            <input
                                readOnly
                                value={formData.email}
                                className="w-full p-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-400 outline-none cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">System Access Role</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all appearance-none"
                            >
                                <option value="driver">Driver (Mobile App)</option>
                                <option value="admin">Administrator</option>
                                <option value="manager">Fleet Manager</option>
                                <option value="finance">Finance Officer</option>
                                <option value="compliance">Compliance Officer</option>
                                <option value="employee">Standard Employee</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* License Details Card (Only if role is driver) */}
                {formData.role === "driver" && (
                    <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                            <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                <Award size={20} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 italic">License Details (Drivers Only)</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">License Number</label>
                                <input
                                    required={formData.role === "driver"}
                                    value={formData.license_number}
                                    onChange={e => setFormData({ ...formData, license_number: e.target.value })}
                                    placeholder="DL No."
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">License Class</label>
                                <input
                                    required={formData.role === "driver"}
                                    value={formData.license_class}
                                    onChange={e => setFormData({ ...formData, license_class: e.target.value })}
                                    placeholder="e.g. C, CE"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Expiry Date</label>
                                <input
                                    type="date"
                                    required={formData.role === "driver"}
                                    value={formData.license_expiry}
                                    onChange={e => setFormData({ ...formData, license_expiry: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-wide hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-4 bg-[#EE401D] text-white rounded-2xl font-black uppercase tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                Save Profile
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default function EditStaffPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-[#EE401D] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm font-medium text-slate-500">Initializing editor...</p>
                </div>
            </div>
        }>
            <EditStaffContent />
        </Suspense>
    )
}
