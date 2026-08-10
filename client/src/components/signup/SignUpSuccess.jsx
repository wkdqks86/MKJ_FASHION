import { Link } from 'react-router-dom'

function SignUpSuccess() {
  return (
    <div className="signup">
      <div className="signup__header-text">
        <h1 className="signup__title">회원가입</h1>
        <p className="signup__subtitle">럭셔리 라이프스타일, MKJ FASHION과 함께하세요.</p>
      </div>
      <div className="signup__card signup__card--success">
        <p className="signup__success-msg">회원가입이 완료되었습니다!</p>
        <p className="signup__success-sub">잠시 후 메인 페이지로 이동합니다.</p>
        <Link to="/" className="signup__home-link">메인으로 바로가기</Link>
      </div>
    </div>
  )
}

export default SignUpSuccess
