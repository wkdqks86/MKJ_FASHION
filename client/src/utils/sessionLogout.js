import { clearAuth } from '@/utils/authStorage'

export function forceLogout() {
  clearAuth()

  const isLoginPage = window.location.pathname === '/login'
  if (!isLoginPage) {
    window.location.replace('/login?session=expired')
  }
}
