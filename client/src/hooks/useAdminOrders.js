import { useCallback, useEffect, useState } from 'react'
import { getOrders } from '@/api/orders'
import { MOCK_ORDERS } from '@/constants/adminData'
import { formatShippingAddress, getOrdererName } from '@/utils/orderDisplay'

export function useAdminOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [isLoading, setIsLoading] = useState(true)

  const loadOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getOrders()
      if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
        setOrders(data.orders.map(normalizeOrder))
      }
    } catch {
      setOrders(MOCK_ORDERS)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  return { orders, isLoading, reload: loadOrders }
}

function normalizeOrder(order) {
  return {
    ...order,
    shippingAddressText: formatShippingAddress(order.shipping),
    ordererName: getOrdererName(order),
  }
}

export function filterOrders(orders, { statuses = [], keyword = '' } = {}) {
  let result = [...orders]

  if (statuses.length > 0) {
    result = result.filter((o) => statuses.includes(o.status))
  }

  if (keyword.trim()) {
    const q = keyword.trim().toLowerCase()
    result = result.filter(
      (o) =>
        o.orderNumber?.toLowerCase().includes(q) ||
        getOrdererName(o).toLowerCase().includes(q)
    )
  }

  return result
}
