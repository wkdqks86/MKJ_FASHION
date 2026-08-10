import { getMe } from '@/api/auth'
import { getAccessToken } from '@/utils/authStorage'

export async function fetchCurrentUser() {
  if (!getAccessToken()) {
    return null
  }

  try {
    const data = await getMe()
    if (data.success && data.user) {
      return data.user
    }
  } catch {
    // 401은 apiClient 인터셉터에서 refresh 시도 후 실패 시 forceLogout 처리
    return null
  }

  return null
}

export { AUTH_CHANGE_EVENT } from '@/utils/authStorage'
