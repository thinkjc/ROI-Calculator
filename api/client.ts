import { Redis } from '@upstash/redis';
import type { Request, Response } from 'express';

const STATIC_CLIENTS: Record<string, any> = {
  'a4f8e2c1-3b7d-4a9e-8f2c-5d1b6e9a3c7f': {
    name: 'VOIS',
    locale: 'en-GB',
    defaultCurrency: 'GBP',
  },
};

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const id = (req.query as Record<string, string>).c;
  if (!id) return res.status(400).json({ error: 'Missing client ID' });
  try {
    const redis = Redis.fromEnv();
    const kvClients = await redis.get<Record<string, any>>('roi:clients') ?? {};
    const client = kvClients[id] ?? STATIC_CLIENTS[id];
    if (!client) return res.status(404).json({ error: 'Client not found' });
    return res.status(200).json(client);
  } catch (err: any) {
    console.error('Client load error:', err);
    const fallback = STATIC_CLIENTS[id];
    if (fallback) return res.status(200).json(fallback);
    return res.status(500).json({ error: String(err?.message ?? err) });
  }
}
