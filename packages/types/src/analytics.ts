export interface Analytics {
  period: AnalyticsPeriod;
  startDate: Date;
  endDate: Date;
  metrics: AnalyticsMetrics;
  trends: AnalyticsTrends;
  topProducts: ProductAnalytics[];
  topMarketplaces: MarketplaceAnalytics[];
}

export enum AnalyticsPeriod {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  THIS_YEAR = 'THIS_YEAR',
  CUSTOM = 'CUSTOM',
}

export interface AnalyticsMetrics {
  // Revenue
  revenue: number;
  revenueChange: number;
  averageOrderValue: number;

  // Sales
  totalSales: number;
  salesChange: number;
  salesVelocity: number;

  // Customers
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;

  // Products
  totalProducts: number;
  publishedProducts: number;
  bestSellingProduct?: string;

  // Licenses
  activeLicenses: number;
  newLicenses: number;
  expiredLicenses: number;

  // Deployments
  totalDeployments: number;
  successfulDeployments: number;
  failedDeployments: number;
  averageDeploymentTime: number;

  // Conversion
  conversionRate: number;
  abandonmentRate: number;

  // Support
  supportTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
}

export interface AnalyticsTrends {
  revenue: TrendData[];
  sales: TrendData[];
  customers: TrendData[];
  licenses: TrendData[];
  deployments: TrendData[];
}

export interface TrendData {
  date: string;
  value: number;
  change?: number;
}

export interface ProductAnalytics {
  productId: string;
  productName: string;

  // Sales
  totalSales: number;
  revenue: number;
  averagePrice: number;

  // Performance
  conversionRate: number;
  refundRate: number;

  // Licenses
  activeLicenses: number;

  // Engagement
  downloads: number;
  supportTickets: number;

  // Ratings
  averageRating?: number;
  totalReviews?: number;
}

export interface MarketplaceAnalytics {
  marketplace: string;

  // Sales
  totalSales: number;
  revenue: number;

  // Products
  totalProducts: number;

  // Performance
  conversionRate: number;
  averageOrderValue: number;

  // Health
  successRate: number;
  averageResponseTime: number;
}

export interface RevenueBreakdown {
  byProduct: Record<string, number>;
  byMarketplace: Record<string, number>;
  byRegion: Record<string, number>;
  byCustomerTier: Record<string, number>;
}

export interface FunnelAnalytics {
  stage: string;
  visitors: number;
  converted: number;
  conversionRate: number;
  dropoffRate: number;
  averageTimeInStage: number;
}

export interface CohortAnalytics {
  cohortDate: string;
  totalCustomers: number;
  retentionByMonth: Record<string, number>;
  revenueByMonth: Record<string, number>;
  lifetimeValue: number;
}

export interface PredictiveAnalytics {
  // Revenue forecasting
  projectedRevenue: number;
  projectedRevenueByMonth: Record<string, number>;
  confidenceInterval: {
    lower: number;
    upper: number;
  };

  // Customer predictions
  churnRisk: ChurnPrediction[];
  upsellOpportunities: UpsellOpportunity[];

  // Product predictions
  demandForecast: Record<string, number>;
  optimalPricing: Record<string, number>;
}

export interface ChurnPrediction {
  customerId: string;
  customerEmail: string;
  churnProbability: number;
  reason?: string;
  recommendedAction?: string;
}

export interface UpsellOpportunity {
  customerId: string;
  customerEmail: string;
  currentTier: string;
  recommendedTier: string;
  probability: number;
  potentialRevenue: number;
}

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  userId?: string;
  customerId?: string;
  productId?: string;

  // Event details
  name: string;
  properties: Record<string, any>;

  // Context
  timestamp: Date;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;

  // Metadata
  metadata?: Record<string, any>;
}

export enum AnalyticsEventType {
  PAGE_VIEW = 'PAGE_VIEW',
  PRODUCT_VIEW = 'PRODUCT_VIEW',
  ADD_TO_CART = 'ADD_TO_CART',
  CHECKOUT_STARTED = 'CHECKOUT_STARTED',
  PURCHASE = 'PURCHASE',
  LICENSE_ACTIVATED = 'LICENSE_ACTIVATED',
  PRODUCT_DEPLOYED = 'PRODUCT_DEPLOYED',
  SUPPORT_TICKET = 'SUPPORT_TICKET',
  CUSTOM = 'CUSTOM',
}

export interface RealTimeMetrics {
  activeUsers: number;
  activeCheckouts: number;
  salesInLastHour: number;
  revenueInLastHour: number;
  currentDeployments: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
  latestEvents: AnalyticsEvent[];
}
