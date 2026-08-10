import { useCallback, useEffect, useState } from 'react'
import { getMyOrders } from '@/api/orders'

export function useMyOrders({ enabled = true } = {}) {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadOrders = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const data = await getMyOrders()

      if (data.success) {
        setOrders(Array.isArray(data.orders) ? data.orders : [])
        return
      }

      setError('주문 목록을 불러오지 못했습니다.')
    } catch (err) {
      setError(err.response?.data?.message || '주문 목록을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    loadOrders()
  }, [enabled, loadOrders])

  return {
    orders,
    isLoading,
    error,
    reload: loadOrders,
  }
}
