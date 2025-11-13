export enum Marketplace {
  GUMROAD = 'GUMROAD',
  LEMONSQUEEZY = 'LEMONSQUEEZY',
  ETSY = 'ETSY',
  SHOPIFY = 'SHOPIFY',
  PAYHIP = 'PAYHIP',
  SENDOWL = 'SENDOWL',
  PODIA = 'PODIA',
  TEACHABLE = 'TEACHABLE',
}

export interface MarketplaceConfig {
  marketplace: Marketplace;
  enabled: boolean;
  apiKey: string;
  apiSecret?: string;
  webhookSecret?: string;
  storeId?: string;
  settings?: Record<string, any>;
}

export interface MarketplaceIntegration {
  id: string;
  userId: string;
  marketplace: Marketplace;

  // Authentication
  apiKey: string;
  apiSecret?: string;
  webhookSecret?: string;

  // Configuration
  storeId?: string;
  storeName?: string;
  storeUrl?: string;

  // Status
  connected: boolean;
  lastSyncAt?: Date;
  lastHealthCheckAt?: Date;
  healthy: boolean;

  // Settings
  settings: MarketplaceSettings;

  // Metadata
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceSettings {
  // Synchronization
  autoSync: boolean;
  syncInterval?: number; // minutes

  // Pricing
  pricingStrategy: 'fixed' | 'dynamic' | 'competitive';
  priceMultiplier?: number;

  // Inventory
  inventorySync: boolean;

  // Notifications
  notifyOnSale: boolean;
  notifyOnError: boolean;
  notifyOnLowInventory: boolean;

  // Customization
  customFields?: Record<string, any>;
}

export interface MarketplaceProduct {
  marketplace: Marketplace;
  marketplaceProductId: string;
  localProductId: string;

  // Product details
  name: string;
  description: string;
  price: number;
  currency: string;
  url: string;

  // Status
  published: boolean;
  inventory?: number;

  // Sync
  lastSyncedAt: Date;
  needsSync: boolean;
  syncErrors?: string[];

  // Metadata
  metadata?: Record<string, any>;
}

export interface MarketplaceWebhook {
  id: string;
  marketplace: Marketplace;
  integrationId: string;

  // Event details
  eventType: string;
  eventId: string;
  payload: Record<string, any>;

  // Processing
  processed: boolean;
  processedAt?: Date;
  error?: string;
  retryCount: number;

  // Verification
  verified: boolean;
  signature?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceHealthCheck {
  marketplace: Marketplace;
  healthy: boolean;
  lastChecked: Date;
  checks: {
    apiReachable: boolean;
    authenticationValid: boolean;
    webhooksActive: boolean;
    rateLimitOk: boolean;
  };
  issues?: string[];
  responseTime?: number;
}

export interface MarketplaceMetrics {
  marketplace: Marketplace;

  // Sales
  totalSales: number;
  salesThisMonth: number;
  revenue: number;
  revenueThisMonth: number;

  // Products
  totalProducts: number;
  publishedProducts: number;

  // Performance
  averageResponseTime: number;
  successRate: number;
  errorRate: number;

  // Sync
  lastSyncAt?: Date;
  syncSuccessRate: number;
  pendingSyncs: number;
}

// Marketplace-specific types
export interface GumroadProduct {
  id: string;
  name: string;
  price: number;
  url: string;
  short_url: string;
  description: string;
  preview_url?: string;
  file_info?: Record<string, any>;
  published: boolean;
  custom_fields?: Array<{
    name: string;
    required: boolean;
  }>;
}

export interface LemonSqueezyProduct {
  type: 'products';
  id: string;
  attributes: {
    name: string;
    description: string;
    price: number;
    status: 'draft' | 'published';
    buy_now_url: string;
    created_at: string;
    updated_at: string;
  };
  relationships: {
    store: {
      data: {
        type: 'stores';
        id: string;
      };
    };
  };
}

export interface MarketplaceAPI {
  createProduct(product: any): Promise<any>;
  updateProduct(id: string, updates: any): Promise<any>;
  deleteProduct(id: string): Promise<void>;
  getProduct(id: string): Promise<any>;
  listProducts(): Promise<any[]>;
  getSales(timeframe?: string): Promise<any[]>;
  getAnalytics(): Promise<any>;
}
