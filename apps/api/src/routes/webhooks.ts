import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as webhookController from '../controllers/webhook.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Webhook receivers (no auth - verified via signature)
router.post('/gumroad', webhookController.receiveGumroadWebhook);
router.post('/lemonsqueezy', webhookController.receiveLemonSqueezyWebhook);

// All other routes require authentication
router.use(authenticate);

// List webhook endpoints
router.get(
  '/endpoints',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  webhookController.listEndpoints
);

// Create webhook endpoint
router.post(
  '/endpoints',
  [
    body('url').isURL(),
    body('events').isArray().notEmpty(),
    body('description').optional().isString(),
  ],
  validate,
  webhookController.createEndpoint
);

// Update webhook endpoint
router.patch(
  '/endpoints/:id',
  [param('id').isString()],
  validate,
  webhookController.updateEndpoint
);

// Delete webhook endpoint
router.delete(
  '/endpoints/:id',
  [param('id').isString()],
  validate,
  webhookController.deleteEndpoint
);

// Test webhook endpoint
router.post(
  '/endpoints/:id/test',
  [
    param('id').isString(),
    body('eventType').isString(),
  ],
  validate,
  webhookController.testEndpoint
);

// Get webhook deliveries
router.get(
  '/deliveries',
  [
    query('endpointId').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  webhookController.getDeliveries
);

// Retry webhook delivery
router.post(
  '/deliveries/:id/retry',
  [param('id').isString()],
  validate,
  webhookController.retryDelivery
);

export default router;
