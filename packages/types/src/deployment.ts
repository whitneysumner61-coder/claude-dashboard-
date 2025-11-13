export enum DeploymentStatus {
  PENDING = 'PENDING',
  VALIDATING = 'VALIDATING',
  OPTIMIZING = 'OPTIMIZING',
  DEPLOYING = 'DEPLOYING',
  VERIFYING = 'VERIFYING',
  DEPLOYED = 'DEPLOYED',
  FAILED = 'FAILED',
  PAUSED = 'PAUSED',
  ROLLED_BACK = 'ROLLED_BACK',
}

export enum DeploymentPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface DeploymentConfig {
  marketplaces: string[];
  pricing?: {
    overrides?: Record<string, number>;
    enableDynamicPricing?: boolean;
  };
  distribution?: {
    regions?: string[];
    excludeRegions?: string[];
  };
  automation?: {
    enableAutoOnboarding?: boolean;
    enableEmailSequence?: boolean;
    enableAffiliateProgram?: boolean;
  };
  customization?: Record<string, any>;
}

export interface DeploymentJob {
  id: string;
  deploymentId: string;
  productId: string;
  marketplace: string;
  status: DeploymentStatus;
  priority: DeploymentPriority;
  config: DeploymentConfig;

  // Progress tracking
  progress: number;
  currentStep?: string;
  steps: DeploymentStep[];

  // Results
  result?: DeploymentResult;
  error?: DeploymentError;

  // Metadata
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  retryCount: number;
  maxRetries: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface DeploymentResult {
  success: boolean;
  marketplace: string;
  productId: string;
  marketplaceProductId?: string;
  productUrl?: string;
  checkoutUrl?: string;
  metrics?: {
    assetsUploaded?: number;
    processingTime?: number;
    validationsPassed?: number;
  };
  warnings?: string[];
}

export interface DeploymentError {
  code: string;
  message: string;
  details?: Record<string, any>;
  retryable: boolean;
  timestamp: Date;
}

export interface DeploymentMetrics {
  totalDeployments: number;
  successfulDeployments: number;
  failedDeployments: number;
  averageDeploymentTime: number;
  deploymentsByMarketplace: Record<string, number>;
  deploymentsByStatus: Record<DeploymentStatus, number>;
  recentDeployments: DeploymentJob[];
}

export interface DeploymentHealthCheck {
  deploymentId: string;
  marketplace: string;
  healthy: boolean;
  lastChecked: Date;
  checks: {
    productAccessible: boolean;
    checkoutFunctional: boolean;
    downloadsWorking: boolean;
    webhooksActive: boolean;
  };
  issues?: string[];
}
