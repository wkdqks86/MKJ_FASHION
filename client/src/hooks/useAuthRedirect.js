import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCurrentUser } from '@/utils/authSession'

export function useAuthRedirect(redirectPath = '/') {
  const navigate = useNavigate()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      const user = await fetchCurrentUser()
      if (user) {
        navigate(redirectPath, { replace: true })
        return
      }
      setIsCheckingAuth(false)
    }

    redirectIfAuthenticated()
  }, [navigate, redirectPath])

  return { isCheckingAuth }
}
