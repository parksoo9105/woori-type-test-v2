import { ResultTypeId } from '../types';
import svgType1 from '../assets/abstract/type-01-face-to-face.svg';
import svgType2 from '../assets/abstract/type-02-online.svg';
import svgType3 from '../assets/abstract/type-03-open.svg';
import svgType4 from '../assets/abstract/type-04-own-pace.svg';

export interface CardItem {
  id: string;
  typeId: ResultTypeId;
  name: string;
  title: string;
  subtitle: string;
  typeTag: string;
  imageUrl: string;
  accentColor: string;
  vibeText: string;
}

export const CARD_IMAGES: Record<ResultTypeId, string> = {
  'type-1': svgType1,
  'type-2': svgType2,
  'type-3': svgType3,
  'type-4': svgType4,
};

export const WHEEL_CARDS: CardItem[] = [
  {
    id: 'type-1',
    typeId: 'type-1',
    name: '마주보는 정원사',
    title: '마주보는 정원사',
    subtitle: '익숙한 이들과 깊게 연결되는 우리',
    typeTag: 'TYPE 01 · RED',
    imageUrl: svgType1,
    accentColor: '#FF654F',
    vibeText: '익숙한 사람들과 가꾸는 깊고 지속적인 연결의 온기',
  },
  {
    id: 'type-2',
    typeId: 'type-2',
    name: '연결망의 항해자',
    title: '연결망의 항해자',
    subtitle: '온라인으로 연결되는 우리',
    typeTag: 'TYPE 02 · BLUE',
    imageUrl: svgType2,
    accentColor: '#4169E1',
    vibeText: '화면 너머 다양한 사람과 생각을 향해 열려 있는 항해',
  },
  {
    id: 'type-3',
    typeId: 'type-3',
    name: '다리를 놓는 탐험가',
    title: '다리를 놓는 탐험가',
    subtitle: '새로운 만남에 열린 우리',
    typeTag: 'TYPE 03 · GREEN',
    imageUrl: svgType3,
    accentColor: '#B8E34A',
    vibeText: '차이를 마주하며 새로운 만남으로 확장되는 지평',
  },
  {
    id: 'type-4',
    typeId: 'type-4',
    name: '고요한 등대',
    title: '고요한 등대',
    subtitle: '나만의 속도로 관계 맺는 우리',
    typeTag: 'TYPE 04 · PURPLE',
    imageUrl: svgType4,
    accentColor: '#8064D8',
    vibeText: '나만의 독립적인 시선과 편안한 거리를 지키는 궤도',
  },
];

export const TYPE_CONFIG: Record<
  ResultTypeId,
  {
    typeTag: string;
    title: string;
    subtitle: string;
    color: string;
    bgGradient: string;
    vibeText: string;
    tag: string;
  }
> = {
  'type-1': {
    typeTag: 'TYPE 01 · RED',
    title: '마주보는 정원사',
    subtitle: '익숙한 이들과 깊게 연결되는 우리',
    color: '#FF654F',
    bgGradient: 'from-rose-100 to-orange-50',
    vibeText: '익숙한 사람들과 가꾸는 깊고 지속적인 연결의 온기',
    tag: '깊은 유대와 안도',
  },
  'type-2': {
    typeTag: 'TYPE 02 · BLUE',
    title: '연결망의 항해자',
    subtitle: '온라인으로 연결되는 우리',
    color: '#4169E1',
    bgGradient: 'from-blue-100 to-indigo-50',
    vibeText: '화면 너머 다양한 사람과 생각을 향해 열려 있는 항해',
    tag: '디지털 탐색과 개방',
  },
  'type-3': {
    typeTag: 'TYPE 03 · GREEN',
    title: '다리를 놓는 탐험가',
    subtitle: '새로운 만남에 열린 우리',
    color: '#B8E34A',
    bgGradient: 'from-lime-100 to-emerald-50',
    vibeText: '차이를 마주하며 새로운 만남으로 확장되는 지평',
    tag: '열린 대화와 확장',
  },
  'type-4': {
    typeTag: 'TYPE 04 · PURPLE',
    title: '고요한 등대',
    subtitle: '나만의 속도로 관계 맺는 우리',
    color: '#8064D8',
    bgGradient: 'from-purple-100 to-violet-50',
    vibeText: '나만의 독립적인 시선과 편안한 거리를 지키는 궤도',
    tag: '독립과 성찰',
  },
};
