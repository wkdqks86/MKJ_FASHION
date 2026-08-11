import HomeProductImage from '@/components/home/HomeProductImage'

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
            {mainProduct && (
              <div className="ranking__main-wrap">
                <HomeProductImage product={mainProduct} className="ranking__main-img" />
                <div className="ranking__main-info">
                  <p className="ranking__main-brand">{mainProduct.brand}</p>
                  <p className="ranking__main-name">{mainProduct.name}</p>
                  <p className="ranking__main-price">₩{mainProduct.price}</p>
                </div>
              </div>
            )}
            <div className="ranking__sub-wrap">
              {subProduct && (
                <>
                  <HomeProductImage product={subProduct} className="ranking__sub-img" />
                  <div className="ranking__sub-info">
                    <p className="ranking__sub-brand">{subProduct.brand}</p>
                    <p className="ranking__sub-name">{subProduct.name}</p>
                    <p className="ranking__sub-price">₩{subProduct.price}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="ranking__thumbs">
          {thumbProducts.map((product) => (
            <HomeProductImage
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
