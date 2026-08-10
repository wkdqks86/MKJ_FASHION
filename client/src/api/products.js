import apiClient from './client'

export const getProducts = async (params = {}) => {
  const { data } = await apiClient.get('/products', { params })
  return data
}

export const getProductById = async (id) => {
  const { data } = await apiClient.get(`/products/${id}`)
  return data
}

export const previewProductSku = async ({ gender, categoryType }) => {
  const { data } = await apiClient.get('/products/sku-preview', {
    params: { gender, categoryType },
  })
  return data
}

export const createProduct = async (productData) => {
  const { data } = await apiClient.post('/products', productData)
  return data
}

export const updateProduct = async (id, productData) => {
  const { data } = await apiClient.patch(`/products/${id}`, productData)
  return data
}

export const deleteProduct = async (id) => {
  const { data } = await apiClient.delete(`/products/${id}`)
  return data
}

export const bulkApplySalePrice = async ({ productIds, discountPercent }) => {
  const { data } = await apiClient.patch('/products/bulk-sale-price', {
    productIds,
    discountPercent,
  })
  return data
}

export const bulkClearSalePrice = async ({ productIds }) => {
  const { data } = await apiClient.patch('/products/bulk-clear-sale-price', {
    productIds,
  })
  return data
}
