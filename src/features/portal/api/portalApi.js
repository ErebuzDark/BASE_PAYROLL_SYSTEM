import { USE_MOCK } from '@/services/api'
import {
  MOCK_EMPLOYEES,
  MOCK_ATTENDANCE,
  MOCK_LEAVES,
  MOCK_LEAVE_BALANCES,
  MOCK_PAYROLL_RUNS,
} from '@/services/mockData'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export const portalKeys = {
  profile: (empId) => ['portal', 'profile', empId],
  attendance: (empId, filters) => ['portal', 'attendance', empId, filters],
  leaves: (empId) => ['portal', 'leaves', empId],
  leaveBalances: (empId) => ['portal', 'leave-balances', empId],
  payslips: (empId) => ['portal', 'payslips', empId],
}

export async function fetchMyProfile(empId) {
  if (USE_MOCK) {
    await delay(300)
    return MOCK_EMPLOYEES.find(e => e.id === empId) ?? null
  }
  return api.get(`/portal/profile`).then(r => r.data)
}

export async function fetchMyAttendance(empId, filters = {}) {
  if (USE_MOCK) {
    await delay(300)
    let data = MOCK_ATTENDANCE.filter(a => a.employeeId === empId)
    if (filters.date) data = data.filter(a => a.date === filters.date)
    return data.sort((a, b) => b.date.localeCompare(a.date))
  }
  return api.get(`/portal/attendance`, { params: filters }).then(r => r.data)
}

export async function fetchMyLeaves(empId) {
  if (USE_MOCK) {
    await delay(300)
    return MOCK_LEAVES
      .filter(l => l.employeeId === empId)
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
  }
  return api.get(`/portal/leaves`).then(r => r.data)
}

export async function fetchMyLeaveBalances(empId) {
  if (USE_MOCK) {
    await delay(200)
    return MOCK_LEAVE_BALANCES.filter(b => b.employeeId === empId)
  }
  return api.get(`/portal/leave-balances`).then(r => r.data)
}

export async function fetchMyPayslips(empId) {
  if (USE_MOCK) {
    await delay(400)
    const payslips = []
    for (const run of MOCK_PAYROLL_RUNS) {
      if (run.status !== 'Released' && run.status !== 'Processed') continue
      for (const ps of run.payslips) {
        if (ps.employeeId === empId) {
          payslips.push({ ...ps, period: run.period, periodStart: run.periodStart, periodEnd: run.periodEnd, runStatus: run.status })
        }
      }
    }
    return payslips.sort((a, b) => b.periodStart.localeCompare(a.periodStart))
  }
  return api.get(`/portal/payslips`).then(r => r.data)
}

export async function createMyLeave(data) {
  if (USE_MOCK) {
    await delay(500)
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1)
    const newLeave = {
      id: `lv-${Date.now()}`,
      ...data,
      days,
      status: 'Pending',
    }
    MOCK_LEAVES.push(newLeave)

    // Update leave balance
    const balance = MOCK_LEAVE_BALANCES.find(
      b => b.employeeId === data.employeeId && b.type === data.type
    )
    if (balance) {
      balance.used += days
      balance.remaining = Math.max(0, balance.total - balance.used)
    }

    return newLeave
  }
  return api.post(`/portal/leaves`, data).then(r => r.data)
}
