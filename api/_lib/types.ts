export type ResultTypeId = 'type-1' | 'type-2' | 'type-3' | 'type-4';

export type SurveyResponseRecord = {
  id: string;
  token_hash: string;
  q1_answers: string[];
  q2_answer: string;
  q3_answer: string;
  q4_answer: string;
  q5_answer: string;
  q6_answer: string;
  q7_answer: string;
  connection_score: number;
  openness_score: number;
  ai_score: number;
  archetype_id: ResultTypeId;
  survey_version?: string;
  created_at: string;
};

export type AggregateStats = {
  totalCount: number;
  archetypeDistribution: Record<ResultTypeId, { count: number; percentage: number }>;
  averageScores: {
    connection: number;
    openness: number;
    ai: number;
  };
  q1Distribution: Record<string, { count: number; percentage: number }>;
  q2Distribution: Record<string, { count: number; percentage: number }>;
  q3Distribution: Record<string, { count: number; percentage: number }>;
  q4Distribution: Record<string, { count: number; percentage: number }>;
  q5Distribution: Record<string, { count: number; percentage: number }>;
  q6Distribution: Record<string, { count: number; percentage: number }>;
  q7Distribution: Record<string, { count: number; percentage: number }>;
};
