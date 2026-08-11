import HomeProductImage from '@/components/home/HomeProductImage'

function BrandLiveSection({ brandLive }) {
  if (!brandLive) {
    return null
  }

  const [leftTop, leftBottom] = brandLive.left || []
  const hero = brandLive?.hero

  return (
    <section className="section">
      <div className="section__inner">
        <h2 className="section__title section__title--center">BRAND LIVE</h2>
        <div className="brand-live">
          <div className="brand-live__col">
            {leftTop && (
              <div className="brand-live__card">
                <HomeProductImage product={leftTop} className="brand-live__img" />
                <div className="brand-live__caption">
                  <span>{leftTop.brand}</span>
                  <strong>{leftTop.name}</strong>
                </div>
              </div>
            )}
            {leftBottom && (
              <div className="brand-live__card">
                <HomeProductImage product={leftBottom} className="brand-live__img" />
                <div className="brand-live__caption">
                  <span>{leftBottom.brand}</span>
                  <strong>{leftBottom.name}</strong>
                </div>
              </div>
            )}
          </div>
          {hero && (
            <div className="brand-live__hero brand-live__hero--lifestyle">
              <HomeProductImage product={hero} className="brand-live__img brand-live__img--hero" />
              <span className="brand-live__badge">{hero.brand}</span>
              <div className="brand-live__hero-caption">
                <strong>{hero.name}</strong>
                <span>₩{hero.price}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BrandLiveSection
