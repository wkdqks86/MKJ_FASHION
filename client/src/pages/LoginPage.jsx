import LoginPageLayout from '@/components/login/LoginPageLayout'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import './LoginPage.css'

function LoginPage() {
  const { isCheckingAuth } = useAuthRedirect()

  if (isCheckingAuth) {
    return null
  }

  return <LoginPageLayout />
}

export default LoginPage
