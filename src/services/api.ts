import { Answers, SurveyResponseRecord, AggregateStats, ResultTypeId } from '../types';
import { calculateScores, classifyResultType } from '../utils/scoring';

const LOCAL_STORAGE_RESPONSES_KEY = 'woori_local_mock_responses_v1';

const isBrowserEnv = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.location !== 'undefined' &&
    window.location.protocol &&
    (window.location.protocol === 'http:' || window.location.protocol === 'https:')
  );
};

// Helper to store mock responses locally when backend API is unavailable (e.g. offline or local Vite dev)
function getLocalMockResponses(): SurveyResponseRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RESPONSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMockResponse(record: SurveyResponseRecord) {
  try {
    const list = getLocalMockResponses();
    list.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_RESPONSES_KEY, JSON.stringify(list));
  } catch {
    // Ignore
  }
}

/**
 * Reset all survey data via POST /api/admin/reset (Admin only)
 */
export async function resetAdminData(password: string): Promise<{ success: boolean; message?: string }> {
  if (isBrowserEnv()) {
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${password.trim()}`,
      },
      body: JSON.stringify({ confirm: '초기화' }),
    });

    if (res.ok) {
      localStorage.removeItem(LOCAL_STORAGE_RESPONSES_KEY);
      return { success: true, message: '전체 데이터가 초기화되었습니다.' };
    } else {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || '데이터 초기화에 실패했습니다.');
    }
  }

  localStorage.removeItem(LOCAL_STORAGE_RESPONSES_KEY);
  return { success: true, message: '로컬 데이터가 초기화되었습니다.' };
}

/**
 * Submit survey response to /api/submit
 */
export async function submitSurvey(token: string, answers: Answers): Promise<{
  success: boolean;
  archetypeId: ResultTypeId;
  connectionScore: number;
  opennessScore: number;
  aiScore: number;
}> {
  const breakdown = calculateScores(answers);
  const archetypeId = classifyResultType(breakdown);

  // Normalize answers payload
  const q1Raw = answers[1];
  const q1Answers = Array.isArray(q1Raw)
    ? q1Raw.map(String)
    : q1Raw ? [String(q1Raw)] : [];

  const payload = {
    token,
    answers: {
      q1: q1Answers,
      q2: String(answers[2] || ''),
      q3: String(answers[3] || ''),
      q4: String(answers[4] || ''),
      q5: String(answers[5] || ''),
      q6: String(answers[6] || ''),
      q7: String(answers[7] || ''),
    },
  };

  if (isBrowserEnv()) {
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          archetypeId: data.archetype_id || archetypeId,
          connectionScore: data.connection_score ?? breakdown.connectionScore,
          opennessScore: data.openness_score ?? breakdown.opennessScore,
          aiScore: data.ai_score ?? breakdown.aiScore,
        };
      }
    } catch (err) {
      if (import.meta.env.MODE !== 'test') {
        console.warn('API submission failed, falling back to local storage:', err);
      }
    }
  }

  // Fallback to local storage
  const mockRecord: SurveyResponseRecord = {
    id: 'mock-' + Date.now(),
    token_hash: token, // in local fallback, token string is mock-hashed
    q1_answers: q1Answers,
    q2_answer: String(answers[2] || ''),
    q3_answer: String(answers[3] || ''),
    q4_answer: String(answers[4] || ''),
    q5_answer: String(answers[5] || ''),
    q6_answer: String(answers[6] || ''),
    q7_answer: String(answers[7] || ''),
    connection_score: breakdown.connectionScore,
    openness_score: breakdown.opennessScore,
    ai_score: breakdown.aiScore,
    archetype_id: archetypeId,
    created_at: new Date().toISOString(),
  };
  saveLocalMockResponse(mockRecord);

  return {
    success: true,
    archetypeId,
    connectionScore: breakdown.connectionScore,
    opennessScore: breakdown.opennessScore,
    aiScore: breakdown.aiScore,
  };
}

/**
 * Verify participant token via POST /api/verify
 */
export async function verifyParticipantToken(token: string): Promise<SurveyResponseRecord | null> {
  if (isBrowserEnv()) {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ token: token.trim() }),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API verify failed, checking local fallback:', err);
    }
  }

  // Fallback check in local storage
  const list = getLocalMockResponses();
  const match = list.find((item) => item.token_hash === token.trim());
  return match || null;
}

/**
 * Fetch aggregated statistics for LED display via GET /api/display/stats
 */
export async function fetchDisplayStats(): Promise<AggregateStats> {
  if (isBrowserEnv()) {
    try {
      const res = await fetch('/api/display/stats', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Display stats fetch failed, generating from local:', err);
    }
  }

  // Fallback computation from local storage
  return computeAggregateFromRecords(getLocalMockResponses());
}

/**
 * Fetch Admin Stats via GET /api/admin/stats
 */
export async function fetchAdminStats(adminKey: string): Promise<AggregateStats> {
  if (isBrowserEnv()) {
    const res = await fetch('/api/admin/stats', {
      headers: {
        Authorization: `Bearer ${adminKey}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error('관리자 비밀번호가 일치하지 않습니다.');
      }
      // If running purely on frontend without serverless function:
      if (res.status === 404 && import.meta.env.VITE_ADMIN_PASSWORD && adminKey === import.meta.env.VITE_ADMIN_PASSWORD) {
        return computeAggregateFromRecords(getLocalMockResponses());
      }
      throw new Error('통계 데이터를 불러오지 못했습니다.');
    }

    return await res.json();
  }

  return computeAggregateFromRecords(getLocalMockResponses());
}

