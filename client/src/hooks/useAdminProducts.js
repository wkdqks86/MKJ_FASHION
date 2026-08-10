import { useCallback, useEffect, useState } from 'react'
import {
  bulkApplySalePrice,
  bulkClearSalePrice,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '@/api/products'
import { parseStockBySizeForm } from '@/utils/productStock'

export function useAdminProducts() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getProducts()
      setProducts(data.products || [])
    } catch (err) {
      setError(err.response?.data?.message || '상품 목록을 불러오지 못했습니다.')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const toggleDisplayed = async (id, isDisplayed) => {
    try {
      const data = await updateProduct(id, { isDisplayed: !isDisplayed })
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? data.product : p))
      )
    } catch (err) {
      throw new Error(err.response?.data?.message || '진열 상태 변경에 실패했습니다.')
    }
  }

  const removeProduct = async (id) => {
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      throw new Error(err.response?.data?.message || '상품 삭제에 실패했습니다.')
    }
  }

  const applyBulkDiscount = async (productIds, discountPercent) => {
    try {
      const data = await bulkApplySalePrice({ productIds, discountPercent })
      const updatedMap = new Map(data.products.map((p) => [p._id, p]))
      setProducts((prev) =>
        prev.map((p) => updatedMap.get(p._id) || p)
      )
      return data
    } catch (err) {
      throw new Error(err.response?.data?.message || '판매가 일괄 적용에 실패했습니다.')
    }
  }

  const clearBulkDiscount = async (productIds) => {
    try {
      const data = await bulkClearSalePrice({ productIds })
      const updatedMap = new Map(data.products.map((p) => [p._id, p]))
      setProducts((prev) =>
        prev.map((p) => updatedMap.get(p._id) || p)
      )
      return data
    } catch (err) {
      throw new Error(err.response?.data?.message || '할인 제거에 실패했습니다.')
    }
  }

  return {
    products,
    isLoading,
    error,
    reload: loadProducts,
    toggleDisplayed,
    removeProduct,
    applyBulkDiscount,
    clearBulkDiscount,
  }
}

export function useProductRegister() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const registerProduct = async (formData) => {
    setIsSubmitting(true)
    setError('')
    try {
      const payload = {
        name: formData.name.trim(),
        listPrice: Number(formData.listPrice),
        gender: formData.gender,
        categoryType: formData.categoryType,
        image: formData.image.trim(),
        description: formData.description?.trim() || '',
        stockBySize: parseStockBySizeForm(formData.stockBySize, formData.gender, formData.categoryType),
      }
      const data = await createProduct(payload)
      return data.product
    } catch (err) {
      const message = err.response?.data?.message || '상품 등록에 실패했습니다.'
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { registerProduct, isSubmitting, error, setError }
}

export function useProductEdit(productId) {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadProduct = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await getProductById(productId)
        if (!cancelled) {
          setProduct(data.product)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || '상품 정보를 불러오지 못했습니다.')
          setProduct(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    if (productId) {
      loadProduct()
    } else {
      setProduct(null)
      setIsLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [productId])

  const updateProductData = async (formData) => {
    setIsSubmitting(true)
    setError('')
    try {
      const payload = {
        name: formData.name.trim(),
        listPrice: Number(formData.listPrice),
        gender: formData.gender,
        categoryType: formData.categoryType,
        image: formData.image.trim(),
        description: formData.description?.trim() || '',
        stockBySize: parseStockBySizeForm(formData.stockBySize, formData.gender, formData.categoryType),
      }
      const data = await updateProduct(productId, payload)
      setProduct(data.product)
      return data.product
    } catch (err) {
      const message = err.response?.data?.message || '상품 수정에 실패했습니다.'
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { product, isLoading, isSubmitting, error, setError, updateProductData }
}
