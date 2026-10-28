import React, { useRef } from 'react';
import { ArrowRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { InteractivePosterScene } from './InteractivePosterScene';
import { TypeIllustration } from './illustrations/TypeIllustration';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleScrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#F8F7F3] text-[#171923] font-sans selection:bg-[#E4E2D8]">
      
      {/* ======================================================== */}
      {/* 1. HERO POSTER VIEWPORT (100svh, 1536x1024 poster design) */}
      {/* ======================================================== */}
      <section className="relative w-full h-[100svh] min-h-[560px]">
        <InteractivePosterScene
          onStart={onStart}
          onScrollToDetails={handleScrollToDetails}
        />
      </section>

      {/* ======================================================== */}
      {/* 2. FUNCTIONAL SCROLL TARGET: ABOUT THE 4 ARCHETYPES     */}
      {/* ======================================================== */}
      <section
        ref={detailsRef}
        id="archetypes-overview"
        className="relative z-20 w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-20 border-t border-[#E4E2D8]"
      >
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-14">
          <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.16em] text-[#64748B] uppercase block mb-3 font-sans">
            FOUR RELATIONSHIP ARCHETYPES
          </span>
          <h2 className="text-[32px] sm:text-[42px] font-bold text-[#171923] tracking-[-0.03em] leading-[1.2] mb-4">
            우리는 서로 다른 방식으로 연결됩니다
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] font-normal leading-[1.6]">
            여섯 개의 질문을 통해 지금 나의 관계 방식과 &lsquo;우리&rsquo;를 이루는 고유한 리듬을 발견해 보세요.
          </p>
        </div>

        {/* 4 Archetypes Cards Grid (Standalone Premium Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 01 */}
          <div className="group transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1">
            <TypeIllustration
              typeId="type-1"
              className="transition-shadow duration-300 group-hover:shadow-[0_22px_44px_-10px_rgba(255,101,79,0.28)]"
            />
          </div>

          {/* Card 02 */}
          <div className="group transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1">
            <TypeIllustration
              typeId="type-2"
              className="transition-shadow duration-300 group-hover:shadow-[0_22px_44px_-10px_rgba(65,105,225,0.28)]"
            />
          </div>

          {/* Card 03 */}
          <div className="group transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1">
            <TypeIllustration
              typeId="type-3"
              className="transition-shadow duration-300 group-hover:shadow-[0_22px_44px_-10px_rgba(184,227,74,0.35)]"
            />
          </div>

          {/* Card 04 */}
          <div className="group transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1">
            <TypeIllustration
              typeId="type-4"
              className="transition-shadow duration-300 group-hover:shadow-[0_22px_44px_-10px_rgba(128,100,216,0.28)]"
            />
          </div>
        </div>

        {/* 3 Metric Dimension Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          <div className="p-6 rounded-2xl bg-white border border-[#E4E2D8]">
            <div className="w-10 h-10 rounded-xl bg-[#F8F7F3] flex items-center justify-center mb-4 text-[#171923]">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-[16px] font-bold text-[#171923]">우리와의 연결감</h4>
            <p className="text-[13.5px] text-[#64748B] mt-2 leading-[1.55]">
              속한 모임이나 집단에서 느끼는 안전감과 소속감의 깊이를 진단합니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E4E2D8]">
            <div className="w-10 h-10 rounded-xl bg-[#F8F7F3] flex items-center justify-center mb-4 text-[#171923]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-[16px] font-bold text-[#171923]">관계가 시작되는 곳</h4>
            <p className="text-[13.5px] text-[#64748B] mt-2 leading-[1.55]">
              대면 일상 공간과 디지털 커뮤니티 중 편안하게 관계를 시작하는 축을 살펴봅니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E4E2D8]">
            <div className="w-10 h-10 rounded-xl bg-[#F8F7F3] flex items-center justify-center mb-4 text-[#171923]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-[16px] font-bold text-[#171923]">다른 생각에 대한 열린 마음</h4>
            <p className="text-[13.5px] text-[#64748B] mt-2 leading-[1.55]">
              나와 다른 관점이나 낯선 배경을 가진 이들과의 만남에 대한 수용도를 측정합니다.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="w-full rounded-3xl bg-[#171923] text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-lg">
          <div>
            <h3 className="text-[22px] sm:text-[28px] font-bold tracking-tight">
              지금 나의 &lsquo;우리&rsquo;를 발견해 보세요
            </h3>
            <p className="text-[14px] sm:text-[15px] text-white/70 mt-2">
              약 1분 소요 · 총 6문항 · 회원가입이나 로그인 없음
            </p>
          </div>
          <button
            onClick={onStart}
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#171923] font-semibold rounded-full hover:bg-[#F8F7F3] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <span>테스트 시작하기</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Disclaimer Footer */}
        <footer className="mt-16 pt-6 border-t border-[#E4E2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[13px] text-[#64748B] gap-3">
          <span>💡 본 검사는 성격이나 관계 능력을 평가하는 진단이 아니며, 관계의 다양한 방식을 이해하기 위한 가이드입니다.</span>
          <span className="font-sans text-[12px] text-[#94A3B8]">WOORI TYPE TEST 2026</span>
        </footer>
      </section>

    </div>
  );
};
