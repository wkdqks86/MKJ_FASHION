import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addCartItem } from '@/api/carts'
import { notifyCartChange } from '@/hooks/useCart'
import { saveCheckoutItemIds } from '@/utils/checkoutSession'
import { getAccessToken } from '@/utils/authStorage'

export function useBuyNow() {
  const navigate = useNavigate()
  const [isBuying, setIsBuying] = useState(false)
  const [error, setError] = useState('')

  const buyNow = async ({ productId, quantity, size, loginRedirectPath }) => {
    if (!getAccessToken()) {
      const redirect = loginRedirectPath || `/products/${productId}`
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`)
      return false
    }

    setIsBuying(true)
    setError('')

    try {
      const data = await addCartItem({ productId, quantity, size })
      notifyCartChange()

      const cartItem = data.cart?.items?.find(
        (item) =>
          item.product?._id === productId &&
          (item.size?.trim() || '') === (size?.trim() || ''),
      )

      if (!cartItem) {
        setError('주문 정보를 준비하지 못했습니다.')
        return false
      }

      saveCheckoutItemIds([cartItem._id])
      navigate('/checkout')
      return true
    } catch (err) {
      setError(err.response?.data?.message || '바로구매를 진행하지 못했습니다.')
      return false
    } finally {
      setIsBuying(false)
    }
  }

  return { buyNow, isBuying, error, clearError: () => setError('') }
}
