const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  getMyWishlist,
  addWishlistItem,
  removeWishlistItem,
} = require('../controllers/wishlistController');

const router = express.Router();

router.use(protect);

router.get('/', getMyWishlist);
router.post('/items', addWishlistItem);
router.delete('/items/:productId', removeWishlistItem);

module.exports = router;
