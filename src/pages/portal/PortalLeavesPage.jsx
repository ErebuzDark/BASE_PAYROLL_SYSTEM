import { useState } from 'react'
import { Plus, CalendarDays } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { useMyLeaves, useMyLeaveBalances, useCreateMyLeave } from '@/features/portal/hooks/usePortal'
import { formatDate } from '@/lib/utils'

const LEAVE_TYPES = ['Vacation Leave', 'Sick Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave']

function FileLeaveDialog({ onClose, balances }) {
  const { employee } = useAuth()
  const createLeave = useCreateMyLeave()
  const [form, setForm] = useState({ type: 'Vacation Leave', startDate: '', endDate: '', reason: '' })

  const selectedBalance = balances.find(b => b.type === form.type)
  const availableTypes = balances.filter(b => b.total > 0).map(b => b.type)

  function handleSubmit(e) {
    e.preventDefault()
    createLeave.mutate({ employeeId: employee.id, ...form }, { onSuccess: onClose })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>File Leave Request</DialogTitle>
          <DialogDescription>Submit a new leave request for approval.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label>Leave Type</Label>
              <NativeSelect value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}>
                {LEAVE_TYPES.filter(t => availableTypes.includes(t)).map(t => <option key={t}>{t}</option>)}
              </NativeSelect>
              {selectedBalance && (
                <p className="text-xs text-slate-500 mt-1">
                  Available: <span className="font-semibold text-slate-700">{selectedBalance.remaining}</span> of {selectedBalance.total} days
                  {selectedBalance.remaining <= 2 && selectedBalance.remaining > 0 && (
                    <span className="text-amber-600 ml-1">· Low balance</span>
                  )}
                  {selectedBalance.remaining === 0 && (
                    <span className="text-red-600 ml-1">· No credits remaining</span>
                  )}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" required value={form.startDate}
                  onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" required value={form.endDate}
                  min={form.startDate}
                  onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Input required placeholder="Brief reason for your leave request"
                value={form.reason} onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createLeave.isPending || (selectedBalance?.remaining === 0)}>
              {createLeave.isPending ? 'Filing...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function PortalLeavesPage() {
  const [showDialog, setShowDialog] = useState(false)
  const { data: leaves = [], isLoading } = useMyLeaves()
  const { data: balances = [] } = useMyLeaveBalances()

  const BALANCE_COLORS = {
    'Vacation Leave': 'text-blue-600',
    'Sick Leave': 'text-red-600',
    'Emergency Leave': 'text-amber-600',
    'Maternity Leave': 'text-pink-600',
    'Paternity Leave': 'text-indigo-600',
  }

  return (
    <div>
      <PageHeader
        title="My Leaves"
        subtitle="View leave balances and manage leave requests"
        actions={
          <Button onClick={() => setShowDialog(true)}>
            <Plus size={16} /> File Leave
          </Button>
        }
      />

      {/* Leave Balances */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {balances.filter(b => b.total > 0).map((b) => (
          <Card key={b.type}>
            <CardContent className="p-4 text-center">
              <CalendarDays size={18} className={`mx-auto mb-2 ${BALANCE_COLORS[b.type] || 'text-slate-600'}`} />
              <p className={`text-2xl font-bold ${BALANCE_COLORS[b.type] || 'text-slate-800'}`}>{b.remaining}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{b.type}</p>
              <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-slate-700 transition-all" style={{ width: `${(b.remaining / b.total) * 100}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{b.used} used / {b.total} total</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leave History */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <p className="text-sm font-semibold text-slate-900">Leave History</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>{[...Array(6)].map((_, j) => (
                  <TableCell key={j}><div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: 80 }} /></TableCell>
                ))}</TableRow>
              ))
            ) : leaves.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  <CalendarDays size={32} className="mx-auto mb-2 opacity-30" />
                  No leave requests yet. Click "File Leave" to submit one.
                </TableCell>
              </TableRow>
            ) : (
              leaves.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium text-slate-800">{l.type}</TableCell>
                  <TableCell>{formatDate(l.startDate)}</TableCell>
                  <TableCell>{formatDate(l.endDate)}</TableCell>
                  <TableCell><span className="font-semibold">{l.days}</span> day{l.days !== 1 ? 's' : ''}</TableCell>
                  <TableCell><span className="text-xs text-slate-500 max-w-[180px] block truncate" title={l.reason}>{l.reason}</span></TableCell>
                  <TableCell><StatusBadge status={l.status} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {showDialog && <FileLeaveDialog onClose={() => setShowDialog(false)} balances={balances} />}
    </div>
  )
}
