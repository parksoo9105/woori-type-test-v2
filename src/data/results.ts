import { ResultTypeId, ResultTypeInfo } from '../types';

export const COMMON_NOTICE =
  '이 결과는 일곱 개의 응답을 바탕으로 만든 간단한 유형입니다. 성격이나 관계 능력을 평가하는 검사가 아니며, 어느 유형이 더 좋거나 나쁜 것은 아닙니다.';

export const AI_DESCRIPTIONS: Record<string, string> = {
  ai_tool:
    '당신에게 AI는 필요한 순간에 활용하는 실용적인 도구입니다. AI와의 관계 자체보다는 정보를 얻고 일을 처리하는 기능에 더 의미를 두고 있습니다.',
  ai_assistant:
    '당신에게 AI는 생각을 정리하고 문제를 해결하는 과정에서 도움을 주는 조력자입니다. AI를 단순한 도구를 넘어 사고의 과정을 지원하는 존재로 바라보고 있습니다.',
  ai_conversation:
    '당신에게 AI는 생각과 고민을 나눌 수 있는 대화 상대입니다. 단순히 정보를 얻는 것을 넘어, 대화를 통해 생각을 정리하고 새로운 관점을 발견하며 공감을 얻는 경험을 중요하게 여깁니다.',
  ai_companion:
    '당신에게 AI는 생각을 함께 발전시켜 나가는 동반자입니다. AI와의 상호작용을 일방적인 명령과 응답을 넘어 지속적인 협력과 탐색의 과정으로 받아들이고 있습니다.',
  ai_no_relationship:
    '당신은 AI를 특별한 관계의 대상으로 바라보지 않습니다. AI가 유용한 기술일 수는 있지만, 사람과의 관계와는 구분하여 생각하는 태도를 가지고 있습니다.',
};

