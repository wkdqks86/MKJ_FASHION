const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

const getRefreshJwtSecret = () => {
  const secret = process.env.REFRESH_JWT_SECRET;
  if (!secret) {
    throw new Error('REFRESH_JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

const createRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, getRefreshJwtSecret(), {
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d',
  });
};

const saveRefreshToken = async (user, refreshToken) => {
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();
};

const verifyRefreshToken = async (user, refreshToken) => {
  if (!user.refreshToken) {
    return false;
  }

  return bcrypt.compare(refreshToken, user.refreshToken);
};

const handleConfigError = (error, res) => {
  if (
    error.message === 'JWT_SECRET is not defined in environment variables' ||
    error.message === 'REFRESH_JWT_SECRET is not defined in environment variables'
  ) {
    return res.status(500).json({
      success: false,
      message: 'Server configuration error',
    });
  }

  return null;
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password +refreshToken');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    user.lastLoginAt = new Date();

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    await saveRefreshToken(user, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    console.error(error);

    const configError = handleConfigError(error, res);
    if (configError) return configError;

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, getRefreshJwtSecret());
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    const isRefreshTokenValid = await verifyRefreshToken(user, refreshToken);

    if (!isRefreshTokenValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    const accessToken = createAccessToken(user._id);
    const newRefreshToken = createRefreshToken(user._id);
    await saveRefreshToken(user, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken,
      refreshToken: newRefreshToken,
      user,
    });
  } catch (error) {
    console.error(error);

    const configError = handleConfigError(error, res);
    if (configError) return configError;

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, getRefreshJwtSecret());
    } catch {
      return res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  login,
  refresh,
  logout,
  getMe,
};
