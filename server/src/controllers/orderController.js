const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const {
  buildOrderItemSnapshot,
  calculateItemsSubtotal,
  calculateShippingFee,
  calculateTotalAmount,
  formatShippingAddress,
  generateOrderNumber,
  getOrdererName,
} = require('../utils/orderHelpers');
const {
  decrementStockForSize,
  formatProductStock,
  getStockForSize,
  isValidProductSize,
} = require('../utils/productStock');

const PRODUCT_FIELDS =
  'name sku image listPrice salePrice discountRate gender categoryType stockBySize isActive';

const handleError = (error, res) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: 'Order number already exists' });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }

  console.error(error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

const validateShippingInput = (shipping) => {
  if (!shipping) {
    return 'Shipping information is required';
  }

  const requiredFields = ['recipientName', 'phone', 'postalCode', 'addressLine1'];

  for (const field of requiredFields) {
    if (!shipping[field]?.trim()) {
      return `${field} is required`;
    }
  }

  return null;
};

const buildOrdererFromRequest = (req, ordererInput = {}) => ({
  name: ordererInput.name?.trim() || req.user.name,
  email: ordererInput.email?.trim() || req.user.email || null,
  phone: ordererInput.phone?.trim() || req.user.phone || null,
});

const normalizeShippingInput = (shipping) => ({
  recipientName: shipping.recipientName.trim(),
  phone: shipping.phone.trim(),
  postalCode: shipping.postalCode.trim(),
  addressLine1: shipping.addressLine1.trim(),
  addressLine2: shipping.addressLine2?.trim() || '',
  memo: shipping.memo?.trim() || '',
});

const guestLookup = async (req, res) => {
  try {
    const { name, orderNumber } = req.body;

    if (!name || !orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Guest name and order number are required',
      });
    }

    const order = await Order.findOne({
      orderNumber: orderNumber.trim().toUpperCase(),
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const ordererName = getOrdererName(order);
    const isNameMatched = ordererName.trim().toLowerCase() === name.trim().toLowerCase();

    if (!isNameMatched) {
      return res.status(401).json({
        success: false,
        message: 'Guest name does not match order information',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Guest order lookup successful',
      order,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const createOrder = async (req, res) => {
  try {
    const { itemIds = [], shipping, payment, orderer: ordererInput } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one cart item is required' });
    }

    const shippingError = validateShippingInput(shipping);
    if (shippingError) {
      return res.status(400).json({ success: false, message: shippingError });
    }

    if (!payment?.method) {
      return res.status(400).json({ success: false, message: 'Payment method is required' });
    }

    if (!payment?.transactionId?.trim()) {
      return res.status(400).json({ success: false, message: 'Payment transaction id is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: PRODUCT_FIELDS,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const selectedItems = cart.items.filter((item) =>
      itemIds.some((itemId) => item._id.toString() === itemId)
    );

    if (selectedItems.length !== itemIds.length) {
      return res.status(400).json({ success: false, message: 'One or more cart items were not found' });
    }

    const orderItems = [];
    const stockUpdates = [];

    for (const cartItem of selectedItems) {
      if (!cartItem.product) {
        return res.status(400).json({
          success: false,
          message: 'One or more products are no longer available',
        });
      }

      const product = formatProductStock(cartItem.product);

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is no longer available`,
        });
      }

      const size = cartItem.size?.trim();
      if (!size || !isValidProductSize(product, size)) {
        return res.status(400).json({
          success: false,
          message: `Invalid size for ${product.name}`,
        });
      }

      const availableStock = getStockForSize(product, size);
      if (availableStock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} (${size})`,
        });
      }

      orderItems.push(buildOrderItemSnapshot(product, size, cartItem.quantity));
      stockUpdates.push({
        productId: product._id,
        size,
        quantity: cartItem.quantity,
        cartItemId: cartItem._id,
      });
    }

    const itemsSubtotal = calculateItemsSubtotal(orderItems);
    const shippingFee = calculateShippingFee(itemsSubtotal);
    const discountAmount = 0;
    const totalAmount = calculateTotalAmount(itemsSubtotal, shippingFee, discountAmount);
    const orderNumber = await generateOrderNumber();

    for (const update of stockUpdates) {
      const productDoc = await Product.findById(update.productId);

      if (!productDoc) {
        return res.status(400).json({ success: false, message: 'Product not found during stock update' });
      }

      const stockResult = await decrementStockForSize(productDoc, update.size, update.quantity);

      if (stockResult.error) {
        return res.status(400).json({ success: false, message: stockResult.error });
      }

      await productDoc.save();
    }

    const createdOrder = await Order.create({
      orderNumber,
      user: req.user._id,
      orderer: buildOrdererFromRequest(req, ordererInput),
      shipping: normalizeShippingInput(shipping),
      items: orderItems,
      itemsSubtotal,
      shippingFee,
      discountAmount,
      totalAmount,
      payment: {
        method: payment.method,
        status: 'paid',
        paidAt: new Date(),
        transactionId: payment.transactionId.trim(),
      },
      status: 'processing',
    });

    const freshCart = await Cart.findOne({ user: req.user._id });

    if (!freshCart) {
      return res.status(400).json({ success: false, message: 'Cart not found during checkout' });
    }

    for (const update of stockUpdates) {
      freshCart.items.pull(update.cartItemId);
    }

    await freshCart.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: createdOrder,
    });
  } catch (error) {
    if (error.message === 'Insufficient stock for selected size') {
      return res.status(400).json({ success: false, message: error.message });
    }

    handleError(error, res);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isOwner = order.user?.toString() === req.user._id.toString();
    const isAdmin = req.user.user_type === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const { status, shippingInfo, payment, shipping, orderer } = req.body;

    if (orderer) {
      if (orderer.name !== undefined) order.orderer.name = orderer.name;
      if (orderer.email !== undefined) order.orderer.email = orderer.email;
      if (orderer.phone !== undefined) order.orderer.phone = orderer.phone;
      order.markModified('orderer');
    }

    if (shipping) {
      const fields = ['recipientName', 'phone', 'postalCode', 'addressLine1', 'addressLine2', 'memo'];
      for (const field of fields) {
        if (shipping[field] !== undefined) {
          order.shipping[field] = shipping[field];
        }
      }
      order.markModified('shipping');
    }

    if (status !== undefined) {
      order.status = status;

      if (status === 'shipped' && !order.shippingInfo.shippedAt) {
        order.shippingInfo.shippedAt = new Date();
      }

      if (status === 'delivered' && !order.shippingInfo.deliveredAt) {
        order.shippingInfo.deliveredAt = new Date();
      }

      if (status === 'cancelled' && !order.cancelledAt) {
        order.cancelledAt = new Date();
      }
    }

    if (shippingInfo) {
      if (shippingInfo.carrier !== undefined) {
        order.shippingInfo.carrier = shippingInfo.carrier;
      }
      if (shippingInfo.trackingNumber !== undefined) {
        order.shippingInfo.trackingNumber = shippingInfo.trackingNumber;
      }
      order.markModified('shippingInfo');
    }

    if (payment?.status !== undefined) {
      order.payment.status = payment.status;
      if (payment.status === 'paid' && !order.payment.paidAt) {
        order.payment.paidAt = new Date();
      }
      order.markModified('payment');
    }

    if (req.body.cancelReason !== undefined) {
      order.cancelReason = req.body.cancelReason;
    }

    await order.save();

    return res.json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  guestLookup,
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  formatShippingAddress,
  getOrdererName,
};
