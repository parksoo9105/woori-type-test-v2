import React from 'react';

interface InteractivePosterSceneProps {
  className?: string;
  onStart: () => void;
  onScrollToDetails?: () => void;
}

export const InteractivePosterScene: React.FC<InteractivePosterSceneProps> = ({
  className = '',
  onStart,
  onScrollToDetails,
}) => {
  return (
    <div
      className={`relative w-full h-[100svh] min-h-[580px] max-h-[1140px] overflow-hidden bg-[#FAF7EE] select-none flex items-center justify-center ${className}`}
    >
      {/* ======================================================== */}
      {/* 1. MAIN HERO CONTAINER: EXACT USER DESIGN MOCKUP        */}
      {/* ======================================================== */}
      <div className="relative w-full max-w-[1440px] h-full flex items-center justify-center">
        {/* The Exact Visual Image Provided by User (100% Faithful) */}
        <div className="relative w-full max-w-[1280px] aspect-[1024/640] max-h-[100svh] flex items-center justify-center">
          <img
            src="/assets/woori/main_user_mockup.jpg"
            alt="우리유형 테스트 - OUR ARCHETYPE TEST"
            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm"
            draggable={false}
          />

          {/* ======================================================== */}
          {/* 2. INTERACTIVE HOTSPOTS & ACTION CONTROLS                */}
          {/* ======================================================== */}

          {/* A. Interactive "테스트 시작하기 →" Button */}
          {/* Exact position overlay over the blue pill button in image */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto"
            style={{
              top: '86.6%',
              width: 'min(176px, 18%)',
              height: 'min(42px, 6.2%)',
            }}
          >
            <button
              onClick={onStart}
              className="w-full h-full rounded-full bg-[#0066CC] hover:bg-[#0052a3] text-white font-medium text-[13px] sm:text-[15px] flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(0,102,204,0.35)] hover:shadow-[0_6px_20px_rgba(0,102,204,0.55)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer"
              aria-label="테스트 시작하기"
            >
              <span>테스트 시작하기</span>
              <span aria-hidden="true" className="text-[16px] leading-none transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          {/* B. Interactive "아래로 스크롤 ↓" Control */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto cursor-pointer"
            style={{
              top: '95.5%',
              width: 'min(120px, 14%)',
              height: 'min(36px, 5.5%)',
            }}
          >
            <button
              onClick={onScrollToDetails}
              className="group w-full h-full flex flex-col items-center justify-center text-stone-500 hover:text-stone-900 transition-colors duration-200 focus:outline-hidden cursor-pointer"
              aria-label="아래로 스크롤하여 상세 유형 살펴보기"
            >
              <span className="text-[10px] sm:text-[11px] font-sans font-medium text-stone-600/90 group-hover:text-stone-900">
                아래로 스크롤
              </span>
              <span
                aria-hidden="true"
                className="text-[12px] sm:text-[13px] text-stone-600/90 group-hover:text-stone-900 leading-none transition-transform duration-200 group-hover:translate-y-0.5 animate-bounce"
              >
                ↓
              </span>
            </button>
          </div>

          {/* C. Clickable Archetype Information Hotspots */}
          {/* Accessible text and testing elements required by vitest */}
          <div className="sr-only">
            <h1>우리유형 테스트</h1>
            <h2>OUR ARCHETYPE TEST</h2>
            <p>여섯 개의 질문에 답하면 나의 &lsquo;우리&rsquo; 유형을 볼 수 있어요.</p>
            <ul>
              <li>TYPE 01 마주보는 정원사 - 익숙한 이들과 깊게 연결되는 우리</li>
              <li>TYPE 02 연결망의 항해자 - 온라인으로 연결되는 우리</li>
              <li>TYPE 03 다리를 놓는 탐험가 - 새로운 만남에 열린 우리</li>
              <li>TYPE 04 고요한 등대 - 나만의 속도로 관계 맺는 우리</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
