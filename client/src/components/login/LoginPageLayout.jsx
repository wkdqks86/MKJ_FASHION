import { useSearchParams } from 'react-router-dom'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'
import LoginPanel from '@/components/login/LoginPanel'

function LoginPageLayout() {
  const [searchParams] = useSearchParams()
  const sessionExpired = searchParams.get('session') === 'expired'

  return (
    <div className="login-page">
      <PageBreadcrumb
        className="login-page__breadcrumb"
        items={[
          { label: 'HOME', to: '/' },
          { label: '로그인' },
        ]}
      />
      <h1 className="login-page__title">로그인</h1>
      {sessionExpired && (
        <p className="login-page__notice" role="alert">
          로그인 세션이 만료되었습니다. 다시 로그인해 주세요.
        </p>
      )}
      <LoginPanel />
    </div>
  )
}

export default LoginPageLayout
