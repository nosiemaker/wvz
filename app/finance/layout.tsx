"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, BarChart3, TrendingUp, FileText, Settings, LogOut } from "lucide-react"
import Image from "next/image"

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { href: "/finance", label: "Dashboard", icon: BarChart3 },
    { href: "/finance/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/finance/reports", label: "Reports", icon: FileText },
    { href: "/finance/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Finance Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 z-40 lg:static lg:translate-x-0 zmw{sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >

        <div className="p-6">
          <div className="relative w-32 h-12 mb-6">
            <Image src="/logo.svg" alt="Logo" fill className="object-contain object-left" />
          </div>
          <h1 className="text-2xl font-bold text-accent mb-8">FleetFinance</h1>
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
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={async () => {
                const { logout } = await import("@/lib/auth")
                await logout()
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold">FleetFinance</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-card border-b border-border p-6 items-center justify-between">
          <h2 className="text-2xl font-bold">Finance Portal</h2>
        </header>

        {/* Finance Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>

      {/* Overlay */}
      {
        sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )
      }
    </div >
  )
}
