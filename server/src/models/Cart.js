const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    size: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.index({ 'items.product': 1 });

cartSchema.pre('validate', function validateUniqueItems(next) {
  if (!Array.isArray(this.items) || this.items.length === 0) {
    return next();
  }

  const seen = new Set();

  for (const item of this.items) {
    const productId = item.product?.toString();
    const sizeKey = item.size?.trim() || '';
    const key = `${productId}:${sizeKey}`;

    if (seen.has(key)) {
      this.invalidate('items', 'Duplicate product and size combination in cart');
      return next();
    }

    seen.add(key);
  }

  return next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
