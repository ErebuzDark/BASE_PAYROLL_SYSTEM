import { useState } from 'react'
import { Clock, Calendar, CheckCircle2, XCircle, Plus, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-base font-semibold">Log Attendance</h2>
          <button className="btn btn-ghost p-1" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="form-label">Employee</label>
              <select className="form-select" required value={form.employeeId}
                onChange={(e) => setForm(f => ({ ...f, employeeId: e.target.value }))}>
                <option value="">Select employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Date</label>
              <input className="form-input" type="date" required value={form.date}
                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status}
                onChange={(e) => setForm(f => ({
                  ...f,
                  status: e.target.value,
                  ...(e.target.value === 'Absent' || e.target.value === 'On Leave'
                    ? { timeIn: '', timeOut: '' }
                    : { timeIn: f.timeIn || '08:00', timeOut: f.timeOut || '17:00' }),
                }))}>
                <option>Present</option>
                <option>Late</option>
                <option>Absent</option>
                <option>On Leave</option>
              </select>
            </div>
            {(form.status === 'Present' || form.status === 'Late') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Time In</label>
                  <input className="form-input" type="time" required value={form.timeIn}
                    onChange={(e) => setForm(f => ({ ...f, timeIn: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Time Out</label>
                  <input className="form-input" type="time" required value={form.timeOut}
                    onChange={(e) => setForm(f => ({ ...f, timeOut: e.target.value }))} />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={createAtt.isPending}>
              {createAtt.isPending ? 'Saving...' : 'Log Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-base font-semibold">File Leave Request</h2>
          <button className="btn btn-ghost p-1" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="form-label">Employee</label>
              <select className="form-select" required value={form.employeeId}
                onChange={(e) => setForm(f => ({ ...f, employeeId: e.target.value }))}>
                <option value="">Select employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Leave Type</label>
              <select className="form-select" value={form.type}
                onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Vacation Leave</option>
                <option>Sick Leave</option>
                <option>Emergency Leave</option>
                <option>Maternity Leave</option>
                <option>Paternity Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Start Date</label>
                <input className="form-input" type="date" required value={form.startDate}
                  onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input className="form-input" type="date" required value={form.endDate}
                  onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="form-label">Reason</label>
              <input className="form-input" required placeholder="Brief reason for leave"
                value={form.reason} onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={createLv.isPending}>
              {createLv.isPending ? 'Filing...' : 'File Leave'}
            </button>
          </div>
        </form>
      </div>
    </div>
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

  return (
    <div>
      <PageHeader
        title="Attendance & Leaves"
        subtitle="Track daily attendance and manage leave requests"
        actions={
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={() => setShowLeaveModal(true)}>
              <Calendar size={15} /> File Leave
            </button>
            <button className="btn btn-primary" onClick={() => setShowLogModal(true)}>
              <Plus size={15} /> Log Attendance
            </button>
          </div>
        }
      />

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ background: 'var(--color-neutral-200)' }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            className="px-4 py-2 text-sm font-medium rounded-md transition-all"
            style={{
              background: tab === i ? 'var(--color-surface)' : 'transparent',
              color: tab === i ? 'var(--color-neutral-900)' : 'var(--color-neutral-500)',
              boxShadow: tab === i ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
            onClick={() => setTab(i)}
          >
            {t === 'Attendance Log' ? <Clock size={14} className="inline mr-2" /> : <Calendar size={14} className="inline mr-2" />}
            {t}
            {t === 'Leave Requests' && leaves.filter(l => l.status === 'Pending').length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'var(--color-warning)', color: 'white' }}>
                {leaves.filter(l => l.status === 'Pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Attendance Log Tab */}
      {tab === 0 && (
        <div>
          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Present', count: attendance.filter(a => a.status === 'Present').length, color: 'var(--color-success)' },
              { label: 'Late', count: attendance.filter(a => a.status === 'Late').length, color: 'var(--color-warning)' },
              { label: 'Absent', count: attendance.filter(a => a.status === 'Absent').length, color: 'var(--color-destructive)' },
              { label: 'On Leave', count: attendance.filter(a => a.status === 'On Leave').length, color: 'var(--color-info)' },
            ].map(({ label, count, color }) => (
              <div key={label} className="stat-card text-center">
                <p className="text-2xl font-bold" style={{ color }}>{count}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-500)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-3 mb-4">
            <div>
              <label className="form-label">Filter by Date</label>
              <input className="form-input w-44" type="date" value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)} />
            </div>
            {dateFilter && (
              <div className="flex items-end">
                <button className="btn btn-outline text-xs" onClick={() => setDateFilter('')}>Clear</button>
              </div>
            )}
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Hours Worked</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j}><div className="h-4 rounded animate-pulse" style={{ background: 'var(--color-neutral-200)', width: 80 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : attendance.map((att) => {
                  const emp = getEmployee(att.employeeId)
                  return (
                    <tr key={att.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: 'var(--color-primary)', color: 'white' }}>
                            {emp ? `${emp.firstName[0]}${emp.lastName[0]}` : '?'}
                          </div>
                          <span className="text-sm font-medium">{emp ? `${emp.firstName} ${emp.lastName}` : att.employeeId}</span>
                        </div>
                      </td>
                      <td>{formatDate(att.date)}</td>
                      <td>{att.timeIn ?? <span style={{ color: 'var(--color-neutral-400)' }}>—</span>}</td>
                      <td>{att.timeOut ?? <span style={{ color: 'var(--color-neutral-400)' }}>—</span>}</td>
                      <td>{att.hoursWorked > 0 ? `${att.hoursWorked}h` : <span style={{ color: 'var(--color-neutral-400)' }}>—</span>}</td>
                      <td><StatusBadge status={att.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Requests Tab */}
      {tab === 1 && (
        <div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(8)].map((_, j) => (
                        <td key={j}><div className="h-4 rounded animate-pulse" style={{ background: 'var(--color-neutral-200)', width: 80 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : leaves.map((leave) => {
                  const emp = getEmployee(leave.employeeId)
                  return (
                    <tr key={leave.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: 'var(--color-primary)', color: 'white' }}>
                            {emp ? `${emp.firstName[0]}${emp.lastName[0]}` : '?'}
                          </div>
                          <span className="text-sm font-medium">{emp ? `${emp.firstName} ${emp.lastName}` : leave.employeeId}</span>
                        </div>
                      </td>
                      <td>{leave.type}</td>
                      <td>{formatDate(leave.startDate)}</td>
                      <td>{formatDate(leave.endDate)}</td>
                      <td><span className="font-medium">{leave.days} day{leave.days !== 1 ? 's' : ''}</span></td>
                      <td>
                        <span className="text-xs max-w-[140px] block truncate" style={{ color: 'var(--color-neutral-600)' }}
                          title={leave.reason}>{leave.reason}</span>
                      </td>
                      <td><StatusBadge status={leave.status} /></td>
                      <td>
                        {leave.status === 'Pending' ? (
                          <div className="flex items-center gap-1">
                            <button
                              className="btn btn-ghost p-1.5"
                              style={{ color: 'var(--color-success)' }}
                              disabled={updateLeave.isPending}
                              onClick={() => updateLeave.mutate({ id: leave.id, status: 'Approved' })}
                              title="Approve"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                            <button
                              className="btn btn-ghost p-1.5"
                              style={{ color: 'var(--color-destructive)' }}
                              disabled={updateLeave.isPending}
                              onClick={() => updateLeave.mutate({ id: leave.id, status: 'Rejected' })}
                              title="Reject"
                            >
                              <XCircle size={15} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showLogModal && <LogAttendanceModal onClose={() => setShowLogModal(false)} employees={employees} />}
      {showLeaveModal && <FileLeaveModal onClose={() => setShowLeaveModal(false)} employees={employees} />}
    </div>
  )
}
