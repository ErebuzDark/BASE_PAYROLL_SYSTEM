import { Link } from 'react-router-dom'
import { CalendarDays, Clock, Receipt, TrendingUp, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useAuth } from '@/context/AuthContext'
import { useMyLeaveBalances, useMyLeaves, useMyAttendance } from '@/features/portal/hooks/usePortal'

export default function PortalDashboardPage() {
  const { employee } = useAuth()
  const { data: balances = [] } = useMyLeaveBalances()
  const { data: leaves = [] } = useMyLeaves()
  const { data: attendance = [] } = useMyAttendance()

  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length
  const totalLeaveBalance = balances.filter(b => b.total > 0).reduce((sum, b) => sum + b.remaining, 0)
  const presentDays = attendance.filter(a => a.status === 'Present').length
  const totalAttDays = attendance.length

  return (
    <div>
      <PageHeader
        title={`Welcome, ${employee?.firstName}!`}
        subtitle={`${employee?.position} · ${employee?.department}`}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Leave Balance</p>
                <p className="text-2xl font-bold mt-1.5 text-slate-900">{totalLeaveBalance}</p>
                <p className="text-xs mt-1 text-slate-500">days remaining</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50">
                <CalendarDays size={20} className="text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Leaves</p>
                <p className="text-2xl font-bold mt-1.5 text-slate-900">{pendingLeaves}</p>
                <p className="text-xs mt-1 text-slate-500">awaiting approval</p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50">
                <Clock size={20} className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Attendance</p>
                <p className="text-2xl font-bold mt-1.5 text-slate-900">{presentDays}/{totalAttDays}</p>
                <p className="text-xs mt-1 text-slate-500">days present</p>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</p>
                <div className="mt-2"><StatusBadge status={employee?.status} /></div>
                <p className="text-xs mt-2 text-slate-500">{employee?.employmentType}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100">
                <Receipt size={20} className="text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Balances */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-900">Leave Balances</p>
            <Link to="/portal/leaves">
              <Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight size={13} /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {balances.filter(b => b.total > 0).map((b) => (
              <div key={b.type} className="rounded-lg border border-slate-100 p-3 text-center">
                <p className="text-lg font-bold text-slate-800">{b.remaining}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{b.type}</p>
                <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-700 transition-all"
                    style={{ width: `${(b.remaining / b.total) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{b.used}/{b.total} used</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Leaves */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-900">Recent Leave Requests</p>
              <Link to="/portal/leaves">
                <Button variant="ghost" size="sm" className="text-xs gap-1">View <ArrowRight size={13} /></Button>
              </Link>
            </div>
            {leaves.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No leave requests yet</p>
            ) : (
              <div className="space-y-2">
                {leaves.slice(0, 3).map(l => (
                  <div key={l.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{l.type}</p>
                      <p className="text-[11px] text-slate-400">{l.days} day{l.days !== 1 ? 's' : ''} · {l.reason}</p>
                    </div>
                    <StatusBadge status={l.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-900">Recent Attendance</p>
              <Link to="/portal/attendance">
                <Button variant="ghost" size="sm" className="text-xs gap-1">View <ArrowRight size={13} /></Button>
              </Link>
            </div>
            {attendance.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No attendance records yet</p>
            ) : (
              <div className="space-y-2">
                {attendance.slice(0, 4).map(a => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{new Date(a.date).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      <p className="text-[11px] text-slate-400">{a.timeIn ?? '—'} → {a.timeOut ?? '—'}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
