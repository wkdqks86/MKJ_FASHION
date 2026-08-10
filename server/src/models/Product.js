const mongoose = require('mongoose');
const { GENDER, CATEGORY_TYPE } = require('../utils/productSku');

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    listPrice: {
      type: Number,
      required: [true, 'List price is required'],
      min: [0, 'List price must be at least 0'],
    },
    salePrice: {
      type: Number,
      default: null,
      min: [0, 'Sale price must be at least 0'],
    },
    discountRate: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(GENDER),
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender category is required'],
    },
    categoryType: {
      type: String,
      enum: {
        values: Object.values(CATEGORY_TYPE),
        message: '{VALUE} is not a valid category type',
      },
      required: [true, 'Category type is required'],
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    stockBySize: {
      type: Map,
      of: {
        type: Number,
        min: [0, 'Stock must be at least 0'],
      },
      default: () => new Map(),
    },
    isDisplayed: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ gender: 1, categoryType: 1 });
productSchema.index({ isDisplayed: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
