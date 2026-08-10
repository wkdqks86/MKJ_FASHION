import SignUpAgreements from './SignUpAgreements'
import SignUpBasicFields from './SignUpBasicFields'
import SignUpPasswordFields from './SignUpPasswordFields'
import SignUpPhoneField from './SignUpPhoneField'
import SignUpSnsButtons from './SignUpSnsButtons'

function SignUpForm({
  form,
  agreements,
  error,
  isSubmitting,
  onChange,
  onAgreementChange,
  onSubmit,
}) {
  return (
    <form className="signup__card" onSubmit={onSubmit} noValidate>
      <SignUpBasicFields form={form} onChange={onChange} />
      <SignUpPasswordFields form={form} onChange={onChange} />
      <SignUpPhoneField form={form} onChange={onChange} />
      <SignUpAgreements agreements={agreements} onAgreementChange={onAgreementChange} />

      {error && <p className="signup__error" role="alert">{error}</p>}

      <button type="submit" className="signup__submit" disabled={isSubmitting}>
        {isSubmitting ? '저장 중...' : '회원가입하기'}
      </button>

      <SignUpSnsButtons />
    </form>
  )
}

export default SignUpForm
