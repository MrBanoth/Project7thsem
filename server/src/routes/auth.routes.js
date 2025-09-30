import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile, changePassword, oauthUpsert } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';

const router = Router();

router.post(
  '/register',
  validate([
    body('name').isString().trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'shopkeeper', 'customer']),
  ]),
  register
);

router.post(
  '/login',
  validate([body('email').isEmail().normalizeEmail(), body('password').isString().isLength({ min: 6 })]),
  login
);

router.get('/me', authenticate, getProfile);

router.put('/me', authenticate, validate([
  body('name').optional().isString().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('address').optional().isString().trim(),
  body('phone').optional().isString().trim(),
  body('bio').optional().isString().trim(),
  body('profileImage').optional().isString().trim(),
]), updateProfile);

router.put('/change-password', authenticate, validate([
  body('oldPassword').isString().isLength({ min: 1 }),
  body('newPassword').isString().isLength({ min: 6 }),
]), changePassword);

router.post('/oauth', validate([body('email').isEmail().normalizeEmail(), body('name').isString().trim().isLength({ min: 1 }), body('role').optional().isIn(['admin', 'shopkeeper', 'customer'])]), oauthUpsert);

// Delete own account (cascading simple cleanup)
router.delete('/me', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    // If shopkeeper: delete their shops and products
    const shops = await Shop.find({ owner: userId }).select('_id');
    const shopIds = shops.map((s) => s._id);
    if (shopIds.length) {
      await Product.deleteMany({ shop: { $in: shopIds } });
      await Shop.deleteMany({ _id: { $in: shopIds } });
    }
    // If customer: optionally delete their orders
    await Order.deleteMany({ user: userId });
    // Delete user
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: 'Account deleted' });
  } catch (e) {
    next(e);
  }
});

export default router;


