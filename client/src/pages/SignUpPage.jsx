import SignUpContent from '@/components/signup/SignUpContent'
import { useSignUpForm } from '@/hooks/useSignUpForm'
import './SignUpPage.css'

function SignUpPage() {
  const signUp = useSignUpForm()

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
