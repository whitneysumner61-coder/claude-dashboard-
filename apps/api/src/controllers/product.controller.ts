import { Response } from 'express';
import { prisma, ProductStatus } from '@autodeploy/database';
import { AuthRequest } from '../middleware/auth';

export async function listProducts(req: AuthRequest, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as ProductStatus | undefined;
    const search = req.query.search as string | undefined;

    const where: any = { userId: req.user!.id };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { deployments: true, licenses: true, purchases: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
}

export async function getProduct(req: AuthRequest, res: Response) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        deployments: { orderBy: { createdAt: 'desc' }, take: 5 },
        _count: {
          select: { licenses: true, purchases: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found' },
      });
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
}

export async function createProduct(req: AuthRequest, res: Response) {
  try {
    const { name, description, type, price, version, category, ...rest } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const product = await prisma.product.create({
      data: {
        userId: req.user!.id,
        name,
        slug,
        description,
        type,
        price,
        version,
        category,
        ...rest,
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_FAILED', message: error.message },
    });
  }
}

export async function updateProduct(req: AuthRequest, res: Response) {
  try {
    const product = await prisma.product.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: req.body,
    });

    if (product.count === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found' },
      });
    }

    const updated = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message },
    });
  }
}

export async function deleteProduct(req: AuthRequest, res: Response) {
  try {
    await prisma.product.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    res.json({
      success: true,
      data: { message: 'Product deleted successfully' },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_FAILED', message: error.message },
    });
  }
}

export async function publishProduct(req: AuthRequest, res: Response) {
  try {
    const product = await prisma.product.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: {
        status: ProductStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    if (product.count === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found' },
      });
    }

    res.json({
      success: true,
      data: { message: 'Product published successfully' },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'PUBLISH_FAILED', message: error.message },
    });
  }
}

export async function getProductAnalytics(req: AuthRequest, res: Response) {
  try {
    const productId = req.params.id;

    const [product, purchases, licenses, events] = await Promise.all([
      prisma.product.findFirst({
        where: { id: productId, userId: req.user!.id },
      }),
      prisma.purchase.findMany({
        where: { productId },
      }),
      prisma.license.findMany({
        where: { productId },
      }),
      prisma.analyticsEvent.findMany({
        where: { productId },
        orderBy: { timestamp: 'desc' },
        take: 100,
      }),
    ]);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found' },
      });
    }

    const analytics = {
      totalRevenue: purchases.reduce((sum, p) => sum + p.amount, 0),
      totalSales: purchases.length,
      activeLicenses: licenses.filter((l) => l.status === 'ACTIVE').length,
      totalLicenses: licenses.length,
      recentEvents: events.slice(0, 10),
    };

    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'ANALYTICS_FAILED', message: error.message },
    });
  }
}
