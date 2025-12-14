"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, logout } from "@/lib/auth"
import {
    User,
    Bell,
    Moon,
    Shield,
    LogOut,
    Truck,
    Users
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AdminSettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [tripAlerts, setTripAlerts] = useState(true)
    const [driverUpdates, setDriverUpdates] = useState(true)
    const [darkMode, setDarkMode] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getCurrentUser()
                setUser(userData)
            } catch (error) {
                console.error("Error loading user:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadUser()
    }, [])

    const handleLogout = async () => {
        await logout()
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">System configuration and admin preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Section */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Admin Profile
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <span className="text-2xl font-bold">{user?.profile?.full_name?.charAt(0) || "A"}</span>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{user?.profile?.full_name || "Fleet Manager"}</p>
                            <p className="text-muted-foreground">{user?.email}</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                Administrator
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Bell className="w-5 h-5 text-accent" />
                        System Notifications
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                    <Truck className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Trip Status Alerts</p>
                                    <p className="text-xs text-muted-foreground">Notifications for delayed/incidental trips</p>
                                </div>
                            </div>
                            <Switch checked={tripAlerts} onCheckedChange={setTripAlerts} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                                    <Users className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Driver Onboarding</p>
                                    <p className="text-xs text-muted-foreground">Alerts for new driver registrations</p>
                                </div>
                            </div>
                            <Switch checked={driverUpdates} onCheckedChange={setDriverUpdates} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                                    <Moon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Dark Mode</p>
                                    <p className="text-xs text-muted-foreground">Adjust interface theme</p>
                                </div>
                            </div>
                            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                    </div>
                </div>

                {/* Logout Section */}
                <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center space-y-4">
                    <h2 className="font-semibold text-lg text-destructive flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Actions
                    </h2>
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out from Admin Console
                    </Button>
                </div>
            </div>
        </div>
    )
}
