function SignUpPasswordFields({ form, onChange }) {
  return (
    <div className="signup__row">
      <div className="signup__field">
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          placeholder="영문, 숫자, 특수문자 조합 8~16자"
          value={form.password}
          onChange={onChange('password')}
        />
      </div>
      <div className="signup__field">
        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="비밀번호를 다시 입력해 주세요"
          value={form.confirmPassword}
          onChange={onChange('confirmPassword')}
        />
      </div>
    </div>
  )
}

export default SignUpPasswordFields
