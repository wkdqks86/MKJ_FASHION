import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'
import CartItemCard from '@/components/cart/CartItemCard'
import CartSummary from '@/components/cart/CartSummary'
import MyPageSidebar from '@/components/cart/MyPageSidebar'
import { useCart } from '@/hooks/useCart'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { saveCheckoutItemIds } from '@/utils/checkoutSession'
import './CartPage.css'

function formatPrice(value) {
  return `₩${Number(value || 0).toLocaleString('ko-KR')}`
}

function CartPage() {
  const navigate = useNavigate()
  const { user, isCheckingAuth } = useRequireAuth()
  const { cart, isLoading, error, updatingItemId, updateItemQuantity, removeItem, clearCart } =
    useCart({ enabled: Boolean(user) })
  const [selectedIds, setSelectedIds] = useState([])

  const items = cart?.items ?? []

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => items.some((item) => item._id === id)))
  }, [items])

  useEffect(() => {
    if (items.length === 0) {
      setSelectedIds([])
      return
    }

    setSelectedIds((prev) => {
      if (prev.length === 0) {
        return items.map((item) => item._id)
      }
      return prev
    })
  }, [items])

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item._id)),
    [items, selectedIds],
  )

  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const allSelected = items.length > 0 && selectedIds.length === items.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
      return
    }
    setSelectedIds(items.map((item) => item._id))
  }

  const toggleSelectItem = (itemId) => {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    )
  }

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await updateItemQuantity(itemId, quantity)
    } catch {
      // error state is handled in hook
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId)
    } catch {
      // error state is handled in hook
    }
  }

  const handleClearCart = async () => {
    if (!window.confirm('장바구니를 비우시겠습니까?')) return

    try {
      await clearCart()
    } catch {
      // error state is handled in hook
    }
  }

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      window.alert('주문할 상품을 선택해 주세요.')
      return
    }

    saveCheckoutItemIds(selectedIds)
    navigate('/checkout')
  }

  if (isCheckingAuth) {
    return null
  }

  return (
    <div className="cart-page">
      <PageBreadcrumb
        className="cart-page__breadcrumb"
        items={[
          { label: 'HOME', to: '/' },
          { label: 'MY PAGE' },
          { label: '장바구니' },
        ]}
      />

      <div className="cart-page__layout">
        <MyPageSidebar />

        <section className="cart-page__content">
          <header className="cart-page__header">
            <h1 className="cart-page__title">장바구니</h1>
            <p className="cart-page__subtitle">{user?.name}님의 담은 상품</p>
          </header>

          <div className="cart-page__stats">
            <div className="cart-page__stat">
              <span className="cart-page__stat-label">담은 상품</span>
              <strong className="cart-page__stat-value">{cart?.itemCount ?? 0}개</strong>
            </div>
            <div className="cart-page__stat">
              <span className="cart-page__stat-label">전체 금액</span>
              <strong className="cart-page__stat-value">{formatPrice(cart?.totalAmount ?? 0)}</strong>
            </div>
          </div>

          {isLoading ? (
            <p className="cart-page__status">장바구니를 불러오는 중...</p>
          ) : error ? (
            <p className="cart-page__status cart-page__status--error" role="alert">
              {error}
            </p>
          ) : items.length === 0 ? (
            <div className="cart-page__empty">
              <p>장바구니에 담긴 상품이 없습니다.</p>
              <Link to="/" className="cart-page__shop-link">
                쇼핑 계속하기
              </Link>
            </div>
          ) : (
            <div className="cart-page__body">
              <div className="cart-page__list-wrap">
                <div className="cart-page__list-toolbar">
                  <label className="cart-page__select-all">
                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                    전체 선택 ({selectedIds.length}/{items.length})
                  </label>
                  <button type="button" className="cart-page__clear-btn" onClick={handleClearCart}>
                    전체 삭제
                  </button>
                </div>

                <div className="cart-page__list">
                  {items.map((item) => (
                    <CartItemCard
                      key={item._id}
                      item={item}
                      isSelected={selectedIds.includes(item._id)}
                      isUpdating={updatingItemId === item._id}
                      onToggleSelect={toggleSelectItem}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>

              <CartSummary
                selectedCount={selectedCount}
                selectedTotal={selectedTotal}
                onCheckout={handleCheckout}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default CartPage
