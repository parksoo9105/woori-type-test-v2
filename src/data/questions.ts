import { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: '다음 중 당신이 만족감과 연결감을 느끼는 순간은 언제인가요?',
    description: '해당하는 항목을 모두 선택해 주세요. (복수 선택 가능)',
    isMultiple: true,
    options: [
      {
        id: 'c1_1',
        label: '하루를 마치고 가족이나 가까운 친구와 일상을 나눌 때',
        score: 1,
      },
      {
        id: 'c1_2',
        label: '새로운 사람들과 만나 공통의 관심사나 좋아하는 활동을 함께할 때',
        score: 1,
      },
      {
        id: 'c1_3',
        label: 'SNS나 온라인 커뮤니티를 통해 일상에서 만나기 어려운 다양한 사람들과 생각과 경험을 나눌 때',
        score: 1,
      },
      {
        id: 'c1_4',
        label: '혼자만의 시간을 보내며 나 자신에게 집중할 때',
        score: 0,
      },
    ],
  },
  {
    id: 2,
    title: '평소 주변 사람들과의 관계를 어떻게 이어가고 있나요?',
    description: '나의 일상적인 관계 유지 방식에 가장 가까운 항목을 하나 선택해 주세요.',
    isMultiple: false,
    options: [
      {
        id: 'c2_1',
        label: '필요한 일이 있을 때만 연락하거나 교류하는 편이다',
        score: 0,
      },
      {
        id: 'c2_2',
        label: '상대방이 먼저 연락하거나 제안하면 대체로 응하는 편이다',
        score: 1,
      },
      {
        id: 'c2_3',
        label: '먼저 안부를 묻거나 연락하며 관계를 이어가는 편이다',
        score: 2,
      },
      {
        id: 'c2_4',
        label: '서로의 일상을 챙기고, 함께할 기회를 꾸준히 만들어가는 편이다',
        score: 3,
      },
    ],
  },
  {
    id: 3,
    title: '내가 속한 ‘우리’에서 충분한 연결감과 유대감을 느끼고 있나요?',
    description: '현재 내가 속한 모임이나 관계에서 느끼는 연결감의 정도를 선택해 주세요.',
    isMultiple: false,
    options: [
      {
        id: 'c3_1',
        label: '전혀 아니다',
        score: 0,
      },
      {
        id: 'c3_2',
        label: '대체로 아니다',
        score: 1,
      },
      {
        id: 'c3_3',
        label: '그렇다',
        score: 2,
      },
      {
        id: 'c3_4',
        label: '매우 그렇다',
        score: 3,
      },
    ],
  },
  {
    id: 4,
    title: '평소 새로운 사람들과 교류할 기회를 탐색하는 편인가요?',
    description: '새로운 사람이나 새로운 관계를 향한 나의 평소 태도를 선택해 주세요.',
    isMultiple: false,
    options: [
      {
        id: 'o1_1',
        label: '전혀 아니다',
        score: 0,
      },
      {
        id: 'o1_2',
        label: '대체로 아니다',
        score: 1,
      },
      {
        id: 'o1_3',
        label: '그렇다',
        score: 2,
      },
      {
        id: 'o1_4',
        label: '매우 그렇다',
        score: 3,
      },
    ],
  },
  {
    id: 5,
    title: '나와 다른 의견을 들었을 때, 내 생각을 유지하는 편인가요?',
    description: '다른 의견을 마주했을 때 나의 일반적인 반응을 선택해 주세요.',
    isMultiple: false,
    options: [
      {
        id: 'o2_1',
        label: '전혀 그렇지 않다',
        score: 3, // 역채점: 3점
      },
      {
        id: 'o2_2',
        label: '그렇지 않다',
        score: 2, // 역채점: 2점
      },
      {
        id: 'o2_3',
        label: '그렇다',
        score: 1, // 역채점: 1점
      },
      {
        id: 'o2_4',
        label: '매우 그렇다',
        score: 0, // 역채점: 0점
      },
    ],
  },
  {
    id: 6,
    title: '나와 직접적인 관계가 없는 사람의 문제도 ‘우리’의 문제가 될 수 있을까요?',
    description: '‘우리’라는 범위에 대한 나의 평소 생각을 선택해 주세요.',
    isMultiple: false,
    options: [
      {
        id: 'o6_1',
        label: '전혀 그렇지 않다',
        score: 0,
      },
      {
        id: 'o6_2',
        label: '그렇지 않다',
        score: 1,
      },
      {
        id: 'o6_3',
        label: '그렇다',
        score: 2,
      },
      {
        id: 'o6_4',
        label: '매우 그렇다',
        score: 3,
      },
    ],
  },
  {
    id: 7,
    title: '당신에게 AI는?',
    description: '나와 AI의 관계에 대해 가장 공감되는 설명을 하나 선택해 주세요.',
    isMultiple: false,
    options: [
      {
        id: 'ai_tool',
        label: '필요할 때 정보를 얻거나 작업을 처리하는 도구',
        score: 0,
      },
      {
        id: 'ai_assistant',
        label: '생각을 정리하거나 문제를 해결할 때 도움을 주는 조력자',
        score: 1,
      },
      {
        id: 'ai_conversation',
        label: '일상적인 고민이나 생각을 편하게 나눌 수 있는 대화 상대',
        score: 2,
      },
      {
        id: 'ai_companion',
        label: '나를 이해하고 함께 생각을 발전시켜 나가는 동반자',
        score: 3,
      },
      {
        id: 'ai_no_relationship',
        label: 'AI를 특별한 관계의 대상으로 생각하지 않는다',
        score: 0,
      },
    ],
  },
];
