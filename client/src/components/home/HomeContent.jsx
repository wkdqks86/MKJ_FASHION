import { useMemo } from 'react'
import { KEYWORDS } from '@/constants/homeProducts'
import { buildHomeLayout, mapProductForHomeCard, shuffleArray } from '@/utils/productDisplay'
import { useHomeStyleEdit } from '@/hooks/useStyleEdits'
import BrandLiveSection from './BrandLiveSection'
import HeroSection from './HeroSection'
import KeywordRankingSection from './KeywordRankingSection'
import ProductSection from './ProductSection'
import PromoBar from './PromoBar'
import TheEditSection from './TheEditSection'

function HomeContent({ products, isLoading, error }) {
  const layout = useMemo(
    () => buildHomeLayout(isLoading ? [] : products),
    [products, isLoading]
  )
  const mappedProducts = useMemo(() => {
    if (isLoading) return []
    return products.map(mapProductForHomeCard)
  }, [products, isLoading])
  const brandNewProducts = useMemo(
    () => shuffleArray(mappedProducts),
    [mappedProducts],
  )
  const brandBestProducts = useMemo(
    () => shuffleArray(mappedProducts),
    [mappedProducts],
  )
  const hotItemProducts = useMemo(
    () => shuffleArray(mappedProducts),
    [mappedProducts],
  )
  const { styleEdit, isLoading: isStyleEditLoading } = useHomeStyleEdit()

  return (
    <>
      <HeroSection heroProduct={isLoading ? null : layout.heroProduct} />
      <KeywordRankingSection
        keywords={KEYWORDS}
        thumbProducts={isLoading ? [] : layout.keywordThumbs}
        mainProduct={isLoading ? null : layout.keywordMain}
        subProduct={isLoading ? null : layout.keywordSub}
      />
      <PromoBar />
      <BrandLiveSection brandLive={isLoading ? null : layout.brandLive} />
      {error && (
        <p className="home-products-status home-products-status--error" role="alert">
          {error}
        </p>
      )}
      {isLoading && (
        <p className="home-products-status">상품을 불러오는 중...</p>
      )}
      <ProductSection
        sectionId="home-products"
        title="BRAND NEW"
        subtitle="CATEGORY NEW"
        products={brandNewProducts}
      />
      {!isStyleEditLoading && <TheEditSection styleEdit={styleEdit} />}
      <ProductSection title="BRAND BEST" subtitle="CATEGORY BEST" products={brandBestProducts} />
      <ProductSection title="HOT ITEM" subtitle="" products={hotItemProducts} />
    </>
  )
}

export default HomeContent
