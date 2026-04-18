import { Redis } from '@upstash/redis';
import type { Request, Response } from 'express';
import { getClient } from '../src/clients';

const redis = Redis.fromEnv();

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const id = (req.query as Record<string, string>).c;
  if (!id) return res.status(400).json({ error: 'Missing client ID' });
  try {
    const kvClients = await redis.get<Record<string, any>>('roi:clients') ?? {};
    const client = kvClients[id] ?? getClient(id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    return res.status(200).json(client);
  } catch (err) {
    console.error('Client load error:', err);
    const fallback = getClient(id);
    if (fallback) return res.status(200).json(fallback);
    return res.status(500).json({ error: 'Failed to load client' });
  }
}
