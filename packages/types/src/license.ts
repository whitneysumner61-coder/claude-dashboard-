export enum LicenseTier {
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  LIFETIME = 'LIFETIME',
}

export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  REVOKED = 'REVOKED',
  TRIAL = 'TRIAL',
}

export interface License {
  id: string;
  key: string;
  productId: string;
  customerId: string;

  // License details
  tier: LicenseTier;
  status: LicenseStatus;

  // Validity
  issuedAt: Date;
  expiresAt?: Date;
  activatedAt?: Date;

  // Activation limits
  maxActivations: number;
  activationCount: number;
  hardwareIds: string[];

  // Features
  features: string[];
  metadata?: Record<string, any>;

  // Tracking
  lastValidatedAt?: Date;
  lastUsedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface LicenseActivation {
  id: string;
  licenseId: string;
  hardwareId: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
  activatedAt: Date;
  lastSeenAt: Date;
  isActive: boolean;
}

export interface LicenseValidationRequest {
  licenseKey: string;
  hardwareId?: string;
  productId: string;
  version?: string;
  metadata?: Record<string, any>;
}

export interface LicenseValidationResponse {
  valid: boolean;
  license?: License;
  reason?: string;
  features?: string[];
  expiresAt?: Date;
  requiresActivation?: boolean;
  activationsRemaining?: number;
}

export interface LicenseGenerationOptions {
  productId: string;
  customerId: string;
  tier: LicenseTier;
  maxActivations?: number;
  expiresIn?: number; // days
  features?: string[];
  metadata?: Record<string, any>;
}

export interface LicenseTransferRequest {
  licenseId: string;
  fromHardwareId: string;
  toHardwareId: string;
  reason?: string;
}

export interface LicenseMetrics {
  totalLicenses: number;
  activeLicenses: number;
  expiredLicenses: number;
  trialLicenses: number;
  licensesByTier: Record<LicenseTier, number>;
  licensesByStatus: Record<LicenseStatus, number>;
  averageActivationsPerLicense: number;
  expiringWithinDays: (days: number) => License[];
}
