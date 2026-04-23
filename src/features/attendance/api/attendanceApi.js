import api, { USE_MOCK } from '@/services/api'
import { MOCK_ATTENDANCE, MOCK_LEAVES } from '@/services/mockData'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export const attendanceKeys = {
  all: ['attendance'],
  list: (filters) => [...attendanceKeys.all, 'list', filters],
  leaves: () => ['leaves'],
  leaveList: (filters) => [...attendanceKeys.leaves(), 'list', filters],
}

export async function fetchAttendance(filters = {}) {
  if (USE_MOCK) {
    await delay()
    let data = [...MOCK_ATTENDANCE]
    if (filters.employeeId) data = data.filter((a) => a.employeeId === filters.employeeId)
    if (filters.date) data = data.filter((a) => a.date === filters.date)
    return data
  }
  return api.get('/attendance', { params: filters }).then((r) => r.data)
}

export async function createAttendance(data) {
  if (USE_MOCK) {
    await delay(500)
    const hoursWorked = (data.timeIn && data.timeOut)
      ? Math.max(0, parseFloat(((new Date(`2000-01-01T${data.timeOut}`) - new Date(`2000-01-01T${data.timeIn}`)) / 3600000).toFixed(2)))
      : 0
    const newAtt = {
      id: `att-${Date.now()}`,
      ...data,
      hoursWorked,
    }
    MOCK_ATTENDANCE.push(newAtt)
    return newAtt
  }
  return api.post('/attendance', data).then((r) => r.data)
}

export async function fetchLeaves(filters = {}) {
  if (USE_MOCK) {
    await delay()
    let data = [...MOCK_LEAVES]
    if (filters.status) data = data.filter((l) => l.status === filters.status)
    if (filters.employeeId) data = data.filter((l) => l.employeeId === filters.employeeId)
    return data
  }
  return api.get('/leaves', { params: filters }).then((r) => r.data)
}

export async function createLeave(data) {
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
    return newLeave
  }
  return api.post('/leaves', data).then((r) => r.data)
}

export async function updateLeaveStatus({ id, status }) {
  if (USE_MOCK) {
    await delay(500)
    const leave = MOCK_LEAVES.find((l) => l.id === id)
    if (leave) leave.status = status
    return leave
  }
  return api.put(`/leaves/${id}/status`, { status }).then((r) => r.data)
}
