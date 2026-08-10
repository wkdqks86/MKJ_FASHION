const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
  },
  { _id: true, timestamps: true }
);

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
    },
    items: {
      type: [wishlistItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ 'items.product': 1 });

wishlistSchema.pre('validate', function validateUniqueItems(next) {
  if (!Array.isArray(this.items) || this.items.length === 0) {
    return next();
  }

  const seen = new Set();

  for (const item of this.items) {
    const productId = item.product?.toString();

    if (seen.has(productId)) {
      this.invalidate('items', 'Duplicate product in wishlist');
      return next();
    }

    seen.add(productId);
  }

  return next();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
