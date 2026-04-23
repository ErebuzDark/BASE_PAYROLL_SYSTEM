import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  employeeKeys,
  fetchEmployees,
  fetchEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  fetchDepartments,
} from '../api/employeesApi'

export function useEmployees(filters) {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => fetchEmployees(filters),
  })
}

export function useEmployee(id) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => fetchEmployee(id),
    enabled: !!id,
  })
}

export function useDepartments() {
  return useQuery({
    queryKey: employeeKeys.departments(),
    queryFn: fetchDepartments,
    staleTime: Infinity,
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => qc.invalidateQueries({ queryKey: employeeKeys.lists() }),
  })
}

export function useUpdateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: employeeKeys.lists() })
      qc.setQueryData(employeeKeys.detail(data.id), data)
    },
  })
}

export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: employeeKeys.lists() })
      qc.removeQueries({ queryKey: employeeKeys.detail(id) })
    },
  })
}
