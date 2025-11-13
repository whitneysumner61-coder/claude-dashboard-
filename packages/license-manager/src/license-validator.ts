import * as crypto from 'crypto';
import { LicensePayload, LicenseValidationRequest, LicenseValidationResponse } from './types';

export class LicenseValidator {
  private encryptionKey: Buffer;
  private algorithm = 'aes-256-gcm';

  constructor(encryptionKey: string) {
    if (!encryptionKey || encryptionKey.length < 32) {
      throw new Error('Encryption key must be at least 32 characters');
    }
    // Must use the same key derivation as generator
    this.encryptionKey = crypto.scryptSync(encryptionKey, 'salt', 32);
  }

  /**
   * Validate a license key
   */
  async validateLicense(
    request: LicenseValidationRequest
  ): Promise<LicenseValidationResponse> {
    try {
      // Decrypt the license key
      const payload = this.decryptLicense(request.licenseKey);

      if (!payload) {
        return {
          valid: false,
          reason: 'Invalid license key format',
        };
      }

      // Verify product ID
      if (payload.productId !== request.productId) {
        return {
          valid: false,
          reason: 'License key does not match product',
        };
      }

      // Check expiration
      if (payload.expiresAt && new Date(payload.expiresAt) < new Date()) {
        return {
          valid: false,
          reason: 'License key has expired',
        };
      }

      // Check activation limits
      if (payload.activationCount >= payload.maxActivations) {
        return {
          valid: false,
          reason: 'Maximum activations reached',
        };
      }

      // Hardware binding validation
      if (request.hardwareId) {
        if (payload.hardwareId && payload.hardwareId !== request.hardwareId) {
          return {
            valid: false,
            reason: 'License key is bound to a different device',
          };
        }
      }

      // License is valid
      return {
        valid: true,
        license: payload,
        features: payload.features,
        expiresAt: payload.expiresAt,
        requiresActivation: !payload.hardwareId && request.hardwareId !== undefined,
        activationsRemaining: payload.maxActivations - payload.activationCount,
      };
    } catch (error) {
      return {
        valid: false,
        reason: 'Failed to validate license key',
      };
    }
  }

  /**
   * Decrypt and parse license key
   */
  decryptLicense(licenseKey: string): LicensePayload | null {
    try {
      // Remove dashes and convert to base64
      const clean = licenseKey.replace(/-/g, '');

      // Convert back to buffer
      const combined = Buffer.from(clean, 'base64');

      // Extract iv (16 bytes), authTag (16 bytes), and encrypted data
      const iv = combined.slice(0, 16);
      const authTag = combined.slice(16, 32);
      const encrypted = combined.slice(32);

      // Decrypt
      const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      // Parse JSON
      const payload = JSON.parse(decrypted.toString('utf8')) as LicensePayload;

      // Convert date strings back to Date objects
      if (payload.issuedAt) {
        payload.issuedAt = new Date(payload.issuedAt);
      }
      if (payload.expiresAt) {
        payload.expiresAt = new Date(payload.expiresAt);
      }

      return payload;
    } catch (error) {
      console.error('Failed to decrypt license:', error);
      return null;
    }
  }

  /**
   * Check if license needs activation
   */
  needsActivation(licenseKey: string): boolean {
    const payload = this.decryptLicense(licenseKey);
    return payload !== null && !payload.hardwareId;
  }

  /**
   * Check if license is expired
   */
  isExpired(licenseKey: string): boolean {
    const payload = this.decryptLicense(licenseKey);
    if (!payload || !payload.expiresAt) {
      return false;
    }
    return new Date(payload.expiresAt) < new Date();
  }

  /**
   * Get license info without full validation
   */
  getLicenseInfo(licenseKey: string): Partial<LicensePayload> | null {
    const payload = this.decryptLicense(licenseKey);
    if (!payload) {
      return null;
    }

    return {
      tier: payload.tier,
      features: payload.features,
      issuedAt: payload.issuedAt,
      expiresAt: payload.expiresAt,
      maxActivations: payload.maxActivations,
      activationCount: payload.activationCount,
    };
  }

  /**
   * Verify hardware binding
   */
  verifyHardwareBinding(licenseKey: string, hardwareId: string): boolean {
    const payload = this.decryptLicense(licenseKey);
    if (!payload) {
      return false;
    }

    if (!payload.hardwareId) {
      return true; // Not bound to any hardware yet
    }

    return payload.hardwareId === hardwareId;
  }

  /**
   * Get days until expiration
   */
  getDaysUntilExpiration(licenseKey: string): number | null {
    const payload = this.decryptLicense(licenseKey);
    if (!payload || !payload.expiresAt) {
      return null; // No expiration
    }

    const now = new Date();
    const expires = new Date(payload.expiresAt);
    const diffTime = expires.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Check if feature is enabled
   */
  hasFeature(licenseKey: string, featureName: string): boolean {
    const payload = this.decryptLicense(licenseKey);
    if (!payload) {
      return false;
    }

    return payload.features.includes(featureName);
  }
}
