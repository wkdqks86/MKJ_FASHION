import { useState } from 'react'
import { LOGIN_TABS } from '@/constants/login'
import { useGuestLogin } from '@/hooks/useGuestLogin'
import { useMemberLogin } from '@/hooks/useMemberLogin'
import GuestLoginForm from './GuestLoginForm'
import LoginTabs from './LoginTabs'
import MemberLoginForm from './MemberLoginForm'

function LoginPanel() {
  const [activeTab, setActiveTab] = useState(LOGIN_TABS.MEMBER)
  const memberLogin = useMemberLogin()
  const guestLogin = useGuestLogin()

  const switchTab = (tab) => {
    setActiveTab(tab)
    memberLogin.clearMessages()
    guestLogin.clearMessages()
  }

  const isMemberTab = activeTab === LOGIN_TABS.MEMBER

  return (
    <div className="login-box">
      <LoginTabs activeTab={activeTab} onTabChange={switchTab} />

      {isMemberTab ? (
        <MemberLoginForm
          form={memberLogin.form}
          showPassword={memberLogin.showPassword}
          error={memberLogin.error}
          successMessage={memberLogin.successMessage}
          isSubmitting={memberLogin.isSubmitting}
          onChange={memberLogin.handleChange}
          onTogglePassword={memberLogin.togglePassword}
          onSubmit={memberLogin.handleSubmit}
        />
      ) : (
        <GuestLoginForm
          form={guestLogin.form}
          error={guestLogin.error}
          successMessage={guestLogin.successMessage}
          isSubmitting={guestLogin.isSubmitting}
          onChange={guestLogin.handleChange}
          onSubmit={guestLogin.handleSubmit}
        />
      )}
    </div>
  )
}

export default LoginPanel
