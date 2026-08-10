import { Link } from 'react-router-dom'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'
import {
  formatOrderDate,
  formatOrderPrice,
  formatShippingAddress,
  formatShippingEta,
  PAYMENT_METHOD_LABELS,
} from '@/utils/orderDisplay'
import './OrderCompleteView.css'

function OrderCompleteView({ order }) {
  const shipping = order?.shipping
  const paymentMethodLabel = PAYMENT_METHOD_LABELS[order?.payment?.method] || '결제'

  return (
    <div className="order-complete">
      <PageBreadcrumb
        className="order-complete__breadcrumb"
        items={[
          { label: 'HOME', to: '/' },
          { label: '주문결제' },
          { label: '주문완료' },
        ]}
      />

      <div className="order-complete__inner">
        <div className="order-complete__hero">
          <div className="order-complete__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M8 12.5L10.8 15.3L16 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="order-complete__title">주문이 정상적으로 완료되었습니다.</h1>
          <div className="order-complete__divider" aria-hidden="true" />
          <p className="order-complete__subtitle">
            고객님의 소중한 주문이 정상적으로 접수되었습니다.
          </p>
        </div>

        <div className="order-complete__card">
          <section className="order-complete__section">
            <h2 className="order-complete__section-title">주문 완료 안내</h2>
            <dl className="order-complete__rows">
              <div className="order-complete__row">
                <dt>주문 번호</dt>
                <dd>{order.orderNumber}</dd>
              </div>
              <div className="order-complete__row">
                <dt>주문 일시</dt>
                <dd>{formatOrderDate(order.createdAt)}</dd>
              </div>
              <div className="order-complete__row">
                <dt>배송 예정</dt>
                <dd>{formatShippingEta(order.createdAt, 3)}</dd>
              </div>
            </dl>
          </section>

          <section className="order-complete__section">
            <h2 className="order-complete__section-title">배송지 정보</h2>
            <div className="order-complete__text-block">
              <p className="order-complete__recipient">
                {shipping?.recipientName || '-'}
                {shipping?.phone ? ` (${shipping.phone})` : ''}
              </p>
              <p className="order-complete__address">{formatShippingAddress(shipping)}</p>
              {shipping?.memo ? (
                <p className="order-complete__memo">요청사항: {shipping.memo}</p>
              ) : null}
            </div>
          </section>

          <section className="order-complete__section">
            <h2 className="order-complete__section-title">결제 정보</h2>
            <dl className="order-complete__rows">
              <div className="order-complete__row">
                <dt>결제 수단</dt>
                <dd>{paymentMethodLabel}</dd>
              </div>
              <div className="order-complete__row order-complete__row--total">
                <dt>최종 결제 금액</dt>
                <dd>{formatOrderPrice(order.totalAmount)}</dd>
              </div>
            </dl>
          </section>

          <section className="order-complete__section order-complete__section--items">
            <h2 className="order-complete__section-title">
              주문 상품 목록
              <span className="order-complete__item-count">(총 {order.items?.length || 0}개)</span>
            </h2>
            <ul className="order-complete__items">
              {(order.items || []).map((item, index) => (
                <li key={`${item.sku}-${item.size}-${index}`} className="order-complete__item">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="order-complete__item-thumb"
                  />
                  <div className="order-complete__item-info">
                    <p className="order-complete__item-name">{item.productName}</p>
                    <p className="order-complete__item-option">
                      {item.size} | {item.quantity}개
                    </p>
                  </div>
                  <strong className="order-complete__item-price">
                    {formatOrderPrice(item.lineTotal)}
                  </strong>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="order-complete__actions">
          <Link to="/orders" className="order-complete__btn order-complete__btn--primary">
            주문 확인하기
          </Link>
          <Link to="/" className="order-complete__btn order-complete__btn--secondary">
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderCompleteView
