const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  getMyCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');

const router = express.Router();

router.use(protect);

router.get('/', getMyCart);
router.post('/items', addCartItem);
router.patch('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
