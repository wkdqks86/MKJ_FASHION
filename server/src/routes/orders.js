const express = require('express');
const protect = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const {
  guestLookup,
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/guest-lookup', guestLookup);

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/', protect, requireAdmin, getOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id', protect, requireAdmin, updateOrder);
router.delete('/:id', protect, requireAdmin, deleteOrder);

module.exports = router;
