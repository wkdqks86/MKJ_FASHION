import { useState } from 'react'
import { FALLBACK_IMAGE } from '@/constants/homeProducts'

function FeatureImage({ product, className }) {
  const [src, setSrc] = useState(product?.image || FALLBACK_IMAGE)

  return (
    <img
      src={src}
      alt={product?.name || '키워드 랭킹'}
      className={className}
      loading="lazy"
      onError={() => setSrc(FALLBACK_IMAGE)}
    />
  )
}

function KeywordRankingSection({ keywords, thumbProducts, mainProduct, subProduct }) {
  return (
    <section className="section section--ranking">
      <div className="section__inner">
        <h2 className="section__title">KEYWORD RANKING</h2>
        <div className="ranking">
          <ol className="ranking__list">
            {keywords.map((item) => (
              <li key={item.rank} className="ranking__item">
                <span className="ranking__num">{item.rank}</span>
                <span className="ranking__label">{item.label}</span>
              </li>
            ))}
          </ol>
          <div className="ranking__visual">
            <FeatureImage product={mainProduct} className="ranking__main-img" />
            <div className="ranking__sub-wrap">
              <FeatureImage product={subProduct} className="ranking__sub-img" />
              {subProduct && (
                <div className="ranking__sub-info">
                  <p className="ranking__sub-brand">{subProduct.brand}</p>
                  <p className="ranking__sub-name">{subProduct.name}</p>
                  <p className="ranking__sub-price">₩{subProduct.price}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ranking__thumbs">
          {thumbProducts.map((product) => (
            <FeatureImage
              key={product.id}
              product={product}
              className="ranking__thumb"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default KeywordRankingSection
