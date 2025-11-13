export enum PricingStrategy {
  FIXED = 'FIXED',
  DYNAMIC = 'DYNAMIC',
  COMPETITIVE = 'COMPETITIVE',
  PENETRATION = 'PENETRATION',
  PREMIUM = 'PREMIUM',
  VALUE_BASED = 'VALUE_BASED',
}

export interface PricingConfig {
  productId: string;
  strategy: PricingStrategy;

  // Base pricing
  basePrice: number;
  currency: string;

  // Dynamic pricing
  dynamicPricing?: {
    enabled: boolean;
    minPrice?: number;
    maxPrice?: number;
    factors: PricingFactor[];
  };

  // Geographic pricing
  geographicPricing?: {
    enabled: boolean;
    regions: Record<string, number>; // region -> price multiplier
  };

  // Tier pricing
  tierPricing?: {
    enabled: boolean;
    tiers: PricingTier[];
  };

  // Discounts
  discounts?: Discount[];

  // Competitor pricing
  competitorPricing?: {
    enabled: boolean;
    competitors: string[];
    strategy: 'match' | 'undercut' | 'premium';
    margin?: number;
  };
}

export interface PricingFactor {
  type: 'demand' | 'inventory' | 'seasonality' | 'competitor' | 'time' | 'customer_segment';
  weight: number;
  config?: Record<string, any>;
}

export interface PricingTier {
  name: string;
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  discount?: number;
}

export interface Discount {
  id: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y';
  value: number;

  // Conditions
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;

  // Validity
  startDate?: Date;
  endDate?: Date;

  // Targeting
  applicableProducts?: string[];
  applicableCustomers?: string[];
  applicableRegions?: string[];

  // Code
  code?: string;

  // Status
  enabled: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface PriceOptimization {
  productId: string;

  // Current pricing
  currentPrice: number;

  // Recommendations
  recommendedPrice: number;
  confidence: number;

  // Analysis
  elasticity: number;
  demandCurve: DemandPoint[];

  // Projections
  projectedRevenue: number;
  projectedSales: number;

  // Insights
  insights: PricingInsight[];

  analyzedAt: Date;
}

export interface DemandPoint {
  price: number;
  expectedSales: number;
  expectedRevenue: number;
}

export interface PricingInsight {
  type: 'opportunity' | 'warning' | 'recommendation';
  message: string;
  impact: 'high' | 'medium' | 'low';
  data?: Record<string, any>;
}

export interface CompetitorPrice {
  competitor: string;
  productName: string;
  price: number;
  currency: string;
  url?: string;
  lastUpdated: Date;
}

export interface PriceChange {
  id: string;
  productId: string;

  // Price change
  oldPrice: number;
  newPrice: number;
  change: number;
  changePercent: number;

  // Reason
  reason: string;
  strategy?: PricingStrategy;

  // Impact
  impactedSales?: number;
  impactedRevenue?: number;

  // Metadata
  appliedAt: Date;
  appliedBy?: string;
  automated: boolean;

  createdAt: Date;
}

export interface PricingExperiment {
  id: string;
  productId: string;

  // Experiment details
  name: string;
  description: string;

  // Variants
  control: PricingVariant;
  variants: PricingVariant[];

  // Allocation
  trafficAllocation: Record<string, number>; // variant -> percentage

  // Goals
  primaryMetric: 'revenue' | 'sales' | 'conversion_rate';
  successCriteria: number;

  // Status
  status: 'draft' | 'running' | 'completed' | 'stopped';
  startDate?: Date;
  endDate?: Date;

  // Results
  results?: PricingExperimentResults;

  createdAt: Date;
  updatedAt: Date;
}

export interface PricingVariant {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface PricingExperimentResults {
  winner?: string;
  confidence: number;

  variants: Record<string, {
    impressions: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    averageOrderValue: number;
  }>;

  insights: string[];
  recommendation: string;
}

export interface PricingAlert {
  id: string;
  type: 'competitor_price_drop' | 'low_conversion' | 'inventory_low' | 'price_anomaly';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  data: Record<string, any>;
  acknowledged: boolean;
  createdAt: Date;
}