/**
 * Fetch Admin Response List via GET /api/admin/responses
 */
export async function fetchAdminResponses(
  adminKey: string,
  page = 1,
  limit = 20
): Promise<{ records: SurveyResponseRecord[]; total: number; page: number; totalPages: number }> {
  if (isBrowserEnv()) {
    const res = await fetch(`/api/admin/responses?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${adminKey}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error('관리자 비밀번호가 일치하지 않습니다.');
      }
      if (res.status === 404 && import.meta.env.VITE_ADMIN_PASSWORD && adminKey === import.meta.env.VITE_ADMIN_PASSWORD) {
        const all = getLocalMockResponses();
        const start = (page - 1) * limit;
        const paginated = all.slice(start, start + limit);
        return {
          records: paginated,
          total: all.length,
          page,
          totalPages: Math.max(1, Math.ceil(all.length / limit)),
        };
      }
      throw new Error('응답 목록을 불러오지 못했습니다.');
    }

    return await res.json();
  }

  const all = getLocalMockResponses();
  const start = (page - 1) * limit;
  const paginated = all.slice(start, start + limit);
  return {
    records: paginated,
    total: all.length,
    page,
    totalPages: Math.max(1, Math.ceil(all.length / limit)),
  };
}

// Compute aggregate stats helper
export function computeAggregateFromRecords(records: SurveyResponseRecord[]): AggregateStats {
  const total = records.length;
  const archetypes: Record<ResultTypeId, { count: number; percentage: number }> = {
    'type-1': { count: 0, percentage: 0 },
    'type-2': { count: 0, percentage: 0 },
    'type-3': { count: 0, percentage: 0 },
    'type-4': { count: 0, percentage: 0 },
  };

  const q1Dist: Record<string, { count: number; percentage: number }> = {
    c1_1: { count: 0, percentage: 0 },
    c1_2: { count: 0, percentage: 0 },
    c1_3: { count: 0, percentage: 0 },
    c1_4: { count: 0, percentage: 0 },
  };

  const createChoiceDist = (choices: string[]) => {
    const map: Record<string, { count: number; percentage: number }> = {};
    for (const c of choices) map[c] = { count: 0, percentage: 0 };
    return map;
  };

  const q2Dist = createChoiceDist(['c2_1', 'c2_2', 'c2_3', 'c2_4']);
  const q3Dist = createChoiceDist(['c3_1', 'c3_2', 'c3_3', 'c3_4']);
  const q4Dist = createChoiceDist(['o1_1', 'o1_2', 'o1_3', 'o1_4']);
  const q5Dist = createChoiceDist(['o2_1', 'o2_2', 'o2_3', 'o2_4']);
  const q6Dist = createChoiceDist(['o6_1', 'o6_2', 'o6_3', 'o6_4']);
  const q7Dist = createChoiceDist(['ai_tool', 'ai_assistant', 'ai_conversation', 'ai_companion', 'ai_no_relationship']);

  let sumC = 0;
  let sumO = 0;
  let sumAI = 0;

  for (const r of records) {
    if (archetypes[r.archetype_id]) {
      archetypes[r.archetype_id].count += 1;
    }
    sumC += r.connection_score;
    sumO += r.openness_score;
    sumAI += r.ai_score;

    // Q1
    if (Array.isArray(r.q1_answers)) {
      for (const opt of r.q1_answers) {
        if (q1Dist[opt]) q1Dist[opt].count += 1;
      }
    }

    if (q2Dist[r.q2_answer]) q2Dist[r.q2_answer].count += 1;
    if (q3Dist[r.q3_answer]) q3Dist[r.q3_answer].count += 1;
    if (q4Dist[r.q4_answer]) q4Dist[r.q4_answer].count += 1;
    if (q5Dist[r.q5_answer]) q5Dist[r.q5_answer].count += 1;
    if (q6Dist[r.q6_answer]) q6Dist[r.q6_answer].count += 1;
    if (q7Dist[r.q7_answer]) q7Dist[r.q7_answer].count += 1;
  }

  // Calculate percentages
  const safeTotal = total > 0 ? total : 1;
  (Object.keys(archetypes) as ResultTypeId[]).forEach((k) => {
    archetypes[k].percentage = total > 0 ? Math.round((archetypes[k].count / safeTotal) * 1000) / 10 : 0;
  });

  const calcDist = (dist: Record<string, { count: number; percentage: number }>) => {
    Object.keys(dist).forEach((k) => {
      dist[k].percentage = total > 0 ? Math.round((dist[k].count / safeTotal) * 1000) / 10 : 0;
    });
  };

  calcDist(q1Dist);
  calcDist(q2Dist);
  calcDist(q3Dist);
  calcDist(q4Dist);
  calcDist(q5Dist);
  calcDist(q6Dist);
  calcDist(q7Dist);

  return {
    totalCount: total,
    archetypeDistribution: archetypes,
    averageScores: {
      connection: total > 0 ? Math.round((sumC / total) * 10) / 10 : 0,
      openness: total > 0 ? Math.round((sumO / total) * 10) / 10 : 0,
      ai: total > 0 ? Math.round((sumAI / total) * 10) / 10 : 0,
    },
    q1Distribution: q1Dist,
    q2Distribution: q2Dist,
    q3Distribution: q3Dist,
    q4Distribution: q4Dist,
    q5Distribution: q5Dist,
    q6Distribution: q6Dist,
    q7Distribution: q7Dist,
  };
}
