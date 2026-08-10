const CHECKOUT_ITEM_IDS_KEY = 'mkj_checkout_item_ids'
const PENDING_CHECKOUT_KEY = 'mkj_pending_checkout'
const PAYMENT_FAILURE_KEY = 'mkj_payment_failure'

export function saveCheckoutItemIds(itemIds) {
  sessionStorage.setItem(CHECKOUT_ITEM_IDS_KEY, JSON.stringify(itemIds))
}

export function getCheckoutItemIds() {
  const raw = sessionStorage.getItem(CHECKOUT_ITEM_IDS_KEY)

  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function clearCheckoutItemIds() {
  sessionStorage.removeItem(CHECKOUT_ITEM_IDS_KEY)
}

export function savePendingCheckout(payload) {
  sessionStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(payload))
}

export function getPendingCheckout() {
  const raw = sessionStorage.getItem(PENDING_CHECKOUT_KEY)

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearPendingCheckout() {
  sessionStorage.removeItem(PENDING_CHECKOUT_KEY)
}

export function savePaymentFailure({ message }) {
  sessionStorage.setItem(PAYMENT_FAILURE_KEY, JSON.stringify({ message: message || '결제에 실패했습니다.' }))
}

export function getPaymentFailure() {
  const raw = sessionStorage.getItem(PAYMENT_FAILURE_KEY)

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearPaymentFailure() {
  sessionStorage.removeItem(PAYMENT_FAILURE_KEY)
}
