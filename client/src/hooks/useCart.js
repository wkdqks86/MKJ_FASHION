import { useCallback, useEffect, useState } from 'react'
import {
  addCartItem as addCartItemApi,
  clearCart as clearCartApi,
  getMyCart,
  removeCartItem as removeCartItemApi,
  updateCartItem as updateCartItemApi,
} from '@/api/carts'

export const CART_CHANGE_EVENT = 'mkj-cart-change'

export const notifyCartChange = () => {
  window.dispatchEvent(new Event(CART_CHANGE_EVENT))
}

export function useCart({ enabled = true } = {}) {
  const [cart, setCart] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(enabled))
  const [error, setError] = useState('')
  const [updatingItemId, setUpdatingItemId] = useState(null)

  const loadCart = useCallback(async () => {
    if (!enabled) {
      setCart(null)
      setIsLoading(false)
      return null
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await getMyCart()
      setCart(data.cart ?? null)
      return data.cart ?? null
    } catch (err) {
      setCart(null)
      setError(err.response?.data?.message || '장바구니를 불러오지 못했습니다.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const applyCartResponse = (nextCart) => {
    setCart(nextCart)
    notifyCartChange()
    return nextCart
  }

  const updateItemQuantity = async (itemId, quantity) => {
    setUpdatingItemId(itemId)
    setError('')

    try {
      const data = await updateCartItemApi(itemId, quantity)
      return applyCartResponse(data.cart ?? null)
    } catch (err) {
      setError(err.response?.data?.message || '수량 변경에 실패했습니다.')
      throw err
    } finally {
      setUpdatingItemId(null)
    }
  }

  const removeItem = async (itemId) => {
    setUpdatingItemId(itemId)
    setError('')

    try {
      const data = await removeCartItemApi(itemId)
      return applyCartResponse(data.cart ?? null)
    } catch (err) {
      setError(err.response?.data?.message || '상품 삭제에 실패했습니다.')
      throw err
    } finally {
      setUpdatingItemId(null)
    }
  }

  const clearCart = async () => {
    setError('')

    try {
      const data = await clearCartApi()
      return applyCartResponse(data.cart ?? null)
    } catch (err) {
      setError(err.response?.data?.message || '장바구니 비우기에 실패했습니다.')
      throw err
    }
  }

  const addItem = async ({ productId, quantity, size }) => {
    setError('')

    try {
      const data = await addCartItemApi({ productId, quantity, size })
      return applyCartResponse(data.cart ?? null)
    } catch (err) {
      setError(err.response?.data?.message || '장바구니 담기에 실패했습니다.')
      throw err
    }
  }

  return {
    cart,
    isLoading,
    error,
    updatingItemId,
    loadCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
  }
}
