import HomeContent from '@/components/home/HomeContent'
import ChatToast from '@/components/ui/ChatToast'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useHomeProducts } from '@/hooks/useHomeProducts'
import './HomePage.css'

function HomePage() {
  const { user } = useAuthSession()
  const { products, isLoading, error } = useHomeProducts()

  return (
    <div className="home">
      <ChatToast userName={user?.name || ''} />
      <HomeContent products={products} isLoading={isLoading} error={error} />
    </div>
  )
}

export default HomePage
