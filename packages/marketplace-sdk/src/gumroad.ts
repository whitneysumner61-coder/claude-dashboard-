import * as crypto from 'crypto';
import { BaseMarketplaceSDK } from './base';
import {
  MarketplaceSDKConfig,
  ProductCreateParams,
  ProductUpdateParams,
  SaleData,
  AnalyticsData,
} from './types';

export class GumroadSDK extends BaseMarketplaceSDK {
  constructor(config: MarketplaceSDKConfig) {
    super(config);
  }

  protected getDefaultHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  protected getBaseURL(): string {
    return 'https://api.gumroad.com/v2';
  }

  /**
   * Create a new product on Gumroad
   */
  async createProduct(params: ProductCreateParams): Promise<any> {
    const payload = {
      name: params.name,
      price: Math.round(params.price * 100), // Convert to cents
      description: params.description,
      file_url: params.downloadUrl,
      preview_link: params.previewUrl,
      image: params.imageUrl,
      custom_fields: params.customFields,
      inventory: params.inventory === 'unlimited' ? -1 : params.inventory,
      require_shipping: params.requireShipping || false,
      currency: params.currency || 'USD',
    };

    return this.request({
      method: 'POST',
      url: '/products',
      data: payload,
    });
  }

  /**
   * Update an existing product
   */
  async updateProduct(productId: string, params: ProductUpdateParams): Promise<any> {
    const payload: any = {};

    if (params.name) payload.name = params.name;
    if (params.price) payload.price = Math.round(params.price * 100);
    if (params.description) payload.description = params.description;
    if (params.downloadUrl) payload.file_url = params.downloadUrl;
    if (params.previewUrl) payload.preview_link = params.previewUrl;
    if (params.imageUrl) payload.image = params.imageUrl;
    if (params.customFields) payload.custom_fields = params.customFields;
    if (params.inventory !== undefined) {
      payload.inventory = params.inventory === 'unlimited' ? -1 : params.inventory;
    }
    if (params.published !== undefined) payload.published = params.published;

    return this.request({
      method: 'PUT',
      url: `/products/${productId}`,
      data: payload,
    });
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<void> {
    await this.request({
      method: 'DELETE',
      url: `/products/${productId}`,
    });
  }

  /**
   * Get a single product
   */
  async getProduct(productId: string): Promise<any> {
    return this.request({
      method: 'GET',
      url: `/products/${productId}`,
    });
  }

  /**
   * List all products
   */
  async listProducts(): Promise<any[]> {
    const response = await this.request<{ products: any[] }>({
      method: 'GET',
      url: '/products',
    });

    return response.products || [];
  }

  /**
   * Get sales data
   */
  async getSales(timeframe: string = '30d'): Promise<SaleData[]> {
    const response = await this.request<{ sales: any[] }>({
      method: 'GET',
      url: '/sales',
      params: {
        interval: timeframe,
      },
    });

    return (response.sales || []).map(this.normalizeSale);
  }

  /**
   * Get analytics data
   */
  async getAnalytics(): Promise<AnalyticsData> {
    const sales = await this.getSales('30d');

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const refundCount = sales.filter((s) => s.refunded).length;

    const salesByProduct: Record<string, number> = {};
    const salesByDate: Record<string, number> = {};

    sales.forEach((sale) => {
      salesByProduct[sale.productId] = (salesByProduct[sale.productId] || 0) + 1;

      const date = sale.purchaseDate.toISOString().split('T')[0];
      salesByDate[date] = (salesByDate[date] || 0) + 1;
    });

    return {
      totalSales,
      totalRevenue,
      averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0,
      refundRate: totalSales > 0 ? refundCount / totalSales : 0,
      salesByProduct,
      salesByDate,
    };
  }

  /**
   * Verify webhook signature
   */
  verifyWebhook(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Enable affiliate program
   */
  async enableAffiliateProgram(productId: string, commissionRate: number): Promise<any> {
    return this.request({
      method: 'PUT',
      url: `/products/${productId}`,
      data: {
        enable_affiliates: true,
        affiliate_commission_rate: commissionRate,
      },
    });
  }

  /**
   * Create a discount code
   */
  async createDiscount(productId: string, code: string, discountPercent: number): Promise<any> {
    return this.request({
      method: 'POST',
      url: `/products/${productId}/offer_codes`,
      data: {
        name: code,
        amount_off: discountPercent,
        max_purchase_count: null, // Unlimited uses
      },
    });
  }

  /**
   * Get product subscribers (for subscriptions)
   */
  async getSubscribers(productId: string): Promise<any[]> {
    const response = await this.request<{ subscribers: any[] }>({
      method: 'GET',
      url: `/products/${productId}/subscribers`,
    });

    return response.subscribers || [];
  }

  /**
   * Normalize sale data from Gumroad format
   */
  private normalizeSale(sale: any): SaleData {
    return {
      id: sale.id,
      productId: sale.product_id,
      amount: sale.price / 100, // Convert from cents
      currency: sale.currency || 'USD',
      customerEmail: sale.email,
      customerName: sale.full_name,
      purchaseDate: new Date(sale.created_at),
      refunded: sale.refunded || false,
      chargedBack: sale.charged_back || false,
    };
  }
}
