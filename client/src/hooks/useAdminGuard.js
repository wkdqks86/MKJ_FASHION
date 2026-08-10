import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCurrentUser } from '@/utils/authSession'

export function useAdminGuard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAdmin = async () => {
      const currentUser = await fetchCurrentUser()

      if (!currentUser) {
        navigate('/login', { replace: true })
        return
      }

      if (currentUser.user_type !== 'admin') {
        navigate('/', { replace: true })
        return
      }

      setUser(currentUser)
      setIsLoading(false)
    }

    verifyAdmin()
  }, [navigate])

  return { user, isLoading }
}
