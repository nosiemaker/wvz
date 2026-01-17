"use client"

import {
  Fuel, Users, MessageSquare, AlertCircle, TrendingUp, Leaf
} from "lucide-react"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line, BarChart, Bar, Legend
} from 'recharts'
import Image from "next/image"

// --- Dummy Data ---

const vehicleStatusData = [
  { label: "Active", count: 156, color: "text-emerald-500", dot: "bg-emerald-500" },
  { label: "Inactive", count: 8, color: "text-blue-500", dot: "bg-blue-500" },
  { label: "In Shop", count: 5, color: "text-orange-500", dot: "bg-orange-500" },
  { label: "Out of Service", count: 1, color: "text-red-500", dot: "bg-red-500" },
]

const timeToResolveData = [
  { month: "Aug", days: 2.1, issues: 3 },
  { month: "Sept", days: 1.8, issues: 5 },
  { month: "Oct", days: 2.5, issues: 4 },
  { month: "Nov", days: 1.9, issues: 7 },
  { month: "Dec", days: 3.2, issues: 9 },
  { month: "Jan", days: 2.8, issues: 11 },
]

const repairPriorityData = [
  { month: "Aug", emergency: 5, nonScheduled: 25, scheduled: 70 },
  { month: "Sept", emergency: 8, nonScheduled: 30, scheduled: 62 },
  { month: "Oct", emergency: 15, nonScheduled: 20, scheduled: 65 },
  { month: "Nov", emergency: 10, nonScheduled: 35, scheduled: 55 },
  { month: "Dec", emergency: 4, nonScheduled: 15, scheduled: 81 },
  { month: "Jan", emergency: 7, nonScheduled: 28, scheduled: 65 },
]

const inspectionsData = [
  { name: "Compliant", value: 78.2, color: "#10b981" },
  { name: "Non-Compliant", value: 21.8, color: "#ef4444" },
]

const fuelCostsData = [
  { month: "Aug", cost: 9200 },
  { month: "Sept", cost: 12100 },
  { month: "Oct", cost: 16500 },
  { month: "Nov", cost: 13800 },
  { month: "Dec", cost: 14500 },
  { month: "Jan", cost: 11200 },
]

const totalCostsData = [
  { month: "Sep '24", cost: 135000 },
  { month: "Oct '24", cost: 152000 },
  { month: "Nov '24", cost: 148000 },
  { month: "Dec '24", cost: 165000 },
  { month: "Jan '25", cost: 120000 },
  { month: "Feb '25", cost: 42000 },
]

const serviceCostsData = [
  { month: "Sep '24", cost: 6500 },
  { month: "Oct '24", cost: 10500 },
  { month: "Nov '24", cost: 9200 },
  { month: "Dec '24", cost: 13800 },
  { month: "Jan '25", cost: 21000 },
  { month: "Feb '25", cost: 8500 },
]

const topReasonsData = [
  { name: "Transmission", value: 145, color: "#ef4444" },
  { name: "Brake System", value: 120, color: "#f59e0b" },
  { name: "Oil Change", value: 95, color: "#6366f1" },
]

const costPerMeterData = [
  { month: "Sep '24", costpm: 1.9, costph: 3.2 },
  { month: "Oct '24", costpm: 2.1, costph: 3.4 },
  { month: "Nov '24", costpm: 2.0, costph: 3.3 },
  { month: "Dec '24", costpm: 2.2, costph: 3.6 },
  { month: "Jan '25", costpm: 2.3, costph: 3.7 },
  { month: "Feb '25", costpm: 2.4, costph: 3.9 },
]

const otherCostsData = [
  { month: "Sep '24", cost: 2500 },
  { month: "Oct '24", cost: 3200 },
  { month: "Nov '24", cost: 4800 },
  { month: "Dec '24", cost: 4200 },
  { month: "Jan '25", cost: 2500 },
  { month: "Feb '25", cost: 15000 },
]

