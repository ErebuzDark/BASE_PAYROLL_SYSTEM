import { useQuery } from '@tanstack/react-query'
import { dashboardKeys, fetchDashboardStats, fetchPayrollTrend, fetchDepartmentCosts } from '../api/dashboardApi'

export function useDashboardStats() {
  return useQuery({ queryKey: dashboardKeys.stats(), queryFn: fetchDashboardStats })
}

export function usePayrollTrend() {
  return useQuery({ queryKey: dashboardKeys.payrollTrend(), queryFn: fetchPayrollTrend })
}

export function useDepartmentCosts() {
  return useQuery({ queryKey: dashboardKeys.departmentCosts(), queryFn: fetchDepartmentCosts })
}
