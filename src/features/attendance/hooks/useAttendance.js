import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  attendanceKeys,
  fetchAttendance,
  fetchLeaves,
  createAttendance,
  createLeave,
  updateLeaveStatus,
} from '../api/attendanceApi'

export function useAttendance(filters) {
  return useQuery({
    queryKey: attendanceKeys.list(filters),
    queryFn: () => fetchAttendance(filters),
  })
}

export function useLeaves(filters) {
  return useQuery({
    queryKey: attendanceKeys.leaveList(filters),
    queryFn: () => fetchLeaves(filters),
  })
}

export function useCreateAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createAttendance,
    onSuccess: () => qc.invalidateQueries({ queryKey: attendanceKeys.all }),
  })
}

export function useCreateLeave() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createLeave,
    onSuccess: () => qc.invalidateQueries({ queryKey: attendanceKeys.leaves() }),
  })
}

export function useUpdateLeaveStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateLeaveStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: attendanceKeys.leaves() }),
  })
}
