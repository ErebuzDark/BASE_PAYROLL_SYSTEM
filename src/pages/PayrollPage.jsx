import { useState } from 'react'
import { Plus, ChevronRight, X, CheckCircle2, PlayCircle, FileText } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  usePayrollRuns, useCreatePayrollRun, useProcessPayrollRun,
  useReleasePayrollRun, usePayslips
} from '@/features/payroll/hooks/usePayroll'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { formatCurrency, formatDate } from '@/lib/utils'

function CreateRunModal({ onClose }) {
  const createRun = useCreatePayrollRun()
  const [form, setForm] = useState({ period: '', periodStart: '', periodEnd: '', cutoff: '1st Cutoff' })

  function handleSubmit(e) {
    e.preventDefault()
    createRun.mutate(form, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold">Create Payroll Run</h2>
          <button className="btn btn-ghost p-1" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="form-label">Period Label</label>
              <input className="form-input" placeholder="e.g. April 16–30, 2025" required
                value={form.period} onChange={(e) => setForm(f => ({ ...f, period: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Period Start</label>
                <input className="form-input" type="date" required
                  value={form.periodStart} onChange={(e) => setForm(f => ({ ...f, periodStart: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Period End</label>
                <input className="form-input" type="date" required
                  value={form.periodEnd} onChange={(e) => setForm(f => ({ ...f, periodEnd: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="form-label">Cutoff</label>
              <select className="form-select" value={form.cutoff} onChange={(e) => setForm(f => ({ ...f, cutoff: e.target.value }))}>
                <option>1st Cutoff</option>
                <option>2nd Cutoff</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={createRun.isPending}>
              {createRun.isPending ? 'Creating...' : 'Create Run'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PayslipModal({ runId, onClose }) {
  const { data: payslips = [], isLoading } = usePayslips(runId)
  const { data: employees = [] } = useEmployees({})

  const getEmployee = (id) => employees.find(e => e.id === id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold">Payslips</h2>
          <button className="btn btn-ghost p-1" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '75vh' }}>
          {isLoading ? (
            <div className="p-8 text-center" style={{ color: 'var(--color-neutral-400)' }}>Loading payslips...</div>
          ) : payslips.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--color-neutral-400)' }}>
              <FileText size={32} className="mx-auto mb-2 opacity-30" />
              No payslips yet. Process the payroll run to generate them.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {payslips.map((ps) => {
                const emp = getEmployee(ps.employeeId)
                return (
                  <div key={ps.id} className="px-6 py-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: 'var(--color-primary)', color: 'white' }}>
                          {emp ? `${emp.firstName[0]}${emp.lastName[0]}` : '??'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{emp ? `${emp.firstName} ${emp.lastName}` : ps.employeeId}</p>
                          <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{emp?.position}</p>
                        </div>
                      </div>
                      <StatusBadge status={ps.status} />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {/* Earnings */}
                      <div>
                        <p className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--color-neutral-500)' }}>Earnings</p>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span style={{ color: 'var(--color-neutral-600)' }}>Basic Pay</span>
                            <span className="font-medium">{formatCurrency(ps.basicPay)}</span>
                          </div>
                          {ps.overtimePay > 0 && (
                            <div className="flex justify-between">
                              <span style={{ color: 'var(--color-neutral-600)' }}>OT Pay ({ps.overtimeHours}h)</span>
                              <span className="font-medium">{formatCurrency(ps.overtimePay)}</span>
                            </div>
                          )}
                          {ps.allowances?.map((a) => (
                            <div key={a.type} className="flex justify-between">
                              <span style={{ color: 'var(--color-neutral-600)' }}>{a.type}</span>
                              <span className="font-medium">{formatCurrency(a.amount)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-1 border-t font-semibold" style={{ borderColor: 'var(--color-border)' }}>
                            <span>Gross Pay</span>
                            <span style={{ color: 'var(--color-success)' }}>{formatCurrency(ps.grossPay)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Deductions */}
                      <div>
                        <p className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--color-neutral-500)' }}>Deductions</p>
                        <div className="space-y-1">
                          {ps.deductions?.map((d) => (
                            <div key={d.type} className="flex justify-between">
                              <span style={{ color: 'var(--color-neutral-600)' }}>{d.type}</span>
                              <span className="font-medium">({formatCurrency(d.amount)})</span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-1 border-t font-semibold" style={{ borderColor: 'var(--color-border)' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--color-destructive)' }}>({formatCurrency(ps.totalDeductions)})</span>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="flex flex-col justify-end">
                        <div className="rounded-lg p-4 text-center" style={{ background: 'var(--color-neutral-100)' }}>
                          <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>Net Pay</p>
                          <p className="text-xl font-bold mt-1" style={{ color: 'var(--color-neutral-900)' }}>
                            {formatCurrency(ps.netPay)}
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-400)' }}>
                            {ps.daysWorked} days worked
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PayrollPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [viewRunId, setViewRunId] = useState(null)

  const { data: runs = [], isLoading } = usePayrollRuns({})
  const processRun = useProcessPayrollRun()
  const releaseRun = useReleasePayrollRun()

  const statusColor = { Draft: 'var(--color-warning)', Processed: 'var(--color-info)', Released: 'var(--color-success)' }

  return (
    <div>
      <PageHeader
        title="Payroll"
        subtitle="Manage payroll runs and payslips"
        actions={
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Payroll Run
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['Draft', 'Processed', 'Released'].map((status) => {
          const count = runs.filter(r => r.status === status).length
          return (
            <div key={status} className="stat-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: statusColor[status] + '18' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: statusColor[status] }} />
              </div>
              <div>
                <p className="text-xl font-bold">{count}</p>
                <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{status} Run{count !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Runs Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Cutoff</th>
              <th>Total Gross</th>
              <th>Total Deductions</th>
              <th>Total Net</th>
              <th>Status</th>
              <th>Processed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>
                  {[...Array(8)].map((_, j) => (
                    <td key={j}><div className="h-4 rounded animate-pulse" style={{ background: 'var(--color-neutral-200)', width: 80 }} /></td>
                  ))}
                </tr>
              ))
            ) : runs.map((run) => (
              <tr key={run.id}>
                <td>
                  <p className="font-medium text-sm" style={{ color: 'var(--color-neutral-900)' }}>{run.period}</p>
                  <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{run.id}</p>
                </td>
                <td>{run.cutoff}</td>
                <td className="font-medium">{formatCurrency(run.totalGross)}</td>
                <td style={{ color: 'var(--color-destructive)' }}>({formatCurrency(run.totalDeductions)})</td>
                <td className="font-semibold" style={{ color: 'var(--color-success)' }}>{formatCurrency(run.totalNet)}</td>
                <td><StatusBadge status={run.status} /></td>
                <td>
                  {run.processedAt
                    ? <span className="text-xs">{formatDate(run.processedAt)}</span>
                    : <span className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>—</span>
                  }
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-ghost p-1.5 text-xs" onClick={() => setViewRunId(run.id)} title="View Payslips">
                      <FileText size={14} />
                    </button>
                    {run.status === 'Draft' && (
                      <button
                        className="btn btn-ghost p-1.5 text-xs"
                        style={{ color: 'var(--color-info)' }}
                        disabled={processRun.isPending}
                        onClick={() => processRun.mutate(run.id)}
                        title="Process"
                      >
                        <PlayCircle size={14} />
                      </button>
                    )}
                    {run.status === 'Processed' && (
                      <button
                        className="btn btn-ghost p-1.5 text-xs"
                        style={{ color: 'var(--color-success)' }}
                        disabled={releaseRun.isPending}
                        onClick={() => releaseRun.mutate(run.id)}
                        title="Release"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && <CreateRunModal onClose={() => setShowCreate(false)} />}
      {viewRunId && <PayslipModal runId={viewRunId} onClose={() => setViewRunId(null)} />}
    </div>
  )
}
