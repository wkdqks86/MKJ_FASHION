import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '@/api/auth'
import { getMyCart } from '@/api/carts'
import { getMyWishlist } from '@/api/wishlists'
import { CART_CHANGE_EVENT } from '@/hooks/useCart'
import { WISHLIST_CHANGE_EVENT } from '@/contexts/WishlistContext'
import {
  AUTH_CHANGE_EVENT,
  clearAuth,
  clearGuestSession,
  getAccessToken,
  getGuestSession,
  getRefreshToken,
} from '@/utils/authStorage'
import { fetchCurrentUser } from '@/utils/authSession'
import './Header.css'

const NAV_ITEMS = [
  { label: 'NEW', to: '/products' },
  { label: 'DESIGNERS' },
  { label: 'MEN', to: '/products/men' },
  { label: 'WOMEN', to: '/products/women' },
  { label: 'LIFE' },
  { label: 'SALE', to: '/products/sale' },
]

function NavItem({ item, className = 'header__nav-link' }) {
  if (item.to) {
    return (
      <Link to={item.to} className={className}>
        {item.label}
      </Link>
    )
  }

  return (
    <span className={`${className} header__nav-link--disabled`}>
      {item.label}
    </span>
  )
}

function useMobileNavVisibleCount() {
  const [visibleCount, setVisibleCount] = useState(2)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 520px)')

    const update = () => {
      setVisibleCount(mediaQuery.matches ? 3 : 2)
    }

    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return visibleCount
}

function useIsMobileHeader() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)')

    const update = () => {
      setIsMobile(mediaQuery.matches)
    }

    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return isMobile
}

