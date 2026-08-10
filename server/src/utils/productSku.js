const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
};

const CATEGORY_TYPE = {
  TOP: 'top',
  BOTTOM: 'bottom',
  ACCESSORY: 'accessory',
  SHOES: 'shoes',
};

/** SKU middle segment: gender(1) + type(3) → MTOP, FACC … */
const CATEGORY_CODE_MAP = {
  [`${GENDER.MALE}:${CATEGORY_TYPE.TOP}`]: 'MTOP',
  [`${GENDER.MALE}:${CATEGORY_TYPE.BOTTOM}`]: 'MBTM',
  [`${GENDER.MALE}:${CATEGORY_TYPE.ACCESSORY}`]: 'MACC',
  [`${GENDER.MALE}:${CATEGORY_TYPE.SHOES}`]: 'MSHO',
  [`${GENDER.FEMALE}:${CATEGORY_TYPE.TOP}`]: 'FTOP',
  [`${GENDER.FEMALE}:${CATEGORY_TYPE.BOTTOM}`]: 'FBTM',
  [`${GENDER.FEMALE}:${CATEGORY_TYPE.ACCESSORY}`]: 'FACC',
  [`${GENDER.FEMALE}:${CATEGORY_TYPE.SHOES}`]: 'FSHO',
};

const GENDER_LABELS = {
  [GENDER.MALE]: '남성',
  [GENDER.FEMALE]: '여성',
};

const CATEGORY_TYPE_LABELS = {
  [CATEGORY_TYPE.TOP]: '상의',
  [CATEGORY_TYPE.BOTTOM]: '하의',
  [CATEGORY_TYPE.ACCESSORY]: '악세사리',
  [CATEGORY_TYPE.SHOES]: '신발',
};

const MIN_BULK_DISCOUNT_PERCENT = 20;
const MAX_BULK_DISCOUNT_PERCENT = 80;

function getCategoryCode(gender, categoryType) {
  const code = CATEGORY_CODE_MAP[`${gender}:${categoryType}`];
  if (!code) {
    throw new Error('Invalid gender and categoryType combination');
  }
  return code;
}

function buildSkuPrefix(gender, categoryType) {
  return `MKJ-${getCategoryCode(gender, categoryType)}-`;
}

function parseSkuSequence(sku, prefix) {
  if (!sku.startsWith(prefix)) return 0;
  const seqPart = sku.slice(prefix.length);
  const num = parseInt(seqPart, 10);
  return Number.isNaN(num) ? 0 : num;
}

function formatSku(prefix, sequence) {
  return `${prefix}${String(sequence).padStart(6, '0')}`;
}

function calcSalePrice(listPrice, discountPercent) {
  const rate = Math.min(MAX_BULK_DISCOUNT_PERCENT, Math.max(MIN_BULK_DISCOUNT_PERCENT, discountPercent));
  const salePrice = Math.round(listPrice * (1 - rate / 100));
  return { salePrice, discountRate: rate };
}

module.exports = {
  GENDER,
  CATEGORY_TYPE,
  CATEGORY_CODE_MAP,
  GENDER_LABELS,
  CATEGORY_TYPE_LABELS,
  MIN_BULK_DISCOUNT_PERCENT,
  MAX_BULK_DISCOUNT_PERCENT,
  getCategoryCode,
  buildSkuPrefix,
  parseSkuSequence,
  formatSku,
  calcSalePrice,
};
