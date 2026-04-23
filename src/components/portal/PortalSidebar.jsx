import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, UserCircle, CalendarDays, Clock, Receipt, LogOut, ShieldCheck, Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/portal', icon: LayoutDashboard },
  { label: 'My Profile', to: '/portal/profile', icon: UserCircle },
  { label: 'My Leaves', to: '/portal/leaves', icon: CalendarDays },
  { label: 'My Attendance', to: '/portal/attendance', icon: Clock },
  { label: 'My Payslips', to: '/portal/payslips', icon: Receipt },
]

export function PortalSidebar() {
  const { employee, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/portal/login')
  }

  return (
    <aside className="flex flex-col h-full w-[260px] min-h-screen bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 shadow-lg shadow-slate-800/15">
          <Building2 size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 tracking-tight">PayrollPro</p>
          <p className="text-[11px] text-slate-400 font-medium">Employee Portal</p>
        </div>
      </div>

      <Separator />

      {/* Employee Card */}
      {employee && (
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-slate-800 text-white text-sm">
                {employee.firstName[0]}{employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {employee.firstName} {employee.lastName}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{employee.position}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/portal'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150',
                isActive
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              )
            }
          >
            <Icon size={17} className="shrink-0" />
            <span className="flex-1">{label}</span>
          </NavLink>
        ))}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="px-3 py-3 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
        >
          <ShieldCheck size={17} className="shrink-0" />
          <span>Admin Panel</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all w-full cursor-pointer"
        >
          <LogOut size={17} className="shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