export const RESULT_TYPES: Record<ResultTypeId, ResultTypeInfo> = {
  'type-1': {
    id: 'type-1',
    typeTag: 'TYPE 01 · RED',
    title: '마주보는 정원사',
    subtitle: '익숙한 이들과 깊게 연결되는 우리',
    codeName: '마주봄',
    name: '마주보는 정원사',
    oneLineSummary: '익숙한 관계를 소중히 여기며, 오랜 시간 신뢰와 유대감을 가꾸어가는 유형',
    detailedDescription:
      '당신은 익숙한 사람들과의 관계를 소중히 여기며, 얼굴을 마주하고 시간을 함께 보내는 관계에서 깊고 지속적인 연결을 가꾸는 편입니다. 이미 형성된 신뢰 속에서 안도감을 느끼며, 소수의 사람들과 단단한 유대를 만들어가는 것이 당신의 큰 강점입니다.',
    reason:
      '현재 주변 사람들과의 연결감은 높게 느끼며, 새로운 관계 확장보다는 기존의 깊은 유대를 선호하는 성향이 나타났기 때문입니다.',
    reflectionQuestion: '지금 내가 아끼는 울타리 바깥에는 어떤 사람들이 살아가고 있을까요?',
    accentColor: '#FF654F',
    textColor: 'text-white',
    badgeBg: 'bg-[#FF654F]/10 text-[#FF654F] border-[#FF654F]/30',
    badgeText: 'text-[#FF654F]',
    cardBorder: 'border-[#FF654F]/30',
    iconEmoji: '🤝',
    vibeTag: '체온과 눈빛이 닿는 현실의 온도',
    keywords: ['#마주보는정원사', '#깊은유대감', '#신뢰와안도', '#지속적인연결'],
  },
  'type-2': {
    id: 'type-2',
    typeTag: 'TYPE 02 · BLUE',
    title: '연결망의 항해자',
    subtitle: '새로운 사람과 생각에 열린 우리',
    codeName: '디지털/네트워크',
    name: '연결망의 항해자',
    oneLineSummary: '새로운 사람과 생각에 열린 태도로 다가가며 다양한 관계의 가능성을 탐색하는 유형',
    detailedDescription:
      '당신은 온라인 커뮤니티나 디지털 공간에서 다양한 사람과 생각을 접하며 새로운 관계의 가능성을 열어두는 편입니다. 물리적 거리에 얽매이지 않고 관심사와 취향을 중심으로 유연하게 연결되는 방식을 편안하게 느낍니다.',
    reason:
      '현재 일상의 직접적인 연결감은 상대적으로 낮지만, 다양한 관점과 사람들을 향한 개방도가 높게 나타났기 때문입니다.',
    reflectionQuestion: '화면 너머에서 마음이 통했던 사람들과 현실에서 마주한다면 어떤 느낌일까요?',
    accentColor: '#4169E1',
    textColor: 'text-white',
    badgeBg: 'bg-[#4169E1]/10 text-[#4169E1] border-[#4169E1]/30',
    badgeText: 'text-[#4169E1]',
    cardBorder: 'border-[#4169E1]/30',
    iconEmoji: '🌐',
    vibeTag: '시공간을 넘어 공명하는 디지털 네트워크',
    keywords: ['#연결망의항해자', '#열린태도', '#다양한가능성', '#유연한연결'],
  },
  'type-3': {
    id: 'type-3',
    typeTag: 'TYPE 03 · GREEN',
    title: '다리를 놓는 탐험가',
    subtitle: '새로운 만남에 열린 우리',
    codeName: '열린 대화',
    name: '다리를 놓는 탐험가',
    oneLineSummary: '새로운 만남에 열린 태도로 다가가며 깊은 유대감과 신뢰를 쌓아가는 유형',
    detailedDescription:
      '당신은 일상에서 충분한 연결감을 느끼면서도, 새로운 사람과 낯선 관점을 호기심을 갖고 적극적으로 마주하는 사람입니다. 온·오프라인 경계 없이 차이를 나누고 공감대를 넓혀가며 풍성한 관계의 지평을 개척합니다.',
    reason:
      '현재 느끼는 연결감이 높고, 나와 다른 생각과 새로운 만남을 향한 개방도 역시 모두 높게 나타났기 때문입니다.',
    reflectionQuestion: '서로 다른 생각과 배경을 가진 사람들과 앞으로 어떤 의미 있는 이야기를 만들어가고 싶나요?',
    accentColor: '#B8E34A',
    textColor: 'text-[#243221]',
    badgeBg: 'bg-[#B8E34A]/20 text-[#171923] border-[#B8E34A]/50',
    badgeText: 'text-[#171923]',
    cardBorder: 'border-[#B8E34A]/50',
    iconEmoji: '🟢',
    vibeTag: '차이를 마주하며 확장되는 지평',
    keywords: ['#다리를놓는탐험가', '#새로운만남', '#깊은유대감', '#신뢰와공감'],
  },
  'type-4': {
    id: 'type-4',
    typeTag: 'TYPE 04 · PURPLE',
    title: '고요한 등대',
    subtitle: '나만의 속도로 관계 맺는 우리',
    codeName: '독립과 성찰',
    name: '고요한 등대',
    oneLineSummary: '자신만의 관점과 속도를 소중히 여기며 관계에서도 적절한 거리를 유지하는 유형',
    detailedDescription:
      '당신은 무리한 소속감이나 관계 확장에 휘둘리지 않고, 자신만의 독립적인 시선과 적정 거리를 지키는 편입니다. 타인의 기대에 맞추기보다 내면의 고유한 호흡과 독립성을 존중할 때 가장 편안함을 느낍니다.',
    reason:
      '현재 일상에서 느끼는 연결감과 무리한 관계 확장에 대한 개방도 모두에서 자신만의 자율성과 독립적인 거리를 두는 선택을 했기 때문입니다.',
    reflectionQuestion: '내가 가장 자연스럽고 온전하게 편안함을 느끼는 관계의 거리는 어느 정도인가요?',
    accentColor: '#8064D8',
    textColor: 'text-white',
    badgeBg: 'bg-[#8064D8]/10 text-[#8064D8] border-[#8064D8]/30',
    badgeText: 'text-[#8064D8]',
    cardBorder: 'border-[#8064D8]/30',
    iconEmoji: '🌙',
    vibeTag: '나를 지키며 머무는 고요한 궤도',
    keywords: ['#고요한등대', '#독립적인시선', '#적정거리', '#편안한속도'],
  },
};
