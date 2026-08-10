import { useEffect, useState } from 'react'
import { deleteOrder, updateOrder } from '@/api/orders'
import {
  formatDateTime,
  formatPrice,
  ORDER_STATUS_LABELS,
} from '@/constants/adminData'
import {
  formatShippingAddress,
  getItemLineTotal,
  getItemUnitPrice,
  getOrdererName,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from '@/utils/orderDisplay'

function OrderDetailModal({ order, onClose, onUpdated, onDeleted }) {
  const [trackingNumber, setTrackingNumber] = useState(order?.shippingInfo?.trackingNumber || '')
  const [carrier, setCarrier] = useState(order?.shippingInfo?.carrier || '')
  const [status, setStatus] = useState(order?.status || 'processing')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setTrackingNumber(order?.shippingInfo?.trackingNumber || '')
    setCarrier(order?.shippingInfo?.carrier || '')
    setStatus(order?.status || 'processing')
    setError('')
  }, [order])

  if (!order) return null

  const handleSave = async () => {
    if (order._id?.startsWith('mock-')) {
      onClose()
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const data = await updateOrder(order._id, {
        status,
        shippingInfo: {
          carrier: carrier.trim() || null,
          trackingNumber: trackingNumber.trim() || null,
        },
      })

      if (data.success) {
        onUpdated?.(data.order)
        onClose()
        return
      }

      setError('주문 정보를 저장하지 못했습니다.')
    } catch (err) {
      setError(err.response?.data?.message || '주문 정보를 저장하지 못했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (order._id?.startsWith('mock-')) {
      window.alert('샘플 데이터는 삭제할 수 없습니다.')
      return
    }

    const confirmed = window.confirm(
      `주문 ${order.orderNumber}을(를) 삭제하시겠습니까?\n삭제된 주문은 복구할 수 없습니다.`,
    )

    if (!confirmed) return

    setIsDeleting(true)
    setError('')

    try {
      const data = await deleteOrder(order._id)

      if (data.success) {
        onDeleted?.(order._id)
        onClose()
        return
      }

      setError('주문을 삭제하지 못했습니다.')
    } catch (err) {
      setError(err.response?.data?.message || '주문을 삭제하지 못했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  const paymentStatus = order.payment?.status || 'pending'
  const paymentMethod = order.payment?.method || 'card'

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="order-modal-title"
      >
        <div className="admin-modal__header">
          <h2 id="order-modal-title" className="admin-modal__title">
            주문 상세 조회 [{order.orderNumber}]
          </h2>
          <button type="button" className="admin-modal__close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="admin-modal__body">
          <div className="admin-info-grid">
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">주문 ID</div>
              <div className="admin-info-cell__value">{order.orderNumber}</div>
            </div>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">결제일</div>
              <div className="admin-info-cell__value">{formatDateTime(order.createdAt)}</div>
            </div>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">결제 현황</div>
              <div className="admin-info-cell__value">
                <span className="admin-status admin-status--paid">
                  {PAYMENT_STATUS_LABELS[paymentStatus] || paymentStatus}
                </span>
              </div>
            </div>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">결제방법</div>
              <div className="admin-info-cell__value">
                {PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod}
              </div>
            </div>
          </div>

          <h3 className="admin-section-title">👤 주문자 정보</h3>
          <div className="admin-info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">이름</div>
              <div className="admin-info-cell__value">{getOrdererName(order)}</div>
            </div>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">연락처</div>
              <div className="admin-info-cell__value">{order.orderer?.phone || '-'}</div>
            </div>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">이메일</div>
              <div className="admin-info-cell__value">{order.orderer?.email || '-'}</div>
            </div>
          </div>

          <h3 className="admin-section-title">🚚 배송 정보</h3>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label>배송지 주소</label>
              <textarea
                readOnly
                value={formatShippingAddress(order.shipping)}
                rows={3}
              />
            </div>
            <div className="admin-form-field">
              <label htmlFor="carrier">택배사</label>
              <input
                id="carrier"
                type="text"
                placeholder="택배사를 입력하세요"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
              />
            </div>
            <div className="admin-form-field">
              <label htmlFor="tracking">운송장 번호</label>
              <input
                id="tracking"
                type="text"
                placeholder="운송장 번호를 입력하세요"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>

          <h3 className="admin-section-title">📦 주문 항목</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>상품</th>
                  <th>옵션</th>
                  <th>수량</th>
                  <th>단가</th>
                  <th>합계</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.productName}</td>
                    <td>{row.size || '-'}</td>
                    <td>{row.quantity}</td>
                    <td>{formatPrice(getItemUnitPrice(row))}</td>
                    <td>{formatPrice(getItemLineTotal(row))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-info-grid" style={{ marginTop: '1rem' }}>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">상품 합계</div>
              <div className="admin-info-cell__value">{formatPrice(order.itemsSubtotal ?? 0)}</div>
            </div>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">배송비</div>
              <div className="admin-info-cell__value">{formatPrice(order.shippingFee ?? 0)}</div>
            </div>
            <div className="admin-info-cell">
              <div className="admin-info-cell__label">총 결제금액</div>
              <div className="admin-info-cell__value">{formatPrice(order.totalAmount)}</div>
            </div>
          </div>

          <div className="admin-form-field" style={{ marginTop: '1rem' }}>
            <label htmlFor="order-status">주문 상태 수정</label>
            <select
              id="order-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="admin-form-error" role="alert">{error}</p>
          )}
        </div>

        <div className="admin-modal__footer">
          <button
            type="button"
            className="admin-btn admin-btn--danger admin-modal__footer-delete"
            onClick={handleDelete}
            disabled={isSaving || isDeleting}
          >
            {isDeleting ? '삭제 중...' : '주문 삭제'}
          </button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={onClose}>
            닫기
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleSave}
            disabled={isSaving || isDeleting}
          >
            {isSaving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal
