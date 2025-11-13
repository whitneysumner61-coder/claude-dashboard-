import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as deploymentController from '../controllers/deployment.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// All deployment routes require authentication
router.use(authenticate);

// List deployments
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isString(),
    query('marketplace').optional().isString(),
  ],
  validate,
  deploymentController.listDeployments
);

// Get deployment by ID
router.get(
  '/:id',
  [param('id').isString()],
  validate,
  deploymentController.getDeployment
);

// Create deployment
router.post(
  '/',
  [
    body('productId').isString(),
    body('marketplaces').isArray().notEmpty(),
    body('config').optional().isObject(),
  ],
  validate,
  deploymentController.createDeployment
);

// Retry failed deployment
router.post(
  '/:id/retry',
  [param('id').isString()],
  validate,
  deploymentController.retryDeployment
);

// Cancel deployment
router.post(
  '/:id/cancel',
  [param('id').isString()],
  validate,
  deploymentController.cancelDeployment
);

// Get deployment logs
router.get(
  '/:id/logs',
  [param('id').isString()],
  validate,
  deploymentController.getDeploymentLogs
);

// Get deployment metrics
router.get(
  '/metrics/overview',
  deploymentController.getDeploymentMetrics
);

export default router;
