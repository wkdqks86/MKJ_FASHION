import { useState } from 'react'
import { FALLBACK_IMAGE } from '@/constants/homeProducts'

function LiveImage({ product, className }) {
  const [src, setSrc] = useState(product?.image || FALLBACK_IMAGE)

  return (
    <img
      src={src}
      alt={product?.name || 'Brand Live'}
      className={className}
      loading="lazy"
      onError={() => setSrc(FALLBACK_IMAGE)}
    />
  )
}

function BrandLiveSection({ brandLive }) {
  const [leftTop, leftBottom] = brandLive?.left || []
  const hero = brandLive?.hero

  return (
    <section className="section">
      <div className="section__inner">
        <h2 className="section__title section__title--center">BRAND LIVE</h2>
        <div className="brand-live">
          <div className="brand-live__col">
            {leftTop && (
              <div className="brand-live__card">
                <LiveImage product={leftTop} className="brand-live__img" />
                <div className="brand-live__caption">
                  <span>{leftTop.brand}</span>
                  <strong>{leftTop.name}</strong>
                </div>
              </div>
            )}
            {leftBottom && (
              <div className="brand-live__card">
                <LiveImage product={leftBottom} className="brand-live__img" />
                <div className="brand-live__caption">
                  <span>{leftBottom.brand}</span>
                  <strong>{leftBottom.name}</strong>
                </div>
              </div>
            )}
          </div>
          {hero && (
            <div className="brand-live__hero">
              <LiveImage product={hero} className="brand-live__img" />
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
