import { Download, BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { usePayrollRuns } from '@/features/payroll/hooks/usePayroll'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { useDepartmentCosts } from '@/features/reports/hooks/useDashboard'
import { formatCurrency, formatDate } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ReportsPage() {
  const { data: runs = [] } = usePayrollRuns({})
  const { data: employees = [] } = useEmployees({})
  const { data: deptCosts = [] } = useDepartmentCosts()

  const releasedRuns = runs.filter(r => r.status === 'Released')
  const totalYTD = releasedRuns.reduce((sum, r) => sum + r.totalNet, 0)
  const totalGrossYTD = releasedRuns.reduce((sum, r) => sum + r.totalGross, 0)

  function handleExport() {
    const headers = ['Period', 'Cutoff', 'Gross Pay', 'Deductions', 'Net Pay', 'Status', 'Processed At']
    const rows = runs.map((run) => [
      `"${run.period}"`, run.cutoff, run.totalGross.toFixed(2), run.totalDeductions.toFixed(2),
      run.totalNet.toFixed(2), run.status, run.processedAt ? new Date(run.processedAt).toLocaleDateString() : '',
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
      <PageHeader title="Reports" subtitle="Payroll summaries and analytics"
        actions={<Button variant="outline" onClick={handleExport}><Download size={15} /> Export CSV</Button>} />

      {/* YTD Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">YTD Gross Payroll</p>
          <p className="text-2xl font-bold mt-1 text-slate-900">{formatCurrency(totalGrossYTD)}</p>
          <p className="text-xs mt-1 text-slate-400">{releasedRuns.length} released runs</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">YTD Net Released</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{formatCurrency(totalYTD)}</p>
          <p className="text-xs mt-1 text-slate-400">After all deductions</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Headcount</p>
          <p className="text-2xl font-bold mt-1 text-slate-900">{employees.filter(e => e.status === 'Active').length}</p>
          <p className="text-xs mt-1 text-slate-400">Active employees</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Department Cost Chart */}
        <Card><CardContent className="p-5">
          <p className="text-sm font-semibold mb-4 text-slate-900">Payroll by Department</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptCosts} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="department" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#e2e8f0' }} />
              <Bar dataKey="cost" fill="#1e293b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent></Card>

        {/* Employee Salary Table */}
        <Card className="overflow-hidden p-0">
          <div className="px-5 py-4 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900">Employee Salary Summary</p>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 260 }}>
            <Table>
              <TableHeader><TableRow className="hover:bg-transparent">
                <TableHead>Employee</TableHead><TableHead>Dept</TableHead><TableHead>Basic Salary</TableHead><TableHead>Type</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <p className="text-sm font-medium text-slate-800">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs text-slate-400">{emp.position}</p>
                    </TableCell>
                    <TableCell className="text-xs">{emp.department}</TableCell>
                    <TableCell className="font-medium text-sm text-slate-800">{formatCurrency(emp.basicSalary)}</TableCell>
                    <TableCell><StatusBadge status={emp.employmentType} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Payroll Run History */}
      <Card className="overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
          <BarChart3 size={16} className="text-slate-700" />
          <p className="text-sm font-semibold text-slate-900">Payroll Run History</p>
        </div>
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent">
            <TableHead>Period</TableHead><TableHead>Cutoff</TableHead><TableHead>Gross</TableHead><TableHead>Deductions</TableHead><TableHead>Net Pay</TableHead><TableHead>Status</TableHead><TableHead>Released</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell className="font-medium text-sm text-slate-800">{run.period}</TableCell>
                <TableCell className="text-xs">{run.cutoff}</TableCell>
                <TableCell>{formatCurrency(run.totalGross)}</TableCell>
                <TableCell className="text-red-600">({formatCurrency(run.totalDeductions)})</TableCell>
                <TableCell className="font-semibold text-emerald-600">{formatCurrency(run.totalNet)}</TableCell>
                <TableCell><StatusBadge status={run.status} /></TableCell>
                <TableCell className="text-xs">{run.processedAt ? formatDate(run.processedAt) : <span className="text-slate-400">—</span>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
