import { Link } from 'react-router-dom'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'
import MyPageSidebar from '@/components/cart/MyPageSidebar'
import ProductCard from '@/components/product/ProductCard'
import { useWishlist } from '@/contexts/WishlistContext'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { mapProductForHomeCard } from '@/utils/productDisplay'
import './CartPage.css'
import './WishlistPage.css'

function WishlistPage() {
  const { user, isCheckingAuth } = useRequireAuth()
  const { items, isLoading } = useWishlist()

  const products = items
    .map((item) => item.product)
    .filter(Boolean)
    .map(mapProductForHomeCard)

  if (isCheckingAuth) {
    return null
  }

  return (
    <div className="cart-page wishlist-page">
      <PageBreadcrumb
        className="cart-page__breadcrumb"
        items={[
          { label: 'HOME', to: '/' },
          { label: 'MY PAGE' },
          { label: '위시리스트' },
        ]}
      />

      <div className="cart-page__layout">
        <MyPageSidebar />

        <section className="wishlist-page__content">
          <header className="cart-page__header">
            <h1 className="cart-page__title">위시리스트</h1>
            <p className="cart-page__subtitle">{user?.name}님이 저장한 상품</p>
          </header>

          <div className="cart-page__stats">
            <div className="cart-page__stat">
              <span className="cart-page__stat-label">저장한 상품</span>
              <strong className="cart-page__stat-value">{products.length}개</strong>
            </div>
          </div>

          {isLoading ? (
            <p className="wishlist-page__status">위시리스트를 불러오는 중...</p>
          ) : products.length === 0 ? (
            <div className="wishlist-page__empty">
              <p>위시리스트에 담긴 상품이 없습니다.</p>
              <Link to="/" className="wishlist-page__shop-link">
                쇼핑 계속하기
              </Link>
            </div>
          ) : (
            <div className="wishlist-page__grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default WishlistPage
