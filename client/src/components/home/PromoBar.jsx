import { Link } from 'react-router-dom'
import { useAuthSession } from '@/hooks/useAuthSession'

function PromoBar() {
  const { user, isLoading } = useAuthSession()

  if (isLoading || user) {
    return null
  }

  return (
    <section className="promo-bar">
      <div className="promo-bar__inner">
        <p>MKJ FASHION 회원 전용 쿠폰 · 신규 가입 시 10% 할인</p>
        <Link to="/signup" className="promo-bar__btn">JOIN</Link>
      </div>
    </section>
  )
}

export default PromoBar
