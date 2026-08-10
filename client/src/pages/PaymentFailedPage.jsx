import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PaymentFailedView from '@/components/order/PaymentFailedView'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { getPaymentFailure } from '@/utils/checkoutSession'

function PaymentFailedPage() {
  const navigate = useNavigate()
  const { isCheckingAuth } = useRequireAuth()
  const failure = getPaymentFailure()

  useEffect(() => {
    if (isCheckingAuth) return

    if (!failure?.message) {
      navigate('/cart', { replace: true })
    }
  }, [failure, isCheckingAuth, navigate])

  if (isCheckingAuth || !failure?.message) {
    return null
  }

  return <PaymentFailedView message={failure.message} />
}

export default PaymentFailedPage
