import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Clock,
  FileText,
  Settings,
  Building2,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Employees', to: '/employees', icon: Users },
  { label: 'Payroll', to: '/payroll', icon: CreditCard },
  { label: 'Attendance & Leaves', to: '/attendance', icon: Clock },
  { label: 'Reports', to: '/reports', icon: FileText },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside
      className="flex flex-col h-full"
      style={{ background: 'var(--color-sidebar)', width: '240px', minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'oklch(30% 0.06 240)' }}>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: 'var(--color-primary)' }}
        >
          <Building2 size={18} color="white" />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--color-sidebar-text)' }}>
            PayrollPro
          </p>
          <p className="text-xs" style={{ color: 'var(--color-sidebar-text-muted)' }}>
            HR & Payroll System
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn('nav-item', isActive && 'active')
            }
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'oklch(30% 0.06 240)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--color-primary)', color: 'white' }}
          >
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: 'var(--color-sidebar-text)' }}>
              Admin User
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--color-sidebar-text-muted)' }}>
              HR Manager
            </p>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--color-sidebar-text-muted)' }} />
        </div>
      </div>
    </aside>
  )
}
