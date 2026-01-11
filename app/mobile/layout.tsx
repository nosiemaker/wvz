"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu, X, Home, Truck, FileText, Clock, Settings,
  LogOut, Calendar, Fuel, Gavel, FileCheck, Info, User,
  PlusCircle, History, MapPin, ClipboardCheck
} from "lucide-react"
import Image from "next/image"
import { logout } from "@/lib/auth"
import { createClient } from "@/lib/client"

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>("employee")
  const [userName, setUserName] = useState<string>("User")
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const getUserRole = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserRole(user.user_metadata?.role || "employee")
        setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "User")
      }
    }
    getUserRole()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  // Define navigation categories based on the screenshot
  const generalNavItems = [
    { href: userRole === "driver" ? "/mobile/driver" : "/mobile/employee", label: "Home", icon: Home },
    { href: "/mobile/fuel", label: "Fuel", icon: Fuel },
    { href: "/mobile/surrender", label: "Hand Over Vehicle", icon: History },
    { href: "/mobile/violations", label: "Violations", icon: Gavel },
    { href: "/mobile/assignments", label: "My Assignments", icon: FileCheck },
    { href: "/mobile/t-codes", label: "Budget Allocation", icon: FileText },
  ]

  // Add Approvals for Managers
  if (['manager', 'admin'].includes(userRole)) {
    generalNavItems.splice(1, 0, { href: "/mobile/approvals", label: "Approvals", icon: FileText })
  }

  const vehicleRequestItems = [
    { href: "/mobile/bookings", label: "My Requests", icon: User },
  ]

  const aboutItems = [
    { href: "/mobile/settings", label: "Settings", icon: Settings },
  ]

  const bottomNavItems = [
    { href: userRole === "driver" ? "/mobile/driver" : "/mobile/employee", label: "Home", icon: Home },
    { href: "/mobile/trips", label: "Trips", icon: Truck },
    { href: "/mobile/fuel", label: "Fuel", icon: Fuel },
  ]

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans">
      {/* Mobile Sidebar */}
      <div
        className={
          "fixed inset-y-0 left-0 w-72 bg-white text-slate-800 transition-transform duration-300 z-50 shadow-2xl flex flex-col " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        {/* Sidebar Header with Exact Geometric Background from Screenshot */}
        <div
          className="relative h-[180px] bg-[#212121] overflow-hidden flex-shrink-0 cursor-pointer shadow-lg"
          onClick={() => { setSidebarOpen(false); router.push('/mobile/profile'); }}
        >
          {/* Geometric shapes matching screenshot precisely */}
          <div className="absolute top-0 left-0 w-full h-full bg-[#212121]"></div>
          {/* The red/orange triangle on the left */}
          <div
            className="absolute top-0 left-0 w-[120px] h-full bg-[#EE401D]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          ></div>
          {/* The middle grey geometric divider */}
          <div
            className="absolute top-0 left-[60px] w-[180px] h-full bg-[#333333] opacity-50"
            style={{ clipPath: 'polygon(20% 0, 100% 0, 0 100%, -20% 100%)' }}
          ></div>
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/20 to-transparent pointer-events-none"
          ></div>

          <div className="absolute bottom-6 left-6 flex items-center gap-4 z-10 w-full">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <User size={42} className="text-slate-400" />
              </div>
            </div>
            <div className="text-white">
              <h2 className="text-[20px] font-black leading-tight tracking-tight">{userName}</h2>
              <p className="text-[13px] opacity-90 italic font-bold tracking-tight text-white/90">
                {userRole === "driver" ? "Driver" : "Basic User"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1 py-4">
          {/* General Section */}
          <div className="mb-6">
            <h3 className="px-5 py-2 text-[13px] font-black text-slate-300 uppercase tracking-[1.5px] italic mb-1">General</h3>
            <nav className="space-y-0">
              {[
                { href: userRole === "driver" ? "/mobile/driver" : "/mobile/employee", label: "Home", icon: Home },
                { href: "/mobile/fuel", label: "Fuel", icon: Fuel },
                ...(["manager", "admin", "supervisor"].includes(userRole)
                  ? [{ href: "/mobile/approvals", label: "Approvals", icon: FileText }]
                  : []),
                { href: "/mobile/surrender", label: "Hand Over Vehicle", icon: History },
                { href: "/mobile/violations", label: "Violations", icon: MapPin },
                { href: "/mobile/assignments", label: "My Assignments", icon: FileCheck },
                { href: "/mobile/vehicle-inspection", label: "Vehicle Inspection", icon: ClipboardCheck },
                { href: "/mobile/t-codes", label: "Budget Allocation", icon: FileText },
                { label: "Logout", icon: LogOut, onClick: handleLogout },
              ].map((item, idx) => {
                const isLink = 'href' in item;
                const Icon = item.icon;
                const isActive = isLink && pathname === item.href;

                const content = (
                  <div
                    className={
                      "flex items-center gap-5 px-5 py-3 rounded-2xl transition-all active:bg-slate-50 " +
                      (isActive ? "text-[#EE401D]" : "text-slate-900")
                    }
                  >
                    <Icon size={22} strokeWidth={2.5} className={isActive ? "text-[#EE401D]" : "text-black"} />
                    <span className="text-[16px] font-black italic tracking-tight">
                      {item.label}
                    </span>
                  </div>
                );

                if (isLink) {
                  return (
                    <Link key={idx} href={item.href!} onClick={() => setSidebarOpen(false)}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <button key={idx} onClick={() => { setSidebarOpen(false); item.onClick?.(); }} className="w-full text-left">
                    {content}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Vehicle Requests Section */}
          <div className="mb-6 pt-4 border-t border-slate-100">
            <h3 className="px-5 py-2 text-[13px] font-black text-slate-300 uppercase tracking-[1.5px] italic mb-1">Vehicle Requests</h3>
            <nav className="space-y-0">
              <Link href="/mobile/bookings" onClick={() => setSidebarOpen(false)}>
                <div
                  className={
                    "flex items-center gap-5 px-5 py-3 rounded-2xl transition-all active:bg-slate-50 " +
                    (pathname === "/mobile/bookings" ? "text-[#EE401D]" : "text-slate-900")
                  }
                >
                  <User size={22} strokeWidth={2.5} className={pathname === "/mobile/bookings" ? "text-[#EE401D]" : "text-black"} />
                  <span className="text-[16px] font-black italic tracking-tight">
                    My Requests
                  </span>
                </div>
              </Link>
            </nav>
          </div>

          {/* About Section */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="px-5 py-2 text-[13px] font-black text-slate-300 uppercase tracking-[1.5px] italic mb-1">About</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header - World Vision Orange (Exact Screenshot Style) */}
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
            <h1 className="text-[19px] font-bold tracking-tight">World Vision</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Sync and Info icons matching top right of screenshot */}
            <button className="p-1 active:scale-90 transition-transform opacity-90 hover:opacity-100">
              <History size={20} className="transform scale-x-[-1]" />
            </button>
            <div className="relative cursor-pointer p-1">
              <Info size={20} className="opacity-90" />
              <div className="absolute -top-0 -right-0 w-3.5 h-3.5 bg-white text-[#EE401D] text-[9px] font-black rounded-full flex items-center justify-center border border-[#EE401D]">
                ?
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div
            className="max-w-md mx-auto min-h-full pb-20"
            style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}
          >
            {children}
          </div>
        </main>

        {/* Bottom Navigation - Fixed Bottom (Matching Screenshot) */}
        <nav
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex items-stretch z-40 px-2 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
          style={{
            height: "calc(68px + env(safe-area-inset-bottom))",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {[
            { href: userRole === "driver" ? "/mobile/driver" : "/mobile/employee", label: "Home", icon: Home },
            ...(['manager', 'admin'].includes(userRole) ? [{ href: "/mobile/approvals", label: "Approvals", icon: FileCheck }] : []),
            { href: "/mobile/trips", label: "Trips", icon: MapPin },
            { href: "/mobile/fuel", label: "Fuel", icon: Fuel },
          ].map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 active:bg-slate-50 transition-all rounded-xl py-1"
              >
                <item.icon
                  size={26}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? "text-[#EE401D]" : "text-slate-400"}
                />
                <span
                  className={
                    "text-[10px] font-black uppercase tracking-[0.5px] transition-colors " +
                    (isActive ? "text-[#EE401D]" : "text-slate-400")
                  }
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Floating Action Button (Screenshot 2 style - plus sign) */}
        <button
          onClick={() => router.push(userRole === "driver" ? "/mobile/trips" : "/mobile/bookings/create")}
          className="fixed right-6 w-[56px] h-[56px] bg-[#3E2723] text-white rounded-full flex items-center justify-center shadow-2xl shadow-brown-900/40 active:scale-90 transition-transform z-30 ring-4 ring-white"
          style={{ bottom: "calc(84px + env(safe-area-inset-bottom))" }}
        >
          <PlusCircle size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
