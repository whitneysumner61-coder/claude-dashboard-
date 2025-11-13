import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { MarketplaceSDKConfig } from './types';

export abstract class BaseMarketplaceSDK {
  protected client: AxiosInstance;
  protected config: MarketplaceSDKConfig;

  constructor(config: MarketplaceSDKConfig) {
    this.config = config;
    this.client = axios.create({
      timeout: config.timeout || 30000,
      headers: this.getDefaultHeaders(),
    });

    this.setupInterceptors();
  }

  protected abstract getDefaultHeaders(): Record<string, string>;
  protected abstract getBaseURL(): string;

  protected setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        config.baseURL = this.getBaseURL();
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Retry logic
        if (!originalRequest._retry && this.shouldRetry(error)) {
          originalRequest._retry = true;
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

          if (originalRequest._retryCount < (this.config.retries || 3)) {
            await this.delay(this.getRetryDelay(originalRequest._retryCount));
            return this.client(originalRequest);
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  protected shouldRetry(error: any): boolean {
    // Retry on network errors and 5xx errors
    return (
      !error.response ||
      error.response.status >= 500 ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT'
    );
  }

  protected getRetryDelay(retryCount: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s
    return Math.min(1000 * Math.pow(2, retryCount), 10000);
  }

  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected normalizeError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText;
      const err = new Error(`${error.response.status}: ${message}`);
      (err as any).status = error.response.status;
      (err as any).data = error.response.data;
      return err;
    }

    if (error.request) {
      return new Error('No response received from server');
    }

    return error;
  }

  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }

  // Abstract methods that must be implemented by child classes
  abstract createProduct(params: any): Promise<any>;
  abstract updateProduct(id: string, params: any): Promise<any>;
  abstract deleteProduct(id: string): Promise<void>;
  abstract getProduct(id: string): Promise<any>;
  abstract listProducts(): Promise<any[]>;
  abstract getSales(timeframe?: string): Promise<any[]>;
  abstract getAnalytics(): Promise<any>;
  abstract verifyWebhook(payload: string, signature: string): boolean;
}
