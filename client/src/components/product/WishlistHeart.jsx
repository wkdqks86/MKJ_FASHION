import { useNavigate } from 'react-router-dom'
import { useWishlist } from '@/contexts/WishlistContext'
import { getAccessToken } from '@/utils/authStorage'
import './WishlistHeart.css'

function HeartIcon({ filled = false, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`wishlist-heart__icon${filled ? ' wishlist-heart__icon--filled' : ''}`}
    >
      <path
        d="M12 20.5l-1.2-1.1C5.4 14.8 2 11.7 2 8a5 5 0 019-3 5 5 0 019 3c0 3.7-3.4 6.8-8.8 11.4L12 20.5z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WishlistHeart({
  productId,
  className = '',
  size = 'md',
  loginRedirectPath,
  stopPropagation = true,
}) {
  const navigate = useNavigate()
  const { isWishlisted, toggleWishlist, togglingProductId } = useWishlist()
  const active = isWishlisted(productId)
  const isToggling = togglingProductId === productId
  const isUnavailable = !productId || String(productId).startsWith('fb-')

  const iconSize = size === 'lg' ? 22 : size === 'title' ? 22 : 18

  const handleClick = async (event) => {
    if (stopPropagation) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (isUnavailable) return

    if (!getAccessToken()) {
      const redirect = loginRedirectPath || `/products/${productId}`
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`)
      return
    }

    await toggleWishlist(productId)
  }

  return (
    <button
      type="button"
      className={`wishlist-heart wishlist-heart--${size}${active ? ' wishlist-heart--active' : ''}${className ? ` ${className}` : ''}`}
      aria-label={active ? '위시리스트에서 제거' : '위시리스트에 추가'}
      aria-pressed={active}
      disabled={isToggling || isUnavailable}
      onClick={handleClick}
    >
      <HeartIcon filled={active} size={iconSize} />
    </button>
  )
}

export default WishlistHeart
