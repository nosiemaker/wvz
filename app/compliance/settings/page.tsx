"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, logout } from "@/lib/auth"
import {
    User,
    Bell,
    Moon,
    Shield,
    LogOut,
    FileCheck,
    AlertTriangle
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ComplianceSettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [violationAlerts, setViolationAlerts] = useState(true)
    const [expiryAlerts, setExpiryAlerts] = useState(true)
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
                <p className="text-muted-foreground">Manage compliance notifications and preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Section */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Profile Information
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <span className="text-2xl font-bold">{user?.profile?.full_name?.charAt(0) || "C"}</span>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{user?.profile?.full_name || "Compliance Officer"}</p>
                            <p className="text-muted-foreground">{user?.email}</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                Compliance Team
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Bell className="w-5 h-5 text-accent" />
                        Notification Preferences
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Violation Alerts</p>
                                    <p className="text-xs text-muted-foreground">Notify immediately on new violations</p>
                                </div>
                            </div>
                            <Switch checked={violationAlerts} onCheckedChange={setViolationAlerts} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                                    <FileCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Expiry Reminders</p>
                                    <p className="text-xs text-muted-foreground">Weekly license/permit expiry digest</p>
                                </div>
                            </div>
                            <Switch checked={expiryAlerts} onCheckedChange={setExpiryAlerts} />
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
                        Security
                    </h2>
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out from Compliance Portal
                    </Button>
                </div>
            </div>
        </div>
    )
}
