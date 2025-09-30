import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';

const router = Router();

router.get('/', listProducts);

router.get('/:id', validate([param('id').isMongoId()]), getProduct);

router.post(
  '/',
  authenticate,
  authorize(['admin', 'shopkeeper']),
  validate([
    body('name').isString().trim().isLength({ min: 1 }),
    body('price').isFloat({ min: 0 }),
    body('shop').isMongoId(),
    body('inStock').optional().isBoolean(),
  ]),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'shopkeeper']),
  validate([param('id').isMongoId()]),
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin', 'shopkeeper']),
  validate([param('id').isMongoId()]),
  async (req, res, next) => {
    try {
      if (req.user.role === 'admin') return deleteProduct(req, res, next);
      const prod = await Product.findById(req.params.id);
      if (!prod) return res.status(404).json({ success: false, message: 'Product not found' });
      const shop = await Shop.findById(prod.shop);
      if (!shop) return res.status(400).json({ success: false, message: 'Invalid shop' });
      if (String(shop.owner) !== req.user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
      return deleteProduct(req, res, next);
    } catch (e) {
      next(e);
    }
  }
);

export default router;


