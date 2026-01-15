"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu, X, CheckCircle, AlertTriangle, FileText,
  Settings, LogOut, Shield, LayoutDashboard, Search
} from "lucide-react"
import Image from "next/image"

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/compliance", label: "Intelligence", icon: LayoutDashboard },
    { href: "/compliance/violations", label: "Violation Logs", icon: AlertTriangle },
    { href: "/compliance/reports", label: "Audit Reports", icon: FileText },
    { href: "/compliance/requests", label: "Mission Review", icon: CheckCircle },
    { href: "/compliance/settings", label: "Policy Config", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased">
      {/* Premium Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-300 transition-all duration-500 ease-in-out z-50 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          } flex flex-col`}
      >
        <div className="p-8 flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Shield size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">GuardForce</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Compliance Module</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Operations Center</p>
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "hover:bg-white/5 hover:text-white"
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "animate-pulse" : "group-hover:scale-110 transition-transform"} />
                  <span className={`text-sm ${isActive ? "font-black italic uppercase italic tracking-tight" : "font-semibold text-slate-400 group-hover:text-slate-200"}`}>
                    {label}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* User Section Bottom */}
          <div className="mt-auto pt-8 border-t border-white/5">
            <button
              onClick={async () => {
                const { logout } = await import("@/lib/auth")
                await logout()
              }}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-3 text-slate-400">
              <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md text-slate-500">Root</span>
              <span className="text-slate-200">/</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Compliance Portfolio</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 w-64 group focus-within:border-blue-400 transition-all">
              <Search size={16} className="text-slate-400 group-focus-within:text-blue-500" />
              <input type="text" placeholder="Scan records..." className="bg-transparent border-none text-xs font-bold outline-none flex-1 text-slate-600 placeholder:text-slate-400" />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-black italic shadow-sm hover:scale-110 transition-transform cursor-pointer">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Content Portal */}
        <main className="flex-1 overflow-auto bg-slate-50/50 relative">
          <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
            {children}
          </div>

          {/* Subtle Background Elements */}
          <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-100/20 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none z-[-1]"></div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
