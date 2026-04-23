import api, { USE_MOCK } from '@/services/api'
import {
  MOCK_EMPLOYEES,
  MOCK_PAYROLL_RUNS,
  MOCK_ATTENDANCE,
  MOCK_LEAVES,
  MOCK_PAYROLL_TREND,
  MOCK_DEPARTMENT_COSTS,
} from '@/services/mockData'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export const dashboardKeys = {
  stats: () => ['dashboard', 'stats'],
  payrollTrend: () => ['dashboard', 'payroll-trend'],
  departmentCosts: () => ['dashboard', 'department-costs'],
}

function computeDashboardStats() {
  const totalEmployees = MOCK_EMPLOYEES.length
  const activeEmployees = MOCK_EMPLOYEES.filter(e => e.status === 'Active').length
  const onLeave = MOCK_EMPLOYEES.filter(e => e.status === 'On Leave').length

  // Total payroll this month from released runs
  const releasedRuns = MOCK_PAYROLL_RUNS.filter(r => r.status === 'Released')
  const totalPayrollThisMonth = releasedRuns.reduce((s, r) => s + r.totalGross, 0)

  // Pending payrolls (Draft or Processed, not yet released)
  const pendingPayrolls = MOCK_PAYROLL_RUNS.filter(r => r.status === 'Draft' || r.status === 'Processed').length

  // Find the latest upcoming payroll period
  const draftRuns = MOCK_PAYROLL_RUNS.filter(r => r.status === 'Draft')
  const upcomingPayroll = draftRuns.length > 0 ? draftRuns[0].period : 'No draft runs'

  // Attendance today (use all records as "today" for demo)
  const attendanceTodayPresent = MOCK_ATTENDANCE.filter(a => a.status === 'Present').length
  const attendanceTodayAbsent = MOCK_ATTENDANCE.filter(a => a.status === 'Absent').length
  const attendanceTodayLate = MOCK_ATTENDANCE.filter(a => a.status === 'Late').length

  // Pending leave requests
  const pendingLeaveRequests = MOCK_LEAVES.filter(l => l.status === 'Pending').length

  return {
    totalEmployees,
    activeEmployees,
    onLeave,
    totalPayrollThisMonth,
    payrollGrowth: 3.2,
    pendingPayrolls,
    upcomingPayroll,
    attendanceTodayPresent,
    attendanceTodayAbsent,
    attendanceTodayLate,
    pendingLeaveRequests,
  }
}

export async function fetchDashboardStats() {
  if (USE_MOCK) {
    await delay(300)
    return computeDashboardStats()
  }
  return api.get('/dashboard/stats').then((r) => r.data)
}

export async function fetchPayrollTrend() {
  if (USE_MOCK) {
    await delay(300)
    return MOCK_PAYROLL_TREND
  }
  return api.get('/dashboard/payroll-trend').then((r) => r.data)
}

export async function fetchDepartmentCosts() {
  if (USE_MOCK) {
    await delay(300)
    return MOCK_DEPARTMENT_COSTS
  }
  return api.get('/dashboard/department-costs').then((r) => r.data)
}
