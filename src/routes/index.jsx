import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/shared/RootLayout'

// Admin pages
const DashboardPage  = lazy(() => import('@/pages/DashboardPage'))
const EmployeesPage  = lazy(() => import('@/pages/EmployeesPage'))
const PayrollPage    = lazy(() => import('@/pages/PayrollPage'))
const AttendancePage = lazy(() => import('@/pages/AttendancePage'))
const ReportsPage    = lazy(() => import('@/pages/ReportsPage'))
const SettingsPage   = lazy(() => import('@/pages/SettingsPage'))

// Portal pages
const PortalLayout         = lazy(() => import('@/components/portal/PortalLayout'))
const PortalLoginPage      = lazy(() => import('@/pages/portal/PortalLoginPage'))
const PortalDashboardPage  = lazy(() => import('@/pages/portal/PortalDashboardPage'))
const PortalProfilePage    = lazy(() => import('@/pages/portal/PortalProfilePage'))
const PortalLeavesPage     = lazy(() => import('@/pages/portal/PortalLeavesPage'))
const PortalAttendancePage = lazy(() => import('@/pages/portal/PortalAttendancePage'))
const PortalPayslipsPage   = lazy(() => import('@/pages/portal/PortalPayslipsPage'))

const Loader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-6 h-6 rounded-full border-2 border-slate-800 border-t-transparent animate-spin" />
  </div>
)

const wrap = (Page) => (
  <Suspense fallback={<Loader />}>
    <Page />
  </Suspense>
)

export const router = createBrowserRouter([
  // Admin routes
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
  // Portal routes
  {
    path: '/portal/login',
    element: wrap(PortalLoginPage),
  },
  {
    path: '/portal',
    element: wrap(PortalLayout),
    children: [
      { index: true,          element: wrap(PortalDashboardPage) },
      { path: 'profile',     element: wrap(PortalProfilePage) },
      { path: 'leaves',      element: wrap(PortalLeavesPage) },
      { path: 'attendance',  element: wrap(PortalAttendancePage) },
      { path: 'payslips',    element: wrap(PortalPayslipsPage) },
    ],
  },
])
