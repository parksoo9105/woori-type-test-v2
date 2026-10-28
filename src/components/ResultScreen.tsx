import React, { useState } from 'react';
import { RotateCcw, Share2, HelpCircle, Sparkles, MessageSquareQuote, Download } from 'lucide-react';
import { ResultTypeInfo, ScoreBreakdown } from '../types';
import { TypeIllustration } from './illustrations/TypeIllustration';
import { MetricVisualizer } from './MetricVisualizer';
import { COMMON_NOTICE, AI_DESCRIPTIONS } from '../data/results';
import { ShareModal } from './ShareModal';
import { toConnectionPercentage, toOpennessPercentage, toAIPercentage } from '../utils/scoring';

interface ResultScreenProps {
  resultType: ResultTypeInfo;
  breakdown: ScoreBreakdown;
  onRestart: () => void;
  isSharedView?: boolean;
  verificationToken?: string;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  resultType,
  breakdown,
  onRestart,
  isSharedView = false,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const aiDescription = breakdown.aiOptionId
    ? AI_DESCRIPTIONS[breakdown.aiOptionId]
    : undefined;

  const handleDownloadCard = () => {
    const link = document.createElement('a');
    link.href = `/cards/card-${resultType.id}.png`;
    link.download = `우리유형_${resultType.title.replace(/\s+/g, '_')}_카드.png`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pctC = toConnectionPercentage(breakdown.connectionScore);
  const pctO = toOpennessPercentage(breakdown.opennessScore);
  const pctAI = toAIPercentage(breakdown.aiScore ?? 1);

  return (
    <div className="flex flex-col min-h-screen max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn relative z-10 space-y-7 text-[#171923]">
      
      {/* 🌟 Shared Result Welcome Banner */}
      {isSharedView && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 text-center space-y-2 animate-fadeIn shadow-xs">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <p className="text-xs sm:text-sm font-bold text-amber-950">친구가 공유한 테스트 결과입니다</p>
          </div>
          <p className="text-[12px] text-amber-800 leading-relaxed">
            나는 어떤 ‘우리’에 속해 있을까요? 질문을 통해 지금 나의 ‘우리’를 발견해 보세요.
          </p>
          <button
            onClick={onRestart}
            className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171923] text-white text-[13px] font-semibold hover:bg-black transition-all shadow-sm active:scale-95"
          >
            <span>나도 내 '우리' 유형 테스트하기 →</span>
          </button>
        </div>
      )}
      
      {/* 🎴 1. Large Type Card with Asset */}
      <div className="flex flex-col items-center">
        {/* Subtle Category Pill above card */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#E4E2D8] text-[#64748B] text-[11px] font-semibold mb-6 tracking-wider uppercase shadow-2xs font-sans">
          <Sparkles className="w-3 h-3 text-[#171923]" />
          <span>YOUR RELATIONSHIP ARCHETYPE</span>
        </div>

        {/* Responsive Type Card Container */}
        <div className="w-64 sm:w-72 transition-transform duration-300 hover:scale-[1.02]">
          <TypeIllustration typeId={resultType.id} />
        </div>
      </div>

      {/* 🏷️ 2. Result Type Name & Score Badges */}
      <header className="text-center space-y-3 pt-1">
        <span className="block text-[11.5px] font-bold text-[#64748B] tracking-[0.16em] uppercase font-sans">
          {resultType.typeTag}
        </span>
        <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#171923] tracking-[-0.03em] leading-tight">
          {resultType.title}
        </h1>

        {/* 3 Metrics Badge Bar (Percentages Only) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-sans">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-[12px] font-medium shadow-2xs">
            <span className="text-rose-700">연결감:</span>
            <span className="font-bold">{pctC}%</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-[12px] font-medium shadow-2xs">
            <span className="text-emerald-700">개방도:</span>
            <span className="font-bold">{pctO}%</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-[12px] font-medium shadow-2xs">
            <span className="text-blue-700">AI 관계 인식:</span>
            <span className="font-bold">{pctAI}%</span>
          </span>
        </div>
      </header>

      {/* 💬 3. One Line Summary */}
      <div className="bg-white border-l-4 border-[#171923] rounded-2xl p-5 text-center shadow-xs border border-[#E4E2D8]/80">
        <p className="text-[15.5px] sm:text-[16.5px] font-medium text-[#171923] leading-snug tracking-[-0.01em]">
          &ldquo;{resultType.oneLineSummary}&rdquo;
        </p>
      </div>

      {/* 📝 4. Detailed Description Card with AI description below it */}
      <div className="bg-white rounded-2xl p-6 space-y-4 border border-[#E4E2D8] shadow-xs text-left">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] font-sans">
          유형 상세 설명
        </h2>
        <p className="text-[15px] sm:text-[16px] text-[#334155] leading-[1.7] break-keep font-normal tracking-[-0.01em]">
          {resultType.detailedDescription}
        </p>
        {aiDescription && (
          <p className="text-[15px] sm:text-[16px] text-[#334155] leading-[1.7] break-keep font-normal tracking-[-0.01em] pt-3 border-t border-[#E4E2D8]/60">
            {aiDescription}
          </p>
        )}
      </div>

