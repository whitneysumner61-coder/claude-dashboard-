import { Router } from 'express';
import { query } from 'express-validator';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// Get overview analytics
router.get(
  '/overview',
  [
    query('period').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  analyticsController.getOverview
);

// Get revenue analytics
router.get(
  '/revenue',
  [
    query('period').optional().isString(),
    query('groupBy').optional().isIn(['day', 'week', 'month']),
  ],
  validate,
  analyticsController.getRevenue
);

// Get sales analytics
router.get(
  '/sales',
  [query('period').optional().isString()],
  validate,
  analyticsController.getSales
);

// Get customer analytics
router.get(
  '/customers',
  [query('period').optional().isString()],
  validate,
  analyticsController.getCustomers
);

// Get product performance
router.get(
  '/products/performance',
  [query('period').optional().isString()],
  validate,
  analyticsController.getProductPerformance
);

// Get marketplace comparison
router.get(
  '/marketplaces/comparison',
  [query('period').optional().isString()],
  validate,
  analyticsController.getMarketplaceComparison
);

// Get real-time metrics
router.get(
  '/realtime',
  analyticsController.getRealtimeMetrics
);

// Get funnel analytics
router.get(
  '/funnel',
  [query('period').optional().isString()],
  validate,
  analyticsController.getFunnelAnalytics
);

// Track custom event
router.post(
  '/events',
  [
    query('type').isString(),
    query('name').isString(),
    query('properties').optional().isObject(),
  ],
  validate,
  analyticsController.trackEvent
);

export default router;
