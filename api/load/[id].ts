import { Redis } from '@upstash/redis';
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const id = (req.query as Record<string, string>).id;
  if (!id) return res.status(400).json({ error: 'Missing ID' });
  try {
    const redis = Redis.fromEnv();
    const data = await redis.get(id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(data);
  } catch (err) {
    console.error('Load error:', err);
    return res.status(500).json({ error: 'Failed to load scenario' });
  }
}
