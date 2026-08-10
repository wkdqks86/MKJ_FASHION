import { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AdminSearchField from '@/components/admin/common/AdminSearchField'

const MENU_ITEMS = [
  { to: '/admin/dashboard', label: '대시보드', icon: '▦' },
  { to: '/admin/orders', label: '주문 관리', icon: '📋' },
  { to: '/admin/products', label: '상품 관리', icon: '📦' },
  { to: '/admin/style-edits', label: 'THE EDIT', icon: '✦' },
  { to: '/admin/members', label: '회원 관리', icon: '👤' },
]

function AdminSidebar() {
  const [searchInput, setSearchInput] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')

  const visibleMenuItems = useMemo(() => {
    const query = appliedQuery.trim().toLowerCase()
    if (!query) return MENU_ITEMS

    return MENU_ITEMS.filter((item) => item.label.toLowerCase().includes(query))
  }, [appliedQuery])

  const handleSearch = () => {
    setAppliedQuery(searchInput.trim())
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo">MKJ</div>
        <div>
          <div className="admin-sidebar__title">MKJ FASHION</div>
          <div className="admin-sidebar__subtitle">ADMIN</div>
        </div>
      </div>

      <div className="admin-sidebar__search">
        <AdminSearchField
          variant="sidebar"
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          placeholder="관리자 메뉴 검색..."
          ariaLabel="관리자 전체 검색"
        />
      </div>

      <nav className="admin-sidebar__nav" aria-label="관리자 메뉴">
        {visibleMenuItems.length === 0 ? (
          <p className="admin-sidebar__search-empty">검색 결과가 없습니다.</p>
        ) : (
          visibleMenuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`
              }
            >
              <span className="admin-sidebar__icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))
        )}
      </nav>

      <div className="admin-sidebar__footer">
        <Link to="/" className="admin-sidebar__store-link">← 쇼핑몰로 돌아가기</Link>
      </div>
    </aside>
  )
}

export default AdminSidebar
