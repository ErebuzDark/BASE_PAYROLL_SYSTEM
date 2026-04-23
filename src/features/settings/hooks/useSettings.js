import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  settingsKeys,
  fetchDeductionTypes,
  createDeductionType,
  deleteDeductionType,
  fetchAllowanceTypes,
  createAllowanceType,
  deleteAllowanceType,
  fetchCompanySettings,
  updateCompanySettings,
} from '../api/settingsApi'

// --- Deduction Types ---
export function useDeductionTypes() {
  return useQuery({
    queryKey: settingsKeys.deductionTypes(),
    queryFn: fetchDeductionTypes,
  })
}

export function useCreateDeductionType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createDeductionType,
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.deductionTypes() }),
  })
}

export function useDeleteDeductionType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteDeductionType,
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.deductionTypes() }),
  })
}

// --- Allowance Types ---
export function useAllowanceTypes() {
  return useQuery({
    queryKey: settingsKeys.allowanceTypes(),
    queryFn: fetchAllowanceTypes,
  })
}

export function useCreateAllowanceType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createAllowanceType,
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.allowanceTypes() }),
  })
}

export function useDeleteAllowanceType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteAllowanceType,
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.allowanceTypes() }),
  })
}

// --- Company Settings ---
export function useCompanySettings() {
  return useQuery({
    queryKey: settingsKeys.company(),
    queryFn: fetchCompanySettings,
  })
}

export function useUpdateCompanySettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateCompanySettings,
    onSuccess: (data) => {
      qc.setQueryData(settingsKeys.company(), data)
    },
  })
}
