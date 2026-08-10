import { Outlet } from 'react-router-dom'
import { WishlistProvider } from '@/contexts/WishlistContext'
import Header from './Header'
import Footer from './Footer'
import './Layout.css'

function Layout() {
  return (
    <WishlistProvider>
      <div className="layout">
        <Header />
        <main className="layout__main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </WishlistProvider>
  )
}

export default Layout
