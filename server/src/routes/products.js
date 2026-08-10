const express = require('express');
const protect = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkApplySalePrice,
  bulkClearSalePrice,
  previewSku,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/sku-preview', protect, requireAdmin, previewSku);
router.get('/:id', getProductById);

router.post('/', protect, requireAdmin, createProduct);
router.patch('/bulk-sale-price', protect, requireAdmin, bulkApplySalePrice);
router.patch('/bulk-clear-sale-price', protect, requireAdmin, bulkClearSalePrice);
router.patch('/:id', protect, requireAdmin, updateProduct);
router.delete('/:id', protect, requireAdmin, deleteProduct);

module.exports = router;