      {/* 📊 5. Metric Matrix Visualization */}
      <MetricVisualizer breakdown={breakdown} accentColor={resultType.accentColor} />

      {/* 💡 6. Reason Card */}
      <div className="bg-white rounded-2xl p-6 space-y-2.5 border border-[#E4E2D8] shadow-xs text-left">
        <div className="flex items-center gap-2 text-[#171923] font-bold text-[14.5px]">
          <div className="w-6 h-6 rounded-lg bg-[#F8F7F3] flex items-center justify-center text-[#171923]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>이 유형이 나온 이유</span>
        </div>
        <p className="text-[14.5px] text-[#475569] leading-[1.65] break-keep pl-8 font-normal tracking-[-0.01em]">
          {resultType.reason}
        </p>
      </div>

      {/* ❓ 7. Reflection Question Card */}
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

      {/* ℹ️ Common Notice */}
      <div className="flex items-start gap-2.5 p-4 bg-white/70 rounded-2xl text-[12.5px] sm:text-[13px] text-[#64748B] leading-relaxed border border-[#E4E2D8] text-left">
        <HelpCircle className="w-4 h-4 text-[#94A3B8] flex-shrink-0 mt-0.5" />
        <p className="break-keep font-normal">{COMMON_NOTICE}</p>
      </div>

      {/* 🚀 9. Action Buttons */}
      <div className="pt-2 space-y-3">
        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 min-h-[52px] text-[16px] font-semibold text-white bg-[#171923] hover:bg-[#252836] active:scale-[0.98] rounded-full shadow-md hover:shadow-lg transition-all duration-200 tracking-tight"
        >
          <RotateCcw className="w-4 h-4" />
          <span>다시 테스트하기</span>
        </button>

        {/* Download Card Image Button */}
        <button
          onClick={handleDownloadCard}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] text-[14.5px] font-medium text-[#171923] bg-white hover:bg-[#F8F7F3] active:scale-[0.98] rounded-full border border-[#E4E2D8] shadow-xs transition-all duration-200 tracking-tight"
        >
          <Download className="w-4 h-4 text-[#64748B]" />
          <span>내 유형 카드 이미지 저장하기</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] text-[13.5px] font-medium text-[#64748B] hover:text-[#171923] active:scale-[0.99] transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>나의 결과 공유하기</span>
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        resultType={resultType}
        breakdown={breakdown}
      />

      {/* Footer Branding */}
      <footer className="text-center py-4 text-[12px] text-[#94A3B8] font-normal font-sans">
        우리 유형 테스트 · Collective Karma
      </footer>
    </div>
  );
};
