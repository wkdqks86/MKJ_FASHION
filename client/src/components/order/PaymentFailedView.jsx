import { Link } from 'react-router-dom'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'
import './PaymentFailedView.css'

function PaymentFailedView({ message }) {
  return (
    <div className="payment-failed">
      <PageBreadcrumb
        className="payment-failed__breadcrumb"
        items={[
          { label: 'HOME', to: '/' },
          { label: '주문결제' },
          { label: '결제실패' },
        ]}
      />

      <div className="payment-failed__inner">
        <div className="payment-failed__hero">
          <div className="payment-failed__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M9 9L15 15M15 9L9 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="payment-failed__title">결제에 실패했습니다.</h1>
          <div className="payment-failed__divider" aria-hidden="true" />
          <p className="payment-failed__subtitle">
            주문이 완료되지 않았으며, 장바구니에 선택하신 상품이 그대로 유지됩니다.
          </p>
        </div>

        <div className="payment-failed__card">
          <section className="payment-failed__section">
            <h2 className="payment-failed__section-title">실패 사유</h2>
            <p className="payment-failed__message">{message}</p>
          </section>

          <section className="payment-failed__section">
            <h2 className="payment-failed__section-title">안내</h2>
            <ul className="payment-failed__guide">
              <li>결제가 정상적으로 완료되지 않아 주문 및 재고 처리가 진행되지 않았습니다.</li>
              <li>장바구니에서 상품을 확인한 뒤 다시 결제를 시도해 주세요.</li>
              <li>문제가 반복되면 다른 결제 수단으로 시도하거나 고객센터로 문의해 주세요.</li>
            </ul>
          </section>
        </div>

        <div className="payment-failed__actions">
          <Link to="/checkout" className="payment-failed__btn payment-failed__btn--primary">
            다시 결제하기
          </Link>
          <Link to="/cart" className="payment-failed__btn payment-failed__btn--secondary">
            장바구니로 이동
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailedView
