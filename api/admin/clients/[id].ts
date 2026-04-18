import { Redis } from '@upstash/redis';
import type { Request, Response } from 'express';

const redis = Redis.fromEnv();

function isAuthorized(req: Request): boolean {
  return !!process.env.ADMIN_GUID && req.headers['x-admin-key'] === process.env.ADMIN_GUID;
}

export default async function handler(req: Request, res: Response) {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  const id = (req.query as Record<string, string>).id;
  if (!id) return res.status(400).json({ error: 'Missing ID' });
  try {
    const clients = await redis.get<Record<string, any>>('roi:clients') ?? {};
    if (req.method === 'PUT') {
      if (!clients[id]) return res.status(404).json({ error: 'Client not found' });
      const { name, logoUrl, locale, defaultCurrency } = req.body;
      clients[id] = { name, logoUrl: logoUrl || undefined, locale, defaultCurrency };
      await redis.set('roi:clients', clients);
      return res.status(200).json({ id, ...clients[id] });
    }
    if (req.method === 'DELETE') {
      if (!clients[id]) return res.status(404).json({ error: 'Client not found' });
      delete clients[id];
      await redis.set('roi:clients', clients);
      return res.status(200).json({ success: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin client error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
