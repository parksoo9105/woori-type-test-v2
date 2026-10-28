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

        {/* 4 Archetypes Cards Grid (Updated with Final Design Assets & Names) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 01 */}
          <div className="flex flex-col bg-white rounded-3xl p-5 border border-[#E4E2D8] shadow-xs hover:border-[#FF654F]/50 transition-all">
            <div className="w-full rounded-2xl overflow-hidden mb-4">
              <TypeIllustration typeId="type-1" showTextOverlay={false} />
            </div>
            <div className="text-left mt-auto">
              <span className="text-[11px] font-bold text-[#FF654F] tracking-wider uppercase font-sans">
                TYPE 01 · RED
              </span>
              <h3 className="text-[19px] font-bold text-[#171923] tracking-tight mt-0.5">
                마주보는 정원사
              </h3>
              <p className="text-[13px] font-semibold text-[#64748B] mt-0.5">
                익숙한 이들과 깊게 연결되는 우리
              </p>
              <p className="text-[13px] text-[#64748B] mt-2 leading-[1.5]">
                얼굴을 마주하고 함께하는 시간 속에서 깊은 유대감과 편안함을 느끼는 관계
              </p>
            </div>
          </div>

          {/* Card 02 */}
          <div className="flex flex-col bg-white rounded-3xl p-5 border border-[#E4E2D8] shadow-xs hover:border-[#4169E1]/50 transition-all">
            <div className="w-full rounded-2xl overflow-hidden mb-4">
              <TypeIllustration typeId="type-2" showTextOverlay={false} />
            </div>
            <div className="text-left mt-auto">
              <span className="text-[11px] font-bold text-[#4169E1] tracking-wider uppercase font-sans">
                TYPE 02 · BLUE
              </span>
              <h3 className="text-[19px] font-bold text-[#171923] tracking-tight mt-0.5">
                연결망의 항해자
              </h3>
              <p className="text-[13px] font-semibold text-[#64748B] mt-0.5">
                온라인으로 연결되는 우리
              </p>
              <p className="text-[13px] text-[#64748B] mt-2 leading-[1.5]">
                물리적 거리와 상관없이 취향과 생각으로 언제 어디서나 이어지는 관계
              </p>
            </div>
          </div>

          {/* Card 03 */}
          <div className="flex flex-col bg-white rounded-3xl p-5 border border-[#E4E2D8] shadow-xs hover:border-[#B8E34A]/50 transition-all">
            <div className="w-full rounded-2xl overflow-hidden mb-4">
              <TypeIllustration typeId="type-3" showTextOverlay={false} />
            </div>
            <div className="text-left mt-auto">
              <span className="text-[11px] font-bold text-[#76A31D] tracking-wider uppercase font-sans">
                TYPE 03 · GREEN
              </span>
              <h3 className="text-[19px] font-bold text-[#171923] tracking-tight mt-0.5">
                다리를 놓는 탐험가
              </h3>
              <p className="text-[13px] font-semibold text-[#64748B] mt-0.5">
                새로운 만남에 열린 우리
              </p>
              <p className="text-[13px] text-[#64748B] mt-2 leading-[1.5]">
                다양한 사람들과의 만남 속에서 새로운 생각과 가능성을 기꺼이 받아들이는 관계
              </p>
            </div>
          </div>

          {/* Card 04 */}
          <div className="flex flex-col bg-white rounded-3xl p-5 border border-[#E4E2D8] shadow-xs hover:border-[#8064D8]/50 transition-all">
            <div className="w-full rounded-2xl overflow-hidden mb-4">
              <TypeIllustration typeId="type-4" showTextOverlay={false} />
            </div>
            <div className="text-left mt-auto">
              <span className="text-[11px] font-bold text-[#8064D8] tracking-wider uppercase font-sans">
                TYPE 04 · PURPLE
              </span>
              <h3 className="text-[19px] font-bold text-[#171923] tracking-tight mt-0.5">
                고요한 등대
              </h3>
              <p className="text-[13px] font-semibold text-[#64748B] mt-0.5">
                나만의 속도로 관계 맺는 우리
              </p>
              <p className="text-[13px] text-[#64748B] mt-2 leading-[1.5]">
                서로의 독립된 공간과 고유한 템포를 존중하며 편안하게 지속되는 관계
              </p>
            </div>
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
