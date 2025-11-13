import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as productController from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// All product routes require authentication
router.use(authenticate);

// List products
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED']),
    query('search').optional().trim(),
  ],
  validate,
  productController.listProducts
);

// Get product by ID
router.get(
  '/:id',
  [param('id').isString()],
  validate,
  productController.getProduct
);

// Create product
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('type').isIn(['DIGITAL_DOWNLOAD', 'SOFTWARE_LICENSE', 'SUBSCRIPTION', 'COURSE', 'PLUGIN', 'THEME']),
    body('price').isFloat({ min: 0 }),
    body('version').trim().notEmpty(),
    body('category').trim().notEmpty(),
  ],
  validate,
  productController.createProduct
);

// Update product
router.patch(
  '/:id',
  [
    param('id').isString(),
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
  ],
  validate,
  productController.updateProduct
);

// Delete product
router.delete(
  '/:id',
  [param('id').isString()],
  validate,
  productController.deleteProduct
);

// Publish product
router.post(
  '/:id/publish',
  [param('id').isString()],
  validate,
  productController.publishProduct
);

// Get product analytics
router.get(
  '/:id/analytics',
  [param('id').isString()],
  validate,
  productController.getProductAnalytics
);

export default router;
