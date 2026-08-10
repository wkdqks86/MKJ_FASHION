import { useState } from 'react'
import ProductCarousel from '@/components/home/ProductCarousel'
import { FALLBACK_IMAGE } from '@/constants/homeProducts'

function EditImage({ product, className }) {
  const [src, setSrc] = useState(product?.image || FALLBACK_IMAGE)

  return (
    <img
      src={src}
      alt={product?.name || 'The Edit'}
      className={className}
      loading="lazy"
      onError={() => setSrc(FALLBACK_IMAGE)}
    />
  )
}

function ProductSection({ title, subtitle, products, editMode = false, theEdit }) {
  if (editMode && theEdit) {
    const [main, ...side] = [theEdit.main, ...(theEdit.side || [])]

    return (
      <section className="section section--edit">
        <div className="section__inner">
          <div className="section__header">
            <h2 className="section__title">{title}</h2>
            {subtitle && <span className="section__subtitle">{subtitle}</span>}
          </div>
          <div className="the-edit">
            <div className="the-edit__main-wrap">
              <EditImage product={main} className="the-edit__main" />
              {main && (
                <div className="the-edit__main-info">
                  <p>{main.brand}</p>
                  <h3>{main.name}</h3>
                  <span>₩{main.price}</span>
                </div>
              )}
            </div>
            <div className="the-edit__side">
              {side.map((product) => (
                <div key={product.id} className="the-edit__side-item">
                  <EditImage product={product} className="the-edit__side-img" />
                  <p>{product.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{title}</h2>
          {subtitle && <span className="section__subtitle">{subtitle}</span>}
        </div>
        <ProductCarousel products={products} />
      </div>
    </section>
  )
}

export default ProductSection
