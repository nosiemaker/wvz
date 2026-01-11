"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  LayoutDashboard,
  Truck,
  Users,
  FileText,
  AlertTriangle,
  Settings,
  LogOut,
  User,
  Bell,
  Info,
} from "lucide-react"
import Image from "next/image"
import { logout } from "@/lib/auth"
import { createClient } from "@/lib/client"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userName, setUserName] = useState<string>("Admin")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
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

  const generalNavItems = [
    { href: "/admin", label: "Fleet Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: FileText },
    { href: "/admin/vehicles", label: "Vehicles", icon: Truck },
    { href: "/admin/contracts", label: "Contracts", icon: FileText },
  ]

  const operationsNavItems = [
    { href: "/admin/drivers", label: "Drivers", icon: Users },
    { href: "/admin/incidents", label: "Incidents", icon: AlertTriangle },
  ]

  const settingsNavItems = [
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans">
      {/* Sidebar */}
      <div
        className={
          "fixed inset-y-0 left-0 w-72 bg-white text-slate-800 transition-transform duration-300 z-50 shadow-2xl flex flex-col " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        {/* Sidebar Header */}
        <div
          className="relative h-[180px] bg-[#212121] overflow-hidden flex-shrink-0 cursor-pointer shadow-lg"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[#212121]"></div>
          <div
            className="absolute top-0 left-0 w-[120px] h-full bg-[#EE401D]"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          ></div>
          <div
            className="absolute top-0 left-[60px] w-[180px] h-full bg-[#333333] opacity-50"
            style={{ clipPath: "polygon(20% 0, 100% 0, 0 100%, -20% 100%)" }}
          ></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/20 to-transparent pointer-events-none"></div>

          <div className="absolute bottom-6 left-6 flex items-center gap-4 z-10 w-full">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <User size={42} className="text-slate-400" />
              </div>
            </div>
            <div className="text-white">
              <h2 className="text-[20px] font-black leading-tight tracking-tight">{userName}</h2>
              <p className="text-[13px] opacity-90 italic font-bold tracking-tight text-white/90">
                Fleet Administrator
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1 py-4">
          <div className="mb-6">
            <h3 className="px-5 py-2 text-[13px] font-black text-slate-300 uppercase tracking-[1.5px] italic mb-1">General</h3>
            <nav className="space-y-0">
              {generalNavItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={
                      "flex items-center gap-5 px-5 py-3 rounded-2xl transition-all active:bg-slate-50 " +
                      (isActive ? "text-[#EE401D]" : "text-slate-900")
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={22} strokeWidth={2.5} className={isActive ? "text-[#EE401D]" : "text-black"} />
                    <span className="text-[16px] font-black italic tracking-tight">
                      {label}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="mb-6 pt-4 border-t border-slate-100">
            <h3 className="px-5 py-2 text-[13px] font-black text-slate-300 uppercase tracking-[1.5px] italic mb-1">Operations</h3>
            <nav className="space-y-0">
              {operationsNavItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={
                      "flex items-center gap-5 px-5 py-3 rounded-2xl transition-all active:bg-slate-50 " +
                      (isActive ? "text-[#EE401D]" : "text-slate-900")
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={22} strokeWidth={2.5} className={isActive ? "text-[#EE401D]" : "text-black"} />
                    <span className="text-[16px] font-black italic tracking-tight">
                      {label}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="px-5 py-2 text-[13px] font-black text-slate-300 uppercase tracking-[1.5px] italic mb-1">Settings</h3>
            <nav className="space-y-0">
              {settingsNavItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={
                      "flex items-center gap-5 px-5 py-3 rounded-2xl transition-all active:bg-slate-50 " +
                      (isActive ? "text-[#EE401D]" : "text-slate-900")
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={22} strokeWidth={2.5} className={isActive ? "text-[#EE401D]" : "text-black"} />
                    <span className="text-[16px] font-black italic tracking-tight">
                      {label}
                    </span>
                  </Link>
                )
              })}
              <button
                onClick={() => { setSidebarOpen(false); handleLogout() }}
                className="w-full text-left"
              >
                <div className="flex items-center gap-5 px-5 py-3 rounded-2xl transition-all active:bg-slate-50 text-slate-900">
                  <LogOut size={22} strokeWidth={2.5} className="text-black" />
                  <span className="text-[16px] font-black italic tracking-tight">
                    Logout Account
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header
          className="bg-[#EE401D] text-white flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm flex-shrink-0"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            height: "calc(56px + env(safe-area-inset-top))",
          }}
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-1 active:scale-90 transition-transform">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-[19px] font-bold tracking-tight">World Vision</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowInfo(true)}
              className="relative cursor-pointer p-1"
              type="button"
            >
              <Info size={20} className="opacity-90" />
              <div className="absolute -top-0 -right-0 w-3.5 h-3.5 bg-white text-[#EE401D] text-[9px] font-black rounded-full flex items-center justify-center border border-[#EE401D]">
                ?
              </div>
            </button>
            <button
              className="p-2 relative hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setShowNotifications(true)}
              type="button"
            >
              <Bell size={22} className="opacity-90" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white">
          <div
            className="max-w-7xl mx-auto min-h-full px-4 sm:px-6 lg:px-8 py-6"
            style={{ paddingBottom: "calc(32px + env(safe-area-inset-bottom))" }}
          >
            {children}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold">Notifications</h3>
              <p className="text-sm text-muted-foreground">Latest activity (demo)</p>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {[
                "Trip INC-004 completed and logged.",
                "Vehicle ABC123 service due in 7 days.",
                "New incident report pending review."
              ].map((note, idx) => (
                <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  {note}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold">System Info</h3>
              <p className="text-sm text-muted-foreground">Fleet operations overview</p>
            </div>
            <div className="p-6 space-y-3 text-sm text-slate-600">
              <p>World Vision Fleet Platform centralizes trip tracking, vehicle lifecycle, and compliance records.</p>
              <p>Use the sidebar to navigate operations, and review incidents and contracts regularly.</p>
              <p>This panel is a demo placeholder; content will be connected to live data later.</p>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInfo(false)}
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
