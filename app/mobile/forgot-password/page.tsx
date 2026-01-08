"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setSuccess(true)
        }, 1500)
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
                    <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Forgot Password</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            {success ? (
                <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">Check Your Email</h3>
                    <p className="text-slate-500 font-medium text-sm">
                        We've sent password reset instructions to your email address.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="mt-6 text-[#EE401D] font-bold text-sm tracking-wide"
                    >
                        Return to Login
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#EE401D]/10 focus:border-[#EE401D] transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-medium text-amber-700 leading-relaxed">
                                Please ensure you have access to the email address registered with your account.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#EE401D] text-white py-4 rounded-2xl font-black text-[15px] uppercase tracking-wide shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Send Reset Link
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
