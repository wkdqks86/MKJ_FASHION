import { stockBySizeToForm } from '@/utils/productStock'

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
}

export const CATEGORY_TYPE = {
  TOP: 'top',
  BOTTOM: 'bottom',
  ACCESSORY: 'accessory',
  SHOES: 'shoes',
}

export const GENDER_OPTIONS = [
  { value: GENDER.MALE, label: '남성' },
  { value: GENDER.FEMALE, label: '여성' },
]

export const CATEGORY_TYPE_OPTIONS = [
  { value: CATEGORY_TYPE.TOP, label: '상의' },
  { value: CATEGORY_TYPE.BOTTOM, label: '하의' },
  { value: CATEGORY_TYPE.ACCESSORY, label: '악세사리' },
  { value: CATEGORY_TYPE.SHOES, label: '신발' },
]

export const GENDER_LABELS = {
  [GENDER.MALE]: '남성',
  [GENDER.FEMALE]: '여성',
}

export const CATEGORY_TYPE_LABELS = {
  [CATEGORY_TYPE.TOP]: '상의',
  [CATEGORY_TYPE.BOTTOM]: '하의',
  [CATEGORY_TYPE.ACCESSORY]: '악세사리',
  [CATEGORY_TYPE.SHOES]: '신발',
}

export const MIN_DISCOUNT_PERCENT = 20
export const MAX_DISCOUNT_PERCENT = 80

export const DISCOUNT_PERCENT_OPTIONS = Array.from(
  { length: (MAX_DISCOUNT_PERCENT - MIN_DISCOUNT_PERCENT) / 10 + 1 },
  (_, index) => MIN_DISCOUNT_PERCENT + index * 10,
)

export function formatCategoryLabel(gender, categoryType) {
  const g = GENDER_LABELS[gender] || gender
  const c = CATEGORY_TYPE_LABELS[categoryType] || categoryType
  return `${g} · ${c}`
}

export function getDisplaySalePrice(product) {
  return product.salePrice ?? product.listPrice
}

export const INITIAL_PRODUCT_FORM = {
  name: '',
  listPrice: '',
  gender: GENDER.MALE,
  categoryType: CATEGORY_TYPE.TOP,
  image: '',
  description: '',
  stockBySize: { S: '', M: '', L: '', XL: '' },
}

export function productToForm(product) {
  return {
    name: product.name || '',
    listPrice: product.listPrice != null ? String(product.listPrice) : '',
    gender: product.gender,
    categoryType: product.categoryType,
    image: product.image || '',
    description: product.description || '',
    stockBySize: stockBySizeToForm(product),
  }
}