const toolStatusData = [
  { label: "In-Service", count: 62, color: "text-emerald-500", dot: "bg-emerald-500" },
  { label: "Out-of-Service", count: 8, color: "text-red-500", dot: "bg-red-500" },
  { label: "Disposed", count: 2, color: "text-slate-500", dot: "bg-slate-500" },
  { label: "Missing", count: 1, color: "text-yellow-500", dot: "bg-yellow-500" },
]

const pendingROsData = [
  { label: "RO Needs Approval", count: 4, color: "text-orange-500", dot: "bg-orange-500" },
  { label: "RO Approved", count: 2, color: "text-blue-500", dot: "bg-blue-500" },
  { label: "RO Complete", count: 8, color: "text-emerald-500", dot: "bg-emerald-500" },
]

const recentComments = [
  {
    user: "Sarah Jenkins",
    action: "commented on Issue: #129",
    message: "Parts have been ordered, expecting delivery by Tuesday.",
    avatar: "SJ",
    color: "bg-purple-500"
  },
  {
    user: "Mike Ross",
    action: "commented on Vehicle: Ford Ranger",
    message: "Routine maintenance completed successfully.",
    avatar: "MR",
    color: "bg-blue-600",
    ping: "@FleetManager"
  }
]

// New Charts Data
const mostUtilizedData = [
  { vehicle: "BAF 2650", days: 31 },
  { vehicle: "CAD 7631", days: 31 },
  { vehicle: "CAE 282 M/BIKE", days: 31 },
  { vehicle: "CAE 4492", days: 31 },
  { vehicle: "CAF 921", days: 31 },
  { vehicle: "BAD 8593", days: 30 },
]

const leastUtilizedData = [
  { vehicle: "BAL 9306 M/BIKE", days: 1 },
  { vehicle: "BAD 8287", days: 1 },
  { vehicle: "BAD 8597", days: 1 },
  { vehicle: "ABZ 9641 M/BIKE", days: 1 },
  { vehicle: "BAJ 8331", days: 1 },
  { vehicle: "CAA 3553 M/BIKE", days: 1 },
]

const maxSpeedData = [
  { vehicle: "BAF 1334", speed: 123 },
  { vehicle: "BAK 400ZM", speed: 122 },
  { vehicle: "BAK 5737", speed: 120 },
  { vehicle: "BBA 7579", speed: 120 },
  { vehicle: "BAK 7464", speed: 120 },
  { vehicle: "CAC 582", speed: 120 },
  { vehicle: "BAJ 2598", speed: 120 },
]

const aggressiveDrivingData = [
  { vehicle: "CAF 9827", count: 1 },
  { vehicle: "CAF 9857", count: 1 },
  { vehicle: "CAF 9855", count: 1 },
  { vehicle: "CAF 9810", count: 1 },
  { vehicle: "CAF 9809", count: 1 },
  { vehicle: "CAF 9807", count: 1 },
  { vehicle: "CAF 9806", count: 1 },
]

const carbonEmissionsData = [
  { month: "Aug", emissions: 185, target: 180 },
  { month: "Sept", emissions: 192, target: 180 },
  { month: "Oct", emissions: 178, target: 180 },
  { month: "Nov", emissions: 205, target: 180 },
  { month: "Dec", emissions: 198, target: 180 },
  { month: "Jan", emissions: 190, target: 180 },
]


// --- Components ---

