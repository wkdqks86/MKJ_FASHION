function formatPrice(value) {
  return `₩${Number(value || 0).toLocaleString('ko-KR')}`
}

function CartSummary({ selectedCount, selectedTotal, onCheckout }) {
  const shippingFee = 0
  const totalWithShipping = selectedTotal + shippingFee

  return (
    <aside className="cart-summary">
      <h3 className="cart-summary__title">주문 예상 금액</h3>

      <dl className="cart-summary__rows">
        <div className="cart-summary__row">
          <dt>선택 상품 ({selectedCount}개)</dt>
          <dd>{formatPrice(selectedTotal)}</dd>
        </div>
        <div className="cart-summary__row">
          <dt>배송비</dt>
          <dd>{selectedCount === 0 ? formatPrice(0) : shippingFee === 0 ? '무료' : formatPrice(shippingFee)}</dd>
        </div>
      </dl>

      <div className="cart-summary__total">
        <span>결제 예정 금액</span>
        <strong>{formatPrice(totalWithShipping)}</strong>
      </div>

      <button
        type="button"
        className="cart-summary__checkout-btn"
        disabled={selectedCount === 0}
        onClick={onCheckout}
      >
        주문하기
      </button>
    </aside>
  )
}

export default CartSummary
