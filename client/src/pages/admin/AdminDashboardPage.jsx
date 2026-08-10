import { useState } from 'react'
import AdminPageHead from '@/components/admin/common/AdminPageHead'
import DashboardCharts from '@/components/admin/dashboard/DashboardCharts'
import KpiCards from '@/components/admin/dashboard/KpiCards'
import RecentOrdersTable from '@/components/admin/dashboard/RecentOrdersTable'
import OrderDetailModal from '@/components/admin/orders/OrderDetailModal'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import { useDeleteOrder } from '@/hooks/useDeleteOrder'

function AdminDashboardPage() {
  const { orders, reload } = useAdminOrders()
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleDeleteSuccess = (orderId) => {
    if (selectedOrder?._id === orderId) {
      setSelectedOrder(null)
    }
    reload()
  }

  const { handleDeleteOrder } = useDeleteOrder({
    onSuccess: handleDeleteSuccess,
  })

  return (
    <>
      <AdminPageHead title="대시보드" description="MKJ FASHION 운영 현황을 한눈에 확인하세요." />
      <KpiCards />
      <DashboardCharts />
      <RecentOrdersTable
        orders={orders}
        onViewDetail={setSelectedOrder}
        onDelete={handleDeleteOrder}
      />
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdated={() => reload()}
        onDeleted={handleDeleteSuccess}
      />
    </>
  )
}

export default AdminDashboardPage
