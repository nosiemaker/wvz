"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, AlertTriangle, TrendingDown, Award, Calendar } from "lucide-react"

export default function DriverProfilePage() {
  const mockProfile = {
    name: "John Driver",
    employeeId: "EMP-001",
    licenseNumber: "DL-2024-123456",
    licenseClass: "B, C",
    licenseExpiry: "2030-01-15",
    licenseStatus: "verified",
    violationPoints: 3,
    maxPoints: 12,
    safetyScore: 87,
    totalTrips: 145,
    violations: [
      { id: 1, type: "Late Return", points: 2, date: "2024-11-20", description: "Vehicle returned 2 hours late" },
      { id: 2, type: "Missed Inspection", points: 1, date: "2024-10-15", description: "Post-trip inspection not completed" },
    ],
    achievements: [
      { id: 1, title: "100 Safe Trips", icon: "🏆", date: "2024-10-01" },
      { id: 2, title: "Perfect Month", icon: "⭐", date: "2024-09-30" },
    ]
  }

  const pointsPercentage = (mockProfile.violationPoints / mockProfile.maxPoints) * 100
  const pointsColor = pointsPercentage < 50 ? "text-green-600" : pointsPercentage < 75 ? "text-yellow-600" : "text-red-600"

  return (
    <div className="pb-20">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Driver Profile</h1>
          <p className="text-sm text-muted-foreground">Performance & Compliance</p>
          <div className="mt-2">
            <Link href="/mobile/change-password">
              <span className="text-xs font-semibold text-[#EE401D] border border-[#EE401D] px-3 py-1.5 rounded-full inline-block">
                Change Password
              </span>
            </Link>
          </div>
        </div>

        {/* License Status */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">License Status</p>
              <p className="text-2xl font-bold">{mockProfile.licenseStatus.toUpperCase()}</p>
            </div>
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-90">License Number:</span>
              <span className="font-semibold">{mockProfile.licenseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-90">Class:</span>
              <span className="font-semibold">{mockProfile.licenseClass}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-90">Expires:</span>
              <span className="font-semibold">{new Date(mockProfile.licenseExpiry).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Violation Points */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${pointsColor}`} />
              <h3 className="font-semibold">Violation Points</h3>
            </div>
            <span className={`text-2xl font-bold ${pointsColor}`}>
              {mockProfile.violationPoints}/{mockProfile.maxPoints}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all ${pointsPercentage < 50 ? "bg-green-600" : pointsPercentage < 75 ? "bg-yellow-600" : "bg-red-600"
                }`}
              style={{ width: `${pointsPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {mockProfile.maxPoints - mockProfile.violationPoints} points remaining before suspension
          </p>
        </div>

        {/* Safety Score */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border rounded-lg p-4 text-center">
            <Award className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{mockProfile.safetyScore}</p>
            <p className="text-xs text-muted-foreground">Safety Score</p>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <TrendingDown className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{mockProfile.totalTrips}</p>
            <p className="text-xs text-muted-foreground">Total Trips</p>
          </div>
        </div>

        {/* Violation History */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Violation History ({mockProfile.violations.length})
          </h3>
          {mockProfile.violations.map((violation) => (
            <div key={violation.id} className="bg-card border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{violation.type}</p>
                  <p className="text-sm text-muted-foreground">{violation.description}</p>
                </div>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                  -{violation.points} pts
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(violation.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <h3 className="font-semibold">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {mockProfile.achievements.map((achievement) => (
              <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="font-semibold text-sm">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(achievement.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
