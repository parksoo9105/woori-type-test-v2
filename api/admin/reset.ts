import type { VercelRequest, VercelResponse } from '@vercel/node';
import { resetAllResponses } from '../_lib/db.js';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSWORD;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
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

  const { confirm } = req.body || {};
  if (confirm !== '초기화') {
    return res.status(400).json({ error: "'초기화' 확인 문구가 일치하지 않습니다." });
  }

  try {
    const result = await resetAllResponses();
    if (!result.success) {
      return res.status(500).json({ error: '데이터 초기화에 실패했습니다.' });
    }

    console.log(`[ADMIN AUDIT] All responses reset by admin at ${new Date().toISOString()}, count: ${result.count}`);

    return res.status(200).json({
      success: true,
      message: '전체 설문 데이터와 통계가 성공적으로 초기화되었습니다.',
      deletedCount: result.count,
    });
  } catch (err: any) {
    console.error('Reset error:', err);
    return res.status(500).json({ error: '데이터 초기화 중 서버 오류가 발생했습니다.' });
  }
}
