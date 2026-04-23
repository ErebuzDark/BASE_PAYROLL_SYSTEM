import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  payrollKeys,
  fetchPayrollRuns,
  fetchPayrollRun,
  fetchPayslips,
  createPayrollRun,
  processPayrollRun,
  releasePayrollRun,
} from '../api/payrollApi'

export function usePayrollRuns(filters) {
  return useQuery({
    queryKey: payrollKeys.list(filters),
    queryFn: () => fetchPayrollRuns(filters),
  })
}

export function usePayrollRun(id) {
  return useQuery({
    queryKey: payrollKeys.detail(id),
    queryFn: () => fetchPayrollRun(id),
    enabled: !!id,
  })
}

export function usePayslips(runId) {
  return useQuery({
    queryKey: payrollKeys.payslips(runId),
    queryFn: () => fetchPayslips(runId),
    enabled: !!runId,
  })
}

export function useCreatePayrollRun() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createPayrollRun,
    onSuccess: () => qc.invalidateQueries({ queryKey: payrollKeys.all }),
  })
}

export function useProcessPayrollRun() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: processPayrollRun,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: payrollKeys.all })
      qc.setQueryData(payrollKeys.detail(data.id), data)
    },
  })
}

export function useReleasePayrollRun() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: releasePayrollRun,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: payrollKeys.all })
      qc.setQueryData(payrollKeys.detail(data.id), data)
    },
  })
}
