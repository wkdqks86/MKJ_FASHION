import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '@/components/admin/layout/AdminLayout'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminMembersPage from '@/pages/admin/AdminMembersPage'
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage'
import AdminProductEditPage from '@/pages/admin/AdminProductEditPage'
import AdminProductRegisterPage from '@/pages/admin/AdminProductRegisterPage'
import AdminStyleEditEditPage from '@/pages/admin/AdminStyleEditEditPage'
import AdminStyleEditRegisterPage from '@/pages/admin/AdminStyleEditRegisterPage'
import AdminStyleEditsPage from '@/pages/admin/AdminStyleEditsPage'
import AdminProductsPage from '@/pages/admin/AdminProductsPage'

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductRegisterPage />} />
        <Route path="products/:id/edit" element={<AdminProductEditPage />} />
        <Route path="style-edits" element={<AdminStyleEditsPage />} />
        <Route path="style-edits/new" element={<AdminStyleEditRegisterPage />} />
        <Route path="style-edits/:id/edit" element={<AdminStyleEditEditPage />} />
        <Route path="members" element={<AdminMembersPage />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes
