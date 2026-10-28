import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllResponses, computeAggregates } from '../_lib/db.js';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSWORD;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!ADMIN_SECRET) {
    return res.status(500).json({ error: '서버에 ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token || token !== ADMIN_SECRET) {
    return res.status(401).json({ error: '관리자 인증이 필요합니다.' });
  }

  try {
    const { records } = await getAllResponses(5000);
    const stats = computeAggregates(records);
    return res.status(200).json(stats);
  } catch (err: any) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ error: '통계 산출 중 오류가 발생했습니다.' });
  }
}
