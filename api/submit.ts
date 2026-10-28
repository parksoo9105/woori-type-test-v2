import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { calculateScores, classifyResultType } from './_lib/scoring.js';
import { insertResponse } from './_lib/db.js';
import type { SurveyResponseRecord } from './_lib/types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { token, answers } = req.body || {};

    if (!token || typeof token !== 'string' || token.trim().length < 8) {
      return res.status(400).json({ error: '유효한 확인 토큰이 필요합니다.' });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: '설문 응답 데이터가 올바르지 않습니다.' });
    }

    // Server-side strict scoring & classification
    const answersMap = {
      1: answers.q1 || [],
      2: answers.q2 || '',
      3: answers.q3 || '',
      4: answers.q4 || '',
      5: answers.q5 || '',
      6: answers.q6 || '',
      7: answers.q7 || '',
    };

    const breakdown = calculateScores(answersMap);
    const archetypeId = classifyResultType(breakdown);

    // One-way SHA-256 hash (never store plain token)
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const record: SurveyResponseRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
      token_hash: tokenHash,
      q1_answers: Array.isArray(answers.q1) ? answers.q1 : [answers.q1].filter(Boolean),
      q2_answer: String(answers.q2 || ''),
      q3_answer: String(answers.q3 || ''),
      q4_answer: String(answers.q4 || ''),
      q5_answer: String(answers.q5 || ''),
      q6_answer: String(answers.q6 || ''),
      q7_answer: String(answers.q7 || ''),
      connection_score: breakdown.connectionScore,
      openness_score: breakdown.opennessScore,
      ai_score: breakdown.aiScore,
      archetype_id: archetypeId,
      survey_version: 'v2.1',
      created_at: new Date().toISOString(),
    };

    await insertResponse(record);

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res.status(200).json({
      success: true,
      archetype_id: archetypeId,
      connection_score: breakdown.connectionScore,
      openness_score: breakdown.opennessScore,
      ai_score: breakdown.aiScore,
      token_hash: tokenHash,
    });
  } catch (err: any) {
    console.error('Submit error:', err);
    return res.status(500).json({ error: '응답 저장 중 오류가 발생했습니다.' });
  }
}
