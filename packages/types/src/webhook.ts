export enum WebhookEventType {
  // Product events
  PRODUCT_CREATED = 'product.created',
  PRODUCT_UPDATED = 'product.updated',
  PRODUCT_DELETED = 'product.deleted',
  PRODUCT_PUBLISHED = 'product.published',

  // Deployment events
  DEPLOYMENT_STARTED = 'deployment.started',
  DEPLOYMENT_COMPLETED = 'deployment.completed',
  DEPLOYMENT_FAILED = 'deployment.failed',

  // Sale events
  SALE_CREATED = 'sale.created',
  SALE_REFUNDED = 'sale.refunded',
  SALE_DISPUTED = 'sale.disputed',

  // License events
  LICENSE_CREATED = 'license.created',
  LICENSE_ACTIVATED = 'license.activated',
  LICENSE_EXPIRED = 'license.expired',
  LICENSE_REVOKED = 'license.revoked',

  // Customer events
  CUSTOMER_CREATED = 'customer.created',
  CUSTOMER_UPDATED = 'customer.updated',

  // Support events
  TICKET_CREATED = 'ticket.created',
  TICKET_RESOLVED = 'ticket.resolved',
}

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  source: string;

  // Event data
  data: Record<string, any>;
  previousData?: Record<string, any>;

  // Metadata
  timestamp: Date;
  apiVersion: string;

  // Delivery
  deliveryAttempts: number;
  lastDeliveryAttempt?: Date;
  delivered: boolean;
  deliveredAt?: Date;

  createdAt: Date;
}

export interface WebhookEndpoint {
  id: string;
  userId: string;

  // Endpoint details
  url: string;
  description?: string;

  // Configuration
  events: WebhookEventType[];
  enabled: boolean;

  // Security
  secret: string;
  signatureHeader: string;

  // Retry policy
  maxRetries: number;
  retryDelay: number;
  timeout: number;

  // Filters
  filters?: WebhookFilter[];

  // Status
  lastDeliveryAt?: Date;
  lastDeliveryStatus?: 'success' | 'failed';
  consecutiveFailures: number;

  // Metadata
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  endpointId: string;
  eventId: string;

  // Request
  requestUrl: string;
  requestHeaders: Record<string, string>;
  requestBody: any;

  // Response
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: any;

  // Timing
  duration?: number;
  attemptNumber: number;

  // Status
  success: boolean;
  error?: string;

  // Metadata
  timestamp: Date;
}

export interface WebhookSignature {
  algorithm: 'sha256' | 'sha512';
  signature: string;
  timestamp: number;
}

export interface WebhookStats {
  endpointId: string;

  // Delivery stats
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  averageResponseTime: number;

  // Recent deliveries
  recentDeliveries: WebhookDelivery[];

  // Health
  healthy: boolean;
  consecutiveFailures: number;
  lastSuccessAt?: Date;
  lastFailureAt?: Date;
}

export interface WebhookTest {
  endpointId: string;
  eventType: WebhookEventType;
  testData?: Record<string, any>;
}

export interface WebhookTestResult {
  success: boolean;
  status?: number;
  duration: number;
  request: {
    url: string;
    headers: Record<string, string>;
    body: any;
  };
  response?: {
    status: number;
    headers: Record<string, string>;
    body: any;
  };
  error?: string;
}
