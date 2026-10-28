import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Copy, Share2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import {
  getShareUrl,
  copyToClipboard,
  shareViaNative,
  shareViaKakao,
  isNativeShareSupported,
  SHARE_CONTENT,
} from '../utils/share';
import { ResultTypeInfo, ScoreBreakdown } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultType?: ResultTypeInfo;
  breakdown?: ScoreBreakdown;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  resultType,
  breakdown,
}) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [kakaoGuide, setKakaoGuide] = useState<string | null>(null);

  // Swipe / Drag down to close state for mobile
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);

  const shareUrl = getShareUrl(resultType, breakdown);
  const hasNativeShare = isNativeShareSupported();

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setKakaoGuide(null);
      setToastMessage(null);
      setDragOffsetY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      showToast(
        resultType
          ? '내 결과 링크가 복사되었습니다! 친구에게 전달해 보세요.'
          : '링크가 복사되었습니다. 원하는 곳에 붙여넣어 공유해 보세요.'
      );
      setTimeout(() => setCopied(false), 2500);
    } else {
      showToast('링크 복사에 실패했습니다. 주소를 직접 복사해 주세요.');
    }
  };

  const handleKakaoShare = async () => {
    const result = shareViaKakao(resultType, breakdown);

    if (result.status === 'sent') {
      showToast('카카오톡 공유 창을 열었습니다.');
      return;
    }

    if (result.status === 'needs_config') {
      if (hasNativeShare) {
        const nativeResult = await shareViaNative(resultType, breakdown);
        if (nativeResult === 'success') {
          showToast('공유가 완료되었습니다.');
        }
        return;
      }

      setKakaoGuide(
        '카카오톡 공식 공유를 활성화하려면 Kakao Developers의 JavaScript 키 등록이 필요합니다. 지금은 아래 [링크 복사]를 눌러 카카오톡 대화방에 바로 붙여넣으실 수 있습니다.'
      );
    } else if (result.status === 'error') {
      setKakaoGuide(result.message || '카카오톡 공유를 실행할 수 없습니다.');
    }
  };

  const handleNativeShare = async () => {
    const result = await shareViaNative(resultType, breakdown);
    if (result === 'success') {
      showToast('공유가 완료되었습니다.');
    } else if (result === 'cancelled') {
      // User cancelled share dialog - perfectly normal, no error
    } else if (result === 'unsupported' || result === 'failed') {
      await handleCopyLink();
    }
  };

  // Touch drag handlers for mobile pull-to-close / swipe-down
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff > 0) {
      setDragOffsetY(diff);
    } else {
      setDragOffsetY(diff * 0.15); // Slight upward resistance
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffsetY > 80) {
      onClose();
      setDragOffsetY(0);
    } else {
      setDragOffsetY(0);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-[#FDFCF7] border-t sm:border border-[#E4E2D8] rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 pb-8 sm:pb-7 shadow-2xl relative animate-slideUp sm:animate-scaleUp max-h-[90vh] overflow-y-auto overscroll-contain transition-transform"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translateY(${Math.max(0, dragOffsetY)}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Mobile Swipe / Drag Handle Bar */}
        <div
          className="w-full flex flex-col items-center justify-center pt-0 pb-3 cursor-grab active:cursor-grabbing sm:hidden touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-[#CBD5E1] rounded-full hover:bg-[#94A3B8] transition-colors" />
          <span className="text-[10px] text-[#94A3B8] font-medium mt-1">아래로 끌어내려 닫기</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#171923] hover:bg-black/5 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-5">
          <span className="text-[11px] font-bold text-[#64748B] tracking-[0.16em] uppercase font-sans">
            {resultType ? 'SHARE RESULT' : 'SHARE TEST'}
          </span>
          <h3 id="share-modal-title" className="text-xl font-bold text-[#171923] tracking-tight">
            {resultType ? '나의 결과 공유하기' : '테스트 링크 공유하기'}
          </h3>
          <p className="text-[13px] text-[#64748B] leading-relaxed">
            {resultType
              ? `내 결과(${resultType.title})를 친구에게 공유하고 친구의 '우리' 유형도 확인해 보세요.`
              : '친구와 동료들에게 테스트를 공유하고 서로의 연결 방식을 비교해 보세요.'}
          </p>
        </div>

        {/* Preview Card */}
        <div className="bg-white/80 border border-[#E4E2D8] rounded-2xl p-4 mb-5 space-y-2">
          {resultType ? (
            <div className="flex items-start gap-3.5">
              {/* Card Image Thumbnail */}
              <div className="w-16 aspect-[3/5] rounded-xl overflow-hidden shrink-0 border border-[#E4E2D8] shadow-xs bg-[#F8F7F3]">
                <img
                  src={`/cards/card-${resultType.id}.png`}
                  alt={resultType.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Card Details */}
              <div className="flex-1 min-w-0 space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-[#171923] truncate">{resultType.title}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full shrink-0">
                    결과 직행
                  </span>
                </div>
                <p className="text-[11.5px] font-medium text-[#171923]">
                  {resultType.subtitle}
                </p>
                <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                  &ldquo;{resultType.oneLineSummary}&rdquo;
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#171923]">{SHARE_CONTENT.title}</span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                  시작 페이지 연결
                </span>
              </div>
              <p className="text-[11.5px] text-[#64748B] leading-relaxed">
                {SHARE_CONTENT.summary}
              </p>
            </>
          )}

          <div className="mt-2.5 pt-2 border-t border-[#E4E2D8]/80 space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              {resultType ? '🔗 공유 연동 주소' : '🔗 테스트 시작 주소'}
            </span>
            <div className="p-2 rounded-xl bg-[#F8F7F3] border border-[#E4E2D8] text-[11px] text-[#334155] font-mono break-all select-all flex items-start gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{shareUrl}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* 1. KakaoTalk Share Button */}
          <button
            onClick={handleKakaoShare}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] active:scale-[0.99] text-[#191919] font-bold text-[14px] transition-all shadow-xs cursor-pointer"
          >
            <svg
              className="w-4 h-4 fill-current shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.85 1.86 5.37 4.67 6.78-.17.65-.68 2.51-.79 2.92-.13.51.19.5.39.37.16-.1 2.56-1.74 3.6-2.45.69.1 1.4.16 2.13.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
            </svg>
            <span>카카오톡으로 공유</span>
          </button>

          {/* 2. Native Share (Messages, other installed apps on Mobile) */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-[#171923] hover:bg-black active:scale-[0.99] text-white font-medium text-[13.5px] transition-all shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span>메시지 및 기타 앱으로 공유</span>
            </button>
          )}

          {/* 3. Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl border font-medium text-[13.5px] transition-all active:scale-[0.99] cursor-pointer ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white hover:bg-slate-50 border-[#E4E2D8] text-[#171923]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-800">링크가 복사되었습니다!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#64748B] shrink-0" />
                <span>링크 복사하기</span>
              </>
            )}
          </button>
        </div>

        {/* Kakao Setup Guidance Notice (only shown when needed) */}
        {kakaoGuide && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-[11.5px] text-amber-900 leading-relaxed animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p>{kakaoGuide}</p>
              <button
                onClick={handleCopyLink}
                className="mt-1.5 font-bold underline hover:text-amber-950 inline-flex items-center gap-1 cursor-pointer"
              >
                지금 링크 복사하기 →
              </button>
            </div>
          </div>
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="mt-4 p-2.5 rounded-xl bg-slate-900 text-white text-[12px] text-center font-medium shadow-md animate-fadeIn">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
