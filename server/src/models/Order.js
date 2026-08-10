const mongoose = require('mongoose');

const ORDER_STATUS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUS = ['pending', 'paid', 'failed', 'refunded'];
const PAYMENT_METHODS = ['card', 'transfer', 'kakao'];

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      trim: true,
      uppercase: true,
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
      trim: true,
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price must be at least 0'],
    },
    lineTotal: {
      type: Number,
      required: [true, 'Line total is required'],
      min: [0, 'Line total must be at least 0'],
    },
  },
  { _id: false }
);

const ordererSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Orderer name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    recipientName: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Recipient phone is required'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
    },
    addressLine1: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
      default: '',
    },
    memo: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: {
        values: PAYMENT_METHODS,
        message: '{VALUE} is not a valid payment method',
      },
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: {
        values: PAYMENT_STATUS,
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
    },
    paidAt: {
      type: Date,
      default: null,
    },
    transactionId: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const shippingInfoSchema = new mongoose.Schema(
  {
    carrier: {
      type: String,
      trim: true,
      default: null,
    },
    trackingNumber: {
      type: String,
      trim: true,
      default: null,
    },
    shippedAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    orderer: {
      type: ordererSchema,
      required: [true, 'Orderer information is required'],
    },
    shipping: {
      type: shippingSchema,
      required: [true, 'Shipping information is required'],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'At least one order item is required',
      },
    },
    itemsSubtotal: {
      type: Number,
      required: [true, 'Items subtotal is required'],
      min: [0, 'Items subtotal must be at least 0'],
    },
    shippingFee: {
      type: Number,
      required: [true, 'Shipping fee is required'],
      min: [0, 'Shipping fee must be at least 0'],
      default: 0,
    },
    discountAmount: {
      type: Number,
      min: [0, 'Discount amount must be at least 0'],
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be at least 0'],
    },
    payment: {
      type: paymentSchema,
      required: [true, 'Payment information is required'],
    },
    status: {
      type: String,
      enum: {
        values: ORDER_STATUS,
        message: '{VALUE} is not a valid order status',
      },
      default: 'pending',
    },
    shippingInfo: {
      type: shippingInfoSchema,
      default: () => ({}),
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancelReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'orderer.name': 1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
module.exports.ORDER_STATUS = ORDER_STATUS;
module.exports.PAYMENT_STATUS = PAYMENT_STATUS;
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;
