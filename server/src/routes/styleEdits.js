const express = require('express');
const protect = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const {
  getActiveStyleEdit,
  getStyleEdits,
  getStyleEditById,
  createStyleEdit,
  updateStyleEdit,
  deleteStyleEdit,
} = require('../controllers/styleEditController');

const router = express.Router();

router.get('/active', getActiveStyleEdit);
router.get('/', protect, requireAdmin, getStyleEdits);
router.get('/:id', protect, requireAdmin, getStyleEditById);
router.post('/', protect, requireAdmin, createStyleEdit);
router.patch('/:id', protect, requireAdmin, updateStyleEdit);
router.delete('/:id', protect, requireAdmin, deleteStyleEdit);

module.exports = router;
