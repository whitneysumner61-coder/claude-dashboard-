import { LicenseTier, LicenseStatus } from '@autodeploy/types';

export interface LicensePayload {
  productId: string;
  customerId: string;
  tier: LicenseTier;
  issuedAt: Date;
  expiresAt?: Date;
  hardwareId?: string;
  activationCount: number;
  maxActivations: number;
  features: string[];
  metadata?: Record<string, any>;
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

export interface LicenseValidationRequest {
  licenseKey: string;
  hardwareId?: string;
  productId: string;
  version?: string;
  metadata?: Record<string, any>;
}

export interface LicenseValidationResponse {
  valid: boolean;
  license?: LicensePayload;
  reason?: string;
  features?: string[];
  expiresAt?: Date;
  requiresActivation?: boolean;
  activationsRemaining?: number;
}

export interface HardwareFingerprint {
  hardwareId: string;
  cpuId?: string;
  diskId?: string;
  macAddress?: string;
  motherboardId?: string;
  biosId?: string;
  computedAt: Date;
}
