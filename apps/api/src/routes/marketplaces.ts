import { Router } from 'express';
import { body, param } from 'express-validator';
import * as marketplaceController from '../controllers/marketplace.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// All marketplace routes require authentication
router.use(authenticate);

// List marketplace integrations
router.get('/', marketplaceController.listIntegrations);

// Get marketplace integration
router.get(
  '/:marketplace',
  [param('marketplace').isString()],
  validate,
  marketplaceController.getIntegration
);

// Connect marketplace
router.post(
  '/connect',
  [
    body('marketplace').isString(),
    body('apiKey').isString(),
    body('apiSecret').optional().isString(),
    body('webhookSecret').optional().isString(),
    body('storeId').optional().isString(),
  ],
  validate,
  marketplaceController.connectMarketplace
);

// Update marketplace settings
router.patch(
  '/:marketplace',
  [param('marketplace').isString()],
  validate,
  marketplaceController.updateSettings
);

// Disconnect marketplace
router.delete(
  '/:marketplace',
  [param('marketplace').isString()],
  validate,
  marketplaceController.disconnectMarketplace
);

// Test marketplace connection
router.post(
  '/:marketplace/test',
  [param('marketplace').isString()],
  validate,
  marketplaceController.testConnection
);

// Sync marketplace data
router.post(
  '/:marketplace/sync',
  [param('marketplace').isString()],
  validate,
  marketplaceController.syncMarketplace
);

// Get marketplace health
router.get(
  '/:marketplace/health',
  [param('marketplace').isString()],
  validate,
  marketplaceController.getMarketplaceHealth
);

// Get marketplace analytics
router.get(
  '/:marketplace/analytics',
  [param('marketplace').isString()],
  validate,
  marketplaceController.getMarketplaceAnalytics
);

export default router;
