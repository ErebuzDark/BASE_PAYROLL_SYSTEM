import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/shared/RootLayout'

const DashboardPage  = lazy(() => import('@/pages/DashboardPage'))
const EmployeesPage  = lazy(() => import('@/pages/EmployeesPage'))
const PayrollPage    = lazy(() => import('@/pages/PayrollPage'))
const AttendancePage = lazy(() => import('@/pages/AttendancePage'))
const ReportsPage    = lazy(() => import('@/pages/ReportsPage'))
const SettingsPage   = lazy(() => import('@/pages/SettingsPage'))

const Loader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
      style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
  </div>
)

const wrap = (Page) => (
  <Suspense fallback={<Loader />}>
    <Page />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,           element: wrap(DashboardPage) },
      { path: 'employees',     element: wrap(EmployeesPage) },
      { path: 'payroll',       element: wrap(PayrollPage) },
      { path: 'attendance',    element: wrap(AttendancePage) },
      { path: 'reports',       element: wrap(ReportsPage) },
      { path: 'settings',      element: wrap(SettingsPage) },
    ],
  },
])
