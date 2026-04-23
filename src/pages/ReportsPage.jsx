import { Download, BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { usePayrollRuns } from '@/features/payroll/hooks/usePayroll'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { useDepartmentCosts } from '@/features/reports/hooks/useDashboard'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export default function ReportsPage() {
  const { data: runs = [] } = usePayrollRuns({})
  const { data: employees = [] } = useEmployees({})
  const { data: deptCosts = [] } = useDepartmentCosts()

  const releasedRuns = runs.filter(r => r.status === 'Released')
  const totalYTD = releasedRuns.reduce((sum, r) => sum + r.totalNet, 0)
  const totalGrossYTD = releasedRuns.reduce((sum, r) => sum + r.totalGross, 0)

  function handleExport() {
    // Build CSV from payroll runs data
    const headers = ['Period', 'Cutoff', 'Gross Pay', 'Deductions', 'Net Pay', 'Status', 'Processed At']
    const rows = runs.map((run) => [
      `"${run.period}"`,
      run.cutoff,
      run.totalGross.toFixed(2),
      run.totalDeductions.toFixed(2),
      run.totalNet.toFixed(2),
      run.status,
      run.processedAt ? new Date(run.processedAt).toLocaleDateString() : '',
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `payroll-report-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Payroll summaries and analytics"
        actions={
          <button className="btn btn-outline" onClick={handleExport}>
            <Download size={15} /> Export CSV
          </button>
        }
      />

      {/* YTD Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-neutral-500)' }}>YTD Gross Payroll</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalGrossYTD)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-400)' }}>{releasedRuns.length} released runs</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-neutral-500)' }}>YTD Net Released</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-success)' }}>{formatCurrency(totalYTD)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-400)' }}>After all deductions</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-neutral-500)' }}>Headcount</p>
          <p className="text-2xl font-bold mt-1">{employees.filter(e => e.status === 'Active').length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-400)' }}>Active employees</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Department Cost Chart */}
        <div className="card">
          <p className="text-sm font-semibold mb-4">Payroll by Department</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptCosts} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-neutral-500)' }}
                tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="department" tick={{ fontSize: 11, fill: 'var(--color-neutral-600)' }}
                axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="cost" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Salary Table */}
        <div className="card overflow-hidden p-0">
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm font-semibold">Employee Salary Summary</p>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 260 }}>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Dept</th>
                  <th>Basic Salary</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>{emp.position}</p>
                    </td>
                    <td className="text-xs">{emp.department}</td>
                    <td className="font-medium text-sm">{formatCurrency(emp.basicSalary)}</td>
                    <td><StatusBadge status={emp.employmentType} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payroll Run History */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--color-border)' }}>
          <BarChart3 size={16} style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm font-semibold">Payroll Run History</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Cutoff</th>
              <th>Gross</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Released</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id}>
                <td className="font-medium text-sm">{run.period}</td>
                <td className="text-xs">{run.cutoff}</td>
                <td>{formatCurrency(run.totalGross)}</td>
                <td style={{ color: 'var(--color-destructive)' }}>({formatCurrency(run.totalDeductions)})</td>
                <td className="font-semibold" style={{ color: 'var(--color-success)' }}>{formatCurrency(run.totalNet)}</td>
                <td><StatusBadge status={run.status} /></td>
                <td className="text-xs">
                  {run.processedAt ? formatDate(run.processedAt) : <span style={{ color: 'var(--color-neutral-400)' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
