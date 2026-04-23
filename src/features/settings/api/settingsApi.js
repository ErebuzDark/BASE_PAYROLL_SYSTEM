import { USE_MOCK } from '@/services/api'
import {
  MOCK_DEDUCTION_TYPES,
  MOCK_ALLOWANCE_TYPES,
  MOCK_COMPANY_SETTINGS,
} from '@/services/mockData'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export const settingsKeys = {
  deductionTypes: () => ['settings', 'deduction-types'],
  allowanceTypes: () => ['settings', 'allowance-types'],
  company: () => ['settings', 'company'],
}

// --- Deduction Types ---
export async function fetchDeductionTypes() {
  if (USE_MOCK) {
    await delay(200)
    return [...MOCK_DEDUCTION_TYPES]
  }
  return api.get('/settings/deduction-types').then((r) => r.data)
}

export async function createDeductionType(data) {
  if (USE_MOCK) {
    await delay(400)
    const newItem = {
      id: `ded-type-${Date.now()}`,
      ...data,
    }
    MOCK_DEDUCTION_TYPES.push(newItem)
    return newItem
  }
  return api.post('/settings/deduction-types', data).then((r) => r.data)
}

export async function deleteDeductionType(id) {
  if (USE_MOCK) {
    await delay(300)
    const idx = MOCK_DEDUCTION_TYPES.findIndex((d) => d.id === id)
    if (idx !== -1) MOCK_DEDUCTION_TYPES.splice(idx, 1)
    return { success: true }
  }
  return api.delete(`/settings/deduction-types/${id}`).then((r) => r.data)
}

// --- Allowance Types ---
export async function fetchAllowanceTypes() {
  if (USE_MOCK) {
    await delay(200)
    return [...MOCK_ALLOWANCE_TYPES]
  }
  return api.get('/settings/allowance-types').then((r) => r.data)
}

export async function createAllowanceType(data) {
  if (USE_MOCK) {
    await delay(400)
    const newItem = {
      id: `all-type-${Date.now()}`,
      ...data,
    }
    MOCK_ALLOWANCE_TYPES.push(newItem)
    return newItem
  }
  return api.post('/settings/allowance-types', data).then((r) => r.data)
}

export async function deleteAllowanceType(id) {
  if (USE_MOCK) {
    await delay(300)
    const idx = MOCK_ALLOWANCE_TYPES.findIndex((a) => a.id === id)
    if (idx !== -1) MOCK_ALLOWANCE_TYPES.splice(idx, 1)
    return { success: true }
  }
  return api.delete(`/settings/allowance-types/${id}`).then((r) => r.data)
}

// --- Company Settings ---
export async function fetchCompanySettings() {
  if (USE_MOCK) {
    await delay(200)
    return { ...MOCK_COMPANY_SETTINGS }
  }
  return api.get('/settings/company').then((r) => r.data)
}

export async function updateCompanySettings(data) {
  if (USE_MOCK) {
    await delay(500)
    Object.assign(MOCK_COMPANY_SETTINGS, data)
    return { ...MOCK_COMPANY_SETTINGS }
  }
  return api.put('/settings/company', data).then((r) => r.data)
}
