import apiClient from './client'

export const getMyCart = async () => {
  const { data } = await apiClient.get('/carts')
  return data
}

export const addCartItem = async ({ productId, quantity, size }) => {
  const { data } = await apiClient.post('/carts/items', {
    productId,
    quantity,
    size,
  })
  return data
}

export const updateCartItem = async (itemId, quantity) => {
  const { data } = await apiClient.patch(`/carts/items/${itemId}`, { quantity })
  return data
}

export const removeCartItem = async (itemId) => {
  const { data } = await apiClient.delete(`/carts/items/${itemId}`)
  return data
}

export const clearCart = async () => {
  const { data } = await apiClient.delete('/carts')
  return data
}
