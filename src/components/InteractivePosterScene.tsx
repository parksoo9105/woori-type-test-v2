import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { GlassCarousel3D, ArchetypeItem, ARCHETYPES } from './GlassCarousel3D';

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
  const [activeItem, setActiveItem] = useState<ArchetypeItem>(ARCHETYPES[1]); // Default TYPE 02 Blue Key

  return (
    <div
      className={`relative w-full h-[100svh] min-h-[640px] max-h-[1080px] overflow-hidden bg-[#FAF8F5] select-none text-[#171923] flex flex-col justify-between ${className}`}
    >
      {/* ======================================================== */}
      {/* 1. BACKGROUND: CHROMATIC FLUID METABALLS (No color chart) */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Key Blue metaball aura (center-left) */}
        <div
          className="absolute -top-10 left-[15%] w-[420px] h-[420px] rounded-full opacity-45 mix-blend-multiply blur-[85px] transition-transform duration-1000 ease-out will-change-transform"
          style={{
            background: 'radial-gradient(circle, #007CC3 0%, rgba(0, 124, 195, 0.4) 50%, transparent 75%)',
            transform: 'translate3d(0, 0, 0)',
          }}
        />

        {/* Warm Orange metaball aura (top-right) */}
        <div
          className="absolute top-[8%] right-[12%] w-[380px] h-[380px] rounded-full opacity-40 mix-blend-multiply blur-[80px] transition-transform duration-1000 ease-out will-change-transform"
          style={{
            background: 'radial-gradient(circle, #F08300 0%, rgba(240, 131, 0, 0.35) 50%, transparent 75%)',
          }}
        />

        {/* Dim Gray grounding aura (bottom-left) */}
        <div
          className="absolute bottom-[10%] left-[25%] w-[400px] h-[340px] rounded-full opacity-25 mix-blend-multiply blur-[90px]"
          style={{
            background: 'radial-gradient(circle, #443E3B 0%, rgba(68, 62, 59, 0.3) 50%, transparent 75%)',
          }}
        />

        {/* Dynamic ambient aura reflecting the active centered archetype */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full opacity-20 blur-[110px] pointer-events-none transition-all duration-700 ease-out"
          style={{
            backgroundColor: activeItem.hex,
          }}
        />

        {/* Ultra-subtle paper grain / museum texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* 2. MINIMALIST SWISS EXHIBITION HEADER                    */}
      {/* ======================================================== */}
      <header className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-6 sm:pt-8 flex items-center justify-between text-[11px] sm:text-[12px] tracking-[0.2em] uppercase text-stone-500 font-sans font-medium">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-stone-900 tracking-wider">COLLECTIVE KARMA</span>
          <span className="text-stone-300">·</span>
          <span className="text-stone-500 font-serif italic lowercase tracking-normal text-[13px]">2026</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-stone-400">
          <span>EXHIBITION</span>
          <span className="text-stone-300">/</span>
          <span>IDENTITY SYSTEM</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#007CC3] animate-pulse" />
          <span className="text-stone-600 font-mono text-[11px]">4 ARCHETYPES</span>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 3. HERO CONTENT: ASYMMETRIC EDITORIAL LAYOUT + CAROUSEL  */}
      {/* ======================================================== */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex-1 flex flex-col justify-center my-auto">
        
        {/* Typographic Header Group */}
        <div className="text-center mb-1 sm:mb-4">
          {/* Main Title Group */}
          <div className="inline-flex flex-col items-center">
            {/* 한글 메인 타이틀: 가장 크고 중요한 제목 */}
            <h1 className="text-[28px] sm:text-[44px] md:text-[54px] lg:text-[64px] font-bold text-[#171923] tracking-[-0.035em] leading-[1.05] font-sans">
              우리유형 테스트
            </h1>

            {/* 영문 서브 타이틀: 한글 바로 아래 작게 배치 */}
            <p className="mt-1 sm:mt-2 text-[11px] sm:text-[13px] md:text-[14px] text-stone-500 tracking-[0.28em] uppercase font-serif font-medium">
              OUR ARCHETYPE TEST
            </p>
          </div>

          {/* 테스트 안내 문구 */}
          <p className="mt-2 sm:mt-3 text-[13px] sm:text-[15.5px] md:text-[16.5px] text-stone-600 font-serif leading-relaxed max-w-xl mx-auto px-4">
            여섯 개의 질문에 답하면<br className="sm:hidden" /> 나의 &lsquo;우리&rsquo; 유형을 볼 수 있어요.
          </p>
        </div>

        {/* Central 3D Glass Carousel Component */}
        <div className="w-full">
          <GlassCarousel3D
            onActiveChange={(item) => setActiveItem(item)}
          />
        </div>

        {/* Action Button: 테스트 시작하기 → */}
        <div className="flex flex-col items-center mt-2 sm:mt-4 mb-2 sm:mb-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 px-7 sm:px-10 py-3 sm:py-3.5 rounded-full bg-[#007CC3] text-white font-medium text-[14.5px] sm:text-[16px] tracking-wide shadow-[0_12px_28px_-6px_rgba(0,124,195,0.45)] hover:bg-[#006bb0] hover:shadow-[0_16px_36px_-6px_rgba(0,124,195,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <span>테스트 시작하기</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. SCROLL INTERACTION: SCROLL TO EXPLORE ↓              */}
      {/* ======================================================== */}
      <footer className="relative z-20 w-full max-w-[1440px] mx-auto px-6 pb-2.5 sm:pb-6 flex items-center justify-center">
        <button
          onClick={onScrollToDetails}
          className="group flex flex-col items-center gap-1.5 text-stone-400 hover:text-stone-700 transition-colors duration-300 focus:outline-none"
          aria-label="유형별 상세 정보 탐색을 위해 아래로 스크롤"
        >
          <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase font-sans font-medium">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5 animate-bounce" />
        </button>
      </footer>
    </div>
  );
};
