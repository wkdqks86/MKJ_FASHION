const Cart = require('../models/Cart');
const Product = require('../models/Product');
const {
  formatProductStock,
  getStockForSize,
  isValidProductSize,
} = require('../utils/productStock');

const PRODUCT_FIELDS =
  'name sku image listPrice salePrice discountRate gender categoryType stockBySize isDisplayed isActive';

const handleError = (error, res) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }

  console.error(error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

const getDisplayPrice = (product) => product.salePrice ?? product.listPrice;

const populateCartQuery = (query) =>
  query.populate({
    path: 'items.product',
    select: PRODUCT_FIELDS,
  });

const formatCartResponse = (cart) => {
  if (!cart) return null;

  const cartObject = cart.toObject();
  let totalAmount = 0;
  let itemCount = 0;

  const items = cartObject.items
    .filter((item) => item.product)
    .map((item) => {
      const product = formatProductStock(item.product);
      const unitPrice = getDisplayPrice(product);
      const lineTotal = unitPrice * item.quantity;

      totalAmount += lineTotal;
      itemCount += item.quantity;

      return {
        _id: item._id,
        product,
        quantity: item.quantity,
        size: item.size,
        unitPrice,
        lineTotal,
      };
    });

  return {
    _id: cartObject._id,
    user: cartObject.user,
    items,
    itemCount,
    totalAmount,
    createdAt: cartObject.createdAt,
    updatedAt: cartObject.updatedAt,
  };
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

const findUserCart = async (userId) => Cart.findOne({ user: userId });

const getActiveProduct = async (productId) => {
  const product = await Product.findOne({ _id: productId, isActive: true });

  if (!product) {
    return null;
  }

  return formatProductStock(product);
};

const validateItemRequest = (product, quantity, size) => {
  const normalizedSize = size?.trim() || null;

  if (!normalizedSize) {
    return { error: 'Size is required' };
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return { error: 'Quantity must be at least 1' };
  }

  if (!isValidProductSize(product, normalizedSize)) {
    return { error: 'Invalid size for this product' };
  }

  const availableStock = getStockForSize(product, normalizedSize);

  if (availableStock < quantity) {
    return { error: 'Insufficient stock for selected size' };
  }

  return { normalizedSize, availableStock };
};

const getMyCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const populatedCart = await populateCartQuery(Cart.findById(cart._id));

    return res.json({
      success: true,
      cart: formatCartResponse(populatedCart),
    });
  } catch (error) {
    handleError(error, res);
  }
};

const addCartItem = async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product id is required' });
    }

    const product = await getActiveProduct(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const validation = validateItemRequest(product, Number(quantity), size);

    if (validation.error) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const { normalizedSize, availableStock } = validation;
    const cart = await getOrCreateCart(req.user._id);
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        (item.size?.trim() || '') === normalizedSize
    );

    if (existingItem) {
      const nextQuantity = existingItem.quantity + Number(quantity);

      if (nextQuantity > availableStock) {
        return res.status(400).json({ success: false, message: 'Insufficient stock for selected size' });
      }

      existingItem.quantity = nextQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        size: normalizedSize,
      });
    }

    await cart.save();

    const populatedCart = await populateCartQuery(Cart.findById(cart._id));

    return res.status(201).json({
      success: true,
      message: 'Item added to cart',
      cart: formatCartResponse(populatedCart),
    });
  } catch (error) {
    handleError(error, res);
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await findUserCart(req.user._id);

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Quantity is required' });
    }

    const product = await getActiveProduct(item.product);

    if (!product) {
      cart.items.pull(item._id);
      await cart.save();
      return res.status(404).json({ success: false, message: 'Product is no longer available' });
    }

    const validation = validateItemRequest(product, Number(quantity), item.size);

    if (validation.error) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    item.quantity = Number(quantity);
    await cart.save();

    const populatedCart = await populateCartQuery(Cart.findById(cart._id));

    return res.json({
      success: true,
      message: 'Cart item updated',
      cart: formatCartResponse(populatedCart),
    });
  } catch (error) {
    handleError(error, res);
  }
};

const removeCartItem = async (req, res) => {
  try {
    const cart = await findUserCart(req.user._id);

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    cart.items.pull(item._id);
    await cart.save();

    const populatedCart = await populateCartQuery(Cart.findById(cart._id));

    return res.json({
      success: true,
      message: 'Cart item removed',
      cart: formatCartResponse(populatedCart),
    });
  } catch (error) {
    handleError(error, res);
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();

    const populatedCart = await populateCartQuery(Cart.findById(cart._id));

    return res.json({
      success: true,
      message: 'Cart cleared',
      cart: formatCartResponse(populatedCart),
    });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  getMyCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
};
