import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('〈우리 유형 테스트〉 7개 문항 및 4대 유형 최종 통합 흐름 검증', () => {
  beforeEach(() => {
    sessionStorage.clear();
    delete (window as any).location;
    window.location = new URL('https://woori-type-test-v2.vercel.app/') as any;
  });

  it('시작 화면에 4개 유형 카드와 메인 텍스트, 테스트 시작 버튼이 올바르게 렌더링된다', () => {
    render(<App />);

    // 메인 타이틀 및 소개 문구 (부가 안내 문구는 삭제됨)
    expect(screen.getAllByText(/우리.*유형.*테스트/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/여섯 개의 질문에 답하면 나의/i)).toBeInTheDocument();
    expect(screen.queryByText(/단, 실제 테스트는 관계 유형 산정 6문항/i)).not.toBeInTheDocument();

    // 4개 유형 카드 텍스트 확인
    expect(screen.getAllByText('마주보는 정원사').length).toBeGreaterThan(0);
    expect(screen.getAllByText('연결망의 항해자').length).toBeGreaterThan(0);
    expect(screen.getAllByText('다리를 놓는 탐험가').length).toBeGreaterThan(0);
    expect(screen.getAllByText('고요한 등대').length).toBeGreaterThan(0);

    // 시작 버튼
    const startBtn = screen.getAllByRole('button', { name: /테스트 시작하기/i })[0];
    expect(startBtn).toBeInTheDocument();
  });

  it('시작 버튼 클릭 시 1번 질문으로 이동하고 총 7문항(1/7)으로 표시된다', () => {
    render(<App />);
    const startBtn = screen.getAllByRole('button', { name: /테스트 시작하기/i })[0];
    fireEvent.click(startBtn);

    expect(screen.getByText('QUESTION 1')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(
      screen.getByText('다음 중 당신이 만족감과 연결감을 느끼는 순간은 언제인가요?')
    ).toBeInTheDocument();
  });

  it('Q1은 체크박스 방식이며 최소 1개 이상 선택해야 다음 단계로 이동할 수 있다', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /테스트 시작하기/i })[0]);

    const nextBtn = screen.getByRole('button', { name: /선택 완료하고 다음으로/i });
    expect(nextBtn).toBeDisabled();

    // ④ 혼자만의 시간을 보내며 나 자신에게 집중할 때 선택
    const opt4 = screen.getByText('혼자만의 시간을 보내며 나 자신에게 집중할 때');
    fireEvent.click(opt4);
    expect(nextBtn).not.toBeDisabled();

    // ④ 해제 시 다시 비활성화
    fireEvent.click(opt4);
    expect(nextBtn).toBeDisabled();
  });

  it('유형 1 (마주보는 정원사: C >= 5, O < 5) 전체 플로우 및 AI 설명 검증', async () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /테스트 시작하기/i })[0]);

    // Q1 (C1): ① + ② 선택 (2점)
    fireEvent.click(screen.getByText('하루를 마치고 가족이나 가까운 친구와 일상을 나눌 때'));
    fireEvent.click(screen.getByText('새로운 사람들과 만나 공통의 관심사나 좋아하는 활동을 함께할 때'));
    fireEvent.click(screen.getByRole('button', { name: /선택 완료하고 다음으로/i }));

    // Q2 (C2): ④ 서로의 일상을 챙기고... (3점) -> 누적 C = 5점
    fireEvent.click(screen.getByText('서로의 일상을 챙기고, 함께할 기회를 꾸준히 만들어가는 편이다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q3 (C3): ③ 그렇다 (2점) -> 누적 C = 7점
    fireEvent.click(screen.getByText('그렇다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q4 (O1): ① 전혀 아니다 (0점)
    fireEvent.click(screen.getByText('전혀 아니다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q5 (O2): ④ 매우 그렇다 (역채점: 0점)
    fireEvent.click(screen.getByText('매우 그렇다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q6 (O3): ① 전혀 그렇지 않다 (0점) -> 누적 O = 0점
    fireEvent.click(screen.getByText('전혀 그렇지 않다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q7 (AI): ① 도구 (0점, ai_tool)
    fireEvent.click(screen.getByText('필요할 때 정보를 얻거나 작업을 처리하는 도구'));
    fireEvent.click(screen.getByRole('button', { name: /결과 확인하기/i }));

    // 결과 화면 검증: 유형 1 (마주보는 정원사)
    expect(await screen.findByRole('heading', { level: 1, name: '마주보는 정원사' })).toBeInTheDocument();
    expect(screen.getAllByText('TYPE 01 · RED').length).toBeGreaterThan(0);
    expect(screen.getByText(/연결감:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/78%/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0%/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AI 관계 인식/i).length).toBeGreaterThan(0);

    // AI 답변별 맞춤 설명문 검증 (도구 설명)
    expect(
      screen.getByText(/당신에게 AI는 필요한 순간에 활용하는 실용적인 도구입니다/i)
    ).toBeInTheDocument();

    // 다시 테스트하기 버튼 동작 확인
    const restartBtn = screen.getByRole('button', { name: /다시 테스트하기/i });
    fireEvent.click(restartBtn);

    expect(screen.getAllByText(/우리.*유형.*테스트/i).length).toBeGreaterThan(0);
  });

  it('유형 2 (연결망의 항해자: C < 5, O >= 5) 결과 화면 검증', async () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /테스트 시작하기/i })[0]);

    // Q1 (C1): ④만 선택 (0점)
    fireEvent.click(screen.getByText('혼자만의 시간을 보내며 나 자신에게 집중할 때'));
    fireEvent.click(screen.getByRole('button', { name: /선택 완료하고 다음으로/i }));

    // Q2 (C2): ① 필요한 일이 있을 때만 (0점)
    fireEvent.click(screen.getByText('필요한 일이 있을 때만 연락하거나 교류하는 편이다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q3 (C3): ② 대체로 아니다 (1점) -> C = 1점
    fireEvent.click(screen.getByText('대체로 아니다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q4 (O1): ④ 매우 그렇다 (3점)
    fireEvent.click(screen.getByText('매우 그렇다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q5 (O2): ① 전혀 그렇지 않다 (역채점: 3점)
    fireEvent.click(screen.getByText('전혀 그렇지 않다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q6 (O3): ③ 그렇다 (2점) -> O = 8점
    fireEvent.click(screen.getByText('그렇다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q7 (AI): ② 조력자 (1점, ai_assistant)
    fireEvent.click(screen.getByText('생각을 정리하거나 문제를 해결할 때 도움을 주는 조력자'));
    fireEvent.click(screen.getByRole('button', { name: /결과 확인하기/i }));

    // 결과 화면 검증: 유형 2 (연결망의 항해자)
    expect(await screen.findByRole('heading', { level: 1, name: '연결망의 항해자' })).toBeInTheDocument();
    expect(screen.getAllByText('TYPE 02 · BLUE').length).toBeGreaterThan(0);
    expect(
      screen.getByText(/당신에게 AI는 생각을 정리하고 문제를 해결하는 과정에서 도움을 주는 조력자입니다/i)
    ).toBeInTheDocument();
  });

  it('유형 3 (다리를 놓는 탐험가: C >= 5, O >= 5) 결과 화면 검증', async () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /테스트 시작하기/i })[0]);

    // Q1 (C1): ①+②+③ (3점)
    fireEvent.click(screen.getByText('하루를 마치고 가족이나 가까운 친구와 일상을 나눌 때'));
    fireEvent.click(screen.getByText('새로운 사람들과 만나 공통의 관심사나 좋아하는 활동을 함께할 때'));
    fireEvent.click(screen.getByText('SNS나 온라인 커뮤니티를 통해 일상에서 만나기 어려운 다양한 사람들과 생각과 경험을 나눌 때'));
    fireEvent.click(screen.getByRole('button', { name: /선택 완료하고 다음으로/i }));

    // Q2 (C2): ④ 일상 챙김 (3점) -> C = 6점
    fireEvent.click(screen.getByText('서로의 일상을 챙기고, 함께할 기회를 꾸준히 만들어가는 편이다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q3 (C3): ④ 매우 그렇다 (3점) -> C = 9점
    fireEvent.click(screen.getByText('매우 그렇다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q4 (O1): ④ 매우 그렇다 (3점)
    fireEvent.click(screen.getByText('매우 그렇다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q5 (O2): ① 전혀 그렇지 않다 (역채점: 3점)
    fireEvent.click(screen.getByText('전혀 그렇지 않다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q6 (O3): ④ 매우 그렇다 (3점) -> O = 9점
    fireEvent.click(screen.getByText('매우 그렇다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q7 (AI): ④ 동반자 (3점, ai_companion)
    fireEvent.click(screen.getByText('나를 이해하고 함께 생각을 발전시켜 나가는 동반자'));
    fireEvent.click(screen.getByRole('button', { name: /결과 확인하기/i }));

    // 결과 화면 검증: 유형 3 (다리를 놓는 탐험가)
    expect(await screen.findByRole('heading', { level: 1, name: '다리를 놓는 탐험가' })).toBeInTheDocument();
    expect(screen.getAllByText('TYPE 03 · GREEN').length).toBeGreaterThan(0);
    expect(
      screen.getByText(/당신에게 AI는 생각을 함께 발전시켜 나가는 동반자입니다/i)
    ).toBeInTheDocument();
  });

  it('유형 4 (고요한 등대: C < 5, O < 5) 결과 화면 검증', async () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /테스트 시작하기/i })[0]);

    // Q1 (C1): ④만 선택 (0점)
    fireEvent.click(screen.getByText('혼자만의 시간을 보내며 나 자신에게 집중할 때'));
    fireEvent.click(screen.getByRole('button', { name: /선택 완료하고 다음으로/i }));

    // Q2 (C2): ① (0점)
    fireEvent.click(screen.getByText('필요한 일이 있을 때만 연락하거나 교류하는 편이다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q3 (C3): ① 전혀 아니다 (0점) -> C = 0점
    fireEvent.click(screen.getByText('전혀 아니다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q4 (O1): ① 전혀 아니다 (0점)
    fireEvent.click(screen.getByText('전혀 아니다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q5 (O2): ④ 매우 그렇다 (역채점: 0점)
    fireEvent.click(screen.getByText('매우 그렇다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q6 (O3): ① 전혀 그렇지 않다 (0점) -> O = 0점
    fireEvent.click(screen.getByText('전혀 그렇지 않다'));
    fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

    // Q7 (AI): ⑤ 특별한 관계 아님 (0점, ai_no_relationship)
    fireEvent.click(screen.getByText('AI를 특별한 관계의 대상으로 생각하지 않는다'));
    fireEvent.click(screen.getByRole('button', { name: /결과 확인하기/i }));

    // 결과 화면 검증: 유형 4 (고요한 등대)
    expect(await screen.findByRole('heading', { level: 1, name: '고요한 등대' })).toBeInTheDocument();
    expect(screen.getAllByText('TYPE 04 · PURPLE').length).toBeGreaterThan(0);
    expect(
      screen.getByText(/당신은 AI를 특별한 관계의 대상으로 바라보지 않습니다/i)
    ).toBeInTheDocument();
  });

  it('이전 버튼을 누르면 이전 질문으로 돌아가고 응답을 수정할 수 있다', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /테스트 시작하기/i })[0]);

    // Q1에서 선택 후 다음 클릭
    fireEvent.click(screen.getByText('하루를 마치고 가족이나 가까운 친구와 일상을 나눌 때'));
    fireEvent.click(screen.getByRole('button', { name: /선택 완료하고 다음으로/i }));

    // Q2 도달 확인
    expect(
      screen.getByText('평소 주변 사람들과의 관계를 어떻게 이어가고 있나요?')
    ).toBeInTheDocument();

    // '이전' 버튼 클릭
    const prevBtn = screen.getByRole('button', { name: /이전 질문으로 돌아가기/i });
    fireEvent.click(prevBtn);

    // Q1으로 복귀 확인
    expect(
      screen.getByText('다음 중 당신이 만족감과 연결감을 느끼는 순간은 언제인가요?')
    ).toBeInTheDocument();
  });

  it('답변을 선택해도 자동으로 다음 질문으로 이동하지 않으며, 다음 버튼을 눌러야만 이동한다', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /테스트 시작하기/i })[0]);

    // Q1 선택 완료
    fireEvent.click(screen.getByText('하루를 마치고 가족이나 가까운 친구와 일상을 나눌 때'));
    fireEvent.click(screen.getByRole('button', { name: /선택 완료하고 다음으로/i }));

    // Q2 도달 확인: '다음 질문' 버튼이 처음에는 비활성화 상태
    const nextBtn = screen.getByRole('button', { name: /다음 질문/i });
    expect(nextBtn).toBeDisabled();

    // 단일 선택지를 클릭해도 자동으로 Q3로 넘어가지 않고 여전히 Q2에 머무름
    fireEvent.click(screen.getByText('필요한 일이 있을 때만 연락하거나 교류하는 편이다'));
    expect(
      screen.getByText('평소 주변 사람들과의 관계를 어떻게 이어가고 있나요?')
    ).toBeInTheDocument();
    expect(nextBtn).not.toBeDisabled();

    // 사용자가 명시적으로 '다음 질문' 버튼을 눌러야 Q3로 이동
    fireEvent.click(nextBtn);
    expect(
      screen.getByText('내가 속한 ‘우리’에서 충분한 연결감과 유대감을 느끼고 있나요?')
    ).toBeInTheDocument();
  });

  describe('유형별 독립 결과 페이지 라우팅 (/result/type-01 ~ type-04 & /result/t1 ~ t4)', () => {
    it('/result/type-01 접근 시 TYPE 01 마주보는 정원사 공유 화면이 독립적으로 렌더링된다', () => {
      delete (window as any).location;
      window.location = new URL('https://woori-type-test-v2.vercel.app/result/type-01') as any;

      render(<App />);

      expect(screen.getAllByText('마주보는 정원사').length).toBeGreaterThan(0);
      expect(screen.getAllByText('익숙한 이들과 깊게 연결되는 우리').length).toBeGreaterThan(0);
      expect(screen.getByText(/친구가 공유한 테스트 결과입니다/i)).toBeInTheDocument();
    });

    it('/result/t1 접근 시에도 호환성 있게 TYPE 01 마주보는 정원사 공유 화면이 렌더링된다', () => {
      delete (window as any).location;
      window.location = new URL('https://woori-type-test-v2.vercel.app/result/t1') as any;

      render(<App />);

      expect(screen.getAllByText('마주보는 정원사').length).toBeGreaterThan(0);
      expect(screen.getByText(/친구가 공유한 테스트 결과입니다/i)).toBeInTheDocument();
    });

    it('/result/type-02 접근 시 TYPE 02 연결망의 항해자 공유 화면이 렌더링된다', () => {
      delete (window as any).location;
      window.location = new URL('https://woori-type-test-v2.vercel.app/result/type-02') as any;

      render(<App />);

      expect(screen.getAllByText('연결망의 항해자').length).toBeGreaterThan(0);
      expect(screen.getAllByText('온라인으로 연결되는 우리').length).toBeGreaterThan(0);
      expect(screen.getByText(/친구가 공유한 테스트 결과입니다/i)).toBeInTheDocument();
    });

    it('/result/type-03 접근 시 TYPE 03 다리를 놓는 탐험가 공유 화면이 렌더링된다', () => {
      delete (window as any).location;
      window.location = new URL('https://woori-type-test-v2.vercel.app/result/type-03') as any;

      render(<App />);

      expect(screen.getAllByText('다리를 놓는 탐험가').length).toBeGreaterThan(0);
      expect(screen.getAllByText('새로운 만남에 열린 우리').length).toBeGreaterThan(0);
      expect(screen.getByText(/친구가 공유한 테스트 결과입니다/i)).toBeInTheDocument();
    });

    it('/result/type-04 접근 시 TYPE 04 고요한 등대 공유 화면이 렌더링된다', () => {
      delete (window as any).location;
      window.location = new URL('https://woori-type-test-v2.vercel.app/result/type-04') as any;

      render(<App />);

      expect(screen.getAllByText('고요한 등대').length).toBeGreaterThan(0);
      expect(screen.getAllByText('나만의 속도로 관계 맺는 우리').length).toBeGreaterThan(0);
      expect(screen.getByText(/친구가 공유한 테스트 결과입니다/i)).toBeInTheDocument();
    });

    it('공유 화면에서 "나도 테스트하기" 버튼을 클릭하면 테스트 시작 화면으로 이동한다', () => {
      delete (window as any).location;
      window.location = new URL('https://woori-type-test-v2.vercel.app/result/type-02') as any;

      render(<App />);

      const testBtn = screen.getAllByRole('button', { name: /나도 테스트하기/i })[0];
      fireEvent.click(testBtn);

      expect(screen.getAllByText(/우리.*유형.*테스트/i).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /테스트 시작하기/i })[0]).toBeInTheDocument();
    });
  });

  describe('V2 디자인 및 UI 요구사항 검증', () => {
    it('메인 화면이 반응형 독립 UI 요소로 렌더링되며 MY \'WE\' ARCHETYPE TEST 영문 타이틀과 스톤 이미지가 포함된다', () => {
      render(<App />);

      // 영문 타이틀 단일 따옴표 및 대문자 검증
      expect(screen.getByText(/MY ['‘]WE['’] ARCHETYPE TEST/i)).toBeInTheDocument();

      // 메인 히어로 스톤 클러스터 이미지
      const heroImage = screen.getByAltText('우리유형 테스트 오브젝트 비주얼');
      expect(heroImage).toBeInTheDocument();
      expect(heroImage.getAttribute('src')).toBe('/assets/landing/hero_stones_feathered.png');

      // 스크롤 안내 버튼
      expect(screen.getByRole('button', { name: /아래로 스크롤하여 상세 유형 살펴보기/i })).toBeInTheDocument();
    });

    it('결과 화면에서 2D 좌표계 그래프와 내부 채점 용어((C), (O), / 9점)가 노출되지 않고 관계의 지표(백분율)만 표시된다', async () => {
      render(<App />);
      fireEvent.click(screen.getAllByRole('button', { name: /테스트 시작하기/i })[0]);

      // Q1 ~ Q7 빠르게 응답하여 결과 화면 진입
      fireEvent.click(screen.getByText('하루를 마치고 가족이나 가까운 친구와 일상을 나눌 때'));
      fireEvent.click(screen.getByRole('button', { name: /선택 완료하고 다음으로/i }));

      fireEvent.click(screen.getByText('서로의 일상을 챙기고, 함께할 기회를 꾸준히 만들어가는 편이다'));
      fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

      fireEvent.click(screen.getByText('그렇다'));
      fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

      fireEvent.click(screen.getByText('전혀 아니다'));
      fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

      fireEvent.click(screen.getByText('매우 그렇다'));
      fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

      fireEvent.click(screen.getByText('전혀 그렇지 않다'));
      fireEvent.click(screen.getByRole('button', { name: /다음 질문/i }));

      fireEvent.click(screen.getByText('필요할 때 정보를 얻거나 작업을 처리하는 도구'));
      fireEvent.click(screen.getByRole('button', { name: /결과 확인하기/i }));

      // 결과 화면 도달 확인
      expect(await screen.findByRole('heading', { level: 1, name: '마주보는 정원사' })).toBeInTheDocument();

      // 관계의 지표 섹션 검증
      expect(screen.getByText('관계의 지표')).toBeInTheDocument();
      expect(screen.getByText('METRICS')).toBeInTheDocument();

      // 2D 좌표계, 사분면, C1~C3, O1~O3, / 9점 등 내부 개발/채점 용어가 노출되지 않음 검증
      expect(screen.queryByText(/2D 좌표계/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/2D MATRIX/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/사분면/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/\/ 9점/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/가로축/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/세로축/i)).not.toBeInTheDocument();
    });
  });
});
