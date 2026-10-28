import { Answers, ScoreBreakdown, ResultTypeId } from '../types';

/**
 * Provisional thresholds for Woori Type Test
 * - 0 ~ 4: Low
 * - 5 ~ 9: High
 * Can be adjusted in the future based on live response distributions.
 */
export const THRESHOLD_C = 5;
export const THRESHOLD_O = 5;

/**
 * Calculates C1 (Connection 1, multi-select)
 * - Choices 1~3: 1 point each (unique count, max 3)
 * - Choice 4 (alone): non-scoring (0 points)
 */
export function calculateC1Score(val: string | number | (string | number)[] | undefined): number {
  if (!val) return 0;
  const rawArr = Array.isArray(val) ? val : [val];
  const uniqueArr = Array.from(new Set(rawArr));
  let scoringCount = 0;

  for (const item of uniqueArr) {
    if (typeof item === 'string') {
      if (['c1_1', 'c1_2', 'c1_3'].includes(item)) {
        scoringCount += 1;
      }
    } else if (typeof item === 'number') {
      // Numerical indices: 1, 2, 3 count toward score
      if (item === 1 || item === 2 || item === 3) {
        scoringCount += 1;
      }
    }
  }

  return Math.min(scoringCount, 3);
}

/**
 * Calculates C2 (Connection 2, single choice)
 * ① 0점, ② 1점, ③ 2점, ④ 3점
 */
export function calculateC2Score(val: string | number | undefined): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'string') {
    switch (val) {
      case 'c2_1': return 0;
      case 'c2_2': return 1;
      case 'c2_3': return 2;
      case 'c2_4': return 3;
      default: {
        const num = Number(val);
        return isNaN(num) ? 0 : Math.min(Math.max(num, 0), 3);
      }
    }
  }
  return Math.min(Math.max(Number(val) || 0, 0), 3);
}

/**
 * Calculates C3 (Connection 3, single choice)
 * ① 0점, ② 1점, ③ 2점, ④ 3점
 */
export function calculateC3Score(val: string | number | undefined): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'string') {
    switch (val) {
      case 'c3_1': return 0;
      case 'c3_2': return 1;
      case 'c3_3': return 2;
      case 'c3_4': return 3;
      default: {
        const num = Number(val);
        return isNaN(num) ? 0 : Math.min(Math.max(num, 0), 3);
      }
    }
  }
  return Math.min(Math.max(Number(val) || 0, 0), 3);
}

/**
 * Calculates O1 (Openness 1, single choice)
 * ① 0점, ② 1점, ③ 2점, ④ 3점
 */
export function calculateO1Score(val: string | number | undefined): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'string') {
    switch (val) {
      case 'o1_1': return 0;
      case 'o1_2': return 1;
      case 'o1_3': return 2;
      case 'o1_4': return 3;
      default: {
        const num = Number(val);
        return isNaN(num) ? 0 : Math.min(Math.max(num, 0), 3);
      }
    }
  }
  return Math.min(Math.max(Number(val) || 0, 0), 3);
}

/**
 * Calculates O2 (Openness 2, single choice)
 * REVERSED SCORING:
 * ① 3점, ② 2점, ③ 1점, ④ 0점
 */
export function calculateO2Score(val: string | number | undefined): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'string') {
    switch (val) {
      case 'o2_1': return 3;
      case 'o2_2': return 2;
      case 'o2_3': return 1;
      case 'o2_4': return 0;
      default: {
        const num = Number(val);
        return isNaN(num) ? 0 : Math.min(Math.max(num, 0), 3);
      }
    }
  }
  return Math.min(Math.max(Number(val) || 0, 0), 3);
}

/**
 * Calculates O3 (Openness 3, single choice)
 * ① 0점, ② 1점, ③ 2점, ④ 3점
 */
export function calculateO3Score(val: string | number | undefined): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'string') {
    switch (val) {
      case 'o6_1': return 0;
      case 'o6_2': return 1;
      case 'o6_3': return 2;
      case 'o6_4': return 3;
      default: {
        const num = Number(val);
        return isNaN(num) ? 0 : Math.min(Math.max(num, 0), 3);
      }
    }
  }
  return Math.min(Math.max(Number(val) || 0, 0), 3);
}

/**
 * Calculates AI score & option ID (Question 7, single choice)
 * ① 1점 (ai_tool)
 * ② 2점 (ai_assistant)
 * ③ 3점 (ai_conversation)
 * ④ 4점 (ai_companion)
 * ⑤ 1점 (ai_no_relationship)
 */
