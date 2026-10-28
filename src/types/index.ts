export type QuestionOption = {
  id: string;
  label: string;
  subLabel?: string;
  score: number;
};

export type Question = {
  id: number;
  title: string;
  description?: string;
  isMultiple?: boolean;
  options: QuestionOption[];
};

// questionId -> selectedOptionId or optionScore (single or multiple)
export type Answers = Record<number, string | number | (string | number)[]>;

export type ScoreBreakdown = {
  connectionScore: number; // 현재의 연결감 (C): 0 ~ 9
  opennessScore: number;   // 마주봄에 대한 개방도 (O): 0 ~ 9
  aiScore: number;         // AI 관계 인식: 0 ~ 3
  aiOptionId?: string;     // 'ai_tool' | 'ai_assistant' | 'ai_conversation' | 'ai_companion' | 'ai_no_relationship'
  c1Score?: number;        // C1 (0 ~ 3)
  c2Score?: number;        // C2 (0 ~ 3)
  c3Score?: number;        // C3 (0 ~ 3)
  o1Score?: number;        // O1 (0 ~ 3)
  o2Score?: number;        // O2 (0 ~ 3, 역채점)
  o3Score?: number;        // O3 (0 ~ 3)
  metricA: number;         // Backward compatibility
  metricB: number;
  metricC: number;
  q1Answers?: string[];
  q2Answers?: number[];
  q3Answers?: number[];
};

export type ResultTypeId = 'type-1' | 'type-2' | 'type-3' | 'type-4';

export type ResultTypeInfo = {
  id: ResultTypeId;
  typeTag: string;
  title: string;
  subtitle: string;
  codeName: string;
  name: string;
  oneLineSummary: string;
  detailedDescription: string;
  reason: string;
  reflectionQuestion: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  cardBorder: string;
  vibeTag: string;
  keywords: string[];
  iconEmoji: string;
  textColor?: string;
};

export type SurveySubmissionPayload = {
  token: string;
  answers: {
    q1: string[];
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string;
  };
};

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
