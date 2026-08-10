import { Link } from 'react-router-dom'

function SignUpBasicFields({ form, onChange }) {
  return (
    <>
      <div className="signup__field">
        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          placeholder="성함을 입력해 주세요"
          value={form.name}
          onChange={onChange('name')}
        />
      </div>

      <div className="signup__field">
        <label htmlFor="email">이메일 주소</label>
        <div className="signup__inline">
          <input
            id="email"
            type="email"
            placeholder="example@domain.com"
            value={form.email}
            onChange={onChange('email')}
          />
          <button type="button" className="signup__verify-btn signup__verify-btn--dark">
            인증하기
          </button>
        </div>
      </div>
    </>
  )
}

export default SignUpBasicFields
