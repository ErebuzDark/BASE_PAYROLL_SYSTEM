import { useState } from 'react'
import { Plus, X, CheckCircle2, PlayCircle, FileText } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
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
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Payroll Run</DialogTitle>
          <DialogDescription className="sr-only">Set up a new payroll run period</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label>Period Label</Label>
              <Input placeholder="e.g. April 16–30, 2025" required
                value={form.period} onChange={(e) => setForm(f => ({ ...f, period: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Period Start</Label>
                <Input type="date" required
                  value={form.periodStart} onChange={(e) => setForm(f => ({ ...f, periodStart: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Period End</Label>
                <Input type="date" required
                  value={form.periodEnd} onChange={(e) => setForm(f => ({ ...f, periodEnd: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Cutoff</Label>
              <NativeSelect value={form.cutoff} onChange={(e) => setForm(f => ({ ...f, cutoff: e.target.value }))}>
                <option>1st Cutoff</option>
                <option>2nd Cutoff</option>
              </NativeSelect>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createRun.isPending}>
              {createRun.isPending ? 'Creating...' : 'Create Run'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function PayslipModal({ runId, onClose }) {
  const { data: payslips = [], isLoading } = usePayslips(runId)
  const { data: employees = [] } = useEmployees({})

  const getEmployee = (id) => employees.find(e => e.id === id)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payslips</DialogTitle>
          <DialogDescription className="sr-only">View employee payslips for this payroll run</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[75vh]">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading payslips...</div>
          ) : payslips.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <FileText size={32} className="mx-auto mb-2 opacity-30" />
              No payslips yet. Process the payroll run to generate them.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {payslips.map((ps) => {
                const emp = getEmployee(ps.employeeId)
                return (
                  <div key={ps.id} className="px-6 py-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {emp ? `${emp.firstName[0]}${emp.lastName[0]}` : '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{emp ? `${emp.firstName} ${emp.lastName}` : ps.employeeId}</p>
                          <p className="text-xs text-slate-500">{emp?.position}</p>
                        </div>
                      </div>
                      <StatusBadge status={ps.status} />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {/* Earnings */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Earnings</p>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Basic Pay</span>
                            <span className="font-medium text-slate-700">{formatCurrency(ps.basicPay)}</span>
                          </div>
                          {ps.overtimePay > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">OT Pay ({ps.overtimeHours}h)</span>
                              <span className="font-medium text-slate-700">{formatCurrency(ps.overtimePay)}</span>
                            </div>
                          )}
                          {ps.allowances?.map((a) => (
                            <div key={a.type} className="flex justify-between">
                              <span className="text-slate-500">{a.type}</span>
                              <span className="font-medium text-slate-700">{formatCurrency(a.amount)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-1 border-t border-slate-100 font-semibold">
                            <span className="text-slate-700">Gross Pay</span>
                            <span className="text-emerald-600">{formatCurrency(ps.grossPay)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Deductions */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Deductions</p>
                        <div className="space-y-1">
                          {ps.deductions?.map((d) => (
                            <div key={d.type} className="flex justify-between">
                              <span className="text-slate-500">{d.type}</span>
                              <span className="font-medium text-slate-700">({formatCurrency(d.amount)})</span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-1 border-t border-slate-100 font-semibold">
                            <span className="text-slate-700">Total</span>
                            <span className="text-red-600">({formatCurrency(ps.totalDeductions)})</span>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="flex flex-col justify-end">
                        <div className="rounded-lg p-4 text-center bg-slate-50">
                          <p className="text-xs text-slate-500">Net Pay</p>
                          <p className="text-xl font-bold mt-1 text-slate-900">
                            {formatCurrency(ps.netPay)}
                          </p>
                          <p className="text-xs mt-1 text-slate-400">
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
      </DialogContent>
    </Dialog>
  )
}

export default function PayrollPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [viewRunId, setViewRunId] = useState(null)

  const { data: runs = [], isLoading } = usePayrollRuns({})
  const processRun = useProcessPayrollRun()
  const releaseRun = useReleasePayrollRun()

  const statusStyles = {
    Draft:     { bg: 'bg-amber-50', dot: 'bg-amber-500' },
    Processed: { bg: 'bg-blue-50', dot: 'bg-blue-500' },
    Released:  { bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  }

  return (
    <div>
      <PageHeader
        title="Payroll"
        subtitle="Manage payroll runs and payslips"
        actions={
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Payroll Run
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['Draft', 'Processed', 'Released'].map((status) => {
          const count = runs.filter(r => r.status === status).length
          const s = statusStyles[status]
          return (
            <Card key={status}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.bg}`}>
                  <div className={`w-3 h-3 rounded-full ${s.dot}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{count}</p>
                  <p className="text-xs text-slate-500">{status} Run{count !== 1 ? 's' : ''}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Runs Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Period</TableHead>
              <TableHead>Cutoff</TableHead>
              <TableHead>Total Gross</TableHead>
              <TableHead>Total Deductions</TableHead>
              <TableHead>Total Net</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Processed</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(8)].map((_, j) => (
                    <TableCell key={j}><div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: 80 }} /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell>
                  <p className="font-medium text-sm text-slate-900">{run.period}</p>
                  <p className="text-xs text-slate-400">{run.id}</p>
                </TableCell>
                <TableCell>{run.cutoff}</TableCell>
                <TableCell className="font-medium text-slate-800">{formatCurrency(run.totalGross)}</TableCell>
                <TableCell className="text-red-600">({formatCurrency(run.totalDeductions)})</TableCell>
                <TableCell className="font-semibold text-emerald-600">{formatCurrency(run.totalNet)}</TableCell>
                <TableCell><StatusBadge status={run.status} /></TableCell>
                <TableCell>
                  {run.processedAt
                    ? <span className="text-xs text-slate-600">{formatDate(run.processedAt)}</span>
                    : <span className="text-xs text-slate-400">—</span>
                  }
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setViewRunId(run.id)} title="View Payslips">
                      <FileText size={14} />
                    </Button>
                    {run.status === 'Draft' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        disabled={processRun.isPending}
                        onClick={() => processRun.mutate(run.id)}
                        title="Process"
                      >
                        <PlayCircle size={14} />
                      </Button>
                    )}
                    {run.status === 'Processed' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        disabled={releaseRun.isPending}
                        onClick={() => releaseRun.mutate(run.id)}
                        title="Release"
                      >
                        <CheckCircle2 size={14} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {showCreate && <CreateRunModal onClose={() => setShowCreate(false)} />}
      {viewRunId && <PayslipModal runId={viewRunId} onClose={() => setViewRunId(null)} />}
    </div>
  )
}