function Header() {
  const navigate = useNavigate()
  const searchInputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [guest, setGuest] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileNavIndex, setMobileNavIndex] = useState(0)
  const mobileNavVisibleCount = useMobileNavVisibleCount()
  const isMobileHeader = useIsMobileHeader()

  const maxMobileNavIndex = Math.max(0, NAV_ITEMS.length - mobileNavVisibleCount)

  const syncAuthState = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null)
      setGuest(getGuestSession())
      return
    }

    const currentUser = await fetchCurrentUser()
    setUser(currentUser)
    setGuest(getGuestSession())
  }, [])

  const syncCartCount = useCallback(async () => {
    if (!getAccessToken()) {
      setCartCount(0)
      return
    }

    try {
      const data = await getMyCart()
      setCartCount(data.cart?.itemCount ?? 0)
    } catch {
      setCartCount(0)
    }
  }, [])

  const syncWishlistCount = useCallback(async () => {
    if (!getAccessToken()) {
      setWishlistCount(0)
      return
    }

    try {
      const data = await getMyWishlist()
      setWishlistCount(data.wishlist?.itemCount ?? 0)
    } catch {
      setWishlistCount(0)
    }
  }, [])

  useEffect(() => {
    syncAuthState()
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuthState)
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, syncAuthState)
  }, [syncAuthState])

  useEffect(() => {
    syncCartCount()
    window.addEventListener(CART_CHANGE_EVENT, syncCartCount)
    return () => window.removeEventListener(CART_CHANGE_EVENT, syncCartCount)
  }, [syncCartCount, user])

  useEffect(() => {
    syncWishlistCount()
    window.addEventListener(WISHLIST_CHANGE_EVENT, syncWishlistCount)
    return () => window.removeEventListener(WISHLIST_CHANGE_EVENT, syncWishlistCount)
  }, [syncWishlistCount, user])

  useEffect(() => {
    setMobileNavIndex((current) => Math.min(current, maxMobileNavIndex))
  }, [maxMobileNavIndex])

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus()
    }
  }, [isSearchOpen])

  const handleLogout = async () => {
    const refreshToken = getRefreshToken()

    try {
      if (refreshToken) {
        await logoutUser(refreshToken)
      }
    } catch {
      // 로컬 세션은 항상 정리
    } finally {
      clearAuth()
      clearGuestSession()
      navigate('/')
    }
  }

  const toggleSearch = () => {
    setIsSearchOpen((open) => !open)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return

    setIsSearchOpen(false)
    navigate(`/products?q=${encodeURIComponent(query)}`)
  }

  const scrollMobileNav = (direction) => {
    setMobileNavIndex((current) => {
      if (direction === 'prev') {
        return Math.max(0, current - 1)
      }
      return Math.min(maxMobileNavIndex, current + 1)
    })
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          MKJ FASHION
        </Link>

        <nav className="header__nav" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <nav className="header__mobile-nav" aria-label="모바일 메뉴">
          <button
            type="button"
            className="header__nav-scroll"
            aria-label="이전 메뉴"
            onClick={() => scrollMobileNav('prev')}
            disabled={mobileNavIndex === 0}
          >
            ◁
          </button>

          <div className="header__mobile-nav-viewport">
            <div
              className="header__mobile-nav-track"
              style={{
                width: `${(NAV_ITEMS.length / mobileNavVisibleCount) * 100}%`,
                transform: `translateX(-${(mobileNavIndex / NAV_ITEMS.length) * 100}%)`,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  className="header__mobile-nav-link"
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="header__nav-scroll"
            aria-label="다음 메뉴"
            onClick={() => scrollMobileNav('next')}
            disabled={mobileNavIndex >= maxMobileNavIndex}
          >
            ▷
          </button>
        </nav>

        <div className="header__actions">
          <div className="header__icons">
            {isSearchOpen && !isMobileHeader && (
              <form
                className="header__search-form header__search-form--desktop"
                onSubmit={handleSearchSubmit}
                role="search"
              >
                <input
                  ref={searchInputRef}
                  type="search"
                  className="header__search-input"
                  placeholder="상품명, SKU 검색"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  aria-label="상품 검색"
                />
              </form>
            )}

            <button
              type="button"
              className={`header__icon-btn${isSearchOpen ? ' header__icon-btn--active' : ''}`}
              aria-label={isSearchOpen ? '검색 닫기' : '검색'}
              aria-expanded={isSearchOpen}
              onClick={toggleSearch}
            >
              <SearchIcon />
            </button>

            <Link to="/wishlist" className="header__icon-btn" aria-label="위시리스트">
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="header__cart-badge" aria-hidden="true">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="header__icon-btn" aria-label="장바구니">
              <BagIcon />
              {cartCount > 0 && (
                <span className="header__cart-badge" aria-hidden="true">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="header__auth">
            {user ? (
              <>
                <span className="header__auth-name">{user.name}님</span>
                <span className="header__auth-divider" aria-hidden="true">|</span>
                <button type="button" className="header__auth-link" onClick={handleLogout}>
                  로그아웃
                </button>
                {user.user_type === 'admin' && (
                  <>
                    <span className="header__auth-divider" aria-hidden="true">|</span>
                    <Link to="/admin/dashboard" className="header__auth-link">관리자</Link>
                  </>
                )}
              </>
            ) : guest ? (
              <>
                <span className="header__auth-name">비회원 ({guest.name})</span>
                <span className="header__auth-divider" aria-hidden="true">|</span>
                <button type="button" className="header__auth-link" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="header__auth-link">로그인</Link>
                <span className="header__auth-divider" aria-hidden="true">|</span>
                <Link to="/signup" className="header__auth-link">회원가입</Link>
              </>
            )}
          </div>
        </div>

        {isSearchOpen && isMobileHeader && (
          <form
            className="header__search-form header__search-form--mobile"
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <input
              ref={searchInputRef}
              type="search"
              className="header__search-input"
              placeholder="상품명, SKU 검색"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="상품 검색"
            />
          </form>
        )}
      </div>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20.5l-1.2-1.1C5.4 14.8 2 11.7 2 8a5 5 0 019-3 5 5 0 019 3c0 3.7-3.4 6.8-8.8 11.4L12 20.5z" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 7h12l-1 14H7L6 7z" />
      <path d="M9 7V5a3 3 0 016 0v2" />
    </svg>
  )
}

export default Header
