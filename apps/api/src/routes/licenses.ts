import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as licenseController from '../controllers/license.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Validate license (public endpoint for activation)
router.post(
  '/validate',
  [
    body('licenseKey').isString().notEmpty(),
    body('productId').isString().notEmpty(),
    body('hardwareId').optional().isString(),
  ],
  validate,
  licenseController.validateLicense
);

// All other routes require authentication
router.use(authenticate);

// List licenses
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isString(),
    query('productId').optional().isString(),
  ],
  validate,
  licenseController.listLicenses
);

// Get license by ID
router.get(
  '/:id',
  [param('id').isString()],
  validate,
  licenseController.getLicense
);

// Generate license
router.post(
  '/',
  [
    body('productId').isString(),
    body('customerId').isString(),
    body('tier').isIn(['BASIC', 'PROFESSIONAL', 'ENTERPRISE', 'LIFETIME']),
    body('maxActivations').optional().isInt({ min: 1 }),
    body('expiresIn').optional().isInt({ min: 1 }),
  ],
  validate,
  licenseController.generateLicense
);

// Activate license
router.post(
  '/:id/activate',
  [
    param('id').isString(),
    body('hardwareId').isString(),
    body('deviceName').optional().isString(),
  ],
  validate,
  licenseController.activateLicense
);

// Deactivate license
router.post(
  '/:id/deactivate',
  [
    param('id').isString(),
    body('hardwareId').isString(),
  ],
  validate,
  licenseController.deactivateLicense
);

// Revoke license
router.post(
  '/:id/revoke',
  [param('id').isString()],
  validate,
  licenseController.revokeLicense
);

// Get license activations
router.get(
  '/:id/activations',
  [param('id').isString()],
  validate,
  licenseController.getLicenseActivations
);

export default router;
