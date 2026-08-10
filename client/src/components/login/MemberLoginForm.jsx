import { Link } from 'react-router-dom'

function MemberLoginForm({
  form,
  showPassword,
  error,
  successMessage,
  isSubmitting,
  onChange,
  onTogglePassword,
  onSubmit,
}) {
  return (
    <form className="login-form" onSubmit={onSubmit} noValidate>
      <div className="login-form__field">
        <input
          type="email"
          placeholder="이메일"
          value={form.email}
          onChange={onChange('email')}
          autoComplete="email"
        />
      </div>

      <div className="login-form__field login-form__field--password">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호"
          value={form.password}
          onChange={onChange('password')}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="login-form__toggle-password"
          onClick={onTogglePassword}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {showPassword ? '🙈' : '👁'}
        </button>
      </div>

      <div className="login-form__options">
        <label className="login-form__checkbox">
          <input
            type="checkbox"
            checked={form.saveEmail}
            onChange={onChange('saveEmail')}
          />
          <span>아이디 저장</span>
        </label>
        <div className="login-form__links">
          <button type="button" className="login-form__text-link">아이디 찾기</button>
          <span>|</span>
          <button type="button" className="login-form__text-link">비밀번호 찾기</button>
        </div>
      </div>

      {successMessage && (
        <p className="login-form__success" role="status">{successMessage}</p>
      )}
      {error && <p className="login-form__error" role="alert">{error}</p>}

      <button type="submit" className="login-form__submit" disabled={isSubmitting}>
        {isSubmitting ? '로그인 중...' : '로그인'}
      </button>

      <button type="button" className="login-form__kakao">
        <span className="login-form__kakao-icon">💬</span>
        카카오 간편로그인
      </button>

      <p className="login-form__signup">
        아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
      </p>
    </form>
  )
}

export default MemberLoginForm
