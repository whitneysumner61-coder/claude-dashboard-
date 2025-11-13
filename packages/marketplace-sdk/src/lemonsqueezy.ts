import * as crypto from 'crypto';
import { BaseMarketplaceSDK } from './base';
import {
  MarketplaceSDKConfig,
  ProductCreateParams,
  ProductUpdateParams,
  SaleData,
  AnalyticsData,
} from './types';

export class LemonSqueezySDK extends BaseMarketplaceSDK {
  constructor(config: MarketplaceSDKConfig) {
    super(config);
    if (!config.storeId) {
      throw new Error('storeId is required for Lemon Squeezy');
    }
  }

  protected getDefaultHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    };
  }

  protected getBaseURL(): string {
    return 'https://api.lemonsqueezy.com/v1';
  }

  /**
   * Create a new product on Lemon Squeezy
   */
  async createProduct(params: ProductCreateParams): Promise<any> {
    const payload = {
      data: {
        type: 'products',
        attributes: {
          name: params.name,
          description: params.description,
          price: Math.round(params.price * 100), // Convert to cents
          pay_what_you_want: false,
          from_price: null,
          to_price: null,
          currency: params.currency || 'USD',
          trial_days: 0,
          billing_requirements: {
            receipt: true,
            receipt_link: true,
          },
          status: 'draft',
          status_livemode: false,
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: this.config.storeId,
            },
          },
        },
      },
    };

    const response = await this.request<{ data: any }>({
      method: 'POST',
      url: '/products',
      data: payload,
    });

    // Create variant (required for selling)
    if (response.data && response.data.id) {
      await this.createVariant(response.data.id, params);
    }

    return response.data;
  }

  /**
   * Create a product variant
   */
  async createVariant(productId: string, params: ProductCreateParams): Promise<any> {
    const payload = {
      data: {
        type: 'variants',
        attributes: {
          name: 'Default',
          description: params.description,
          price: Math.round(params.price * 100),
          is_subscription: false,
          interval: null,
          interval_count: null,
          has_free_trial: false,
          trial_interval: null,
          trial_interval_count: null,
          pay_what_you_want: false,
          min_price: 0,
          suggested_price: 0,
          is_license_key_enabled: true,
          is_license_length_unlimited: true,
          license_length_value: null,
          license_length_unit: null,
          status: 'published',
        },
        relationships: {
          product: {
            data: {
              type: 'products',
              id: productId,
            },
          },
        },
      },
    };

    const response = await this.request<{ data: any }>({
      method: 'POST',
      url: '/variants',
      data: payload,
    });

    return response.data;
  }

  /**
   * Update an existing product
   */
  async updateProduct(productId: string, params: ProductUpdateParams): Promise<any> {
    const attributes: any = {};

    if (params.name) attributes.name = params.name;
    if (params.description) attributes.description = params.description;
    if (params.price) attributes.price = Math.round(params.price * 100);
    if (params.published !== undefined) {
      attributes.status = params.published ? 'published' : 'draft';
    }

    const payload = {
      data: {
        type: 'products',
        id: productId,
        attributes,
      },
    };

    const response = await this.request<{ data: any }>({
      method: 'PATCH',
      url: `/products/${productId}`,
      data: payload,
    });

    return response.data;
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
    const response = await this.request<{ data: any }>({
      method: 'GET',
      url: `/products/${productId}`,
    });

    return response.data;
  }

  /**
   * List all products
   */
  async listProducts(): Promise<any[]> {
    const response = await this.request<{ data: any[] }>({
      method: 'GET',
      url: '/products',
      params: {
        'filter[store_id]': this.config.storeId,
      },
    });

    return response.data || [];
  }

  /**
   * Get sales data (orders)
   */
  async getSales(timeframe: string = '30d'): Promise<SaleData[]> {
    const response = await this.request<{ data: any[] }>({
      method: 'GET',
      url: '/orders',
      params: {
        'filter[store_id]': this.config.storeId,
        'filter[status]': 'paid',
      },
    });

    return (response.data || []).map(this.normalizeSale);
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
   * Create a discount code
   */
  async createDiscount(
    storeId: string,
    code: string,
    discountPercent: number,
    productIds?: string[]
  ): Promise<any> {
    const payload = {
      data: {
        type: 'discounts',
        attributes: {
          name: code,
          code: code,
          amount: discountPercent,
          amount_type: 'percent',
          is_limited_redemptions: false,
          max_redemptions: null,
          starts_at: new Date().toISOString(),
          expires_at: null,
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: storeId,
            },
          },
          ...(productIds && {
            variants: {
              data: productIds.map((id) => ({ type: 'variants', id })),
            },
          }),
        },
      },
    };

    const response = await this.request<{ data: any }>({
      method: 'POST',
      url: '/discounts',
      data: payload,
    });

    return response.data;
  }

  /**
   * Get subscriptions
   */
  async getSubscriptions(): Promise<any[]> {
    const response = await this.request<{ data: any[] }>({
      method: 'GET',
      url: '/subscriptions',
      params: {
        'filter[store_id]': this.config.storeId,
      },
    });

    return response.data || [];
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<any> {
    const response = await this.request<{ data: any }>({
      method: 'DELETE',
      url: `/subscriptions/${subscriptionId}`,
    });

    return response.data;
  }

  /**
   * Get license keys
   */
  async getLicenseKeys(orderId?: string): Promise<any[]> {
    const params: any = {};
    if (orderId) {
      params['filter[order_id]'] = orderId;
    }

    const response = await this.request<{ data: any[] }>({
      method: 'GET',
      url: '/license-keys',
      params,
    });

    return response.data || [];
  }

  /**
   * Activate a license key
   */
  async activateLicense(licenseKeyId: string, instanceName: string): Promise<any> {
    const payload = {
      data: {
        type: 'license-key-instances',
        attributes: {
          name: instanceName,
        },
        relationships: {
          'license-key': {
            data: {
              type: 'license-keys',
              id: licenseKeyId,
            },
          },
        },
      },
    };

    const response = await this.request<{ data: any }>({
      method: 'POST',
      url: '/license-key-instances',
      data: payload,
    });

    return response.data;
  }

  /**
   * Deactivate a license key instance
   */
  async deactivateLicense(instanceId: string): Promise<void> {
    await this.request({
      method: 'DELETE',
      url: `/license-key-instances/${instanceId}`,
    });
  }

  /**
   * Normalize sale data from Lemon Squeezy format
   */
  private normalizeSale(order: any): SaleData {
    return {
      id: order.id,
      productId: order.relationships?.product?.data?.id || '',
      amount: order.attributes.total / 100, // Convert from cents
      currency: order.attributes.currency || 'USD',
      customerEmail: order.attributes.user_email,
      customerName: order.attributes.user_name,
      purchaseDate: new Date(order.attributes.created_at),
      refunded: order.attributes.refunded || false,
      chargedBack: false, // Lemon Squeezy doesn't provide this directly
    };
  }
}
