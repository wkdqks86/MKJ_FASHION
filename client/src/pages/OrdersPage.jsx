import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'
import MyPageSidebar from '@/components/cart/MyPageSidebar'
import OrderListCard from '@/components/order/OrderListCard'
import { useMyOrders } from '@/hooks/useMyOrders'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { formatOrderPrice, ORDER_LIST_TABS } from '@/utils/orderDisplay'
import './CartPage.css'
import './OrdersPage.css'

function OrdersPage() {
  const { user, isCheckingAuth } = useRequireAuth()
  const { orders, isLoading, error } = useMyOrders({ enabled: Boolean(user) })
  const [activeTab, setActiveTab] = useState('all')

  const totalAmount = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders
    return orders.filter((order) => order.status === activeTab)
  }, [orders, activeTab])

  const activeTabLabel = ORDER_LIST_TABS.find((tab) => tab.id === activeTab)?.label || '전체'

  if (isCheckingAuth) {
    return null
  }

  return (
    <div className="cart-page orders-page">
      <PageBreadcrumb
        className="cart-page__breadcrumb"
        items={[
          { label: 'HOME', to: '/' },
          { label: 'MY PAGE' },
          { label: '내 주문목록' },
        ]}
      />

      <div className="cart-page__layout">
        <MyPageSidebar />

        <section className="orders-page__content">
          <header className="cart-page__header">
            <h1 className="cart-page__title">내 주문목록</h1>
            <p className="cart-page__subtitle">{user?.name}님의 주문 내역</p>
          </header>

          <div className="cart-page__stats">
            <div className="cart-page__stat">
              <span className="cart-page__stat-label">전체 주문</span>
              <strong className="cart-page__stat-value">{orders.length}건</strong>
            </div>
            <div className="cart-page__stat">
              <span className="cart-page__stat-label">누적 결제 금액</span>
              <strong className="cart-page__stat-value">{formatOrderPrice(totalAmount)}</strong>
            </div>
          </div>

          {isLoading ? (
            <p className="orders-page__status">주문 목록을 불러오는 중...</p>
          ) : error ? (
            <p className="orders-page__status orders-page__status--error" role="alert">
              {error}
            </p>
          ) : orders.length === 0 ? (
            <div className="orders-page__empty">
              <p>주문 내역이 없습니다.</p>
              <Link to="/" className="orders-page__shop-link">
                쇼핑 계속하기
              </Link>
            </div>
          ) : (
            <>
              <div className="orders-page__tabs" role="tablist" aria-label="주문 상태 필터">
                {ORDER_LIST_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`orders-page__tab${
                      activeTab === tab.id ? ' orders-page__tab--active' : ''
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {filteredOrders.length === 0 ? (
                <div className="orders-page__empty orders-page__empty--filtered">
                  <p>{activeTabLabel} 상태의 주문이 없습니다.</p>
                </div>
              ) : (
                <div className="orders-page__list">
                  {filteredOrders.map((order) => (
                    <OrderListCard key={order._id} order={order} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default OrdersPage
