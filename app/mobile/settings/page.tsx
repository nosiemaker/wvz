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
    Truck
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [notifications, setNotifications] = useState(true)
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
            <div className="flex items-center justify-center h-full p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="pb-20 p-4 space-y-6 max-w-md mx-auto">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground text-sm">Manage your preferences</p>
            </div>

            {/* User Profile Card */}
            {user && (
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <User className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-lg truncate">{user?.profile?.full_name || "Driver"}</h2>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                {user?.profile?.role || "Driver"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* App Preferences */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Preferences</h3>

                <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                <Bell className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Notifications</span>
                        </div>
                        <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>

                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                                <Moon className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Dark Mode</span>
                        </div>
                        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>

                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                                <Globe className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Language</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-sm">English</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Support & Legal */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Support</h3>

                <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Help Center</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>

                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                                <Shield className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Privacy Policy</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

            <Button
                variant="destructive"
                className="w-full h-12 text-base font-semibold mt-4"
                onClick={handleLogout}
            >
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
                App Version 1.0.2 (Build 2025.12.14)
            </p>
        </div>
    )
}
