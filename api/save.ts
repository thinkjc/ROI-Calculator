import { Redis } from '@upstash/redis';
import type { Request, Response } from 'express';

const redis = Redis.fromEnv();

function generateId(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { globalValues, currency, subCost } = req.body;
    let id = generateId();
    for (let i = 0; i < 5; i++) {
      if (!(await redis.exists(id))) break;
      id = generateId();
    }
    await redis.set(id, { globalValues, currency, subCost }, { ex: 60 * 60 * 24 * 90 });
    return res.status(200).json({ id });
  } catch (err) {
    console.error('Save error:', err);
    return res.status(500).json({ error: 'Failed to save scenario' });
  }
}
