import { Users, CreditCard, Clock, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardStats, usePayrollTrend, useDepartmentCosts } from '@/features/reports/hooks/useDashboard'
import { formatCurrency } from '@/lib/utils'

const ICON_COLORS = {
  primary: { bg: 'bg-slate-100', text: 'text-slate-700' },
  success: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-600' },
  info:    { bg: 'bg-blue-50', text: 'text-blue-600' },
}

function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', trend }) {
  const c = ICON_COLORS[color]
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
            <p className="text-2xl font-bold mt-1.5 text-slate-900">{value}</p>
            {subtitle && <p className="text-xs mt-1 text-slate-500">{subtitle}</p>}
          </div>
          <div className={`p-2.5 rounded-lg ${c.bg}`}>
            <Icon size={20} className={c.text} />
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs font-medium mt-3">
            {trend >= 0
              ? <TrendingUp size={13} className="text-emerald-600" />
              : <TrendingDown size={13} className="text-red-600" />
            }
            <span className={trend >= 0 ? 'text-emerald-600' : 'text-red-600'}>
              {Math.abs(trend)}% vs last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AttendanceSummary({ present, absent, late }) {
  const total = present + absent + late
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Today's Attendance
        </p>
        <div className="flex gap-4">
          <div className="flex-1 text-center">
            <p className="text-xl font-bold text-emerald-600">{present}</p>
            <p className="text-xs mt-1 text-slate-500">Present</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xl font-bold text-amber-600">{late}</p>
            <p className="text-xs mt-1 text-slate-500">Late</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xl font-bold text-red-600">{absent}</p>
            <p className="text-xs mt-1 text-slate-500">Absent</p>
          </div>
        </div>
        <div className="mt-3 flex rounded-full overflow-hidden h-2 bg-slate-200">
          <div className="h-full bg-emerald-500" style={{ width: `${(present / total) * 100}%` }} />
          <div className="h-full bg-amber-500" style={{ width: `${(late / total) * 100}%` }} />
          <div className="h-full bg-red-500" style={{ width: `${(absent / total) * 100}%` }} />
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: trend } = usePayrollTrend()
  const { data: deptCosts } = useDepartmentCosts()

  if (statsLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Overview of your payroll operations" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="h-24 rounded bg-slate-100 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Overview for ${new Date().toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}`}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          subtitle={`${stats.activeEmployees} active · ${stats.onLeave} on leave`}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(stats.totalPayrollThisMonth)}
          subtitle="Gross for this month"
          icon={CreditCard}
          color="success"
          trend={stats.payrollGrowth}
        />
        <StatCard
          title="Pending Payrolls"
          value={stats.pendingPayrolls}
          subtitle={`Next: ${stats.upcomingPayroll}`}
          icon={AlertCircle}
          color="warning"
        />
        <StatCard
          title="Leave Requests"
          value={stats.pendingLeaveRequests}
          subtitle="Awaiting approval"
          icon={Clock}
          color="info"
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <AttendanceSummary
          present={stats.attendanceTodayPresent}
          absent={stats.attendanceTodayAbsent}
          late={stats.attendanceTodayLate}
        />
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Department Payroll Cost
            </p>
            <div className="space-y-2.5">
              {deptCosts?.map((d) => {
                const max = Math.max(...(deptCosts?.map(x => x.cost) ?? [1]))
                const pct = (d.cost / max) * 100
                return (
                  <div key={d.department} className="flex items-center gap-3">
                    <p className="text-xs w-24 shrink-0 text-slate-600 font-medium">{d.department}</p>
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-100">
                      <div className="h-full rounded-full bg-slate-700 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs font-semibold w-24 text-right text-slate-700">
                      {formatCurrency(d.cost)}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-semibold mb-4 text-slate-900">
            Payroll Trend (Last 6 Months)
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trend} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e293b" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v, name) => [formatCurrency(v), name === 'gross' ? 'Gross Pay' : 'Net Pay']}
                contentStyle={{ fontSize: 12, borderColor: '#e2e8f0', borderRadius: 8, background: '#fff' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="gross" name="gross" stroke="#1e293b" strokeWidth={2} fill="url(#grossGrad)" />
              <Area type="monotone" dataKey="net" name="net" stroke="#16a34a" strokeWidth={2} fill="url(#netGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
