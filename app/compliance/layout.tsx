"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, CheckCircle, AlertTriangle, FileText, Settings, LogOut } from "lucide-react"

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { href: "/compliance", label: "Dashboard", icon: CheckCircle },
    { href: "/compliance/violations", label: "Violations", icon: AlertTriangle },
    { href: "/compliance/reports", label: "Reports", icon: FileText },
    { href: "/compliance/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Compliance Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 z-40 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-accent mb-8">FleetCompliance</h1>
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
          <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold">FleetCompliance</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-card border-b border-border p-6 items-center justify-between">
          <h2 className="text-2xl font-bold">Compliance Portal</h2>
        </header>

        {/* Compliance Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
