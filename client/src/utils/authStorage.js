const ACCESS_TOKEN_KEY = 'mkj_access_token'
const REFRESH_TOKEN_KEY = 'mkj_refresh_token'
const USER_KEY = 'mkj_user'
const SAVED_EMAIL_KEY = 'mkj_saved_email'
const GUEST_KEY = 'mkj_guest'
const AUTH_CHANGE_EVENT = 'mkj-auth-change'

const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export const saveAuth = ({ accessToken, refreshToken, user }) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  notifyAuthChange()
}

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  notifyAuthChange()
}

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)
export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export const saveEmail = (email) => {
  localStorage.setItem(SAVED_EMAIL_KEY, email)
}

export const getSavedEmail = () => localStorage.getItem(SAVED_EMAIL_KEY)

export const clearSavedEmail = () => {
  localStorage.removeItem(SAVED_EMAIL_KEY)
}

export const saveGuestSession = (guest) => {
  sessionStorage.setItem(GUEST_KEY, JSON.stringify(guest))
  notifyAuthChange()
}

export const getGuestSession = () => {
  const guest = sessionStorage.getItem(GUEST_KEY)
  return guest ? JSON.parse(guest) : null
}

export const clearGuestSession = () => {
  sessionStorage.removeItem(GUEST_KEY)
  notifyAuthChange()
}

export { AUTH_CHANGE_EVENT }
