import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchCurrentUser } from '@/utils/authSession'

export function useRequireAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      const currentUser = await fetchCurrentUser()

      if (!currentUser) {
        const redirect = encodeURIComponent(location.pathname + location.search)
        navigate(`/login?redirect=${redirect}`, { replace: true })
        return
      }

      setUser(currentUser)
      setIsCheckingAuth(false)
    }

    verifyAuth()
  }, [location.pathname, location.search, navigate])

  return { user, isCheckingAuth }
}
