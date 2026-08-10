import apiClient from './client'

export const loginUser = async ({ email, password }) => {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

export const logoutUser = async (refreshToken) => {
  const { data } = await apiClient.post('/auth/logout', { refreshToken })
  return data
}

export const refreshAccessToken = async (refreshToken) => {
  const { data } = await apiClient.post('/auth/refresh', { refreshToken })
  return data
}

export const getMe = async () => {
  const { data } = await apiClient.get('/auth/me')
  return data
}
