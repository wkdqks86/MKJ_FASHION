import { LOGIN_TABS } from '@/constants/login'

function LoginTabs({ activeTab, onTabChange }) {
  return (
    <div className="login-box__tabs" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === LOGIN_TABS.MEMBER}
        className={`login-box__tab ${activeTab === LOGIN_TABS.MEMBER ? 'login-box__tab--active' : ''}`}
        onClick={() => onTabChange(LOGIN_TABS.MEMBER)}
      >
        MKJ FASHION 회원
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === LOGIN_TABS.GUEST}
        className={`login-box__tab ${activeTab === LOGIN_TABS.GUEST ? 'login-box__tab--active' : ''}`}
        onClick={() => onTabChange(LOGIN_TABS.GUEST)}
      >
        비회원
      </button>
    </div>
  )
}

export default LoginTabs