export function calculateAIScore(val: string | number | undefined): { score: number; optionId: string } {
  if (val === undefined || val === null) {
    return { score: 1, optionId: 'ai_tool' };
  }
  if (typeof val === 'string') {
    switch (val) {
      case 'ai_tool': return { score: 1, optionId: 'ai_tool' };
      case 'ai_assistant': return { score: 2, optionId: 'ai_assistant' };
      case 'ai_conversation': return { score: 3, optionId: 'ai_conversation' };
      case 'ai_companion': return { score: 4, optionId: 'ai_companion' };
      case 'ai_no_relationship': return { score: 1, optionId: 'ai_no_relationship' };
      default: {
        return { score: 1, optionId: val };
      }
    }
  }
  // Numerical fallback (1-based index or 0-based)
  const num = Number(val);
  switch (num) {
    case 1: return { score: 1, optionId: 'ai_tool' };
    case 2: return { score: 2, optionId: 'ai_assistant' };
    case 3: return { score: 3, optionId: 'ai_conversation' };
    case 4: return { score: 4, optionId: 'ai_companion' };
    case 5: return { score: 1, optionId: 'ai_no_relationship' };
    default: {
      if (num === 0) return { score: 1, optionId: 'ai_tool' };
      return { score: 1, optionId: 'ai_tool' };
    }
  }
}

/**
 * Metric percentage conversion utilities (rounded to nearest integer)
 * - Connection: (C / 9) * 100
 * - Openness: (O / 9) * 100
 * - AI Perception: (AI / 4) * 100 (4-point scale, range 25% ~ 100%)
 */
export function toConnectionPercentage(cScore: number): number {
  const clamped = Math.min(Math.max(Number(cScore) || 0, 0), 9);
  return Math.round((clamped / 9) * 100);
}

export function toOpennessPercentage(oScore: number): number {
  const clamped = Math.min(Math.max(Number(oScore) || 0, 0), 9);
  return Math.round((clamped / 9) * 100);
}

export function toAIPercentage(aiScore: number): number {
  const clamped = Math.min(Math.max(Number(aiScore) || 1, 1), 4);
  return Math.round((clamped / 4) * 100);
}

/**
 * Calculates Connection (C: 0~9), Openness (O: 0~9), and AI (1~4)
 * C = C1 + C2 + C3
 * O = O1 + O2 + O3
 * AI = Q7 Score (1 ~ 4)
 */
export function calculateScores(answers: Answers): ScoreBreakdown {
  const c1Score = calculateC1Score(answers[1]);
  const c2Score = calculateC2Score(answers[2] as string | number);
  const c3Score = calculateC3Score(answers[3] as string | number);

  const o1Score = calculateO1Score(answers[4] as string | number);
  const o2Score = calculateO2Score(answers[5] as string | number);
  const o3Score = calculateO3Score(answers[6] as string | number);

  const aiResult = calculateAIScore(answers[7] as string | number);

  const connectionScore = c1Score + c2Score + c3Score; // 0 ~ 9
  const opennessScore = o1Score + o2Score + o3Score;     // 0 ~ 9
  const aiScore = Math.min(Math.max(aiResult.score, 1), 4); // 1 ~ 4

  const q1Raw = answers[1];
  const q1Answers = Array.isArray(q1Raw)
    ? q1Raw.map(String)
    : q1Raw ? [String(q1Raw)] : [];

  return {
    connectionScore,
    opennessScore,
    aiScore,
    aiOptionId: aiResult.optionId,
    c1Score,
    c2Score,
    c3Score,
    o1Score,
    o2Score,
    o3Score,
    metricA: connectionScore,
    metricB: aiScore,
    metricC: opennessScore,
    q1Answers,
  };
}

/**
 * Determines the Woori Type ID from C and O scores:
 * Threshold: 5 points
 * - C >= 5 && O < 5  -> 'type-1' (마주보는 정원사)
 * - C < 5  && O >= 5 -> 'type-2' (연결망의 항해자)
 * - C >= 5 && O >= 5 -> 'type-3' (다리를 놓는 탐험가)
 * - C < 5  && O < 5  -> 'type-4' (고요한 등대)
 */
export function classifyResultType(breakdown: { connectionScore: number; opennessScore: number } | ScoreBreakdown): ResultTypeId {
  const { connectionScore, opennessScore } = breakdown;

  if (connectionScore >= THRESHOLD_C) {
    if (opennessScore >= THRESHOLD_O) {
      return 'type-3'; // 다리를 놓는 탐험가
    } else {
      return 'type-1'; // 마주보는 정원사
    }
  } else {
    if (opennessScore >= THRESHOLD_O) {
      return 'type-2'; // 연결망의 항해자
    } else {
      return 'type-4'; // 고요한 등대
    }
  }
}
