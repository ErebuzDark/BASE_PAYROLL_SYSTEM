import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/shared/Sidebar'

export default function RootLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto"
        style={{ background: 'var(--color-neutral-100)' }}
      >
        <div className="p-8 max-w-screen-xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
