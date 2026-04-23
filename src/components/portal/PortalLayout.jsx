import { Outlet, Navigate } from 'react-router-dom'
import { PortalSidebar } from '@/components/portal/PortalSidebar'
import { useAuth } from '@/context/AuthContext'

export default function PortalLayout() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/portal/login" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <PortalSidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-8 max-w-screen-xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
