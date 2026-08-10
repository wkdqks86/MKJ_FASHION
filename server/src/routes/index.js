const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const authRouter = require('./auth');
const ordersRouter = require('./orders');
const productsRouter = require('./products');
const styleEditsRouter = require('./styleEdits');
const cartsRouter = require('./carts');
const wishlistsRouter = require('./wishlists');

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/orders', ordersRouter);
router.use('/products', productsRouter);
router.use('/style-edits', styleEditsRouter);
router.use('/carts', cartsRouter);
router.use('/wishlists', wishlistsRouter);

module.exports = router;
