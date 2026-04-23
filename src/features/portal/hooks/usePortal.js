import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import {
  portalKeys,
  fetchMyProfile,
  fetchMyAttendance,
  fetchMyLeaves,
  fetchMyLeaveBalances,
  fetchMyPayslips,
  createMyLeave,
} from '../api/portalApi'

export function useMyProfile() {
  const { employee } = useAuth()
  return useQuery({
    queryKey: portalKeys.profile(employee?.id),
    queryFn: () => fetchMyProfile(employee.id),
    enabled: !!employee,
  })
}

export function useMyAttendance(filters = {}) {
  const { employee } = useAuth()
  return useQuery({
    queryKey: portalKeys.attendance(employee?.id, filters),
    queryFn: () => fetchMyAttendance(employee.id, filters),
    enabled: !!employee,
  })
}

export function useMyLeaves() {
  const { employee } = useAuth()
  return useQuery({
    queryKey: portalKeys.leaves(employee?.id),
    queryFn: () => fetchMyLeaves(employee.id),
    enabled: !!employee,
  })
}

export function useMyLeaveBalances() {
  const { employee } = useAuth()
  return useQuery({
    queryKey: portalKeys.leaveBalances(employee?.id),
    queryFn: () => fetchMyLeaveBalances(employee.id),
    enabled: !!employee,
  })
}

export function useMyPayslips() {
  const { employee } = useAuth()
  return useQuery({
    queryKey: portalKeys.payslips(employee?.id),
    queryFn: () => fetchMyPayslips(employee.id),
    enabled: !!employee,
  })
}

export function useCreateMyLeave() {
  const qc = useQueryClient()
  const { employee } = useAuth()
  return useMutation({
    mutationFn: createMyLeave,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portalKeys.leaves(employee?.id) })
      qc.invalidateQueries({ queryKey: portalKeys.leaveBalances(employee?.id) })
      // Also invalidate admin leaves view
      qc.invalidateQueries({ queryKey: ['leaves'] })
    },
  })
}
