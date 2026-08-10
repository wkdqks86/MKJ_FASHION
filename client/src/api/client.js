import axios from 'axios'
import { getAccessToken, getRefreshToken, saveAuth } from '@/utils/authStorage'
import { forceLogout } from '@/utils/sessionLogout'

const baseURL = import.meta.env.VITE_API_URL || '/api'

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const refreshClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshWaitQueue = []

function enqueueRefreshWait(callback) {
  refreshWaitQueue.push(callback)
}

function resolveRefreshWait(newAccessToken) {
  refreshWaitQueue.forEach((callback) => callback(newAccessToken))
  refreshWaitQueue = []
}

function isAuthEndpoint(url = '') {
  return url.includes('/auth/login') || url.includes('/auth/refresh')
}

async function refreshTokens() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  const { data } = await refreshClient.post('/auth/refresh', { refreshToken })

  if (!data?.success || !data.accessToken) {
    throw new Error('Refresh failed')
  }

  saveAuth({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
  })

  return data.accessToken
}

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error)
    }

    if (!getRefreshToken()) {
      forceLogout()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        enqueueRefreshWait((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          originalRequest._retry = true
          resolve(apiClient(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const newAccessToken = await refreshTokens()
      resolveRefreshWait(newAccessToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return apiClient(originalRequest)
    } catch {
      refreshWaitQueue = []
      forceLogout()
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)

export default apiClient
