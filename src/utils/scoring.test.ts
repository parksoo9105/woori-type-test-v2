import { describe, it, expect } from 'vitest';
import {
  calculateScores,
  classifyResultType,
  calculateC1Score,
  calculateC2Score,
  calculateC3Score,
  calculateO1Score,
  calculateO2Score,
  calculateO3Score,
  calculateAIScore,
  toConnectionPercentage,
  toOpennessPercentage,
  toAIPercentage,
} from './scoring';

describe('calculateScores & classifyResultType (최종 규격)', () => {
  describe('C1: 복수선택 및 비채점 항목(④) 계산 검증', () => {
    it('④만 선택 시 0점', () => {
      expect(calculateC1Score(['c1_4'])).toBe(0);
    });

    it('① + ④ 선택 시 1점', () => {
      expect(calculateC1Score(['c1_1', 'c1_4'])).toBe(1);
    });

    it('① + ② + ④ 선택 시 2점', () => {
      expect(calculateC1Score(['c1_1', 'c1_2', 'c1_4'])).toBe(2);
    });

    it('① + ② + ③ + ④ 선택 시 3점 (최대 3점)', () => {
      expect(calculateC1Score(['c1_1', 'c1_2', 'c1_3', 'c1_4'])).toBe(3);
    });

    it('중복 선택이 있어도 고유 항목 개수만 환산된다', () => {
      expect(calculateC1Score(['c1_1', 'c1_1', 'c1_2'])).toBe(2);
    });
  });

  describe('C2, C3 및 연결감 C 합산 (0~9점)', () => {
    it('C2 배점 (0~3점) 정상 계산', () => {
      expect(calculateC2Score('c2_1')).toBe(0);
      expect(calculateC2Score('c2_2')).toBe(1);
      expect(calculateC2Score('c2_3')).toBe(2);
      expect(calculateC2Score('c2_4')).toBe(3);
    });

    it('C3 배점 (0~3점) 정상 계산', () => {
      expect(calculateC3Score('c3_1')).toBe(0);
      expect(calculateC3Score('c3_2')).toBe(1);
      expect(calculateC3Score('c3_3')).toBe(2);
      expect(calculateC3Score('c3_4')).toBe(3);
    });

    it('C = C1 + C2 + C3 총합이 0~9점 범위로 정확히 산출된다', () => {
      // 최소 0점
      const min = calculateScores({
        1: ['c1_4'],
        2: 'c2_1',
        3: 'c3_1',
        4: 'o1_1',
        5: 'o2_4',
        6: 'o6_1',
        7: 'ai_tool',
      });
      expect(min.connectionScore).toBe(0);

      // 최대 9점 (C1: 3점, C2: 3점, C3: 3점)
      const max = calculateScores({
        1: ['c1_1', 'c1_2', 'c1_3'],
        2: 'c2_4',
        3: 'c3_4',
        4: 'o1_1',
        5: 'o2_4',
        6: 'o6_1',
        7: 'ai_tool',
      });
      expect(max.connectionScore).toBe(9);
    });
  });

  describe('O1, O2(역채점), O3 및 개방도 O 합산 (0~9점)', () => {
    it('O1 배점 (0~3점) 정상 계산', () => {
      expect(calculateO1Score('o1_1')).toBe(0);
      expect(calculateO1Score('o1_4')).toBe(3);
    });

    it('O2 역채점: ①=3점, ②=2점, ③=1점, ④=0점', () => {
      expect(calculateO2Score('o2_1')).toBe(3);
      expect(calculateO2Score('o2_2')).toBe(2);
      expect(calculateO2Score('o2_3')).toBe(1);
      expect(calculateO2Score('o2_4')).toBe(0);
    });

    it('O3 배점 (0~3점) 정상 계산', () => {
      expect(calculateO3Score('o6_1')).toBe(0);
      expect(calculateO3Score('o6_4')).toBe(3);
    });

    it('O = O1 + O2 + O3 총합이 0~9점 범위로 정확히 산출된다', () => {
      // 최소 0점 (O1: 0, O2: ④=0점, O3: 0)
      const minO = calculateScores({
        1: ['c1_4'],
        2: 'c2_1',
        3: 'c3_1',
        4: 'o1_1',
        5: 'o2_4',
        6: 'o6_1',
        7: 'ai_tool',
      });
      expect(minO.opennessScore).toBe(0);

      // 최대 9점 (O1: 3, O2: ①=3점, O3: 3)
      const maxO = calculateScores({
        1: ['c1_4'],
        2: 'c2_1',
        3: 'c3_1',
        4: 'o1_4',
        5: 'o2_1',
        6: 'o6_4',
        7: 'ai_tool',
      });
      expect(maxO.opennessScore).toBe(9);
    });
  });

  describe('AI 친밀도 독립 문항(Q7) 0, 1, 2, 3, 0점 배점 및 설명 구분 검증', () => {
    it('①=0점 (ai_tool) 및 ⑤=0점 (ai_no_relationship) 고유 ID 구분 및 0점 부여 검증', () => {
      const tool = calculateAIScore('ai_tool');
      expect(tool.score).toBe(0);
      expect(tool.optionId).toBe('ai_tool');

      const noRel = calculateAIScore('ai_no_relationship');
      expect(noRel.score).toBe(0);
      expect(noRel.optionId).toBe('ai_no_relationship');
    });

    it('②=1점, ③=2점, ④=3점 순서대로 정확히 매핑', () => {
      expect(calculateAIScore('ai_assistant').score).toBe(1);
      expect(calculateAIScore('ai_conversation').score).toBe(2);
      expect(calculateAIScore('ai_companion').score).toBe(3);
    });

    it('AI 점수는 C나 O 점수 및 유형 판정에 일절 영향을 주지 않는다', () => {
      const result = calculateScores({
        1: ['c1_1'], // 1점
        2: 'c2_2',   // 1점
        3: 'c3_2',   // 1점 -> C = 3점
        4: 'o1_2',   // 1점
        5: 'o2_2',   // 2점 (역채점)
        6: 'o6_2',   // 1점 -> O = 4점
        7: 'ai_companion', // AI = 3점
      });

      expect(result.connectionScore).toBe(3);
      expect(result.opennessScore).toBe(4);
      expect(result.aiScore).toBe(3);
      expect(result.aiOptionId).toBe('ai_companion');

      // AI 점수와 무관하게 C=3(<5), O=4(<5) -> type-4 고요한 등대
      expect(classifyResultType(result)).toBe('type-4');
    });
  });

  describe('지표별 백분율 환산 검증', () => {
    it('연결감(C): (C ÷ 9) * 100 반올림 (0~100%)', () => {
      expect(toConnectionPercentage(0)).toBe(0);
      expect(toConnectionPercentage(3)).toBe(33);
      expect(toConnectionPercentage(5)).toBe(56);
      expect(toConnectionPercentage(7)).toBe(78);
      expect(toConnectionPercentage(9)).toBe(100);
    });

    it('개방도(O): (O ÷ 9) * 100 반올림 (0~100%)', () => {
      expect(toOpennessPercentage(0)).toBe(0);
      expect(toOpennessPercentage(3)).toBe(33);
      expect(toOpennessPercentage(5)).toBe(56);
      expect(toOpennessPercentage(7)).toBe(78);
      expect(toOpennessPercentage(9)).toBe(100);
    });

    it('AI 관계 인식: (AI ÷ 3) * 100 (0~3점 척도, 0~100%)', () => {
      expect(toAIPercentage(0)).toBe(0);
      expect(toAIPercentage(1)).toBe(33);
      expect(toAIPercentage(2)).toBe(67);
      expect(toAIPercentage(3)).toBe(100);
    });
  });

  describe('경계값(5점) 기준 4대 관계 유형 판정', () => {
    it('C >= 5, O < 5 -> type-1 (마주보는 정원사)', () => {
      expect(classifyResultType({ connectionScore: 5, opennessScore: 4 })).toBe('type-1');
      expect(classifyResultType({ connectionScore: 9, opennessScore: 0 })).toBe('type-1');
    });

    it('C < 5, O >= 5 -> type-2 (연결망의 항해자)', () => {
      expect(classifyResultType({ connectionScore: 4, opennessScore: 5 })).toBe('type-2');
      expect(classifyResultType({ connectionScore: 1, opennessScore: 8 })).toBe('type-2');
    });

    it('C >= 5, O >= 5 -> type-3 (다리를 놓는 탐험가)', () => {
      expect(classifyResultType({ connectionScore: 5, opennessScore: 5 })).toBe('type-3');
      expect(classifyResultType({ connectionScore: 9, opennessScore: 9 })).toBe('type-3');
    });

    it('C < 5, O < 5 -> type-4 (고요한 등대)', () => {
      expect(classifyResultType({ connectionScore: 4, opennessScore: 4 })).toBe('type-4');
      expect(classifyResultType({ connectionScore: 0, opennessScore: 0 })).toBe('type-4');
    });
  });
});
