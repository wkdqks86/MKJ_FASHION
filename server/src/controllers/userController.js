const User = require('../models/User');

const ALLOWED_UPDATE_FIELDS = [
  'email',
  'name',
  'password',
  'user_type',
  'address',
  'phone',
  'isActive',
  'lastLoginAt',
  'avatar',
];

const pickAllowedFields = (body) => {
  return ALLOWED_UPDATE_FIELDS.reduce((result, field) => {
    if (body[field] !== undefined) {
      result[field] = body[field];
    }
    return result;
  }, {});
};

const handleError = (error, res) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }

  console.error(error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    handleError(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    handleError(error, res);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    handleError(error, res);
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = pickAllowedFields(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    Object.assign(user, updates);
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    handleError(error, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user && req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
