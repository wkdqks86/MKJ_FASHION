const Product = require('../models/Product');
const {
  GENDER,
  CATEGORY_TYPE,
  buildSkuPrefix,
  parseSkuSequence,
  formatSku,
  calcSalePrice,
  MIN_BULK_DISCOUNT_PERCENT,
  MAX_BULK_DISCOUNT_PERCENT,
} = require('../utils/productSku');
const { parseStockBySize, formatProductStock, applyStockBySizeToDocument } = require('../utils/productStock');

const handleError = (error, res) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    if (field === 'sku') {
      return res.status(409).json({ success: false, message: 'SKU already exists' });
    }
    return res.status(409).json({ success: false, message: 'Duplicate value' });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid product id' });
  }

  console.error(error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

const isValidGender = (value) => Object.values(GENDER).includes(value);
const isValidCategoryType = (value) => Object.values(CATEGORY_TYPE).includes(value);

const generateNextSku = async (gender, categoryType) => {
  const prefix = buildSkuPrefix(gender, categoryType);

  const latest = await Product.findOne({ sku: new RegExp(`^${prefix.replace(/-/g, '\\-')}`) })
    .sort({ sku: -1 })
    .select('sku')
    .lean();

  const nextSequence = latest ? parseSkuSequence(latest.sku, prefix) + 1 : 1;
  return formatSku(prefix, nextSequence);
};

const createProduct = async (req, res) => {
  try {
    const { name, listPrice, gender, categoryType, image, description, stockBySize } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (listPrice === undefined || listPrice === null || Number(listPrice) < 0) {
      return res.status(400).json({ success: false, message: 'Valid list price is required' });
    }
    if (!isValidGender(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be male or female (남성/여성)',
      });
    }
    if (!isValidCategoryType(categoryType)) {
      return res.status(400).json({
        success: false,
        message: 'Category type must be top, bottom, accessory, or shoes',
      });
    }
    if (!image?.trim()) {
      return res.status(400).json({ success: false, message: 'Product image is required' });
    }

    const sku = await generateNextSku(gender, categoryType);

    const product = await Product.create({
      sku,
      name: name.trim(),
      listPrice: Number(listPrice),
      gender,
      categoryType,
      image: image.trim(),
      description: description?.trim() || '',
      stockBySize: parseStockBySize(stockBySize, gender, categoryType),
      salePrice: null,
      discountRate: null,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: formatProductStock(product),
    });
  } catch (error) {
    handleError(error, res);
  }
};

const getProducts = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.categoryType) filter.categoryType = req.query.categoryType;
    if (req.query.isDisplayed !== undefined) {
      filter.isDisplayed = req.query.isDisplayed === 'true';
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json({
      success: true,
      products: products.map((product) => formatProductStock(product)),
    });
  } catch (error) {
    handleError(error, res);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, product: formatProductStock(product) });
  } catch (error) {
    handleError(error, res);
  }
};

const updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'listPrice',
      'image',
      'description',
      'stockBySize',
      'isDisplayed',
      'gender',
      'categoryType',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (updates.stockBySize !== undefined) {
      try {
        const gender = updates.gender ?? product.gender;
        const categoryType = updates.categoryType ?? product.categoryType;
        applyStockBySizeToDocument(
          product,
          parseStockBySize(updates.stockBySize, gender, categoryType),
        );
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      delete updates.stockBySize;
    }

    if (updates.gender !== undefined && !isValidGender(updates.gender)) {
      return res.status(400).json({ success: false, message: 'Invalid gender' });
    }
    if (updates.categoryType !== undefined && !isValidCategoryType(updates.categoryType)) {
      return res.status(400).json({ success: false, message: 'Invalid category type' });
    }
    if (updates.listPrice !== undefined && Number(updates.listPrice) < 0) {
      return res.status(400).json({ success: false, message: 'List price must be at least 0' });
    }

    Object.assign(product, updates);
    await product.save();

    return res.json({ success: true, message: 'Product updated', product: formatProductStock(product) });
  } catch (error) {
    handleError(error, res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false, isDisplayed: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    handleError(error, res);
  }
};

const bulkApplySalePrice = async (req, res) => {
  try {
    const { productIds, discountPercent } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'productIds array is required',
      });
    }

    const rate = Number(discountPercent);
    if (Number.isNaN(rate) || rate < MIN_BULK_DISCOUNT_PERCENT || rate > MAX_BULK_DISCOUNT_PERCENT) {
      return res.status(400).json({
        success: false,
        message: `discountPercent must be between ${MIN_BULK_DISCOUNT_PERCENT} and ${MAX_BULK_DISCOUNT_PERCENT}`,
      });
    }

    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found' });
    }

    const updated = await Promise.all(
      products.map(async (product) => {
        const { salePrice, discountRate } = calcSalePrice(product.listPrice, rate);
        product.salePrice = salePrice;
        product.discountRate = discountRate;
        await product.save();
        return product;
      })
    );

    return res.json({
      success: true,
      message: `Sale price applied to ${updated.length} product(s)`,
      products: updated.map((product) => formatProductStock(product)),
    });
  } catch (error) {
    handleError(error, res);
  }
};

const bulkClearSalePrice = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'productIds array is required',
      });
    }

    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found' });
    }

    const updated = await Promise.all(
      products.map(async (product) => {
        product.salePrice = null;
        product.discountRate = null;
        await product.save();
        return product;
      })
    );

    return res.json({
      success: true,
      message: `Discount removed from ${updated.length} product(s)`,
      products: updated.map((product) => formatProductStock(product)),
    });
  } catch (error) {
    handleError(error, res);
  }
};

const previewSku = async (req, res) => {
  try {
    const { gender, categoryType } = req.query;

    if (!isValidGender(gender) || !isValidCategoryType(categoryType)) {
      return res.status(400).json({
        success: false,
        message: 'Valid gender and categoryType query params are required',
      });
    }

    const sku = await generateNextSku(gender, categoryType);
    return res.json({ success: true, previewSku: sku });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkApplySalePrice,
  bulkClearSalePrice,
  previewSku,
};
