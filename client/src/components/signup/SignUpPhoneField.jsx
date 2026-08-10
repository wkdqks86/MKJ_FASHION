import { PHONE_PREFIXES } from '@/constants/signUp'

function SignUpPhoneField({ form, onChange }) {
  return (
    <div className="signup__field">
      <label>휴대폰 번호</label>
      <div className="signup__phone">
        <select
          value={form.phonePrefix}
          onChange={onChange('phonePrefix')}
          aria-label="휴대폰 앞자리"
        >
          {PHONE_PREFIXES.map((prefix) => (
            <option key={prefix} value={prefix}>{prefix}</option>
          ))}
        </select>
        <span className="signup__dash">-</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={form.phoneMiddle}
          onChange={onChange('phoneMiddle')}
          aria-label="휴대폰 중간자리"
        />
        <span className="signup__dash">-</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={form.phoneLast}
          onChange={onChange('phoneLast')}
          aria-label="휴대폰 끝자리"
        />
        <button type="button" className="signup__verify-btn signup__verify-btn--accent">
          인증번호 발송
        </button>
      </div>
    </div>
  )
}

export default SignUpPhoneField
