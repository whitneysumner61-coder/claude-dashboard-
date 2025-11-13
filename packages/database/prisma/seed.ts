import { PrismaClient, UserRole, ProductType, ProductStatus, LicenseTier, CustomerTier } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@autodeploy.local' },
    update: {},
    create: {
      email: 'admin@autodeploy.local',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
      company: 'AutoDeploy Pro',
      country: 'US',
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@autodeploy.local' },
    update: {},
    create: {
      email: 'demo@autodeploy.local',
      name: 'Demo User',
      password: demoPassword,
      role: UserRole.USER,
      company: 'Demo Company',
      country: 'US',
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      userId: demoUser.id,
      name: 'Premium WordPress Theme',
      slug: 'premium-wordpress-theme',
      description: 'A beautiful and responsive WordPress theme for modern websites',
      longDescription: 'This premium WordPress theme includes everything you need to create a stunning website. Features include responsive design, SEO optimization, and extensive customization options.',
      type: ProductType.THEME,
      status: ProductStatus.PUBLISHED,
      price: 49.99,
      version: '1.0.0',
      category: 'WordPress Themes',
      tags: ['wordpress', 'theme', 'responsive', 'premium'],
      features: [
        'Responsive Design',
        'SEO Optimized',
        'Custom Widgets',
        'Page Builder Integration',
        'Regular Updates',
        'Premium Support',
      ],
      inventory: 'unlimited',
      enableTrial: false,
      publishedAt: new Date(),
    },
  });

  const product2 = await prisma.product.create({
    data: {
      userId: demoUser.id,
      name: 'SaaS Starter Kit',
      slug: 'saas-starter-kit',
      description: 'Complete SaaS application starter kit with authentication, billing, and more',
      longDescription: 'Build your SaaS faster with this complete starter kit. Includes user authentication, subscription billing, admin dashboard, API, and deployment scripts.',
      type: ProductType.SOFTWARE_LICENSE,
      status: ProductStatus.PUBLISHED,
      price: 199.99,
      version: '2.1.0',
      category: 'Software',
      tags: ['saas', 'starter-kit', 'react', 'nodejs'],
      features: [
        'User Authentication',
        'Subscription Billing',
        'Admin Dashboard',
        'REST API',
        'Email Templates',
        'Documentation',
      ],
      inventory: 'unlimited',
      enableTrial: true,
      trialDays: 14,
      publishedAt: new Date(),
    },
  });

  console.log('✅ Created sample products');

  // Create sample customers
  const customer1 = await prisma.customer.create({
    data: {
      userId: demoUser.id,
      email: 'customer1@example.com',
      name: 'John Smith',
      company: 'Tech Startup Inc',
      tier: CustomerTier.PROFESSIONAL,
      country: 'US',
      lifetimeValue: 249.98,
      totalPurchases: 2,
      firstPurchaseAt: new Date('2024-01-15'),
      lastPurchaseAt: new Date('2024-02-20'),
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      userId: demoUser.id,
      email: 'customer2@example.com',
      name: 'Sarah Johnson',
      tier: CustomerTier.STARTER,
      country: 'UK',
      lifetimeValue: 49.99,
      totalPurchases: 1,
      firstPurchaseAt: new Date('2024-03-01'),
      lastPurchaseAt: new Date('2024-03-01'),
    },
  });

  console.log('✅ Created sample customers');

  // Create sample purchases
  const purchase1 = await prisma.purchase.create({
    data: {
      customerId: customer1.id,
      productId: product1.id,
      amount: 49.99,
      currency: 'USD',
      marketplace: 'GUMROAD',
      marketplaceOrderId: 'gum_12345',
      paymentStatus: 'COMPLETED',
      fulfilled: true,
      fulfilledAt: new Date(),
      licenseKey: 'DEMO-KEY-1234-5678',
    },
  });

  const purchase2 = await prisma.purchase.create({
    data: {
      customerId: customer1.id,
      productId: product2.id,
      amount: 199.99,
      currency: 'USD',
      marketplace: 'LEMONSQUEEZY',
      marketplaceOrderId: 'ls_67890',
      paymentStatus: 'COMPLETED',
      fulfilled: true,
      fulfilledAt: new Date(),
      licenseKey: 'DEMO-KEY-ABCD-EFGH',
    },
  });

  console.log('✅ Created sample purchases');

  // Create sample licenses
  const license1 = await prisma.license.create({
    data: {
      key: 'DEMO-KEY-1234-5678-9ABC',
      productId: product2.id,
      customerId: customer1.id,
      tier: LicenseTier.PROFESSIONAL,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      activatedAt: new Date(),
      maxActivations: 3,
      activationCount: 1,
      hardwareIds: ['hw-12345'],
      features: ['full-access', 'priority-support', 'auto-updates'],
    },
  });

  console.log('✅ Created sample licenses');

  // Create sample analytics events
  await prisma.analyticsEvent.createMany({
    data: [
      {
        type: 'PAGE_VIEW',
        name: 'product_page_view',
        productId: product1.id,
        properties: { page: '/products/premium-wordpress-theme' },
        timestamp: new Date(),
      },
      {
        type: 'PURCHASE',
        name: 'product_purchase',
        customerId: customer1.id,
        productId: product1.id,
        properties: { amount: 49.99, currency: 'USD' },
        timestamp: new Date(),
      },
      {
        type: 'LICENSE_ACTIVATED',
        name: 'license_activation',
        customerId: customer1.id,
        productId: product2.id,
        properties: { licenseKey: license1.key },
        timestamp: new Date(),
      },
    ],
  });

  console.log('✅ Created sample analytics events');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('Login credentials:');
  console.log('  Admin: admin@autodeploy.local / admin123');
  console.log('  Demo:  demo@autodeploy.local / demo123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
