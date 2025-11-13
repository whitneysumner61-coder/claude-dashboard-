import * as crypto from 'crypto';
import * as os from 'os';

export class HardwareIdGenerator {
  /**
   * Generate a hardware ID based on system information
   * This creates a unique identifier for the device
   */
  static generate(): string {
    const components: string[] = [];

    // CPU information
    const cpus = os.cpus();
    if (cpus.length > 0) {
      components.push(cpus[0].model);
    }

    // Network interfaces (MAC addresses)
    const networks = os.networkInterfaces();
    const macAddresses: string[] = [];

    Object.values(networks).forEach((network) => {
      network?.forEach((details) => {
        if (details.mac && details.mac !== '00:00:00:00:00:00') {
          macAddresses.push(details.mac);
        }
      });
    });

    if (macAddresses.length > 0) {
      // Sort to ensure consistency
      macAddresses.sort();
      components.push(macAddresses[0]);
    }

    // Platform and architecture
    components.push(os.platform());
    components.push(os.arch());

    // Hostname (can be changed by user, so less weight)
    components.push(os.hostname());

    // Combine all components and hash
    const combined = components.join('|');
    const hash = crypto.createHash('sha256').update(combined).digest('hex');

    // Return first 32 characters for readability
    return hash.substring(0, 32).toUpperCase();
  }

  /**
   * Generate a hardware fingerprint with detailed information
   */
  static generateFingerprint(): {
    hardwareId: string;
    platform: string;
    architecture: string;
    cpuModel?: string;
    macAddress?: string;
    hostname: string;
    computedAt: Date;
  } {
    const cpus = os.cpus();
    const networks = os.networkInterfaces();
    const macAddresses: string[] = [];

    Object.values(networks).forEach((network) => {
      network?.forEach((details) => {
        if (details.mac && details.mac !== '00:00:00:00:00:00') {
          macAddresses.push(details.mac);
        }
      });
    });

    macAddresses.sort();

    return {
      hardwareId: this.generate(),
      platform: os.platform(),
      architecture: os.arch(),
      cpuModel: cpus.length > 0 ? cpus[0].model : undefined,
      macAddress: macAddresses.length > 0 ? macAddresses[0] : undefined,
      hostname: os.hostname(),
      computedAt: new Date(),
    };
  }

  /**
   * Verify if a hardware ID matches the current system
   */
  static verify(hardwareId: string): boolean {
    const currentId = this.generate();
    return currentId === hardwareId;
  }

  /**
   * Generate a device name for display purposes
   */
  static generateDeviceName(): string {
    const hostname = os.hostname();
    const platform = os.platform();
    const cpus = os.cpus();

    let name = hostname;

    if (cpus.length > 0) {
      name += ` (${cpus[0].model})`;
    }

    name += ` - ${platform}`;

    return name;
  }

  /**
   * Calculate similarity between two hardware IDs
   * Useful for detecting similar but not identical hardware
   */
  static calculateSimilarity(id1: string, id2: string): number {
    if (id1 === id2) return 1.0;

    let matches = 0;
    const length = Math.min(id1.length, id2.length);

    for (let i = 0; i < length; i++) {
      if (id1[i] === id2[i]) {
        matches++;
      }
    }

    return matches / length;
  }
}

/**
 * Browser-based hardware ID generation (for web applications)
 */
export class BrowserHardwareIdGenerator {
  /**
   * Generate a browser fingerprint
   * Note: This is less secure than native hardware IDs
   */
  static async generate(): Promise<string> {
    const components: string[] = [];

    // User agent
    if (typeof navigator !== 'undefined') {
      components.push(navigator.userAgent);
      components.push(navigator.language);
      components.push(String(navigator.hardwareConcurrency || ''));
      components.push(String(navigator.deviceMemory || ''));
    }

    // Screen information
    if (typeof screen !== 'undefined') {
      components.push(`${screen.width}x${screen.height}`);
      components.push(String(screen.colorDepth));
    }

    // Timezone
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Canvas fingerprint (more advanced)
    const canvasFingerprint = await this.getCanvasFingerprint();
    if (canvasFingerprint) {
      components.push(canvasFingerprint);
    }

    // Combine and hash
    const combined = components.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);

    // Use SubtleCrypto API if available
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return hashHex.substring(0, 32).toUpperCase();
    }

    // Fallback: simple hash
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return Math.abs(hash).toString(16).toUpperCase();
  }

  /**
   * Generate canvas fingerprint
   */
  private static async getCanvasFingerprint(): Promise<string | null> {
    if (typeof document === 'undefined') {
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return null;
      }

      // Draw some text with specific styling
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('AutoDeploy Pro', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('License', 4, 17);

      // Get canvas data
      const dataUrl = canvas.toDataURL();

      // Hash the canvas data
      const encoder = new TextEncoder();
      const data = encoder.encode(dataUrl);

      if (crypto.subtle) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}
