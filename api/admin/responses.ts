import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllResponses } from '../_lib/db.js';

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
    const page = Math.max(parseInt(String(req.query.page || '1'), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit || '20'), 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const { records, total } = await getAllResponses(limit, offset);

    // Ensure absolutely NO PII or raw token
    const safeRecords = records.map((r) => ({
      id: r.id,
      archetype_id: r.archetype_id,
      connection_score: r.connection_score,
      openness_score: r.openness_score,
      ai_score: r.ai_score,
      q1_answers: r.q1_answers,
      q2_answer: r.q2_answer,
      q3_answer: r.q3_answer,
      q4_answer: r.q4_answer,
      q5_answer: r.q5_answer,
      q6_answer: r.q6_answer,
      q7_answer: r.q7_answer,
      survey_version: r.survey_version || 'v2.0',
      created_at: r.created_at,
    }));

    return res.status(200).json({
      records: safeRecords,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error('Admin responses error:', err);
    return res.status(500).json({ error: '응답 목록을 불러오는 중 오류가 발생했습니다.' });
  }
}
