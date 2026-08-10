export const APPAREL_SIZES = ['S', 'M', 'L', 'XL']

export const SHOES_CATEGORY = 'shoes'

export const SHOE_SIZES = {
  female: ['240', '250', '260', '270'],
  male: ['250', '260', '270', '280'],
}

export function getProductSizes(gender, categoryType) {
  if (categoryType === SHOES_CATEGORY) {
    return SHOE_SIZES[gender] || SHOE_SIZES.male
  }

  return APPAREL_SIZES
}

function getLegacyDefaultSize(gender, categoryType) {
  if (categoryType === SHOES_CATEGORY) {
    return '260'
  }

  return 'M'
}

function toStockObject(stockBySize) {
  if (!stockBySize) return {}
  if (stockBySize instanceof Map) {
    return Object.fromEntries(stockBySize)
  }
  if (typeof stockBySize === 'object') {
    return { ...stockBySize }
  }
  return {}
}

export function normalizeStockBySize(product = {}) {
  const sizes = getProductSizes(product.gender, product.categoryType)
  const raw = toStockObject(product.stockBySize)
  const normalized = {}

  for (const size of sizes) {
    normalized[size] = Math.max(0, Number(raw[size]) || 0)
  }

  const hasAnyStock = sizes.some((size) => normalized[size] > 0)
  const hasStockBySizeData = Object.keys(raw).length > 0
  if (!hasAnyStock && !hasStockBySizeData && product.stock != null && Number(product.stock) > 0) {
    const legacyDefault = getLegacyDefaultSize(product.gender, product.categoryType)
    normalized[legacyDefault] = Math.max(0, Number(product.stock) || 0)
  }

  return normalized
}

export function getTotalStock(stockBySize) {
  const values = toStockObject(stockBySize)
  return Object.values(values).reduce((sum, value) => sum + (Number(value) || 0), 0)
}

export function createEmptyStockForm(gender, categoryType) {
  return getProductSizes(gender, categoryType).reduce((form, size) => {
    form[size] = ''
    return form
  }, {})
}

export function migrateStockForm(stockBySize, gender, categoryType) {
  const sizes = getProductSizes(gender, categoryType)
  return sizes.reduce((form, size) => {
    form[size] = stockBySize?.[size] ?? ''
    return form
  }, {})
}

export function stockBySizeToForm(product) {
  const normalized = normalizeStockBySize(product)
  const sizes = getProductSizes(product.gender, product.categoryType)

  return sizes.reduce((form, size) => {
    form[size] = normalized[size] > 0 ? String(normalized[size]) : ''
    return form
  }, {})
}

export function parseStockBySizeForm(formStockBySize, gender, categoryType) {
  const sizes = getProductSizes(gender, categoryType)
  const result = {}

  for (const size of sizes) {
    const value = formStockBySize?.[size]
    result[size] = value === '' || value === undefined ? 0 : Math.max(0, Number(value) || 0)
  }

  return result
}

export function getStockForSize(product, size) {
  const stockBySize = normalizeStockBySize(product)
  return stockBySize[size] ?? 0
}

export function isShoeCategory(categoryType) {
  return categoryType === SHOES_CATEGORY
}
