import { Users, CreditCard, Clock, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { PageHeader } from '@/components/shared/PageHeader'
import { useDashboardStats, usePayrollTrend, useDepartmentCosts } from '@/features/reports/hooks/useDashboard'
import { formatCurrency } from '@/lib/utils'

function StatCard({ title, value, subtitle, icon: Icon, color, trend }) {
  return (
    <div className="stat-card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-neutral-500)' }}>{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-neutral-900)' }}>{value}</p>
          {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-500)' }}>{subtitle}</p>}
        </div>
        <div className="p-2 rounded-lg" style={{ background: color + '18' }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs font-medium">
          {trend >= 0
            ? <TrendingUp size={13} style={{ color: 'var(--color-success)' }} />
            : <TrendingDown size={13} style={{ color: 'var(--color-destructive)' }} />
          }
          <span style={{ color: trend >= 0 ? 'var(--color-success)' : 'var(--color-destructive)' }}>
            {Math.abs(trend)}% vs last month
          </span>
        </div>
      )}
    </div>
  )
}

function AttendanceSummary({ present, absent, late }) {
  const total = present + absent + late
  return (
    <div className="stat-card">
      <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-neutral-500)' }}>
        Today's Attendance
      </p>
      <div className="flex gap-4">
        <div className="flex-1 text-center">
          <p className="text-xl font-bold" style={{ color: 'var(--color-success)' }}>{present}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-500)' }}>Present</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-xl font-bold" style={{ color: 'var(--color-warning)' }}>{late}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-500)' }}>Late</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-xl font-bold" style={{ color: 'var(--color-destructive)' }}>{absent}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-500)' }}>Absent</p>
        </div>
      </div>
      <div className="mt-3 flex rounded-full overflow-hidden h-2" style={{ background: 'var(--color-neutral-200)' }}>
        <div style={{ width: `${(present / total) * 100}%`, background: 'var(--color-success)' }} />
        <div style={{ width: `${(late / total) * 100}%`, background: 'var(--color-warning)' }} />
        <div style={{ width: `${(absent / total) * 100}%`, background: 'var(--color-destructive)' }} />
      </div>
    </div>
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
            <div key={i} className="stat-card h-28 animate-pulse" style={{ background: 'var(--color-neutral-200)' }} />
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
          color="var(--color-primary)"
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(stats.totalPayrollThisMonth)}
          subtitle="Gross for this month"
          icon={CreditCard}
          color="var(--color-success)"
          trend={stats.payrollGrowth}
        />
        <StatCard
          title="Pending Payrolls"
          value={stats.pendingPayrolls}
          subtitle={`Next: ${stats.upcomingPayroll}`}
          icon={AlertCircle}
          color="var(--color-warning)"
        />
        <StatCard
          title="Leave Requests"
          value={stats.pendingLeaveRequests}
          subtitle="Awaiting approval"
          icon={Clock}
          color="var(--color-info)"
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <AttendanceSummary
          present={stats.attendanceTodayPresent}
          absent={stats.attendanceTodayAbsent}
          late={stats.attendanceTodayLate}
        />
        <div className="stat-card lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--color-neutral-500)' }}>
            Department Payroll Cost
          </p>
          <div className="space-y-2">
            {deptCosts?.map((d) => {
              const max = Math.max(...(deptCosts?.map(x => x.cost) ?? [1]))
              const pct = (d.cost / max) * 100
              return (
                <div key={d.department} className="flex items-center gap-3">
                  <p className="text-xs w-24 shrink-0" style={{ color: 'var(--color-neutral-700)' }}>{d.department}</p>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-neutral-200)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--color-primary)' }} />
                  </div>
                  <p className="text-xs font-medium w-24 text-right" style={{ color: 'var(--color-neutral-700)' }}>
                    {formatCurrency(d.cost)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--color-neutral-900)' }}>
          Payroll Trend (Last 6 Months)
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={trend} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-neutral-500)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-neutral-500)' }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(v, name) => [formatCurrency(v), name === 'gross' ? 'Gross Pay' : 'Net Pay']}
              contentStyle={{ fontSize: 12, borderColor: 'var(--color-border)', borderRadius: 8 }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="gross" name="gross" stroke="var(--color-primary)" strokeWidth={2} fill="url(#grossGrad)" />
            <Area type="monotone" dataKey="net" name="net" stroke="var(--color-success)" strokeWidth={2} fill="url(#netGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
