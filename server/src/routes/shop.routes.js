import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createShop, listShops, getShop, updateShop, deleteShop, getShopAnalytics } from '../controllers/shop.controller.js';

const router = Router();

router.get('/', listShops);

router.get('/:id', validate([param('id').isMongoId()]), getShop);

router.post(
  '/',
  authenticate,
  authorize(['admin', 'shopkeeper']),
  validate([
    body('name').isString().trim().isLength({ min: 1 }),
    body('address').isString().trim().isLength({ min: 1 }),
    body('bannerImage').optional().isString().trim(),
  ]),
  createShop
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'shopkeeper']),
  validate([param('id').isMongoId()]),
  updateShop
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  validate([param('id').isMongoId()]),
  deleteShop
);

// Analytics
router.get('/:id/analytics', validate([param('id').isMongoId()]), getShopAnalytics);

export default router;


