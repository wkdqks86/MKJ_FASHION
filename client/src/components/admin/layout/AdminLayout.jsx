import { Outlet } from 'react-router-dom'
import { useAdminGuard } from '@/hooks/useAdminGuard'
import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'
import '@/styles/admin.css'

function AdminLayout() {
  const { user, isLoading } = useAdminGuard()

  if (isLoading) {
    return null
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-shell__main">
        <AdminTopBar userName={user?.name} />
        <div className="admin-shell__content">
          <Outlet context={{ user }} />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
