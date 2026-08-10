import { BellIcon } from '@/components/admin/common/AdminIcons'

function AdminTopBar({ userName }) {
  const initial = userName?.charAt(0)?.toUpperCase() || 'A'

  return (
    <header className="admin-topbar">
      <p className="admin-topbar__greeting">안녕하세요, {userName || '관리자'}님!</p>

      <div className="admin-topbar__actions">
        <button type="button" className="admin-topbar__icon-btn" aria-label="알림">
          <BellIcon />
          <span className="admin-topbar__badge" />
        </button>
        <div className="admin-topbar__profile">
          <div className="admin-topbar__avatar">{initial}</div>
          <span>{userName || 'Admin'}</span>
        </div>
      </div>
    </header>
  )
}

export default AdminTopBar
