import HomeProductImage from '@/components/home/HomeProductImage'

function HeroSection({ heroProduct }) {
  const handleShopNow = (event) => {
    event.preventDefault()
    document.getElementById('home-products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div className="hero__content">
        <p className="hero__eyebrow">LIMITED OFFER</p>
        <h1 className="hero__title">CLEARANCE<br />SALE</h1>
        <p className="hero__desc">
          시즌 오프 최대 70% 할인<br />
          MKJ FASHION 봄 컬렉션
        </p>
        <a href="#home-products" className="hero__cta" onClick={handleShopNow}>
          Shop Now
        </a>
        {heroProduct && (
          <p className="hero__featured">
            <span className="hero__featured-label">Featured</span>
            {heroProduct.name}
          </p>
        )}
      </div>
      <div className="hero__visual">
        {heroProduct && (
          <HomeProductImage product={heroProduct} className="hero__product-img" alt="MKJ FASHION" />
        )}
        <div className="hero__tag">
          <span>SALE</span>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
