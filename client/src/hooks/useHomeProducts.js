import { useEffect, useState } from 'react'
import { getProducts } from '@/api/products'

export function useHomeProducts() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadProducts = async () => {
      setIsLoading(true)
      setError('')

      try {
        const data = await getProducts({ isDisplayed: true })
        if (!cancelled) {
          setProducts(data.products || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || '상품을 불러오지 못했습니다.')
          setProducts([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [])

  return { products, isLoading, error }
}
