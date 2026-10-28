# 〈우리 유형 테스트〉 (Woori Type Test)

> AI 시대에 사람들이 '우리'라는 관계를 어떻게 느끼고 형성하는지 탐색하는 모바일 우선 웹 애플리케이션입니다.  
> 6개의 문항을 통해 현재 자신의 관계 경험과 인식을 돌아볼 수 있는 참여형 콘텐츠입니다.

---

## 🌿 주요 특징 및 구현 내용

1. **원작 검사 기준 및 채점 모델 100% 반영**
   - 기존 6개 문항 및 선택지별 배점 정확히 유지
   - 세 가지 핵심 평가 지표 산출:
     - **지표 A (우리와의 연결감)**: Q1 + Q6 (0~6점, 4점 이상: 높음)
     - **지표 B (관계가 시작되는 곳)**: Q2 + Q3 (-2~+2점, 0점은 중립값으로 시각화)
     - **지표 C (다른 생각에 대한 열린 마음)**: Q4 + Q5 (0~8점, 5점 이상: 높음)
   - 4개 유형 자동 분류:
     1. 마주보며 연결되는 우리 (A ≥ 4, B ≤ 0)
     2. 온라인으로 연결되는 우리 (A ≥ 4, B ≥ 1)
     3. 새로운 만남에 열린 우리 (A ≤ 3, C ≥ 5)
     4. 나만의 속도로 관계 맺는 우리 (A ≤ 3, C ≤ 4)

2. **모바일 퍼스트 & 에디토리얼 디자인**
   - 따뜻한 오프화이트 배경(`bg-paper`), 세이지 그린/포레스트 딥 그린 메인 컬러
   - 4가지 결과 유형별 개별 에디토리얼 SVG 벡터 일러스트레이션 적용
   - 중앙 기준 양방향 밸런스 인디케이터(지표 B의 중립 상태 명시)

3. **향상된 사용자 경험 (UX)**
   - 1문항씩 집중하는 인터페이스 (상단 1/6 ~ 6/6 진행률 바)
   - 이전 질문으로 돌아가 답변 수정 가능
   - 새로고침 시에도 응답 상태 유지 (SessionStorage 활용)
   - 결과 복사 및 웹 공유(Web Share API) 기능 지원

4. **개인정보 제로 원칙 (Privacy-First)**
   - 로그인 및 사용자 개인정보 입력 일체 없음
   - 서버 저장소나 데이터베이스를 두지 않고 브라우저 내에서만 안전하게 연산

5. **유지보수성이 뛰어난 구조화된 코드**
   - `src/data/questions.ts`: 문항/선택지/배점 데이터
   - `src/data/results.ts`: 결과 유형 텍스트 및 메타데이터
   - `src/utils/scoring.ts`: 점수 산출 및 분류 순수 함수
   - `src/components/`: 화면별/컴포넌트별 분리 구조

---

## 🚀 로컬 실행 방법

### 요구 사항
- Node.js v18 이상 및 npm

### 의존성 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
기본적으로 `http://localhost:3000`에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
```
빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 자동화 테스트 실행 (Vitest)
```bash
npm test
```
경계값 채점 및 4개 유형 판정 로직, 화면 렌더링 검증 20개 테스트가 자동 실행됩니다.

---

## 📁 프로젝트 구조

```
Collective_Karma/
├── src/
│   ├── components/
│   │   ├── illustrations/           # 유형별 4종 에디토리얼 SVG 일러스트레이션
│   │   │   ├── FaceToFaceIllustration.tsx
│   │   │   ├── OnlineIllustration.tsx
│   │   │   ├── OpenMindIllustration.tsx
│   │   │   ├── OwnPaceIllustration.tsx
│   │   │   └── TypeIllustration.tsx
│   │   ├── StartScreen.tsx          # 시작 화면
│   │   ├── QuestionScreen.tsx       # 1~6문항 진행 화면
│   │   ├── ResultScreen.tsx         # 결과 화면 (8단계 구성 완벽 준수)
│   │   └── MetricVisualizer.tsx     # 3대 평가 지표 시각화 (중앙 기준 축)
│   ├── data/
│   │   ├── questions.ts             # 6문항 데이터
│   │   └── results.ts               # 4개 유형 결과 콘텐츠
│   ├── utils/
│   │   ├── scoring.ts               # 지표 계산 및 유형 분류 알고리즘
│   │   └── scoring.test.ts          # 점수 경계값 단위 테스트
│   ├── types/
│   │   └── index.ts                 # TypeScript 타입 정의
│   ├── App.tsx                      # 메인 화면 흐름 제어기
│   ├── App.test.tsx                 # 화면 흐름 & 통합 테스트
│   ├── main.tsx                     # React 엔트리포인트
│   └── index.css                    # Tailwind CSS 스타일
├── tailwind.config.js               # 컬러 팔레트 & 폰트 설정
├── vite.config.ts                   # Vite 및 Vitest 설정
└── package.json
```

---

## 🌐 배포 가이드 (배포 준비 단계)

본 프로젝트는 순수 정적 웹 애플리케이션(SPA)이므로 정적 웹 호스팅 서비스에 즉시 배포할 수 있습니다.

- **Vercel**: GitHub 저장소 연결 후 자동 빌드 및 무료 글로벌 CDN 배포
- **Netlify**: `dist` 폴더 드래그 앤 드롭 또는 Git 연동
- **GitHub Pages**: `vite.config.ts`의 `base` 경로 지정 후 `gh-pages` 배포
- **Cloudflare Pages**: 고속 엣지 네트워크 배포

---

## 🔒 핵심 아키텍처 불변 원칙 (Invariant Rules)

> **⚠️ 중요 개발 지침: 카카오톡 공유 및 결과 페이지 연결 로직 불변 원칙**  
> 향후 설문 질문, 점수 계산식, 텍스트 내용, 공유 이미지 디자인이 변경되더라도 **아래의 공유 라우팅 및 화면 연결 로직은 변경하지 않고 그대로 유지합니다.**

1. **카카오톡 공유 전송 로직 (`src/utils/share.ts` - `shareViaKakao`)**
   - 유형별 독립 결과 페이지 고유 URL 연결: `/result/type-01`, `/result/type-02`, `/result/type-03`, `/result/type-04`
   - 피드 템플릿의 카드 본문(`content.link`) 및 버튼 링크에 해당 고유 URL 바인딩 유지

2. **공유 결과 화면 터치 시 첫 화면 연결 로직 (`SharedResultScreen.tsx` & `generate-static-results.cjs`)**
   - 공유받은 결과 페이지 접속 시, **화면 전체 영역(배경, 카드, 텍스트, 여백 등 아무 곳이나)을 터치/클릭하면 즉시 `https://woori-type-test.vercel.app` (테스트 첫 화면)으로 다이렉트 이동**.
   - 클릭 즉시 세션/로컬 스토리지를 클린 리셋하여 언제나 새로운 테스트를 시작할 수 있도록 보장.

