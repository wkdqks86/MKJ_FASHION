export function getOrdererName(order) {
  return order?.orderer?.name || order?.guestName || '-'
}

export function formatShippingAddress(shipping) {
  if (!shipping?.addressLine1) return '-'
  const line2 = shipping.addressLine2 ? ` ${shipping.addressLine2}` : ''
  return `[${shipping.postalCode}] ${shipping.addressLine1}${line2}`
}

export function getItemUnitPrice(item) {
  return item.unitPrice ?? item.price ?? 0
}

export function getItemLineTotal(item) {
  if (item.lineTotal != null) return item.lineTotal
  return getItemUnitPrice(item) * (item.quantity || 0)
}

export const PAYMENT_STATUS_LABELS = {
  pending: '결제 대기',
  paid: '결제 완료',
  failed: '결제 실패',
  refunded: '환불 완료',
}

export const PAYMENT_METHOD_LABELS = {
  card: '신용카드',
  transfer: '계좌이체',
  kakao: '카카오페이',
}

export function formatOrderDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  const parts = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ]
  const time = [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ]

  return `${parts.join('.')} ${time.join(':')}`
}

export function formatOrderPrice(value) {
  return `₩${Number(value || 0).toLocaleString('ko-KR')}`
}

export const ORDER_STATUS_LABELS = {
  pending: '입금대기',
  processing: '배송준비중',
  shipped: '배송중',
  delivered: '배송완료',
  cancelled: '취소/환불',
}

export const ORDER_LIST_TABS = [
  { id: 'all', label: '전체' },
  { id: 'processing', label: '배송준비' },
  { id: 'shipped', label: '배송중' },
  { id: 'delivered', label: '배송완료' },
]

export function summarizeOrderItems(items = []) {
  if (!items.length) return '-'

  const firstName = items[0].productName
  if (items.length === 1) return firstName

  return `${firstName} 외 ${items.length - 1}건`
}

function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function addBusinessDays(startDate, businessDays) {
  const date = new Date(startDate)
  if (Number.isNaN(date.getTime())) return null

  let added = 0

  while (added < businessDays) {
    date.setDate(date.getDate() + 1)
    if (!isWeekend(date)) {
      added += 1
    }
  }

  return date
}

export function formatShippingEta(orderDate, businessDays = 3) {
  const eta = addBusinessDays(orderDate, businessDays)
  if (!eta) return '-'

  const formatted = [
    eta.getFullYear(),
    String(eta.getMonth() + 1).padStart(2, '0'),
    String(eta.getDate()).padStart(2, '0'),
  ].join('.')

  return `${formatted} 발송 예정`
}
