const Order = require('../models/Order');

const FREE_SHIPPING_THRESHOLD = 30000;
const DEFAULT_SHIPPING_FEE = 3000;

const getDisplayPrice = (product) => product.salePrice ?? product.listPrice;

const calculateItemsSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.lineTotal, 0);

const calculateShippingFee = () => 0;

const calculateTotalAmount = (itemsSubtotal, shippingFee, discountAmount = 0) =>
  Math.max(0, itemsSubtotal + shippingFee - discountAmount);

const formatShippingAddress = (shipping = {}) => {
  const line2 = shipping.addressLine2 ? ` ${shipping.addressLine2}` : '';
  return `[${shipping.postalCode}] ${shipping.addressLine1}${line2}`;
};

const getOrdererName = (order) => order.orderer?.name || order.guestName || '';

const generateOrderNumber = async () => {
  const now = new Date();
  const ymd = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const prefix = `MKJ-${ymd}-`;
  const latest = await Order.findOne({
    orderNumber: new RegExp(`^${prefix}`),
  })
    .sort({ orderNumber: -1 })
    .select('orderNumber');

  let sequence = 1;

  if (latest?.orderNumber) {
    const suffix = latest.orderNumber.slice(prefix.length);
    const parsed = Number.parseInt(suffix, 10);
    if (!Number.isNaN(parsed)) {
      sequence = parsed + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(4, '0')}`;
};

const buildOrderItemSnapshot = (product, size, quantity) => {
  const unitPrice = getDisplayPrice(product);
  const lineTotal = unitPrice * quantity;

  return {
    product: product._id,
    productName: product.name,
    sku: product.sku,
    image: product.image,
    size,
    quantity,
    unitPrice,
    lineTotal,
  };
};

module.exports = {
  FREE_SHIPPING_THRESHOLD,
  DEFAULT_SHIPPING_FEE,
  getDisplayPrice,
  calculateItemsSubtotal,
  calculateShippingFee,
  calculateTotalAmount,
  formatShippingAddress,
  getOrdererName,
  generateOrderNumber,
  buildOrderItemSnapshot,
};
