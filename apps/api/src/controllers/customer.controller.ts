import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export async function listCustomers(req: AuthRequest, res: Response) {
  res.json({ success: true, data: [], meta: { total: 0 } });
}

export async function getCustomer(req: AuthRequest, res: Response) {
  res.status(501).json({ success: false, error: { code: 'NOT_IMPLEMENTED' } });
}

export async function getCustomerPurchases(req: AuthRequest, res: Response) {
  res.json({ success: true, data: [] });
}

export async function getCustomerLicenses(req: AuthRequest, res: Response) {
  res.json({ success: true, data: [] });
}

export async function getCustomerTickets(req: AuthRequest, res: Response) {
  res.json({ success: true, data: [] });
}

export async function getCustomerAnalytics(req: AuthRequest, res: Response) {
  res.json({
    success: true,
    data: {
      lifetimeValue: 0,
      totalPurchases: 0,
      activeLicenses: 0,
    },
  });
}
