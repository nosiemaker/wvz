"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, User, Mail, Shield, Award } from "lucide-react"

export default function CreateDriverPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        licenseNumber: "",
        licenseClass: "",
        licenseExpiry: "",
        password: "" // Basic auth setup
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call to create user in auth & db
        setTimeout(() => {
            setIsLoading(false)
            alert("Driver account created successfully!")
            router.push("/admin/drivers")
        }, 1500)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            {/* Header */}
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
                        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Create Driver Profile</h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Register a new driver and create their access credentials.</p>
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
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="e.g. John Banda"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                            <input
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="e.g. +260 97..."
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Credentials Card */}
                <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <Shield size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 italic">Account Credentials</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="driver@worldvision.org"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Initial Password</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Min. 8 characters"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </div>

                {/* License Details Card */}
                <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                            <Award size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 italic">License Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">License Number</label>
                            <input
                                required
                                value={formData.licenseNumber}
                                onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                                placeholder="DL No."
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">License Class</label>
                            <input
                                required
                                value={formData.licenseClass}
                                onChange={e => setFormData({ ...formData, licenseClass: e.target.value })}
                                placeholder="e.g. C, CE"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Expiry Date</label>
                            <input
                                type="date"
                                required
                                value={formData.licenseExpiry}
                                onChange={e => setFormData({ ...formData, licenseExpiry: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-[#EE401D]/20 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-4 bg-[#EE401D] text-white rounded-2xl font-black uppercase tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                Create Profile
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
