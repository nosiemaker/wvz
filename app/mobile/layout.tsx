"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Home, Truck, FileText, Clock, Settings, LogOut, Calendar } from "lucide-react"
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

  useEffect(() => {
    const getUserRole = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserRole(user.user_metadata?.role || "employee")
      }
    }
    getUserRole()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  // Role-specific navigation
  const driverNavItems = [
    { href: "/mobile/driver", label: "Dashboard", icon: Home },
    { href: "/mobile/trips", label: "My Trips", icon: Truck },
    { href: "/mobile/inspections", label: "Inspections", icon: Clock },
    { href: "/mobile/profile", label: "Profile", icon: Settings },
  ]

  const employeeNavItems = [
    { href: "/mobile/employee", label: "Dashboard", icon: Home },
    { href: "/mobile/bookings", label: "My Requests", icon: Calendar },
    { href: "/mobile/bookings/create", label: "New Request", icon: FileText },
    { href: "/mobile/settings", label: "Settings", icon: Settings },
  ]

  const navItems = userRole === "driver" ? driverNavItems : employeeNavItems

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 z-40 md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >

        <div className="p-6">
          <div className="relative w-32 h-12 mb-6">
            <Image src="/logo.svg" alt="Logo" fill className="object-contain object-left" />
          </div>
          <h1 className="text-2xl font-bold text-accent mb-8">FleetLog</h1>
          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between md:hidden">
          <h1 className="text-xl font-bold">FleetLog</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
