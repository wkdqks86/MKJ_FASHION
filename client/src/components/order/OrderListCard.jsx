import {
  formatOrderDate,
  formatOrderPrice,
  formatShippingAddress,
  formatShippingEta,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@/utils/orderDisplay'
import './OrderListCard.css'

function OrderListCard({ order }) {
  const paymentMethodLabel = PAYMENT_METHOD_LABELS[order.payment?.method] || '결제'
  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status

  return (
    <article className="order-list-card">
      <header className="order-list-card__header">
        <div>
          <p className="order-list-card__number">{order.orderNumber}</p>
          <p className="order-list-card__date">{formatOrderDate(order.createdAt)}</p>
        </div>
        <span className={`order-list-card__status order-list-card__status--${order.status}`}>
          {statusLabel}
        </span>
      </header>

      <ul className="order-list-card__items">
        {(order.items || []).map((item, index) => (
          <li key={`${item.sku}-${item.size}-${index}`} className="order-list-card__item">
            <img src={item.image} alt={item.productName} className="order-list-card__thumb" />
            <div className="order-list-card__item-info">
              <p className="order-list-card__item-name">{item.productName}</p>
              <p className="order-list-card__item-option">
                {item.size} | {item.quantity}개
              </p>
            </div>
            <strong className="order-list-card__item-price">
              {formatOrderPrice(item.lineTotal)}
            </strong>
          </li>
        ))}
      </ul>

      <dl className="order-list-card__meta">
        <div className="order-list-card__meta-row">
          <dt>배송지</dt>
          <dd>{formatShippingAddress(order.shipping)}</dd>
        </div>
        <div className="order-list-card__meta-row">
          <dt>배송 예정</dt>
          <dd>{formatShippingEta(order.createdAt, 3)}</dd>
        </div>
        <div className="order-list-card__meta-row">
          <dt>결제 수단</dt>
          <dd>{paymentMethodLabel}</dd>
        </div>
        <div className="order-list-card__meta-row order-list-card__meta-row--total">
          <dt>결제 금액</dt>
          <dd>{formatOrderPrice(order.totalAmount)}</dd>
        </div>
      </dl>
    </article>
  )
}

export default OrderListCard
