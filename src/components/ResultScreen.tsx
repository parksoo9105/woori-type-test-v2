import React, { useState } from 'react';
import { RotateCcw, Share2, HelpCircle, Sparkles, MessageSquareQuote, Download, Check, Copy } from 'lucide-react';
import { ResultTypeInfo, ScoreBreakdown } from '../types';
import { TypeIllustration } from './illustrations/TypeIllustration';
import { MetricVisualizer } from './MetricVisualizer';
import { COMMON_NOTICE, AI_DESCRIPTIONS } from '../data/results';
import { ShareModal } from './ShareModal';
import { toConnectionPercentage, toOpennessPercentage, toAIPercentage } from '../utils/scoring';
import { TYPE_URL_SLUGS, shareViaKakao, copyToClipboard, getShareUrl } from '../utils/share';

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
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const aiDescription = breakdown.aiOptionId
    ? AI_DESCRIPTIONS[breakdown.aiOptionId]
    : undefined;

  const slug = TYPE_URL_SLUGS[resultType.id] || 'type-01';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Result Card Direct PNG Download (woori-type-01.png ~ woori-type-04.png)
  const handleDownloadCard = () => {
    const filename = `woori-${slug}.png`;
    const link = document.createElement('a');
    link.href = `/${filename}`;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`결과 카드(${filename}) 다운로드를 시작했습니다.`);
  };

  // 2. Direct KakaoTalk Share
  const handleKakaoShare = () => {
    const res = shareViaKakao(resultType, breakdown);
    if (res.status === 'sent') {
      showToast('카카오톡 공유 창을 열었습니다.');
    } else {
      // If SDK needs config or encountered error, open the friendly Share Modal with link copy
      setIsShareModalOpen(true);
    }
  };

  // 3. Direct Link Copy (Copies https://woori-type-test-v2.vercel.app)
  const handleCopyLink = async () => {
    const shareUrl = getShareUrl(resultType, breakdown);
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      showToast('링크가 복사되었습니다.');
      setTimeout(() => setCopied(false), 2500);
    } else {
      setIsShareModalOpen(true);
    }
  };

  const pctC = toConnectionPercentage(breakdown.connectionScore);
  const pctO = toOpennessPercentage(breakdown.opennessScore);
  const pctAI = toAIPercentage(breakdown.aiScore ?? 1);

  return (
    <div className="flex flex-col min-h-screen max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn relative z-10 space-y-7 text-[#171923]">
      {/* 🌌 Ambient Editorial Blur Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 w-96 h-96 rounded-full bg-[#007CC3]/6 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -left-10 w-96 h-96 rounded-full bg-[#F08300]/6 blur-3xl -z-10"
      />

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
            className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#007CC3] text-white text-[13px] font-semibold hover:bg-[#0066A0] transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>나도 내 '우리' 유형 테스트하기 →</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          SECTION 01 — 나의 우리 유형
          ========================================================================= */}
      <section className="flex flex-col items-center text-center space-y-4">
        {/* Subtle Category Pill above card */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#E4E2D8] text-[#64748B] text-[11px] font-semibold tracking-widest uppercase shadow-2xs font-sans">
          <Sparkles className="w-3 h-3 text-[#007CC3]" />
          <span>YOUR RELATIONSHIP ARCHETYPE</span>
        </div>

        {/* Large Result Archetype Visual Card */}
        <div className="w-64 sm:w-72 transition-transform duration-300 hover:scale-[1.02]">
          <TypeIllustration typeId={resultType.id} />
        </div>

        {/* TYPE Number & Title & Subtitle */}
        <header className="space-y-2 pt-2">
          <span className="block text-[12px] font-bold text-[#64748B] tracking-[0.18em] uppercase font-mono">
            {resultType.typeTag}
          </span>
          <h1 className="font-serif text-[32px] sm:text-[38px] font-bold text-[#000000] tracking-[-0.02em] leading-tight break-keep">
            {resultType.title}
          </h1>
          <p className="font-serif text-[15px] sm:text-[16.5px] font-medium text-[#443E3B] tracking-[-0.01em]">
            {resultType.subtitle}
          </p>

          {/* 3 Metrics Badge Bar (Percentages) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 font-sans">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F08300]/10 border border-[#F08300]/30 text-[#B85D00] text-[12px] font-medium shadow-2xs">
              <span className="text-[#B85D00]">연결감:</span>
              <span className="font-bold">{pctC}%</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007CC3]/10 border border-[#007CC3]/30 text-[#005A8C] text-[12px] font-medium shadow-2xs">
              <span className="text-[#005A8C]">개방도:</span>
              <span className="font-bold">{pctO}%</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#443E3B]/10 border border-[#443E3B]/30 text-[#333333] text-[12px] font-medium shadow-2xs">
              <span className="text-[#555555]">AI 관계 인식:</span>
              <span className="font-bold">{pctAI}%</span>
            </span>
          </div>
        </header>

        {/* One Line Summary Card */}
        <div className="w-full bg-white border-l-4 border-[#007CC3] rounded-2xl p-5 text-center shadow-xs border border-[#E4E2D8]/80 mt-1">
          <p className="text-[15.5px] sm:text-[16.5px] font-medium text-[#171923] leading-snug tracking-[-0.01em] break-keep">
            &ldquo;{resultType.oneLineSummary}&rdquo;
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — 관계의 지표 (연결감 · 개방도 · AI 관계 인식)
          ========================================================================= */}
      <MetricVisualizer breakdown={breakdown} accentColor={resultType.accentColor} />

      {/* =========================================================================
          SECTION 03 — 나의 관계 방식 (상세 특성 및 AI 설명)
          ========================================================================= */}
      <section className="space-y-4">
        {/* 1. 관계를 맺는 방식 (유형 상세 설명) */}
        <div className="bg-white rounded-2xl p-6 space-y-3 border border-[#E4E2D8] shadow-xs text-left">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] font-sans">
            관계를 맺는 방식
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#334155] leading-[1.7] break-keep font-normal tracking-[-0.01em]">
            {resultType.detailedDescription}
          </p>
          {aiDescription && (
            <div className="pt-3 border-t border-[#E4E2D8]/70">
              <span className="text-[11.5px] font-bold text-[#007CC3] block mb-1">
                AI와의 관계적 관점
              </span>
              <p className="text-[14.5px] sm:text-[15.5px] text-[#334155] leading-[1.65] break-keep font-normal tracking-[-0.01em]">
                {aiDescription}
              </p>
            </div>
          )}
        </div>

        {/* 2. 연결감을 느끼는 순간과 이유 */}
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

        {/* 3. 관계에 대해 생각해 볼 질문 */}
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

      {/* ℹ️ Common Notice */}
      <div className="flex items-start gap-2.5 p-4 bg-white/70 rounded-2xl text-[12.5px] sm:text-[13px] text-[#64748B] leading-relaxed border border-[#E4E2D8] text-left">
        <HelpCircle className="w-4 h-4 text-[#94A3B8] flex-shrink-0 mt-0.5" />
        <p className="break-keep font-normal">{COMMON_NOTICE}</p>
      </div>

      {/* =========================================================================
          SECTION 04 — 액션 버튼들 (결과 카드 저장 · 카카오톡 공유 · 다시 테스트)
          ========================================================================= */}
      <div className="pt-2 space-y-3">
        {/* 1. 결과 카드 저장하기 (Download Card Image: woori-type-0X.png) */}
        <button
          onClick={handleDownloadCard}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 min-h-[52px] text-[15.5px] font-bold text-[#000000] bg-white hover:bg-[#F5F3EE] active:scale-[0.98] rounded-full border-2 border-[#007CC3] shadow-xs transition-all duration-200 tracking-tight cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#007CC3]" />
          <span>결과 카드 저장하기</span>
        </button>

        {/* 2. 카카오톡 공유하기 (Official Kakao JS SDK Feed Sharing) */}
        <button
          onClick={handleKakaoShare}
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 min-h-[52px] text-[15.5px] font-bold text-[#191919] bg-[#FEE500] hover:bg-[#FDD835] active:scale-[0.98] rounded-full shadow-xs transition-all duration-200 tracking-tight cursor-pointer"
        >
          <svg
            className="w-4 h-4 fill-current shrink-0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.85 1.86 5.37 4.67 6.78-.17.65-.68 2.51-.79 2.92-.13.51.19.5.39.37.16-.1 2.56-1.74 3.6-2.45.69.1 1.4.16 2.13.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
          </svg>
          <span>카카오톡으로 결과 공유하기</span>
        </button>

        {/* 3. 링크 복사하기 & 기타 공유 옵션 */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[46px] text-[14px] font-medium text-[#443E3B] bg-white hover:bg-[#F8F7F3] active:scale-[0.98] rounded-full border border-[#E4E2D8] shadow-2xs transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-800">링크가 복사되었습니다.</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#666666]" />
                <span>링크 복사하기</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[46px] text-[14px] font-medium text-[#443E3B] bg-white hover:bg-[#F8F7F3] active:scale-[0.98] rounded-full border border-[#E4E2D8] shadow-2xs transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#666666]" />
            <span>더 많은 공유 옵션</span>
          </button>
        </div>

        {/* 4. 다시 테스트하기 (Restart) */}
        <button
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 min-h-[52px] text-[16px] font-bold text-white bg-[#000000] hover:bg-[#222222] active:scale-[0.98] rounded-full shadow-md transition-all duration-200 tracking-tight cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>다시 테스트하기</span>
        </button>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#171923] text-white text-[13px] font-medium shadow-lg animate-fadeIn flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        resultType={resultType}
        breakdown={breakdown}
      />

      {/* Footer Branding */}
      <footer className="text-center py-4 text-[12px] text-[#94A3B8] font-normal font-sans">
        우리유형 테스트 · Collective Karma
      </footer>
    </div>
  );
};
