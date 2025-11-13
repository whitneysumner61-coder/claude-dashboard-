import * as crypto from 'crypto';
import { nanoid } from 'nanoid';
import { LicenseTier } from '@autodeploy/types';
import { LicenseGenerationOptions, LicensePayload } from './types';

export class LicenseGenerator {
  private encryptionKey: Buffer;
  private algorithm = 'aes-256-gcm';

  constructor(encryptionKey: string) {
    if (!encryptionKey || encryptionKey.length < 32) {
      throw new Error('Encryption key must be at least 32 characters');
    }
    // Create a 32-byte key from the encryption key
    this.encryptionKey = crypto.scryptSync(encryptionKey, 'salt', 32);
  }

  /**
   * Generate a new license key
   */
  async generateLicense(options: LicenseGenerationOptions): Promise<string> {
    const payload: LicensePayload = {
      productId: options.productId,
      customerId: options.customerId,
      tier: options.tier,
      issuedAt: new Date(),
      expiresAt: options.expiresIn
        ? new Date(Date.now() + options.expiresIn * 24 * 60 * 60 * 1000)
        : undefined,
      hardwareId: undefined,
      activationCount: 0,
      maxActivations: options.maxActivations || this.getDefaultMaxActivations(options.tier),
      features: options.features || this.getDefaultFeatures(options.tier),
      metadata: options.metadata,
    };

    const encryptedPayload = this.encryptPayload(payload);
    const licenseKey = this.formatLicenseKey(encryptedPayload);

    return licenseKey;
  }

  /**
   * Encrypt license payload
   */
  private encryptPayload(payload: LicensePayload): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

    const payloadString = JSON.stringify(payload);
    let encrypted = cipher.update(payloadString, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Combine iv + authTag + encrypted data
    const combined = Buffer.concat([
      iv,
      authTag,
      Buffer.from(encrypted, 'hex'),
    ]);

    return combined.toString('base64');
  }

  /**
   * Format license key with dashes for readability
   */
  private formatLicenseKey(encrypted: string): string {
    // Remove any non-alphanumeric characters and convert to uppercase
    const clean = encrypted.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // Format as XXXX-XXXX-XXXX-XXXX-XXXX
    const segments: string[] = [];
    for (let i = 0; i < clean.length; i += 4) {
      segments.push(clean.substring(i, i + 4));
    }

    return segments.join('-');
  }

  /**
   * Get default max activations based on tier
   */
  private getDefaultMaxActivations(tier: LicenseTier): number {
    switch (tier) {
      case LicenseTier.BASIC:
        return 1;
      case LicenseTier.PROFESSIONAL:
        return 3;
      case LicenseTier.ENTERPRISE:
        return 10;
      case LicenseTier.LIFETIME:
        return 5;
      default:
        return 1;
    }
  }

  /**
   * Get default features based on tier
   */
  private getDefaultFeatures(tier: LicenseTier): string[] {
    const baseFeatures = ['basic-access'];

    switch (tier) {
      case LicenseTier.BASIC:
        return baseFeatures;

      case LicenseTier.PROFESSIONAL:
        return [...baseFeatures, 'priority-support', 'auto-updates', 'advanced-features'];

      case LicenseTier.ENTERPRISE:
        return [
          ...baseFeatures,
          'priority-support',
          'auto-updates',
          'advanced-features',
          'custom-branding',
          'api-access',
          'dedicated-support',
        ];

      case LicenseTier.LIFETIME:
        return [
          ...baseFeatures,
          'priority-support',
          'auto-updates',
          'advanced-features',
          'lifetime-updates',
        ];

      default:
        return baseFeatures;
    }
  }

  /**
   * Generate a trial license
   */
  async generateTrialLicense(
    productId: string,
    customerId: string,
    trialDays: number = 14
  ): Promise<string> {
    return this.generateLicense({
      productId,
      customerId,
      tier: LicenseTier.BASIC,
      maxActivations: 1,
      expiresIn: trialDays,
      features: ['trial-access'],
      metadata: { trial: true },
    });
  }

  /**
   * Generate a temporary license (for demos, testing, etc.)
   */
  async generateTemporaryLicense(
    productId: string,
    durationHours: number = 24
  ): Promise<string> {
    return this.generateLicense({
      productId,
      customerId: 'temp-' + nanoid(),
      tier: LicenseTier.BASIC,
      maxActivations: 1,
      expiresIn: durationHours / 24,
      features: ['temporary-access'],
      metadata: { temporary: true },
    });
  }

  /**
   * Upgrade a license tier
   */
  async upgradeLicense(
    currentLicenseKey: string,
    newTier: LicenseTier
  ): Promise<string> {
    // In a real implementation, you would decrypt the current license,
    // modify the tier, and re-encrypt with the same customer/product info
    // For now, this is a placeholder that would need the validator to decrypt
    throw new Error('Upgrade license requires LicenseValidator to decrypt first');
  }
}
