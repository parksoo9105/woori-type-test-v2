import React, { useEffect } from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { ResultTypeInfo } from '../types';

interface SharedResultScreenProps {
  resultType: ResultTypeInfo;
  onStartTest: () => void;
}

export const SharedResultScreen: React.FC<SharedResultScreenProps> = ({
  resultType,
  onStartTest,
}) => {
  const handleNavigateToStart = (e?: React.MouseEvent | MouseEvent) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch {}
    onStartTest();
    if (typeof window !== 'undefined') {
      window.location.href = 'https://woori-type-test-v2.vercel.app';
    }
  };

  useEffect(() => {
    const handleGlobalClick = () => {
      try {
        sessionStorage.clear();
        localStorage.clear();
      } catch {}
      onStartTest();
      if (typeof window !== 'undefined') {
        window.location.href = 'https://woori-type-test-v2.vercel.app';
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [onStartTest]);

  return (
    <a
      href="https://woori-type-test-v2.vercel.app"
      onClick={handleNavigateToStart}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleNavigateToStart(e as any);
      }}
      className="flex flex-col min-h-screen max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn relative z-10 space-y-6 text-[#171923] cursor-pointer selection:bg-transparent no-underline block"
      title="화면을 터치하여 나도 테스트 시작하기"
    >
      {/* 🏷️ 1. Type Title & Subtitle */}
      <header className="text-center space-y-1 pt-1">
        <span className="block text-[12px] font-bold text-[#64748B] tracking-[0.16em] uppercase font-sans">
          {resultType.typeTag}
        </span>
        <h1 className="text-[32px] sm:text-[38px] font-extrabold text-[#171923] tracking-[-0.03em] leading-tight">
          {resultType.title}
        </h1>
        <p className="text-[14.5px] font-semibold text-[#475569] tracking-tight">
          {resultType.subtitle}
        </p>
      </header>

      {/* 🎴 2. Existing Result Card Image */}
      <div className="flex flex-col items-center">
        <div className="w-64 sm:w-72 transition-transform duration-300 hover:scale-[1.02]">
          <img
            src={`/cards/card-${resultType.id}.png`}
            alt={`${resultType.title} - ${resultType.subtitle}`}
            className="w-full aspect-[3/5] object-contain rounded-3xl shadow-[0_16px_36px_-6px_rgba(23,25,35,0.12)] border border-[#E4E2D8] bg-white block"
          />
        </div>
        <p className="text-[12px] text-[#64748B] mt-2.5 font-medium tracking-tight">
          화면을 터치하면 테스트 첫 화면으로 이동합니다
        </p>
      </div>

      {/* 💬 3. One Line Summary */}
      <div className="bg-white border-l-4 border-[#171923] rounded-2xl p-5 text-center shadow-xs border border-[#E4E2D8]/80">
        <p className="text-[15.5px] sm:text-[16.5px] font-medium text-[#171923] leading-snug tracking-[-0.01em]">
          &ldquo;{resultType.oneLineSummary}&rdquo;
        </p>
      </div>

      {/* 📝 4. Full Type Description */}
      <div className="bg-white rounded-2xl p-6 space-y-3 border border-[#E4E2D8] shadow-xs text-left">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] font-sans">
          유형 상세 설명
        </h2>
        <p className="text-[15px] sm:text-[16px] text-[#334155] leading-[1.7] break-keep font-normal tracking-[-0.01em]">
          {resultType.detailedDescription}
        </p>
      </div>

      {/* ❓ 5. Reflection Question */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 space-y-2.5 shadow-xs text-left">
        <div className="flex items-center gap-2 text-amber-950 font-bold text-[14.5px]">
          <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
            <MessageSquareQuote className="w-3.5 h-3.5" />
          </div>
          <span>생각해 볼 질문</span>
        </div>
        <p className="text-[15px] font-medium text-amber-950 leading-[1.6] pl-8 tracking-[-0.01em]">
          &ldquo;{resultType.reflectionQuestion}&rdquo;
        </p>
      </div>
    </a>
  );
};
export default SharedResultScreen;
