import React from 'react';
import { Sparkles, MessageSquareQuote, Compass, ArrowRight } from 'lucide-react';
import { ResultTypeInfo } from '../types';
import { TypeIllustration } from './illustrations/TypeIllustration';

interface SharedResultScreenProps {
  resultType: ResultTypeInfo;
  onStartTest: () => void;
}

export const SharedResultScreen: React.FC<SharedResultScreenProps> = ({
  resultType,
  onStartTest,
}) => {
  const handleStart = () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch {}
    onStartTest();
    if (typeof window !== 'undefined') {
      window.location.href = 'https://woori-type-test-v2.vercel.app';
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn relative z-10 space-y-7 text-[#171923] selection:bg-[#E4E2D8]">
      {/* 🌌 Ambient Background Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 w-96 h-96 rounded-full bg-[#007CC3]/6 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -left-10 w-96 h-96 rounded-full bg-[#F08300]/6 blur-3xl -z-10"
      />

      {/* 🌟 1. Shared Result Welcome Banner */}
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-center space-y-2.5 animate-fadeIn shadow-xs">
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <p className="text-xs sm:text-sm font-bold text-amber-950">
            친구가 공유한 테스트 결과입니다
          </p>
        </div>
        <p className="text-[12.5px] text-amber-800 leading-relaxed break-keep max-w-md mx-auto">
          나는 어떤 &lsquo;우리&rsquo;에 속해 있을까요? 6개의 질문을 통해 지금 나의 관계 리듬을 발견해 보세요.
        </p>
        <button
          onClick={handleStart}
          className="mt-1 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#007CC3] text-white text-[13.5px] font-semibold hover:bg-[#0066A0] transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span>나도 테스트하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 🏷️ 2. Archetype Visual Card & Title Header */}
      <section className="flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#E4E2D8] text-[#64748B] text-[11px] font-semibold tracking-widest uppercase shadow-2xs font-sans">
          <Compass className="w-3 h-3 text-[#007CC3]" />
          <span>RELATIONSHIP ARCHETYPE</span>
        </div>

        {/* Large Result Archetype Visual Card (Final Text-free Card) */}
        <div className="w-64 sm:w-72 transition-transform duration-300 hover:scale-[1.01]">
          <TypeIllustration typeId={resultType.id} />
        </div>

        {/* TYPE Number & Title & Subtitle */}
        <header className="space-y-1.5 pt-1">
          <span className="block text-[12px] font-bold text-[#64748B] tracking-[0.18em] uppercase font-mono">
            {resultType.typeTag}
          </span>
          <h1 className="font-serif text-[32px] sm:text-[38px] font-bold text-[#000000] tracking-[-0.02em] leading-tight break-keep">
            {resultType.title}
          </h1>
          <p className="font-serif text-[15px] sm:text-[16.5px] font-medium text-[#443E3B] tracking-[-0.01em]">
            {resultType.subtitle}
          </p>
        </header>

        {/* One Line Summary */}
        <div className="w-full bg-white border-l-4 border-[#007CC3] rounded-2xl p-5 text-center shadow-xs border border-[#E4E2D8]/80 mt-1">
          <p className="text-[15.5px] sm:text-[16.5px] font-medium text-[#171923] leading-snug tracking-[-0.01em] break-keep">
            &ldquo;{resultType.oneLineSummary}&rdquo;
          </p>
        </div>
      </section>

      {/* 📝 3. Type Detailed Description */}
      <section className="space-y-4">
        {/* 관계를 맺는 방식 */}
        <div className="bg-white rounded-2xl p-6 space-y-3 border border-[#E4E2D8] shadow-xs text-left">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] font-sans">
            관계를 맺는 방식
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#334155] leading-[1.7] break-keep font-normal tracking-[-0.01em]">
            {resultType.detailedDescription}
          </p>
        </div>

        {/* 연결감을 느끼는 순간과 성향 */}
        <div className="bg-white rounded-2xl p-6 space-y-2.5 border border-[#E4E2D8] shadow-xs text-left">
          <div className="flex items-center gap-2 text-[#171923] font-bold text-[14.5px]">
            <div className="w-6 h-6 rounded-lg bg-[#FAF9F5] text-[#007CC3] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>연결감을 느끼는 순간과 성향</span>
          </div>
          <p className="text-[14.5px] text-[#475569] leading-[1.65] break-keep pl-8 font-normal tracking-[-0.01em]">
            {resultType.reason}
          </p>
        </div>

        {/* 관계에 대해 생각해 볼 질문 */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 space-y-2.5 shadow-xs text-left">
          <div className="flex items-center gap-2 text-amber-950 font-bold text-[14.5px]">
            <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <MessageSquareQuote className="w-3.5 h-3.5" />
            </div>
            <span>관계에 대해 생각해 볼 질문</span>
          </div>
          <p className="font-serif text-[15.5px] font-semibold text-amber-950 leading-[1.6] pl-8 tracking-[-0.01em] break-keep">
            &ldquo;{resultType.reflectionQuestion}&rdquo;
          </p>
        </div>
      </section>

      {/* 🚀 4. Prominent Bottom Action Buttons */}
      <footer className="pt-2 pb-6 flex flex-col items-center gap-3">
        <button
          onClick={handleStart}
          className="group w-full max-w-sm inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#0066CC] hover:bg-[#0052A3] text-white font-semibold text-[15.5px] shadow-[0_6px_20px_rgba(0,102,204,0.32)] hover:shadow-[0_8px_25px_rgba(0,102,204,0.48)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>나도 테스트하기</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
        <span className="text-[11.5px] text-[#888888] font-sans">
          약 1분 소요 · 총 6문항 · 로그인 없이 바로 시작
        </span>
      </footer>
    </div>
  );
};

export default SharedResultScreen;
