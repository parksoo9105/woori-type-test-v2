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
      className={`relative w-full h-[100svh] min-h-[580px] max-h-[1140px] overflow-hidden bg-[#FAF7EE] select-none flex flex-col justify-between items-center text-[#171923] ${className}`}
    >
      {/* ======================================================== */}
      {/* 1. AMBIENT BACKGROUND & SWISS EDITORIAL GUIDELINES       */}
      {/* ======================================================== */}
      
      {/* Soft Ambient Radial Blur Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-[#F08300]/8 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -right-24 w-[480px] h-[480px] rounded-full bg-[#007CC3]/10 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 w-[380px] h-[380px] rounded-full bg-[#443E3B]/6 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-10 w-[360px] h-[360px] rounded-full bg-[#76A31D]/6 blur-3xl -z-10"
      />

      {/* Editorial Corner Crosshairs (+) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-6 left-6 text-[#A8A498]/60 font-mono text-[11px] select-none"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-6 right-6 text-[#A8A498]/60 font-mono text-[11px] select-none"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-6 text-[#A8A498]/60 font-mono text-[11px] select-none"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 right-6 text-[#A8A498]/60 font-mono text-[11px] select-none"
      >
        +
      </div>

      {/* Editorial Vertical Side Labels (Desktop) */}
      <div
        aria-hidden="true"
        className="hidden lg:block pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[10px] tracking-[0.24em] text-[#8C887B] font-mono uppercase whitespace-nowrap"
      >
        EST. 2026 · RELATIONSHIP ARCHETYPE STUDY
      </div>
      <div
        aria-hidden="true"
        className="hidden lg:block pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 rotate-90 origin-center text-[10px] tracking-[0.24em] text-[#8C887B] font-mono uppercase whitespace-nowrap"
      >
        SWISS EDITORIAL MEDIA ART
      </div>

      {/* Subtle Hairline Frame Guides */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 sm:inset-x-12 top-0 h-px bg-[#E6E3D8]/60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 sm:inset-x-12 bottom-0 h-px bg-[#E6E3D8]/60"
      />

      {/* ======================================================== */}
      {/* 2. TOP HEADER: TITLE & SUBTITLE SECTION                  */}
      {/* ======================================================== */}
      <header className="relative z-20 w-full max-w-[840px] pt-8 sm:pt-12 md:pt-14 px-4 text-center flex flex-col items-center">
        {/* Project Edition Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/70 border border-[#E5E2D9] text-[#78716C] text-[10.5px] font-mono uppercase tracking-[0.18em] shadow-2xs mb-2.5 sm:mb-3">
          <span>OUR ARCHETYPE PROJECT 2026</span>
        </div>

        {/* Main Title (Korean Serif) */}
        <h1 className="font-serif text-[34px] sm:text-[44px] md:text-[52px] lg:text-[58px] font-bold text-[#111111] tracking-[-0.03em] leading-[1.12]">
          우리유형 테스트
        </h1>

        {/* English Subtitle (Exact Specification: MY 'WE' ARCHETYPE TEST) */}
        <p className="font-sans text-[11px] sm:text-[12.5px] md:text-[13.5px] font-semibold tracking-[0.22em] text-[#64748B] uppercase mt-1.5 sm:mt-2">
          MY &lsquo;WE&rsquo; ARCHETYPE TEST
        </p>

        {/* Descriptive Subtitle */}
        <p className="font-sans text-[13.5px] sm:text-[15px] md:text-[16px] text-[#555555] font-normal leading-relaxed mt-2 sm:mt-2.5 break-keep max-w-md mx-auto">
          여섯 개의 질문에 답하면 나의 &lsquo;우리&rsquo; 유형을 볼 수 있어요.
        </p>
      </header>

      {/* ======================================================== */}
      {/* 3. CENTERPIECE VISUAL: 5-STONE CLUSTER (ISOLATED PNG)   */}
      {/* ======================================================== */}
      <div className="relative z-10 flex-1 w-full max-w-[820px] flex items-center justify-center px-4 my-auto py-1 sm:py-3">
        <img
          src="/assets/landing/hero_stones_feathered.png"
          alt="우리유형 테스트 오브젝트 비주얼"
          className="w-[90%] sm:w-[82%] max-w-[620px] max-h-[38vh] aspect-[744/355] object-contain drop-shadow-[0_12px_28px_rgba(30,25,20,0.06)] pointer-events-none select-none transition-transform duration-500 hover:scale-[1.01]"
          draggable={false}
        />
      </div>

      {/* ======================================================== */}
      {/* 4. BOTTOM ACTION SECTION: START BUTTON & SCROLL GUIDE    */}
      {/* ======================================================== */}
      <footer className="relative z-20 w-full max-w-[840px] pb-6 sm:pb-8 md:pb-10 px-4 text-center flex flex-col items-center gap-3 sm:gap-3.5">
        {/* Test Start Button */}
        <button
          onClick={onStart}
          className="group inline-flex items-center justify-center gap-2 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#0066CC] hover:bg-[#0052A3] text-white font-medium text-[14.5px] sm:text-[15.5px] shadow-[0_6px_18px_rgba(0,102,204,0.32)] hover:shadow-[0_8px_24px_rgba(0,102,204,0.48)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer min-h-[48px] sm:min-h-[52px]"
          aria-label="테스트 시작하기"
        >
          <span>테스트 시작하기</span>
          <span
            aria-hidden="true"
            className="text-[16px] leading-none transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </button>

        {/* Scroll Down Indicator */}
        <button
          onClick={onScrollToDetails}
          className="group flex flex-col items-center justify-center text-stone-500 hover:text-stone-900 transition-colors duration-200 cursor-pointer focus:outline-hidden py-1"
          aria-label="아래로 스크롤하여 상세 유형 살펴보기"
        >
          <span className="text-[10.5px] sm:text-[11.5px] font-sans font-medium text-stone-600/90 group-hover:text-stone-900">
            아래로 스크롤
          </span>
          <span
            aria-hidden="true"
            className="text-[12px] sm:text-[13px] text-stone-600/90 group-hover:text-stone-900 leading-none transition-transform duration-200 group-hover:translate-y-0.5 animate-bounce mt-0.5"
          >
            ↓
          </span>
        </button>
      </footer>
    </div>
  );
};
