import apiClient from './client'

export const checkServerHealth = async () => {
  const { data } = await apiClient.get('/health')
  return data
}
