import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '@/api/orders'
import OrderCompleteView from '@/components/order/OrderCompleteView'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'
import { formatCategoryLabel } from '@/constants/productCategories'
import { notifyCartChange, useCart } from '@/hooks/useCart'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import {
  clearCheckoutItemIds,
  clearPaymentFailure,
  clearPendingCheckout,
  getCheckoutItemIds,
  getPendingCheckout,
  savePaymentFailure,
  savePendingCheckout,
} from '@/utils/checkoutSession'
import { PAYMENT_METHOD_LABELS } from '@/utils/orderDisplay'
import {
  buildPaymentName,
  generatePaymentId,
  getPortOnePayMethod,
  requestPortOnePayment,
  SUPPORTED_PAYMENT_METHODS,
} from '@/utils/portone'
import { isShoeCategory } from '@/utils/productStock'
import './CheckoutPage.css'

const DEMO_SHIPPING_FEE = 0

const SHIPPING_MEMO_OPTIONS = [
  { value: '', label: '배송 요청사항을 선택해 주세요' },
  { value: '문 앞에 놔주세요', label: '문 앞에 놔주세요' },
  { value: '경비실에 맡겨주세요', label: '경비실에 맡겨주세요' },
  { value: '배송 전 연락 부탁드립니다', label: '배송 전 연락 부탁드립니다' },
  { value: 'direct', label: '직접 입력' },
]

function formatPrice(value) {
  return `₩${Number(value || 0).toLocaleString('ko-KR')}`
}

