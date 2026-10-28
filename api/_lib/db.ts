import type { SurveyResponseRecord, AggregateStats, ResultTypeId } from './types.js';

// In-memory global store as graceful fallback for local development or when DB credentials are pending
declare global {
  // eslint-disable-next-line no-var
  var __WOORI_MEMORY_STORE__: SurveyResponseRecord[] | undefined;
}

if (!globalThis.__WOORI_MEMORY_STORE__) {
  globalThis.__WOORI_MEMORY_STORE__ = [];
}

const memoryStore = globalThis.__WOORI_MEMORY_STORE__;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

/**
 * Save anonymous survey response
 */
export async function insertResponse(record: SurveyResponseRecord): Promise<boolean> {
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/responses`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(record),
      });
      if (res.ok) {
        return true;
      }
      console.error('Supabase insert failed:', await res.text());
    } catch (err) {
      console.error('Supabase fetch error:', err);
    }
  }

  // Fallback to in-memory store
  memoryStore.unshift(record);
  return true;
}

/**
 * Reset all survey response records (Admin only action)
 */
export async function resetAllResponses(): Promise<{ success: boolean; count: number }> {
  let count = memoryStore.length;
  memoryStore.length = 0;

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      // In PostgREST, DELETE with a filter matching all rows (id is not null)
      const res = await fetch(`${SUPABASE_URL}/rest/v1/responses?id=not.is.null`, {
        method: 'DELETE',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
      });

      if (res.ok) {
        const deletedRecords = await res.json();
        count = Array.isArray(deletedRecords) ? deletedRecords.length : count;
        return { success: true, count };
      }
      console.error('Supabase reset failed:', await res.text());
      return { success: false, count: 0 };
    } catch (err) {
      console.error('Supabase reset error:', err);
      return { success: false, count: 0 };
    }
  }

  return { success: true, count };
}

/**
 * Find response by SHA-256 token hash (never searches with plain token)
 */
export async function getResponseByTokenHash(tokenHash: string): Promise<SurveyResponseRecord | null> {
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const url = `${SUPABASE_URL}/rest/v1/responses?token_hash=eq.${encodeURIComponent(tokenHash)}&select=*&limit=1`;
      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        return data && data.length > 0 ? data[0] : null;
      }
    } catch (err) {
      console.error('Supabase query error:', err);
    }
  }

  const match = memoryStore.find((r) => r.token_hash === tokenHash);
  return match || null;
}

/**
 * Fetch all responses for admin / aggregate stats
 */
export async function getAllResponses(limit = 5000, offset = 0): Promise<{ records: SurveyResponseRecord[]; total: number }> {
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const url = `${SUPABASE_URL}/rest/v1/responses?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`;
      const countUrl = `${SUPABASE_URL}/rest/v1/responses?select=id`;
      
      const [dataRes, countRes] = await Promise.all([
        fetch(url, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }),
        fetch(countUrl, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'count=exact',
          },
        }),
      ]);

      if (dataRes.ok) {
        const records = await dataRes.json();
        const contentRange = countRes.headers.get('content-range');
        const total = contentRange ? parseInt(contentRange.split('/')[1] || '0', 10) : records.length;
        return { records, total };
      }
    } catch (err) {
      console.error('Supabase getAllResponses error:', err);
    }
  }

  return {
    records: memoryStore.slice(offset, offset + limit),
    total: memoryStore.length,
  };
}

/**
 * Compute aggregate statistics
 */
export function computeAggregates(records: SurveyResponseRecord[]): AggregateStats {
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
