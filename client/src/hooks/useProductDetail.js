import { useEffect, useState } from 'react'
import { getProductById } from '@/api/products'

export function useProductDetail(productId) {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!productId) {
      setProduct(null)
      setError('상품을 찾을 수 없습니다.')
      setIsLoading(false)
      return undefined
    }

    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await getProductById(productId)
        if (!cancelled) setProduct(data.product)
      } catch (err) {
        if (!cancelled) {
          setProduct(null)
          setError(err.response?.data?.message || '상품 정보를 불러오지 못했습니다.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [productId])

  return { product, isLoading, error }
}