function formatSizeLabel(size, categoryType) {
  if (!size) return '-'
  return isShoeCategory(categoryType) ? `${size}mm` : size
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { user, isCheckingAuth } = useRequireAuth()
  const { cart, isLoading, loadCart } = useCart({ enabled: Boolean(user) })
  const [checkoutItemIds, setCheckoutItemIds] = useState(() => getCheckoutItemIds())
  const [shippingTab, setShippingTab] = useState('direct')
  const [shipping, setShipping] = useState({
    recipientName: '',
    phone: '',
    postalCode: '',
    addressLine1: '',
    addressLine2: '',
    memo: '',
    memoSelect: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)

  const orderItems = useMemo(() => {
    if (!cart?.items || !checkoutItemIds?.length) return []
    return cart.items.filter((item) => checkoutItemIds.includes(item._id))
  }, [cart, checkoutItemIds])

  const itemsSubtotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [orderItems],
  )

  const shippingFee = DEMO_SHIPPING_FEE
  const totalAmount = itemsSubtotal + shippingFee

  const goToPaymentFailed = useCallback((message) => {
    clearPendingCheckout()
    savePaymentFailure({ message })
    navigate('/checkout/failed', { replace: true })
  }, [navigate])

  useEffect(() => {
    const ids = getCheckoutItemIds()
    setCheckoutItemIds(ids)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentId = params.get('paymentId')
    const code = params.get('code')

    if (!paymentId) return

    window.history.replaceState({}, '', '/checkout')

    if (code) {
      goToPaymentFailed(params.get('message') || '결제에 실패했습니다.')
      return
    }

    const pending = getPendingCheckout()
    if (!pending || pending.paymentId !== paymentId) {
      goToPaymentFailed('결제 정보를 확인할 수 없습니다. 다시 시도해 주세요.')
      return
    }

    let cancelled = false

    const completeRedirectPayment = async () => {
      setIsSubmitting(true)
      setError('')

      try {
        const data = await createOrder({
          itemIds: pending.itemIds,
          shipping: pending.shipping,
          payment: {
            method: pending.paymentMethod,
            transactionId: paymentId,
          },
        })

        if (!data.success) {
          goToPaymentFailed('주문을 완료하지 못했습니다.')
          return
        }

        clearCheckoutItemIds()
        clearPendingCheckout()
        clearPaymentFailure()
        setCompletedOrder(data.order)
        await loadCart()
        notifyCartChange()
      } catch (err) {
        if (!cancelled) {
          goToPaymentFailed(
            err.response?.data?.message || err.message || '주문을 완료하지 못했습니다.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsSubmitting(false)
        }
      }
    }

    completeRedirectPayment()

    return () => {
      cancelled = true
    }
  }, [goToPaymentFailed, loadCart])

  useEffect(() => {
    if (!user) return

    setShipping((prev) => ({
      ...prev,
      recipientName: prev.recipientName || user.name || '',
      phone: prev.phone || user.phone || '',
      addressLine1: prev.addressLine1 || user.address || '',
    }))
  }, [user])

  useEffect(() => {
    if (isCheckingAuth || isLoading || completedOrder) return

    if (!checkoutItemIds?.length) {
      navigate('/cart', { replace: true })
      return
    }

    if (cart && orderItems.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [
    isCheckingAuth,
    isLoading,
    checkoutItemIds,
    cart,
    orderItems.length,
    completedOrder,
    navigate,
  ])

  const handleShippingChange = (field) => (event) => {
    const value = event.target.value
    setShipping((prev) => {
      const next = { ...prev, [field]: value }

      if (field === 'memoSelect') {
        next.memo = value === 'direct' ? prev.memo : value
      }

      return next
    })
    setError('')
  }

  const applyOrdererToRecipient = () => {
    if (!user) return

    setShipping((prev) => ({
      ...prev,
      recipientName: user.name || '',
      phone: user.phone || '',
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!agreed) {
      setError('주문 내용 확인 및 결제 동의에 체크해 주세요.')
      return
    }

    if (orderItems.length === 0) {
      setError('주문할 상품이 없습니다.')
      return
    }

    setIsSubmitting(true)
    setError('')

    const shippingPayload = {
      recipientName: shipping.recipientName.trim(),
      phone: shipping.phone.trim(),
      postalCode: shipping.postalCode.trim(),
      addressLine1: shipping.addressLine1.trim(),
      addressLine2: shipping.addressLine2.trim(),
      memo: shipping.memoSelect === 'direct' ? shipping.memo.trim() : shipping.memo,
    }

    try {
      const paymentId = generatePaymentId()

      savePendingCheckout({
        paymentId,
        itemIds: orderItems.map((item) => item._id),
        shipping: shippingPayload,
        paymentMethod,
      })

      const paymentResponse = await requestPortOnePayment({
        paymentId,
        name: buildPaymentName(orderItems),
        amount: totalAmount,
        buyerEmail: user?.email,
        buyerName: user?.name,
        buyerTel: shippingPayload.phone || user?.phone || '',
        payMethod: getPortOnePayMethod(paymentMethod),
      })

      const data = await createOrder({
        itemIds: orderItems.map((item) => item._id),
        shipping: shippingPayload,
        payment: {
          method: paymentMethod,
          transactionId: paymentResponse.paymentId || paymentId,
        },
      })

      if (data.success) {
        clearCheckoutItemIds()
        clearPendingCheckout()
        clearPaymentFailure()
        setCompletedOrder(data.order)
        await loadCart()
        notifyCartChange()
        return
      }

      goToPaymentFailed('주문을 완료하지 못했습니다.')
    } catch (err) {
      goToPaymentFailed(err.response?.data?.message || err.message || '결제를 완료하지 못했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCheckingAuth || (isLoading && !completedOrder)) {
    return (
      <div className="checkout-page">
        <p className="checkout-page__status">주문서를 불러오는 중...</p>
      </div>
    )
  }

  if (completedOrder) {
    return <OrderCompleteView order={completedOrder} />
  }

  return (
    <div className="checkout-page">
      <PageBreadcrumb
        className="checkout-page__breadcrumb"
        items={[
          { label: 'HOME', to: '/' },
          { label: '주문결제' },
          { label: '주문서' },
        ]}
      />

      <div className="checkout-page__inner">
        <h1 className="checkout-page__title">주문서</h1>

        <form className="checkout-page__layout" onSubmit={handleSubmit}>
          <div className="checkout-page__main">
            <section className="checkout-section">
              <div className="checkout-section__head">
                <h2 className="checkout-section__title">주문상품</h2>
              </div>
              <div className="checkout-section__body">
                <table className="checkout-items-table">
                  <thead>
                    <tr>
                      <th>상품정보</th>
                      <th>수량</th>
                      <th>결제금액</th>
                      <th>배송비</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => {
                      const product = item.product
                      const brand = formatCategoryLabel(product.gender, product.categoryType)
                      const sizeLabel = formatSizeLabel(item.size, product.categoryType)

                      return (
                        <tr key={item._id}>
                          <td>
                            <div className="checkout-item-info">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="checkout-item-info__thumb"
                              />
                              <div>
                                <p className="checkout-item-info__brand">{brand}</p>
                                <p className="checkout-item-info__name">{product.name}</p>
                                <p className="checkout-item-info__option">
                                  {sizeLabel} | {item.quantity}개
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>{item.quantity}</td>
                          <td>{formatPrice(item.lineTotal)}</td>
                          <td>무료배송</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="checkout-section">
              <div className="checkout-section__head">
                <h2 className="checkout-section__title">배송지 정보</h2>
              </div>
              <div className="checkout-section__body">
                <div className="checkout-shipping-tabs">
                  <button
                    type="button"
                    className={`checkout-shipping-tabs__btn${
                      shippingTab === 'recent' ? ' checkout-shipping-tabs__btn--active' : ''
                    }`}
                    onClick={() => setShippingTab('recent')}
                  >
                    최근 배송지
                  </button>
                  <button
                    type="button"
                    className={`checkout-shipping-tabs__btn${
                      shippingTab === 'direct' ? ' checkout-shipping-tabs__btn--active' : ''
                    }`}
                    onClick={() => setShippingTab('direct')}
                  >
                    직접입력
                  </button>
                </div>

                <div className="checkout-shipping-actions">
                  <button
                    type="button"
                    className="checkout-shipping-actions__btn"
                    onClick={applyOrdererToRecipient}
                  >
                    주문자와 동일
                  </button>
                </div>

                <dl className="checkout-orderer-box">
                  <div>
                    <dt>주문자</dt>
                    <dd>{user?.name || '-'}</dd>
                  </div>
                  <div>
                    <dt>휴대폰</dt>
                    <dd>{user?.phone || '-'}</dd>
                  </div>
                  <div>
                    <dt>이메일</dt>
                    <dd>{user?.email || '-'}</dd>
                  </div>
                </dl>

                <div className="checkout-form-grid">
                  <label className="checkout-form-field">
                    <span className="required">수령인</span>
                    <input
                      type="text"
                      value={shipping.recipientName}
                      onChange={handleShippingChange('recipientName')}
                      required
                    />
                  </label>
                  <label className="checkout-form-field">
                    <span className="required">휴대폰번호</span>
                    <input
                      type="text"
                      value={shipping.phone}
                      onChange={handleShippingChange('phone')}
                      required
                    />
                  </label>
                  <label className="checkout-form-field">
                    <span className="required">우편번호</span>
                    <input
                      type="text"
                      value={shipping.postalCode}
                      onChange={handleShippingChange('postalCode')}
                      required
                    />
                  </label>
                  <label className="checkout-form-field checkout-form-field--full">
                    <span className="required">배송지 주소</span>
                    <input
                      type="text"
                      value={shipping.addressLine1}
                      onChange={handleShippingChange('addressLine1')}
                      required
                    />
                  </label>
                  <label className="checkout-form-field checkout-form-field--full">
                    <span>상세 주소</span>
                    <input
                      type="text"
                      value={shipping.addressLine2}
                      onChange={handleShippingChange('addressLine2')}
                    />
                  </label>
                  <label className="checkout-form-field checkout-form-field--full">
                    <span>배송 요청사항</span>
                    <select
                      value={shipping.memoSelect}
                      onChange={handleShippingChange('memoSelect')}
                    >
                      {SHIPPING_MEMO_OPTIONS.map((option) => (
                        <option key={option.value || 'empty'} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {shipping.memoSelect === 'direct' && (
                    <label className="checkout-form-field checkout-form-field--full">
                      <span>요청사항 직접 입력</span>
                      <input
                        type="text"
                        value={shipping.memo}
                        onChange={handleShippingChange('memo')}
                        placeholder="배송 시 요청사항을 입력해 주세요"
                      />
                    </label>
                  )}
                  <label className="checkout-form-field checkout-form-field--full">
                    <span className="required">결제 수단</span>
                    <select
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    >
                      {SUPPORTED_PAYMENT_METHODS.map((value) => (
                        <option key={value} value={value}>
                          {PAYMENT_METHOD_LABELS[value]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </section>
          </div>

          <aside className="checkout-summary">
            <h2 className="checkout-summary__title">최종결제금액</h2>

            <div className="checkout-summary__total">
              <span className="checkout-summary__total-label">결제 예정 금액</span>
              <strong className="checkout-summary__total-value">{formatPrice(totalAmount)}</strong>
            </div>

            <dl className="checkout-summary__rows">
              <div className="checkout-summary__row">
                <dt>상품금액</dt>
                <dd>{formatPrice(itemsSubtotal)}</dd>
              </div>
              <div className="checkout-summary__row">
                <dt>배송비</dt>
                <dd>{shippingFee === 0 ? '0원' : formatPrice(shippingFee)}</dd>
              </div>
              <div className="checkout-summary__row">
                <dt>총 할인금액</dt>
                <dd>{formatPrice(0)}</dd>
              </div>
            </dl>

            <p className="checkout-summary__notice">
              데모 테스트 기간 배송비는 무료입니다.
            </p>

            {error && (
              <p className="checkout-page__error" role="alert">{error}</p>
            )}

            <label className="checkout-summary__agree">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
              />
              주문 내용을 확인하였으며, 결제 및 개인정보 제공에 동의합니다.
            </label>

            <button
              type="submit"
              className="checkout-summary__submit"
              disabled={isSubmitting || orderItems.length === 0}
            >
              {isSubmitting ? '결제 처리 중...' : '결제하기'}
            </button>
          </aside>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage
