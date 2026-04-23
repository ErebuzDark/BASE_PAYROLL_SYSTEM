/**
 * Employees API
 *
 * MOCK MODE: Returns data from mockData.js with simulated delay
 * REAL API:  Uncomment the axios calls and remove the mock block
 *            Endpoints follow REST conventions:
 *              GET    /employees
 *              GET    /employees/:id
 *              POST   /employees
 *              PUT    /employees/:id
 *              DELETE /employees/:id
 */

import api, { USE_MOCK } from '@/services/api'
import {
  MOCK_EMPLOYEES,
  MOCK_DEPARTMENTS,
} from '@/services/mockData'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// --- Query Keys ---
export const employeeKeys = {
  all: ['employees'],
  lists: () => [...employeeKeys.all, 'list'],
  list: (filters) => [...employeeKeys.lists(), filters],
  detail: (id) => [...employeeKeys.all, 'detail', id],
  departments: () => ['departments'],
}

// --- Fetch All Employees ---
export async function fetchEmployees(filters = {}) {
  if (USE_MOCK) {
    await delay()
    let data = [...MOCK_EMPLOYEES]
    if (filters.status) data = data.filter((e) => e.status === filters.status)
    if (filters.department) data = data.filter((e) => e.department === filters.department)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      data = data.filter(
        (e) =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.position.toLowerCase().includes(q)
      )
    }
    return data
  }
  // REAL API ↓
  return api.get('/employees', { params: filters }).then((r) => r.data)
}

// --- Fetch Single Employee ---
export async function fetchEmployee(id) {
  if (USE_MOCK) {
    await delay()
    return MOCK_EMPLOYEES.find((e) => e.id === id) ?? null
  }
  return api.get(`/employees/${id}`).then((r) => r.data)
}

// --- Create Employee ---
export async function createEmployee(data) {
  if (USE_MOCK) {
    await delay(600)
    const newEmp = {
      ...data,
      id: `EMP-${String(MOCK_EMPLOYEES.length + 1).padStart(3, '0')}`,
      status: 'Active',
      hireDate: new Date().toISOString().split('T')[0],
    }
    MOCK_EMPLOYEES.push(newEmp)
    return newEmp
  }
  return api.post('/employees', data).then((r) => r.data)
}

// --- Update Employee ---
export async function updateEmployee({ id, ...data }) {
  if (USE_MOCK) {
    await delay(600)
    const idx = MOCK_EMPLOYEES.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Employee not found')
    MOCK_EMPLOYEES[idx] = { ...MOCK_EMPLOYEES[idx], ...data }
    return MOCK_EMPLOYEES[idx]
  }
  return api.put(`/employees/${id}`, data).then((r) => r.data)
}

// --- Delete Employee ---
export async function deleteEmployee(id) {
  if (USE_MOCK) {
    await delay(400)
    const idx = MOCK_EMPLOYEES.findIndex((e) => e.id === id)
    if (idx !== -1) MOCK_EMPLOYEES.splice(idx, 1)
    return { success: true }
  }
  return api.delete(`/employees/${id}`).then((r) => r.data)
}

// --- Fetch Departments ---
export async function fetchDepartments() {
  if (USE_MOCK) {
    await delay(200)
    return MOCK_DEPARTMENTS
  }
  return api.get('/departments').then((r) => r.data)
}
