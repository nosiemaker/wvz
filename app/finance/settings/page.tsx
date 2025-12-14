"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, logout } from "@/lib/auth"
import {
    User,
    Bell,
    Moon,
    Globe,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    Database,
    Mail,
    Settings
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function FinanceSettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [notifications, setNotifications] = useState(true)
    const [emailDigest, setEmailDigest] = useState(true)
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
                <p className="text-muted-foreground">Manage your account and finance module preferences</p>
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
                            <span className="text-2xl font-bold">{user?.profile?.full_name?.charAt(0) || "U"}</span>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{user?.profile?.full_name || "Finance Officer"}</p>
                            <p className="text-muted-foreground">{user?.email}</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                Finance Team
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5 text-accent" />
                        Preferences
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Real-time Alerts</p>
                                    <p className="text-xs text-muted-foreground">Notify on high expense reports</p>
                                </div>
                            </div>
                            <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Weekly Email Digest</p>
                                    <p className="text-xs text-muted-foreground">Summary of weekly spending</p>
                                </div>
                            </div>
                            <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
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

                {/* System Settings */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Database className="w-5 h-5 text-green-500" />
                        Data Management
                    </h2>
                    <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                            <span className="mr-2">📥</span> Export All Financial Data (CSV)
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <span className="mr-2">📊</span> Configure Currencies
                        </Button>
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
                        Sign Out from Finance Portal
                    </Button>
                </div>
            </div>
        </div>
    )
}
