import { Redis } from '@upstash/redis';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';

function isAuthorized(req: Request): boolean {
  return !!process.env.ADMIN_GUID && req.headers['x-admin-key'] === process.env.ADMIN_GUID;
}

export default async function handler(req: Request, res: Response) {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const redis = Redis.fromEnv();
    const clients = await redis.get<Record<string, any>>('roi:clients') ?? {};
    if (req.method === 'GET') {
      return res.status(200).json(clients);
    }
    if (req.method === 'POST') {
      const { name, logoUrl, locale, defaultCurrency, showInvestmentOverview } = req.body;
      if (!name || !locale || !defaultCurrency) {
        return res.status(400).json({ error: 'name, locale, and defaultCurrency are required' });
      }
      const id = randomUUID();
      clients[id] = { name, logoUrl: logoUrl || undefined, locale, defaultCurrency, showInvestmentOverview: !!showInvestmentOverview };
      await redis.set('roi:clients', clients);
      return res.status(201).json({ id, ...clients[id] });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin clients error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
