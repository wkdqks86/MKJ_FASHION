import { useMemo } from 'react'
import { KEYWORDS } from '@/constants/homeProducts'
import { buildHomeLayout, mapProductForHomeCard } from '@/utils/productDisplay'
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
  const sectionProducts = useMemo(() => {
    if (isLoading) return []
    return products.map(mapProductForHomeCard)
  }, [products, isLoading])
  const { styleEdit, isLoading: isStyleEditLoading } = useHomeStyleEdit()

  return (
    <>
      <HeroSection heroProduct={layout.heroProduct} />
      <KeywordRankingSection
        keywords={KEYWORDS}
        thumbProducts={layout.keywordThumbs}
        mainProduct={layout.keywordMain}
        subProduct={layout.keywordSub}
      />
      <PromoBar />
      <BrandLiveSection brandLive={layout.brandLive} />
      {error && (
        <p className="home-products-status home-products-status--error" role="alert">
          {error}
        </p>
      )}
      {isLoading && (
        <p className="home-products-status">상품을 불러오는 중...</p>
      )}
      <ProductSection title="BRAND NEW" subtitle="CATEGORY NEW" products={sectionProducts} />
      {!isStyleEditLoading && <TheEditSection styleEdit={styleEdit} />}
      <ProductSection title="BRAND BEST" subtitle="CATEGORY BEST" products={sectionProducts} />
      <ProductSection title="HOT ITEM" subtitle="" products={sectionProducts} />
    </>
  )
}

export default HomeContent
