import apiClient from './client'

export const getMyWishlist = async () => {
  const { data } = await apiClient.get('/wishlists')
  return data
}

export const addWishlistItem = async (productId) => {
  const { data } = await apiClient.post('/wishlists/items', { productId })
  return data
}

export const removeWishlistItem = async (productId) => {
  const { data } = await apiClient.delete(`/wishlists/items/${productId}`)
  return data
}
