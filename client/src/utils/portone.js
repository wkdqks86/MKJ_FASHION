const PORTONE_PAY_METHODS = {
  card: 'CARD',
  transfer: 'TRANSFER',
}

export const PORTONE_STORE_ID = import.meta.env.VITE_PORTONE_STORE_ID || ''
export const PORTONE_CHANNEL_KEY = import.meta.env.VITE_PORTONE_CHANNEL_KEY || ''

export const SUPPORTED_PAYMENT_METHODS = Object.keys(PORTONE_PAY_METHODS)

export function getPortOnePayMethod(paymentMethod) {
  return PORTONE_PAY_METHODS[paymentMethod] || 'CARD'
}

export function generatePaymentId() {
  return `payment_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function buildPaymentName(orderItems) {
  if (!orderItems.length) return 'MKJ FASHION 주문'

  const firstName = orderItems[0].product?.name || '상품'
  if (orderItems.length === 1) return firstName

  return `${firstName} 외 ${orderItems.length - 1}건`
}

export async function requestPortOnePayment({
  paymentId,
  name,
  amount,
  buyerEmail,
  buyerName,
  buyerTel,
  payMethod,
}) {
  const PortOne = window.PortOne

  if (!PortOne) {
    throw new Error('결제 모듈을 불러오지 못했습니다. 페이지를 새로고침해 주세요.')
  }

  if (!PORTONE_STORE_ID || !PORTONE_CHANNEL_KEY) {
    throw new Error('결제 설정이 없습니다. 환경 변수를 확인해 주세요.')
  }

  if (!buyerTel) {
    throw new Error('휴대폰번호를 입력해 주세요.')
  }

  const response = await PortOne.requestPayment({
    storeId: PORTONE_STORE_ID,
    channelKey: PORTONE_CHANNEL_KEY,
    paymentId,
    orderName: name,
    totalAmount: amount,
    currency: 'CURRENCY_KRW',
    payMethod,
    customer: {
      fullName: buyerName || '',
      phoneNumber: buyerTel,
      email: buyerEmail || '',
    },
    redirectUrl: `${window.location.origin}/checkout`,
  })

  if (response?.code) {
    throw new Error(response.message || '결제에 실패했습니다.')
  }

  return response
}
