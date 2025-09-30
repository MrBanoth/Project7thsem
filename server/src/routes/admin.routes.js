import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { adminLogin } from '../controllers/admin.controller.js';

const router = Router();

router.post(
  '/login',
  validate([body('adminId').isString().trim().notEmpty(), body('password').isString().isLength({ min: 6 })]),
  adminLogin
);

export default router;


