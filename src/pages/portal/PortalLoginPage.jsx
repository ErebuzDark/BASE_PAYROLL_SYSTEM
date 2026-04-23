import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { Building2, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { MOCK_EMPLOYEES } from '@/services/mockData'

export default function PortalLoginPage() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [selectedEmp, setSelectedEmp] = useState('')

  if (isLoggedIn) return <Navigate to="/portal" replace />

  function handleLogin(e) {
    e.preventDefault()
    if (login(selectedEmp)) {
      navigate('/portal')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 shadow-xl shadow-slate-800/20 mb-4">
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">PayrollPro</h1>
          <p className="text-sm text-slate-500 mt-1">Employee Self-Service Portal</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-slate-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Welcome back</h2>
            <p className="text-sm text-slate-500 mb-6">Select your employee profile to continue</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label>Employee</Label>
                <NativeSelect
                  value={selectedEmp}
                  onChange={(e) => setSelectedEmp(e.target.value)}
                  required
                  className="h-11"
                >
                  <option value="">Choose your name...</option>
                  {MOCK_EMPLOYEES.filter(e => e.status === 'Active' || e.status === 'On Leave').map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} — {emp.position}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <Button type="submit" className="w-full h-11" disabled={!selectedEmp}>
                <LogIn size={16} /> Sign In to Portal
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                ← Back to Admin Panel
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          Demo mode — select any employee to sign in
        </p>
      </div>
    </div>
  )
}
