const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { formatProductStock } = require('../utils/productStock');

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

const populateWishlistQuery = (query) =>
  query.populate({
    path: 'items.product',
    select: PRODUCT_FIELDS,
  });

const formatWishlistResponse = (wishlist) => {
  if (!wishlist) return null;

  const wishlistObject = wishlist.toObject();
  const items = wishlistObject.items
    .filter((item) => item.product)
    .map((item) => ({
      _id: item._id,
      product: formatProductStock(item.product),
      addedAt: item.createdAt,
    }));

  return {
    _id: wishlistObject._id,
    user: wishlistObject.user,
    items,
    itemCount: items.length,
    createdAt: wishlistObject.createdAt,
    updatedAt: wishlistObject.updatedAt,
  };
};

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }

  return wishlist;
};

const findUserWishlist = async (userId) => Wishlist.findOne({ user: userId });

const getActiveProduct = async (productId) => {
  const product = await Product.findOne({ _id: productId, isActive: true });

  if (!product) {
    return null;
  }

  return formatProductStock(product);
};

const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    const populatedWishlist = await populateWishlistQuery(Wishlist.findById(wishlist._id));

    return res.json({
      success: true,
      wishlist: formatWishlistResponse(populatedWishlist),
    });
  } catch (error) {
    handleError(error, res);
  }
};

const addWishlistItem = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product id is required' });
    }

    const product = await getActiveProduct(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const wishlist = await getOrCreateWishlist(req.user._id);
    const alreadyExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (alreadyExists) {
      const populatedWishlist = await populateWishlistQuery(Wishlist.findById(wishlist._id));
      return res.json({
        success: true,
        message: 'Item already in wishlist',
        wishlist: formatWishlistResponse(populatedWishlist),
      });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();

    const populatedWishlist = await populateWishlistQuery(Wishlist.findById(wishlist._id));

    return res.status(201).json({
      success: true,
      message: 'Item added to wishlist',
      wishlist: formatWishlistResponse(populatedWishlist),
    });
  } catch (error) {
    handleError(error, res);
  }
};

const removeWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await findUserWishlist(req.user._id);

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    const item = wishlist.items.find((entry) => entry.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    }

    wishlist.items.pull(item._id);
    await wishlist.save();

    const populatedWishlist = await populateWishlistQuery(Wishlist.findById(wishlist._id));

    return res.json({
      success: true,
      message: 'Item removed from wishlist',
      wishlist: formatWishlistResponse(populatedWishlist),
    });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  getMyWishlist,
  addWishlistItem,
  removeWishlistItem,
};
