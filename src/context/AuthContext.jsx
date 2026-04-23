import { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_EMPLOYEES } from '@/services/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null)

  // Rehydrate from sessionStorage on mount
  useEffect(() => {
    const savedId = sessionStorage.getItem('portal_employee_id')
    if (savedId) {
      const emp = MOCK_EMPLOYEES.find(e => e.id === savedId)
      if (emp) setEmployee(emp)
    }
  }, [])

  function login(empId) {
    const emp = MOCK_EMPLOYEES.find(e => e.id === empId)
    if (!emp) return false
    setEmployee(emp)
    sessionStorage.setItem('portal_employee_id', empId)
    return true
  }

  function logout() {
    setEmployee(null)
    sessionStorage.removeItem('portal_employee_id')
  }

  return (
    <AuthContext.Provider value={{ employee, login, logout, isLoggedIn: !!employee }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
