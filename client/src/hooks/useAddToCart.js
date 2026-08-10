import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addCartItem } from '@/api/carts'
import { notifyCartChange } from '@/hooks/useCart'
import { getAccessToken } from '@/utils/authStorage'

export function useAddToCart() {
  const navigate = useNavigate()
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const addToCart = async ({ productId, quantity, size, loginRedirectPath }) => {
    if (!getAccessToken()) {
      const redirect = loginRedirectPath || `/products/${productId}`
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`)
      return false
    }

    setIsAdding(true)
    setMessage('')
    setError('')

    try {
      await addCartItem({ productId, quantity, size })
      notifyCartChange()
      setMessage('장바구니에 담았습니다.')
      return true
    } catch (err) {
      setError(err.response?.data?.message || '장바구니 담기에 실패했습니다.')
      return false
    } finally {
      setIsAdding(false)
    }
  }

  return { addToCart, isAdding, message, error }
}
