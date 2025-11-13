import { Router } from 'express';
import { param, query } from 'express-validator';
import * as customerController from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// All customer routes require authentication
router.use(authenticate);

// List customers
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isString(),
    query('search').optional().trim(),
  ],
  validate,
  customerController.listCustomers
);

// Get customer by ID
router.get(
  '/:id',
  [param('id').isString()],
  validate,
  customerController.getCustomer
);

// Get customer purchases
router.get(
  '/:id/purchases',
  [param('id').isString()],
  validate,
  customerController.getCustomerPurchases
);

// Get customer licenses
router.get(
  '/:id/licenses',
  [param('id').isString()],
  validate,
  customerController.getCustomerLicenses
);

// Get customer support tickets
router.get(
  '/:id/tickets',
  [param('id').isString()],
  validate,
  customerController.getCustomerTickets
);

// Get customer analytics
router.get(
  '/:id/analytics',
  [param('id').isString()],
  validate,
  customerController.getCustomerAnalytics
);

export default router;
