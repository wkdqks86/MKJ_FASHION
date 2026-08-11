import SignUpContent from '@/components/signup/SignUpContent'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { useSignUpForm } from '@/hooks/useSignUpForm'
import './SignUpPage.css'

function SignUpPage() {
  const { isCheckingAuth } = useAuthRedirect('/')
  const signUp = useSignUpForm()

  if (isCheckingAuth) {
    return null
  }

  return (
    <SignUpContent
      form={signUp.form}
      agreements={signUp.agreements}
      error={signUp.error}
      isSubmitting={signUp.isSubmitting}
      success={signUp.success}
      onChange={signUp.handleChange}
      onAgreementChange={signUp.handleAgreementChange}
      onSubmit={signUp.handleSubmit}
    />
  )
}

export default SignUpPage
