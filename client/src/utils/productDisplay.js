import { formatCategoryLabel } from '@/constants/productCategories'
import { BRAND_LIVE_HERO_SKUS, FALLBACK_HOME_PRODUCTS } from '@/constants/homeProducts'

export function shuffleArray(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function mapProductForHomeCard(product) {
  const displayPrice = product.salePrice ?? product.listPrice
  const hasDiscount = product.salePrice != null && product.salePrice < product.listPrice

  return {
    id: product._id,
    brand: formatCategoryLabel(product.gender, product.categoryType),
    name: product.name,
    price: displayPrice.toLocaleString('ko-KR'),
    listPrice: product.listPrice?.toLocaleString('ko-KR'),
    image: product.image,
    sku: product.sku,
    hasDiscount,
    discountRate: product.discountRate,
  }
}

function padWithFallbacks(items, count) {
  const result = items.map((item) => ({ ...item }))
  let fallbackIndex = 0

  while (result.length < count) {
    const fallback = FALLBACK_HOME_PRODUCTS[fallbackIndex % FALLBACK_HOME_PRODUCTS.length]
    result.push({
      ...fallback,
      id: `${fallback.id}-pad-${fallbackIndex}`,
    })
    fallbackIndex += 1
  }

  return result
}

function pickBrandLiveHero(products) {
  const skuSet = new Set(BRAND_LIVE_HERO_SKUS.map((sku) => sku.toUpperCase()))
  const candidates = products.filter((product) =>
    skuSet.has(String(product.sku || '').toUpperCase()),
  )

  if (candidates.length === 0) {
    return null
  }

  return mapProductForHomeCard(shuffleArray(candidates)[0])
}

export function buildHomeLayout(products) {
  const mapped = products.map(mapProductForHomeCard)
  const pool = shuffleArray(padWithFallbacks(mapped, 15))

  return {
    hasApiProducts: mapped.length > 0,
    totalCount: mapped.length,
    heroProduct: pool[0],
    keywordThumbs: pool.slice(0, 4),
    keywordMain: pool[4],
    keywordSub: pool[5],
    brandLive: {
      left: [pool[6], pool[7]],
      hero: pickBrandLiveHero(products),
    },
    brandNew: pool.slice(0, 5),
    brandBest: pool.slice(5, 10),
    hotItems: pool.slice(10, 15),
  }
}

export function splitHomeProducts(products) {
  const layout = buildHomeLayout(products)
  return {
    brandNew: layout.brandNew,
    brandBest: layout.brandBest,
    hotItems: layout.hotItems,
    thumbProducts: layout.keywordThumbs,
  }
}
