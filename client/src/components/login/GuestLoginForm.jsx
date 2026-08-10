function GuestLoginForm({ form, error, successMessage, isSubmitting, onChange, onSubmit }) {
  return (
    <form className="login-form" onSubmit={onSubmit} noValidate>
      <p className="login-form__guest-desc">
        비회원 주문 조회를 위해 주문자명과 주문번호를 입력해 주세요.
      </p>

      <div className="login-form__field">
        <input
          type="text"
          placeholder="주문자명"
          value={form.name}
          onChange={onChange('name')}
        />
      </div>

      <div className="login-form__field">
        <input
          type="text"
          placeholder="주문번호"
          value={form.orderNumber}
          onChange={onChange('orderNumber')}
        />
      </div>

      {successMessage && (
        <p className="login-form__success" role="status">{successMessage}</p>
      )}
      {error && <p className="login-form__error" role="alert">{error}</p>}

      <button type="submit" className="login-form__submit" disabled={isSubmitting}>
        {isSubmitting ? '조회 중...' : '주문 조회'}
      </button>
    </form>
  )
}

export default GuestLoginForm
