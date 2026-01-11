"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu, X, LayoutDashboard, Truck, Users, FileText,
  AlertTriangle, Settings, LogOut, User, Bell, Search
} from "lucide-react"
import { logout } from "@/lib/auth"
import Image from "next/image"
import { createClient } from "@/lib/client"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userName, setUserName] = useState<string>("Admin")
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin")
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  const navItems = [
    { href: "/admin", label: "Fleet Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: FileText },
    { href: "/admin/vehicles", label: "Vehicles", icon: Truck },
    { href: "/admin/contracts", label: "Contracts", icon: FileText },
    { href: "/admin/drivers", label: "Drivers", icon: Users },
    { href: "/admin/incidents", label: "Incidents", icon: AlertTriangle },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white text-slate-800 transition-transform duration-300 z-50 shadow-2xl flex flex-col lg:static lg:translate-x-0 zmw{sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header with Geometric Pattern (Matching Mobile) */}
        <div className="relative h-[180px] bg-[#212121] overflow-hidden flex-shrink-0 shadow-lg cursor-pointer group" onClick={() => setSidebarOpen(false)}>
          <div className="absolute top-0 left-0 w-full h-full bg-[#212121]"></div>
          <div
            className="absolute top-0 left-0 w-[120px] h-full bg-[#EE401D]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          ></div>
          <div
            className="absolute top-0 left-[60px] w-[180px] h-full bg-[#333333] opacity-40"
            style={{ clipPath: 'polygon(20% 0, 100% 0, 0 100%, -20% 100%)' }}
          ></div>

          <div className="absolute bottom-6 left-6 flex items-center gap-4 z-10 w-full">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xl border-2 border-white/20">
              <User size={36} className="text-slate-400" />
            </div>
            <div className="text-white">
              <h2 className="text-[18px] font-black leading-tight tracking-tight">{userName}</h2>
              <p className="text-[12px] opacity-90 italic font-bold tracking-tight text-[#EE401D]">
                Fleet Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <h3 className="px-5 py-2 text-[11px] font-black text-slate-300 uppercase tracking-[2px] italic mb-2">Management</h3>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group zmw{isActive
                    ? "bg-slate-50 text-[#EE401D]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#EE401D]" : "text-slate-400 group-hover:text-slate-600"} />
                  <span className={`text-[15px] font-black italic tracking-tight zmw{isActive ? "opacity-100" : "opacity-80"}`}>
                    {label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-black italic text-[15px]"
          >
            <LogOut size={22} strokeWidth={2.5} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header (Matching Mobile Theme) */}
        <header className="bg-[#EE401D] text-white h-[64px] flex items-center justify-between px-6 sticky top-0 z-40 shadow-md flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 active:scale-90 transition-transform">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 relative">
                <Image src="/logo.svg" alt="WV" fill className="object-contain brightness-0 invert" />
              </div>
              <h1 className="text-[19px] font-black tracking-tight italic uppercase hidden sm:block">World Vision Portal</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-white/10 border-none rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/20 outline-none w-48 transition-all focus:w-64"
              />
            </div>
            <button className="p-2 relative hover:bg-white/10 rounded-full transition-colors">
              <Bell size={22} className="opacity-90" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-white/20 border border-white/10 flex items-center justify-center font-black text-white text-sm">
              {userName[0]}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
