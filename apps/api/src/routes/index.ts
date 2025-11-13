import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import deploymentRoutes from './deployments';
import licenseRoutes from './licenses';
import customerRoutes from './customers';
import marketplaceRoutes from './marketplaces';
import webhookRoutes from './webhooks';
import analyticsRoutes from './analytics';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/deployments', deploymentRoutes);
router.use('/licenses', licenseRoutes);
router.use('/customers', customerRoutes);
router.use('/marketplaces', marketplaceRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/analytics', analyticsRoutes);

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'AutoDeploy Pro API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      deployments: '/api/v1/deployments',
      licenses: '/api/v1/licenses',
      customers: '/api/v1/customers',
      marketplaces: '/api/v1/marketplaces',
      webhooks: '/api/v1/webhooks',
      analytics: '/api/v1/analytics',
    },
  });
});

export default router;
