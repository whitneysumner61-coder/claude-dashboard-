export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CHURNED = 'CHURNED',
  BLOCKED = 'BLOCKED',
}

export enum CustomerTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  company?: string;

  // Status
  status: CustomerStatus;
  tier: CustomerTier;

  // Profile
  avatar?: string;
  phone?: string;
  country?: string;
  timezone?: string;

  // Preferences
  emailOptIn: boolean;
  marketingOptIn: boolean;
  language: string;

  // Metadata
  metadata?: Record<string, any>;
  tags: string[];

  // Analytics
  lifetimeValue: number;
  totalPurchases: number;
  lastPurchaseAt?: Date;
  firstPurchaseAt?: Date;

  // Relations
  purchases: Purchase[];
  licenses: License[];
  supportTickets?: SupportTicket[];

  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  customerId: string;
  productId: string;

  // Transaction details
  amount: number;
  currency: string;
  marketplace: string;
  marketplaceOrderId: string;

  // Payment
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  refunded: boolean;
  refundedAt?: Date;
  refundAmount?: number;

  // Fulfillment
  fulfilled: boolean;
  fulfilledAt?: Date;
  downloadUrl?: string;
  licenseKey?: string;

  // Metadata
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;

  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
}

export interface SupportTicket {
  id: string;
  customerId: string;
  productId?: string;

  // Ticket details
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;

  // Assignment
  assignedTo?: string;

  // Conversation
  messages: TicketMessage[];

  // Metadata
  tags: string[];
  metadata?: Record<string, any>;

  // Resolution
  resolvedAt?: Date;
  resolution?: string;
  satisfactionRating?: number;

  createdAt: Date;
  updatedAt: Date;
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_CUSTOMER = 'WAITING_CUSTOMER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string;
  authorType: 'customer' | 'agent' | 'system';
  content: string;
  attachments?: string[];
  createdAt: Date;
}

export interface CustomerOnboarding {
  customerId: string;
  productId: string;

  // Progress
  completed: boolean;
  currentStep: number;
  totalSteps: number;

  // Steps
  steps: OnboardingStep[];

  // Timing
  startedAt: Date;
  completedAt?: Date;
  lastActivityAt: Date;
}

export interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'tutorial' | 'video' | 'task' | 'milestone';
  completed: boolean;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  churnRate: number;
  averageLifetimeValue: number;
  averagePurchaseValue: number;
  customersByTier: Record<CustomerTier, number>;
  customersByStatus: Record<CustomerStatus, number>;
  topCustomers: Customer[];
}
