// Payroll API
//
// MOCK MODE: Simulates payroll run CRUD and processing
// REAL API:  Replace mock blocks with real axios calls
//            Endpoints:
//              GET    /payroll-runs
//              GET    /payroll-runs/:id
//              POST   /payroll-runs
//              PUT    /payroll-runs/:id/process
//              PUT    /payroll-runs/:id/release
//              GET    /payroll-runs/:id/payslips
//              GET    /payslips/:id

import api, { USE_MOCK } from '@/services/api'
import { MOCK_PAYROLL_RUNS, MOCK_EMPLOYEES } from '@/services/mockData'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export const payrollKeys = {
  all: ['payroll-runs'],
  lists: () => [...payrollKeys.all, 'list'],
  list: (filters) => [...payrollKeys.lists(), filters],
  detail: (id) => [...payrollKeys.all, 'detail', id],
  payslips: (runId) => [...payrollKeys.detail(runId), 'payslips'],
  payslip: (id) => ['payslips', id],
}

export async function fetchPayrollRuns(filters = {}) {
  if (USE_MOCK) {
    await delay()
    let data = [...MOCK_PAYROLL_RUNS]
    if (filters.status) data = data.filter((r) => r.status === filters.status)
    return data
  }
  return api.get('/payroll-runs', { params: filters }).then((r) => r.data)
}

export async function fetchPayrollRun(id) {
  if (USE_MOCK) {
    await delay()
    return MOCK_PAYROLL_RUNS.find((r) => r.id === id) ?? null
  }
  return api.get(`/payroll-runs/${id}`).then((r) => r.data)
}

export async function fetchPayslips(runId) {
  if (USE_MOCK) {
    await delay()
    const run = MOCK_PAYROLL_RUNS.find((r) => r.id === runId)
    return run?.payslips ?? []
  }
  return api.get(`/payroll-runs/${runId}/payslips`).then((r) => r.data)
}

export async function createPayrollRun(data) {
  if (USE_MOCK) {
    await delay(800)
    const newRun = {
      id: `pr-${Date.now()}`,
      ...data,
      status: 'Draft',
      processedAt: null,
      approvedBy: null,
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
      payslips: [],
    }
    MOCK_PAYROLL_RUNS.unshift(newRun)
    return newRun
  }
  return api.post('/payroll-runs', data).then((r) => r.data)
}

// Helper: compute payslips for all active employees
function generatePayslips(run) {
  const activeEmployees = MOCK_EMPLOYEES.filter((e) => e.status === 'Active')

  // Calculate working days in the period (roughly half-month = 11 days for semi-monthly)
  const start = new Date(run.periodStart)
  const end = new Date(run.periodEnd)
  const calendarDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
  const workDays = Math.round(calendarDays * 5 / 7) // approximate working days

  return activeEmployees.map((emp, idx) => {
    const dailyRate = emp.basicSalary / 22 // monthly salary / 22 working days
    const basicPay = Math.round(dailyRate * workDays * 100) / 100
    const hoursRegular = workDays * 8

    // Standard allowances
    const allowances = [
      { type: 'Transportation', amount: 2000, taxable: false },
      { type: 'Meal', amount: 1500, taxable: false },
    ]
    const totalAllowances = allowances.reduce((s, a) => s + a.amount, 0)

    // Gross
    const grossPay = basicPay + totalAllowances

    // Standard deductions (simplified Philippine rates)
    const sssContrib = Math.min(Math.round(grossPay * 0.045 / 2), 1125)
    const philhealth = Math.round(grossPay * 0.025 / 2)
    const pagibig = 200
    const taxableIncome = grossPay - sssContrib - philhealth - pagibig - totalAllowances
    const withholdingTax = Math.max(0, Math.round(taxableIncome * 0.15))

    const deductions = [
      { type: 'SSS', amount: sssContrib, category: 'Government' },
      { type: 'PhilHealth', amount: philhealth, category: 'Government' },
      { type: 'Pag-IBIG', amount: pagibig, category: 'Government' },
      { type: 'Withholding Tax', amount: withholdingTax, category: 'Tax' },
    ]
    const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0)

    return {
      id: `ps-${run.id}-${idx}`,
      employeeId: emp.id,
      payrollRunId: run.id,
      basicPay,
      daysWorked: workDays,
      hoursRegular,
      overtimeHours: 0,
      overtimePay: 0,
      allowances,
      grossPay,
      deductions,
      totalDeductions,
      netPay: grossPay - totalDeductions,
      status: 'Processed',
    }
  })
}

export async function processPayrollRun(id) {
  if (USE_MOCK) {
    await delay(1200)
    const run = MOCK_PAYROLL_RUNS.find((r) => r.id === id)
    if (!run) throw new Error('Payroll run not found')

    // Auto-generate payslips if none exist
    if (run.payslips.length === 0) {
      run.payslips = generatePayslips(run)
    } else {
      // Mark existing payslips as processed
      run.payslips.forEach((ps) => { ps.status = 'Processed' })
    }

    // Recompute run totals
    run.totalGross = run.payslips.reduce((s, ps) => s + ps.grossPay, 0)
    run.totalDeductions = run.payslips.reduce((s, ps) => s + ps.totalDeductions, 0)
    run.totalNet = run.payslips.reduce((s, ps) => s + ps.netPay, 0)
    run.status = 'Processed'
    run.processedAt = new Date().toISOString()
    return run
  }
  return api.put(`/payroll-runs/${id}/process`).then((r) => r.data)
}

export async function releasePayrollRun(id) {
  if (USE_MOCK) {
    await delay(800)
    const run = MOCK_PAYROLL_RUNS.find((r) => r.id === id)
    if (!run) throw new Error('Payroll run not found')
    run.status = 'Released'
    run.approvedBy = 'Current User'
    // Mark payslips as released too
    run.payslips.forEach((ps) => { ps.status = 'Released' })
    return run
  }
  return api.put(`/payroll-runs/${id}/release`).then((r) => r.data)
}
