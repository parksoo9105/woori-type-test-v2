-- ==============================================================================
-- 〈우리 유형 테스트 v2〉 신규 Supabase 데이터베이스 생성 SQL 스크립트
--
-- 대상: woori-type-test-v2 전용 Supabase 신규 프로젝트
-- 목적: 기존 운영 DB와 100% 분리된 독립 응답 저장 테이블 생성 및 보안 설정
-- ==============================================================================

-- 1. responses 테이블 생성
CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    q1_answers JSONB NOT NULL,
    q2_answer VARCHAR(16) NOT NULL,
    q3_answer VARCHAR(16) NOT NULL,
    q4_answer VARCHAR(16) NOT NULL,
    q5_answer VARCHAR(16) NOT NULL,
    q6_answer VARCHAR(16) NOT NULL,
    q7_answer VARCHAR(32) NOT NULL,
    connection_score INTEGER NOT NULL,
    openness_score INTEGER NOT NULL,
    ai_score INTEGER NOT NULL,
    archetype_id VARCHAR(16) NOT NULL,
    survey_version VARCHAR(16) NOT NULL DEFAULT 'v2.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. 고속 통계 및 조회용 인덱스 설정
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_archetype_id ON responses (archetype_id);
CREATE INDEX IF NOT EXISTS idx_responses_token_hash ON responses (token_hash);

-- 3. Row Level Security (RLS) 활성화
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- 4. 익명 응답 보안: 외부 직접 접근 차단, 백엔드 서버(service_role)만 접근 허용
REVOKE ALL ON responses FROM anon, authenticated;
GRANT ALL ON responses TO service_role;

-- 참고: service_role 키를 사용하는 Vercel 서버리스 함수(/api/*)는 RLS를 안전하게 우회하여
-- 응답 저장, 관리자 통계 산출, 2단계 데이터 리셋을 정상 수행합니다.
