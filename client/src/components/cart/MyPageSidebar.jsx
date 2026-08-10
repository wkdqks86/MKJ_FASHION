import { NavLink } from 'react-router-dom'

const MENU_ITEMS = [
  { label: '장바구니', to: '/cart' },
  { label: '위시리스트', to: '/wishlist' },
  { label: '내 주문목록', to: '/orders' },
]

function MyPageSidebar() {
  return (
    <aside className="my-page-sidebar">
      <h2 className="my-page-sidebar__title">MY PAGE</h2>
      <nav className="my-page-sidebar__nav" aria-label="마이페이지 메뉴">
        {MENU_ITEMS.map((item) =>
          item.disabled ? (
            <span key={item.label} className="my-page-sidebar__link my-page-sidebar__link--disabled">
              {item.label}
            </span>
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `my-page-sidebar__link${isActive ? ' my-page-sidebar__link--active' : ''}`
              }
              end
            >
              {item.label}
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  )
}

export default MyPageSidebar
