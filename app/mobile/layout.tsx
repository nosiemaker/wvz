"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, Truck, FileText, Clock, Settings, LogOut } from "lucide-react"
import Image from "next/image"
import { logout } from "@/lib/auth"

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const navItems = [
    { href: "/mobile", label: "Home", icon: Home },
    { href: "/mobile/bookings", label: "Bookings", icon: Truck },
    { href: "/mobile/trips", label: "Trips", icon: FileText },
    { href: "/mobile/inspections", label: "Inspections", icon: Clock },
    { href: "/mobile/settings", label: "Settings", icon: Settings },
  ]

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
