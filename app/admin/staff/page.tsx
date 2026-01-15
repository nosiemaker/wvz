"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/client"
import { PlusCircle, FileText, Search, User, ShieldCheck } from "lucide-react"

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setStaff(data || [])
      } catch (error) {
        console.log("[v0] Error loading staff:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStaff()
  }, [])

  const getRoleBadge = (role: string) => {
    const baseStyle = "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"
    if (role === "admin") return `${baseStyle} bg-red-100 text-red-600`
    if (role === "manager") return `${baseStyle} bg-blue-100 text-blue-600`
    if (role === "finance") return `${baseStyle} bg-emerald-100 text-emerald-600`
    if (role === "compliance") return `${baseStyle} bg-amber-100 text-amber-600`
    return `${baseStyle} bg-slate-100 text-slate-600`
  }

  const filteredStaff = staff.filter((person) => {
    const searchStr = searchTerm.toLowerCase()
    return (
      person.full_name?.toLowerCase().includes(searchStr) ||
      person.email?.toLowerCase().includes(searchStr) ||
      person.role?.toLowerCase().includes(searchStr)
    )
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-[#EE401D] border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm font-medium text-slate-500">Loading Staff Records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-6 bg-[#EE401D] rounded-full"></div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Staff Management</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium pl-4">Manage permissions, roles, and profiles for all system users.</p>
        </div>
        <Link href="/admin/staff/create">
          <button className="px-6 py-3 bg-[#EE401D] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-2">
            <PlusCircle size={18} />
            Add Staff Member
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          className="w-full bg-white border border-slate-100 rounded-[20px] py-4 pl-12 pr-6 font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#EE401D]/5 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Team Member</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Access Role</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User size={24} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold italic uppercase text-xs">No staff members found match your search</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((person) => (
                  <tr key={person.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 uppercase tracking-tighter">
                          {person.full_name?.substring(0, 2) || "U"}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm tracking-tight">{person.full_name}</p>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{person.license_number || "No License"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{person.email}</p>
                      <p className="text-xs text-slate-400 font-medium">{person.phone || "No Phone"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getRoleBadge(person.role)}>{person.role || "Driver"}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/staff/manage/?id=${person.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-[#EE401D]/10 hover:text-[#EE401D] transition-all text-xs font-black uppercase tracking-widest"
                      >
                        <FileText size={14} />
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