function DashboardCard({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col ${className}`}>
      <h3 className="text-sm font-bold text-slate-800 mb-3">{title}</h3>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  )
}

function StatPair({ label1, val1, label2, val2, color1 = "text-red-500", color2 = "text-orange-400" }: any) {
  return (
    <div className="flex items-center justify-around h-full py-2">
      <div className="text-center">
        <span className={`block text-3xl font-black ${color1} mb-1`}>{val1}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label1}</span>
      </div>
      <div className="text-center">
        <span className={`block text-3xl font-black ${color2} mb-1`}>{val2}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label2}</span>
      </div>
    </div>
  )
}

function StatusList({ data }: { data: any[] }) {
  return (
    <div className="space-y-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${item.dot}`}></div>
            <span className="text-xs font-semibold text-slate-600">{item.label}</span>
          </div>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${item.count > 0 ? (item.color === 'text-emerald-500' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600') : 'text-slate-400'}`}>
            {item.count}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function FleetDashboardPage() {
  return (
    <div className="space-y-6 pb-12 font-sans text-slate-600 bg-slate-50 min-h-screen">

      <div className="flex items-center justify-between px-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fleet Operations Dashboard</h1>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-bold shadow-sm hover:bg-slate-50">Manage Widgets</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Row 1 */}
        <DashboardCard title="Repair Priority Class Trends" className="lg:col-span-2 row-span-2 h-[350px]">
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={repairPriorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis hide />
                <RechartsTooltip />
                <Area type="monotone" dataKey="emergency" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
                <Area type="monotone" dataKey="nonScheduled" stackId="1" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.8} />
                <Area type="monotone" dataKey="scheduled" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-[-10px] pb-2">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Emergency</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Non-Scheduled</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Scheduled</span></div>
          </div>
        </DashboardCard>

        <DashboardCard title="Service Reminders">
          <StatPair label1="Overdue" val1="12" label2="Due Soon" val2="28" />
        </DashboardCard>

        <DashboardCard title="Time to Resolve">
          <div className="h-[120px] w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeToResolveData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                <YAxis hide />
                <RechartsTooltip />
                <Line type="monotone" dataKey="days" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="issues" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Row 1.5 - items under Service Reminders and Time to Resolve */}
        <DashboardCard title="Open Issues">
          <StatPair label1="Open" val1="24" label2="Overdue" val2="2" color1="text-orange-400" color2="text-blue-500" />
        </DashboardCard>
        <DashboardCard title="Vehicle Renewal Reminders">
          <StatPair label1="Overdue" val1="1" label2="Due Soon" val2="9" />
        </DashboardCard>

        {/* Row 2 - Full 4 cols */}
        <DashboardCard title="Total Costs">
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalCostsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="cost" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Contact Renewal Reminders">
          <StatPair label1="Overdue" val1="0" label2="Due Soon" val2="14" />
        </DashboardCard>

        <DashboardCard title="Fuel Costs">
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelCostsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="cost" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Vehicle Status">
          <StatusList data={vehicleStatusData} />
        </DashboardCard>

        {/* Row 3 - Insert Recent Comments Here */}
        <DashboardCard title="Recent Comments" className="lg:col-span-2">
          <div className="space-y-4">
            {recentComments.map((comment, idx) => (
              <div key={idx} className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${comment.color}`}>
                  {comment.avatar}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-800">
                    <span className="font-bold text-sky-600">{comment.user}</span> {comment.action}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">"{comment.message}"</p>
                  {comment.ping && (
                    <span className="inline-block bg-sky-50 text-sky-600 text-[10px] font-bold px-1.5 py-0.5 rounded mt-1">
                      {comment.ping}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Tool Status">
          <StatusList data={toolStatusData} />
        </DashboardCard>

        <DashboardCard title="Service Costs">
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceCostsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="cost" fill="#fbbf24" radius={[2, 2, 0, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="On-Time Service Compliance">
          <div className="flex items-center justify-around h-full py-4">
            <div className="text-center">
              <span className="block text-3xl font-black text-emerald-500 mb-1">94%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All Time</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-black text-emerald-500 mb-1">97%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 30 Days</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Pending ROs by Status">
          <StatusList data={pendingROsData} />
        </DashboardCard>

        <DashboardCard title="Top Reasons for Repair">
          <div className="flex items-center h-full">
            <div className="w-1/2 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={topReasonsData} cx="50%" cy="50%" innerRadius={0} outerRadius={50} dataKey="value">
                    {topReasonsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 text-xs space-y-2">
              {topReasonsData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-bold flex-1 truncate">{item.name}</span>
                  <span className="font-bold text-slate-500 bg-slate-100 px-1 rounded">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Inspections Summary">
          <div className="relative h-[150px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inspectionsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {inspectionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-[-10px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Last 30 Days</span>
          </div>
        </DashboardCard>

        <DashboardCard title="Cost Per Meter">
          <div className="h-[150px] w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costPerMeterData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                <YAxis hide />
                <RechartsTooltip />
                <Line type="monotone" dataKey="costpm" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="costph" stroke="#fbbf24" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Other Costs">
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={otherCostsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="cost" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* --- New Widgets --- */}

        {/* Possible Collisions */}
        <DashboardCard title="Possible Collisions">
          <div className="flex flex-col items-center justify-center h-full bg-red-50 rounded-lg border border-red-100 p-4">
            <h4 className="text-xs font-bold text-red-800 uppercase tracking-widest mb-2 bg-red-200 px-2 py-1 rounded">Possible Collision Vehicles</h4>
            <span className="text-6xl font-black text-slate-800">13</span>
            <div className="w-full mt-4 flex justify-between text-[10px] bg-red-900/10 p-1.5 rounded text-red-900 font-bold">
              <span>From: Dec 17, 2025</span>
              <span>To: Jan 16, 2026</span>
            </div>
          </div>
        </DashboardCard>

        {/* Asset Utilization Report */}
        <div className="lg:col-span-2 space-y-4">
          {/* Most Utilized */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#D4E8B4] px-4 py-2 border-b border-[#C2DB9D]">
              <h3 className="text-xs font-black text-[#5C7D29] uppercase tracking-wider text-center">Most Utilized Vehicles</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Vehicle</th>
                    <th className="px-3 py-2 text-right">Days Driven</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mostUtilizedData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-3 py-1.5 font-bold text-slate-400 bg-emerald-50/50 w-8 text-center">{idx + 1}</td>
                      <td className="px-3 py-1.5 font-bold text-slate-700">{item.vehicle}</td>
                      <td className="px-3 py-1.5 font-bold text-slate-600 text-right">{item.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Least Utilized */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#F8A8B3] px-4 py-2 border-b border-[#EFA0AB]">
              <h3 className="text-xs font-black text-[#962534] uppercase tracking-wider text-center">Least Utilized Vehicles</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Vehicle</th>
                    <th className="px-3 py-2 text-right">Days Driven</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leastUtilizedData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-3 py-1.5 font-bold text-slate-400 bg-red-50/50 w-8 text-center">{idx + 1}</td>
                      <td className="px-3 py-1.5 font-bold text-slate-700">{item.vehicle}</td>
                      <td className="px-3 py-1.5 font-bold text-slate-600 text-right">{item.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Highest Max Speed */}
        <DashboardCard title="Highest Max Speed" className="lg:col-span-2">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maxSpeedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="vehicle"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis hide />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="speed" fill="#F472B6" radius={[4, 4, 0, 0]} barSize={20}>
                  {maxSpeedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#FABDD3" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Aggressive Driving */}
        <DashboardCard title="Aggressive Driving" className="lg:col-span-2">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggressiveDrivingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="vehicle"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis hide />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="count" fill="#009688" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Carbon Emissions Widget */}
        <DashboardCard title="Carbon Emissions Analysis" className="lg:col-span-2">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Leaf className="text-emerald-500" size={18} />
                <div>
                  <span className="text-2xl font-black text-slate-800">190</span>
                  <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Avg g/km</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">-4.2%</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">vs Last Month</p>
              </div>
            </div>
            <div className="flex-1 min-h-[140px] w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={carbonEmissionsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Actual Emissions</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 border-t-2 border-slate-300 border-dashed"></div>Sustainability Target</div>
            </div>
          </div>
        </DashboardCard>

      </div>
    </div>
  )
}
