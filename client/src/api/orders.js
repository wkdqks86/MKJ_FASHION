import apiClient from './client'

export const lookupGuestOrder = async ({ name, orderNumber }) => {
  const { data } = await apiClient.post('/orders/guest-lookup', { name, orderNumber })
  return data
}

export const createOrder = async (orderData) => {
  const { data } = await apiClient.post('/orders', orderData)
  return data
}

export const getMyOrders = async () => {
  const { data } = await apiClient.get('/orders/mine')
  return data
}

export const getOrders = async () => {
  const { data } = await apiClient.get('/orders')
  return data
}

export const getOrderById = async (id) => {
  const { data } = await apiClient.get(`/orders/${id}`)
  return data
}

export const updateOrder = async (id, orderData) => {
  const { data } = await apiClient.patch(`/orders/${id}`, orderData)
  return data
}

export const deleteOrder = async (id) => {
  const { data } = await apiClient.delete(`/orders/${id}`)
  return data
}
