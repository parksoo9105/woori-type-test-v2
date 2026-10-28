import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllResponses, computeAggregates } from '../_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=3, stale-while-revalidate=5');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { records } = await getAllResponses(5000);
    const stats = computeAggregates(records);
    return res.status(200).json(stats);
  } catch (err: any) {
    console.error('Display stats error:', err);
    return res.status(500).json({ error: '집계 데이터를 불러올 수 없습니다.' });
  }
}
