import AgreementItem from './AgreementItem'

function SignUpAgreements({ agreements, onAgreementChange }) {
  return (
    <div className="signup__agreements">
      <label className="signup__agree-all">
        <input
          type="checkbox"
          checked={agreements.all}
          onChange={onAgreementChange('all')}
        />
        <span>전체 동의</span>
      </label>

      <div className="signup__agree-grid">
        <AgreementItem id="terms" label="이용약관 동의" required checked={agreements.terms} onChange={onAgreementChange('terms')} />
        <AgreementItem id="privacy" label="개인정보 수집 및 이용 동의" required checked={agreements.privacy} onChange={onAgreementChange('privacy')} />
        <AgreementItem id="marketing" label="마케팅 정보 수신 동의" checked={agreements.marketing} onChange={onAgreementChange('marketing')} />
        <AgreementItem id="event" label="이벤트, 쿠폰 알림 수신" checked={agreements.event} onChange={onAgreementChange('event')} />
      </div>
    </div>
  )
}

export default SignUpAgreements
