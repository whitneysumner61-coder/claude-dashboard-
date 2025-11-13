export interface MarketplaceSDKConfig {
  apiKey: string;
  apiSecret?: string;
  webhookSecret?: string;
  storeId?: string;
  timeout?: number;
  retries?: number;
}

export interface ProductCreateParams {
  name: string;
  description: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  customFields?: Array<{ name: string; required: boolean }>;
  inventory?: number | 'unlimited';
  requireShipping?: boolean;
}

export interface ProductUpdateParams extends Partial<ProductCreateParams> {
  published?: boolean;
}

export interface SaleData {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName?: string;
  purchaseDate: Date;
  refunded: boolean;
  chargedBack: boolean;
}

export interface AnalyticsData {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  refundRate: number;
  salesByProduct: Record<string, number>;
  salesByDate: Record<string, number>;
}

export interface WebhookPayload {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
}
