const express = require('express');
const protect = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/', createUser);
router.get('/', protect, requireAdmin, getUsers);
router.get('/:id', protect, requireAdmin, getUserById);
router.put('/:id', protect, requireAdmin, updateUser);
router.delete('/:id', protect, requireAdmin, deleteUser);

module.exports = router;
