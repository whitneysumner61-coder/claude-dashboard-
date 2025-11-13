export enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum ProductType {
  DIGITAL_DOWNLOAD = 'DIGITAL_DOWNLOAD',
  SOFTWARE_LICENSE = 'SOFTWARE_LICENSE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  COURSE = 'COURSE',
  PLUGIN = 'PLUGIN',
  THEME = 'THEME',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  type: ProductType;
  status: ProductStatus;
  price: number;
  currency: string;

  // Metadata
  version: string;
  category: string;
  tags: string[];

  // Assets
  imageUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  documentationUrl?: string;

  // Features
  features: string[];
  systemRequirements?: Record<string, any>;

  // Settings
  inventory: number | 'unlimited';
  enableTrial: boolean;
  trialDays?: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;

  // Relations
  userId: string;
  deployments?: Deployment[];
  licenses?: License[];
}

export interface ProductCreateInput {
  name: string;
  description: string;
  longDescription?: string;
  type: ProductType;
  price: number;
  currency?: string;
  version: string;
  category: string;
  tags?: string[];
  features: string[];
  systemRequirements?: Record<string, any>;
  imageUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  enableTrial?: boolean;
  trialDays?: number;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {
  status?: ProductStatus;
  inventory?: number | 'unlimited';
}

export interface Deployment {
  id: string;
  productId: string;
  marketplace: string;
  marketplaceProductId?: string;
  status: DeploymentStatus;
  config: Record<string, any>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  deployedAt?: Date;
}

export enum DeploymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DEPLOYING = 'DEPLOYING',
  DEPLOYED = 'DEPLOYED',
  FAILED = 'FAILED',
  PAUSED = 'PAUSED',
}
