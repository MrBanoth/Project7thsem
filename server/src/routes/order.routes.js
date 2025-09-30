import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrder, listOrders, getOrder, updateOrderStatus } from '../controllers/order.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', listOrders);
router.get('/:id', validate([param('id').isMongoId()]), getOrder);

router.post(
  '/',
  validate([
    body('shop').isMongoId(),
    body('items').isArray({ min: 1 }),
    body('items.*.product').isMongoId(),
    body('items.*.quantity').optional().isInt({ min: 1 }),
  ]),
  createOrder
);

router.patch(
  '/:id/status',
  validate([param('id').isMongoId(), body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])]),
  updateOrderStatus
);

export default router;


