import type { ResultTypeId } from './types.js';

export const THRESHOLD_C = 5;
export const THRESHOLD_O = 5;

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
      if (item === 1 || item === 2 || item === 3) {
        scoringCount += 1;
      }
    }
  }

  return Math.min(scoringCount, 3);
}

export function calculateC2Score(val: string | number | undefined): number {
  if (typeof val === 'string') {
    switch (val) {
      case 'c2_1': return 0;
      case 'c2_2': return 1;
      case 'c2_3': return 2;
      case 'c2_4': return 3;
      default: return 0;
    }
  }
  const num = typeof val === 'number' ? val : parseInt(String(val || 0), 10);
  return [0, 1, 2, 3].includes(num) ? num : 0;
}

export function calculateC3Score(val: string | number | undefined): number {
  if (typeof val === 'string') {
    switch (val) {
      case 'c3_1': return 0;
      case 'c3_2': return 1;
      case 'c3_3': return 2;
      case 'c3_4': return 3;
      default: return 0;
    }
  }
  const num = typeof val === 'number' ? val : parseInt(String(val || 0), 10);
  return [0, 1, 2, 3].includes(num) ? num : 0;
}

export function calculateO1Score(val: string | number | undefined): number {
  if (typeof val === 'string') {
    switch (val) {
      case 'o1_1': return 0;
      case 'o1_2': return 1;
      case 'o1_3': return 2;
      case 'o1_4': return 3;
      default: return 0;
    }
  }
  const num = typeof val === 'number' ? val : parseInt(String(val || 0), 10);
  return [0, 1, 2, 3].includes(num) ? num : 0;
}

export function calculateO2Score(val: string | number | undefined): number {
  if (typeof val === 'string') {
    switch (val) {
      case 'o2_1': return 3;
      case 'o2_2': return 2;
      case 'o2_3': return 1;
      case 'o2_4': return 0;
      default: return 0;
    }
  }
  const num = typeof val === 'number' ? val : parseInt(String(val || 0), 10);
  switch (num) {
    case 1: return 3;
    case 2: return 2;
    case 3: return 1;
    case 4: return 0;
    default: return 0;
  }
}

export function calculateO3Score(val: string | number | undefined): number {
  if (typeof val === 'string') {
    switch (val) {
      case 'o6_1': return 0;
      case 'o6_2': return 1;
      case 'o6_3': return 2;
      case 'o6_4': return 3;
      default: return 0;
    }
  }
  const num = typeof val === 'number' ? val : parseInt(String(val || 0), 10);
  return [0, 1, 2, 3].includes(num) ? num : 0;
}

export function calculateAIScore(val: string | number | undefined): number {
  if (typeof val === 'string') {
    switch (val) {
      case 'ai_tool': return 0;
      case 'ai_assistant': return 1;
      case 'ai_conversation': return 2;
      case 'ai_companion': return 3;
      case 'ai_no_relationship': return 0;
      default: return 0;
    }
  }
  const num = typeof val === 'number' ? val : parseInt(String(val || 1), 10);
  switch (num) {
    case 1: return 0;
    case 2: return 1;
    case 3: return 2;
    case 4: return 3;
    case 5: return 0;
    default: {
      return 0;
    }
  }
}

export function toConnectionPercentage(cScore: number): number {
  const clamped = Math.min(Math.max(Number(cScore) || 0, 0), 9);
  return Math.round((clamped / 9) * 100);
}

export function toOpennessPercentage(oScore: number): number {
  const clamped = Math.min(Math.max(Number(oScore) || 0, 0), 9);
  return Math.round((clamped / 9) * 100);
}

export function toAIPercentage(aiScore: number): number {
  const clamped = Math.min(Math.max(Number(aiScore) || 0, 0), 3);
  return Math.round((clamped / 3) * 100);
}

export function calculateScores(answers: Record<number, any>): {
  connectionScore: number;
  opennessScore: number;
  aiScore: number;
} {
  const c1 = calculateC1Score(answers[1]);
  const c2 = calculateC2Score(answers[2]);
  const c3 = calculateC3Score(answers[3]);

  const o1 = calculateO1Score(answers[4]);
  const o2 = calculateO2Score(answers[5]);
  const o3 = calculateO3Score(answers[6]);

  const ai = calculateAIScore(answers[7]);

  return {
    connectionScore: Math.min(Math.max(c1 + c2 + c3, 0), 9),
    opennessScore: Math.min(Math.max(o1 + o2 + o3, 0), 9),
    aiScore: Math.min(Math.max(ai, 0), 3),
  };
}

export function classifyResultType(breakdown: { connectionScore: number; opennessScore: number }): ResultTypeId {
  const isHighC = breakdown.connectionScore >= THRESHOLD_C;
  const isHighO = breakdown.opennessScore >= THRESHOLD_O;

  if (isHighC && !isHighO) {
    return 'type-1';
  } else if (!isHighC && isHighO) {
    return 'type-2';
  } else if (isHighC && isHighO) {
    return 'type-3';
  } else {
    return 'type-4';
  }
}
