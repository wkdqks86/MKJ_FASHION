const { GENDER, CATEGORY_TYPE } = require('../utils/productSku');

const APPAREL_SIZES = ['S', 'M', 'L', 'XL'];

const SHOE_SIZES = {
  [GENDER.FEMALE]: ['240', '250', '260', '270'],
  [GENDER.MALE]: ['250', '260', '270', '280'],
};

function getProductSizes(gender, categoryType) {
  if (categoryType === CATEGORY_TYPE.SHOES) {
    return SHOE_SIZES[gender] || SHOE_SIZES[GENDER.MALE];
  }

  return APPAREL_SIZES;
}

function getLegacyDefaultSize(gender, categoryType) {
  if (categoryType === CATEGORY_TYPE.SHOES) {
    return '260';
  }

  return 'M';
}

function toStockObject(stockBySize) {
  if (!stockBySize) return {};

  if (stockBySize instanceof Map) {
    return Object.fromEntries(stockBySize);
  }

  if (typeof stockBySize === 'object') {
    return { ...stockBySize };
  }

  return {};
}

function normalizeStockBySize(product = {}) {
  const sizes = getProductSizes(product.gender, product.categoryType);
  const raw = toStockObject(product.stockBySize);
  const normalized = {};

  for (const size of sizes) {
    normalized[size] = Math.max(0, Number(raw[size]) || 0);
  }

  const hasAnyStock = sizes.some((size) => normalized[size] > 0);
  const hasStockBySizeData = Object.keys(raw).length > 0;
  if (!hasAnyStock && !hasStockBySizeData && product.stock != null && Number(product.stock) > 0) {
    const legacyDefault = getLegacyDefaultSize(product.gender, product.categoryType);
    normalized[legacyDefault] = Math.max(0, Number(product.stock) || 0);
  }

  return normalized;
}

function getTotalStock(stockBySize) {
  const values = toStockObject(stockBySize);
  return Object.values(values).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

function parseStockBySize(input, gender, categoryType) {
  const sizes = getProductSizes(gender, categoryType);
  const normalized = {};

  if (!input || typeof input !== 'object') {
    for (const size of sizes) {
      normalized[size] = 0;
    }
    return normalized;
  }

  const raw = toStockObject(input);

  for (const size of sizes) {
    if (raw[size] === undefined || raw[size] === '') {
      normalized[size] = 0;
      continue;
    }

    const value = Number(raw[size]);
    if (Number.isNaN(value) || value < 0) {
      throw new Error(`Invalid stock for size ${size}`);
    }
    normalized[size] = value;
  }

  return normalized;
}

function getStockForSize(product, size) {
  const stockBySize = normalizeStockBySize(product);
  return stockBySize[size] ?? 0;
}

function isValidProductSize(product, size) {
  if (!size) return false;
  const sizes = getProductSizes(product.gender, product.categoryType);
  return sizes.includes(size);
}

function formatProductStock(product) {
  const doc = product?.toObject ? product.toObject() : { ...product };

  if (doc.stockBySize instanceof Map) {
    doc.stockBySize = Object.fromEntries(doc.stockBySize);
  }

  const stockBySize = normalizeStockBySize(doc);

  return {
    ...doc,
    stockBySize,
    stock: getTotalStock(stockBySize),
  };
}

function applyStockBySizeToDocument(product, stockBySize) {
  product.stockBySize = new Map(Object.entries(stockBySize));
  if (typeof product.markModified === 'function') {
    product.markModified('stockBySize');
  }
}

async function decrementStockForSize(productDoc, size, quantity) {
  const product = formatProductStock(productDoc);
  const availableStock = getStockForSize(product, size);

  if (availableStock < quantity) {
    return { error: 'Insufficient stock for selected size' };
  }

  const nextStockBySize = { ...product.stockBySize };
  nextStockBySize[size] = availableStock - quantity;
  applyStockBySizeToDocument(productDoc, nextStockBySize);

  return { stockBySize: nextStockBySize };
}

module.exports = {
  APPAREL_SIZES,
  SHOE_SIZES,
  getProductSizes,
  normalizeStockBySize,
  getTotalStock,
  getStockForSize,
  isValidProductSize,
  parseStockBySize,
  formatProductStock,
  decrementStockForSize,
  applyStockBySizeToDocument,
};
