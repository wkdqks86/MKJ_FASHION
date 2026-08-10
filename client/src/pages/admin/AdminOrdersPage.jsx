import { useMemo, useState } from 'react'
import AdminPageHead from '@/components/admin/common/AdminPageHead'
import OrderDetailModal from '@/components/admin/orders/OrderDetailModal'
import OrderListTable from '@/components/admin/orders/OrderListTable'
import OrderSearchFilter from '@/components/admin/orders/OrderSearchFilter'
import { filterOrders, useAdminOrders } from '@/hooks/useAdminOrders'
import { useDeleteOrder } from '@/hooks/useDeleteOrder'

function AdminOrdersPage() {
  const { orders, reload } = useAdminOrders()
  const [filters, setFilters] = useState({ statuses: [], keyword: '' })
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleDeleteSuccess = (orderId) => {
    if (selectedOrder?._id === orderId) {
      setSelectedOrder(null)
    }
    reload()
  }

  const { handleDeleteOrder, deletingOrderId } = useDeleteOrder({
    onSuccess: handleDeleteSuccess,
  })

  const filteredOrders = useMemo(
    () => filterOrders(orders, filters),
    [orders, filters]
  )

  return (
    <>
      <AdminPageHead title="주문 관리" description="주문 검색, 상태 확인 및 배송 관리" />
      <OrderSearchFilter
        onSearch={setFilters}
        onReset={() => setFilters({ statuses: [], keyword: '' })}
      />
      <OrderListTable
        orders={filteredOrders}
        onViewDetail={setSelectedOrder}
        onDelete={handleDeleteOrder}
        deletingOrderId={deletingOrderId}
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

export default AdminOrdersPage
