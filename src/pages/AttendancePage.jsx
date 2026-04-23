import { useState } from 'react'
import { Clock, Calendar, CheckCircle2, XCircle, Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useAttendance, useLeaves, useUpdateLeaveStatus, useCreateAttendance, useCreateLeave } from '@/features/attendance/hooks/useAttendance'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { formatDate } from '@/lib/utils'

const TABS = ['Attendance Log', 'Leave Requests']

function LogAttendanceModal({ onClose, employees }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ employeeId: '', date: today, timeIn: '08:00', timeOut: '17:00', status: 'Present' })
  const createAtt = useCreateAttendance()

  function handleSubmit(e) {
    e.preventDefault()
    createAtt.mutate(form, { onSuccess: onClose })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Attendance</DialogTitle>
          <DialogDescription className="sr-only">Record attendance</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label>Employee</Label>
              <NativeSelect required value={form.employeeId} onChange={(e) => setForm(f => ({ ...f, employeeId: e.target.value }))}>
                <option value="">Select employee</option>
                {employees.map(emp => (<option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" required value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <NativeSelect value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value, ...(e.target.value === 'Absent' || e.target.value === 'On Leave' ? { timeIn: '', timeOut: '' } : { timeIn: f.timeIn || '08:00', timeOut: f.timeOut || '17:00' }) }))}>
                <option>Present</option><option>Late</option><option>Absent</option><option>On Leave</option>
              </NativeSelect>
            </div>
            {(form.status === 'Present' || form.status === 'Late') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Time In</Label><Input type="time" required value={form.timeIn} onChange={(e) => setForm(f => ({ ...f, timeIn: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Time Out</Label><Input type="time" required value={form.timeOut} onChange={(e) => setForm(f => ({ ...f, timeOut: e.target.value }))} /></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createAtt.isPending}>{createAtt.isPending ? 'Saving...' : 'Log Attendance'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FileLeaveModal({ onClose, employees }) {
  const [form, setForm] = useState({ employeeId: '', type: 'Vacation Leave', startDate: '', endDate: '', reason: '' })
  const createLv = useCreateLeave()

  function handleSubmit(e) {
    e.preventDefault()
    createLv.mutate(form, { onSuccess: onClose })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>File Leave Request</DialogTitle>
          <DialogDescription className="sr-only">Submit a leave request</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label>Employee</Label>
              <NativeSelect required value={form.employeeId} onChange={(e) => setForm(f => ({ ...f, employeeId: e.target.value }))}>
                <option value="">Select employee</option>
                {employees.map(emp => (<option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label>Leave Type</Label>
              <NativeSelect value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Vacation Leave</option><option>Sick Leave</option><option>Emergency Leave</option><option>Maternity Leave</option><option>Paternity Leave</option>
              </NativeSelect>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" required value={form.startDate} onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>End Date</Label><Input type="date" required value={form.endDate} onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Input required placeholder="Brief reason for leave" value={form.reason} onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createLv.isPending}>{createLv.isPending ? 'Filing...' : 'File Leave'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function AttendancePage() {
  const [tab, setTab] = useState(0)
  const [dateFilter, setDateFilter] = useState('')
  const [showLogModal, setShowLogModal] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const { data: attendance = [], isLoading: attLoading } = useAttendance(dateFilter ? { date: dateFilter } : {})
  const { data: leaves = [], isLoading: leaveLoading } = useLeaves({})
  const { data: employees = [] } = useEmployees({})
  const updateLeave = useUpdateLeaveStatus()
  const getEmployee = (id) => employees.find(e => e.id === id)
  const pendingCount = leaves.filter(l => l.status === 'Pending').length

  return (
    <div>
      <PageHeader title="Attendance & Leaves" subtitle="Track daily attendance and manage leave requests"
        actions={<div className="flex gap-2"><Button variant="outline" onClick={() => setShowLeaveModal(true)}><Calendar size={15} /> File Leave</Button><Button onClick={() => setShowLogModal(true)}><Plus size={15} /> Log Attendance</Button></div>} />

      <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit bg-slate-100 border border-slate-200">
        {TABS.map((t, i) => (
          <button key={t} className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer ${tab === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setTab(i)}>
            {t === 'Attendance Log' ? <Clock size={14} /> : <Calendar size={14} />}{t}
            {t === 'Leave Requests' && pendingCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">{pendingCount}</span>}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div>
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[{ label: 'Present', count: attendance.filter(a => a.status === 'Present').length, color: 'text-emerald-600' }, { label: 'Late', count: attendance.filter(a => a.status === 'Late').length, color: 'text-amber-600' }, { label: 'Absent', count: attendance.filter(a => a.status === 'Absent').length, color: 'text-red-600' }, { label: 'On Leave', count: attendance.filter(a => a.status === 'On Leave').length, color: 'text-blue-600' }].map(({ label, count, color }) => (
              <Card key={label}><CardContent className="p-5 text-center"><p className={`text-2xl font-bold ${color}`}>{count}</p><p className="text-xs mt-1 text-slate-500">{label}</p></CardContent></Card>
            ))}
          </div>
          <div className="flex gap-3 mb-4 items-end">
            <div className="space-y-1.5"><Label>Filter by Date</Label><Input className="w-44" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} /></div>
            {dateFilter && <Button variant="outline" size="sm" onClick={() => setDateFilter('')}>Clear</Button>}
          </div>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Employee</TableHead><TableHead>Date</TableHead><TableHead>Time In</TableHead><TableHead>Time Out</TableHead><TableHead>Hours Worked</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {attLoading ? [...Array(4)].map((_, i) => (<TableRow key={i}>{[...Array(6)].map((_, j) => (<TableCell key={j}><div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: 80 }} /></TableCell>))}</TableRow>))
                : attendance.map((att) => { const emp = getEmployee(att.employeeId); return (
                  <TableRow key={att.id}>
                    <TableCell><div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{emp ? `${emp.firstName[0]}${emp.lastName[0]}` : '?'}</AvatarFallback></Avatar><span className="text-sm font-medium text-slate-800">{emp ? `${emp.firstName} ${emp.lastName}` : att.employeeId}</span></div></TableCell>
                    <TableCell>{formatDate(att.date)}</TableCell>
                    <TableCell>{att.timeIn ?? <span className="text-slate-400">—</span>}</TableCell>
                    <TableCell>{att.timeOut ?? <span className="text-slate-400">—</span>}</TableCell>
                    <TableCell>{att.hoursWorked > 0 ? `${att.hoursWorked}h` : <span className="text-slate-400">—</span>}</TableCell>
                    <TableCell><StatusBadge status={att.status} /></TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {tab === 1 && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Employee</TableHead><TableHead>Leave Type</TableHead><TableHead>Start Date</TableHead><TableHead>End Date</TableHead><TableHead>Days</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {leaveLoading ? [...Array(3)].map((_, i) => (<TableRow key={i}>{[...Array(8)].map((_, j) => (<TableCell key={j}><div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: 80 }} /></TableCell>))}</TableRow>))
              : leaves.map((leave) => { const emp = getEmployee(leave.employeeId); return (
                <TableRow key={leave.id}>
                  <TableCell><div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{emp ? `${emp.firstName[0]}${emp.lastName[0]}` : '?'}</AvatarFallback></Avatar><span className="text-sm font-medium text-slate-800">{emp ? `${emp.firstName} ${emp.lastName}` : leave.employeeId}</span></div></TableCell>
                  <TableCell>{leave.type}</TableCell>
                  <TableCell>{formatDate(leave.startDate)}</TableCell>
                  <TableCell>{formatDate(leave.endDate)}</TableCell>
                  <TableCell><span className="font-medium">{leave.days} day{leave.days !== 1 ? 's' : ''}</span></TableCell>
                  <TableCell><span className="text-xs max-w-[140px] block truncate text-slate-500" title={leave.reason}>{leave.reason}</span></TableCell>
                  <TableCell><StatusBadge status={leave.status} /></TableCell>
                  <TableCell>
                    {leave.status === 'Pending' ? (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" disabled={updateLeave.isPending} onClick={() => updateLeave.mutate({ id: leave.id, status: 'Approved' })} title="Approve"><CheckCircle2 size={15} /></Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" disabled={updateLeave.isPending} onClick={() => updateLeave.mutate({ id: leave.id, status: 'Rejected' })} title="Reject"><XCircle size={15} /></Button>
                      </div>
                    ) : <span className="text-xs text-slate-400">—</span>}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </Card>
      )}

      {showLogModal && <LogAttendanceModal onClose={() => setShowLogModal(false)} employees={employees} />}
      {showLeaveModal && <FileLeaveModal onClose={() => setShowLeaveModal(false)} employees={employees} />}
    </div>
  )
}
