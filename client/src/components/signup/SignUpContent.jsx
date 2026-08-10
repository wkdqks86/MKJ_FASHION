import SignUpForm from './SignUpForm'
import SignUpHeader from './SignUpHeader'
import SignUpSuccess from './SignUpSuccess'

function SignUpContent({
  form,
  agreements,
  error,
  isSubmitting,
  success,
  onChange,
  onAgreementChange,
  onSubmit,
}) {
  if (success) {
    return <SignUpSuccess />
  }

  return (
    <div className="signup">
      <SignUpHeader />
      <SignUpForm
        form={form}
        agreements={agreements}
        error={error}
        isSubmitting={isSubmitting}
        onChange={onChange}
        onAgreementChange={onAgreementChange}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default SignUpContent
