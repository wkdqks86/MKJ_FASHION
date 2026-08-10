import { useCallback, useState } from 'react'
import { deleteOrder } from '@/api/orders'
import { getOrdererName } from '@/utils/orderDisplay'

export function useDeleteOrder({ onSuccess } = {}) {
  const [deletingOrderId, setDeletingOrderId] = useState(null)

  const handleDeleteOrder = useCallback(async (order) => {
    if (order._id?.startsWith('mock-')) {
      window.alert('샘플 데이터는 삭제할 수 없습니다.')
      return false
    }

    const confirmed = window.confirm(
      `주문 ${order.orderNumber} (${getOrdererName(order)})을(를) 삭제하시겠습니까?\n삭제된 주문은 복구할 수 없습니다.`,
    )

    if (!confirmed) return false

    setDeletingOrderId(order._id)

    try {
      const data = await deleteOrder(order._id)

      if (data.success) {
        onSuccess?.(order._id)
        return true
      }

      window.alert('주문을 삭제하지 못했습니다.')
      return false
    } catch (err) {
      window.alert(err.response?.data?.message || '주문을 삭제하지 못했습니다.')
      return false
    } finally {
      setDeletingOrderId(null)
    }
  }, [onSuccess])

  return { handleDeleteOrder, deletingOrderId }
}
