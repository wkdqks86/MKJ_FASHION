import { useCallback, useEffect, useState } from 'react'
import { AUTH_CHANGE_EVENT, fetchCurrentUser } from '@/utils/authSession'

export function useAuthSession() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    const currentUser = await fetchCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
    return currentUser
  }, [])

  useEffect(() => {
    refreshUser()
    window.addEventListener(AUTH_CHANGE_EVENT, refreshUser)
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, refreshUser)
  }, [refreshUser])

  return { user, isLoading, refreshUser }
}
