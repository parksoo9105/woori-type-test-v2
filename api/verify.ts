import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getResponseByTokenHash } from './_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { token } = req.body || {};

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return res.status(400).json({ error: '확인 토큰을 입력해 주세요.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const record = await getResponseByTokenHash(tokenHash);

    if (!record) {
      return res.status(404).json({ error: '해당 토큰으로 등록된 응답 데이터를 찾을 수 없습니다.' });
    }

    // Return strictly the participant's own single record
    return res.status(200).json({
      archetype_id: record.archetype_id,
      connection_score: record.connection_score,
      openness_score: record.openness_score,
      ai_score: record.ai_score,
      q1_answers: record.q1_answers,
      q2_answer: record.q2_answer,
      q3_answer: record.q3_answer,
      q4_answer: record.q4_answer,
      q5_answer: record.q5_answer,
      q6_answer: record.q6_answer,
      q7_answer: record.q7_answer,
      survey_version: record.survey_version || 'v2.0',
      created_at: record.created_at,
    });
  } catch (err: any) {
    console.error('Verify error:', err);
    return res.status(500).json({ error: '응답 조회 중 오류가 발생했습니다.' });
  }
}
