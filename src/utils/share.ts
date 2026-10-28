/**
 * Share utility functions and configurations for 〈우리 유형 테스트〉
 */

import { ResultTypeId, ResultTypeInfo, ScoreBreakdown } from '../types';

export const DEFAULT_PRODUCTION_URL = 'https://woori-type-test.vercel.app';
export const DEFAULT_KAKAO_JS_KEY = 'e61f671fbd50e670cc3b10c1f779d620';

export const TYPE_URL_SLUGS: Record<ResultTypeId, string> = {
  'type-1': 'type-01',
  'type-2': 'type-02',
  'type-3': 'type-03',
  'type-4': 'type-04',
};

export const SLUG_TO_TYPE_ID: Record<string, ResultTypeId> = {
  'type-01': 'type-1',
  'type-02': 'type-2',
  'type-03': 'type-3',
  'type-04': 'type-4',
  'type-1': 'type-1',
  'type-2': 'type-2',
  'type-3': 'type-3',
  'type-4': 'type-4',
  t1: 'type-1',
  t2: 'type-2',
  t3: 'type-3',
  t4: 'type-4',
};

export const SHARE_CONTENT = {
  title: '우리 유형 테스트',
  description:
    '우리는 어떤 방식으로 연결되고 있을까요?\n6개의 질문으로 알아보는 나의 ‘우리’ 유형.\n당신의 ‘우리’는 어떤 모습인가요?',
  summary: '우리는 어떤 방식으로 연결되고 있을까요? 6개의 질문으로 알아보는 나의 ‘우리’ 유형.',
};

/**
 * Returns the base root URL of the site.
 * - Never returns localhost or internal IPs (127.0.0.1, 0.0.0.0, etc.)
 */
export function getBaseUrl(): string {
  const envUrl = import.meta.env?.VITE_SITE_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname, protocol, origin } = window.location;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local') ||
      protocol === 'file:';

    if (!isLocal && origin) {
      return origin.replace(/\/+$/, '');
    }
  }

  return DEFAULT_PRODUCTION_URL;
}

/**
 * Returns the canonical URL for sharing.
 * If resultType is provided, returns the dedicated archetype URL: /result/t1, /result/t2, etc.
 * Otherwise returns the base start URL.
 */
export function getShareUrl(resultType?: ResultTypeInfo | ResultTypeId, _breakdown?: ScoreBreakdown): string {
  const base = getBaseUrl();
  if (resultType) {
    const typeId = typeof resultType === 'string' ? resultType : resultType.id;
    const slug = TYPE_URL_SLUGS[typeId] || 'type-01';
    return `${base}/result/${slug}`;
  }
  return base;
}

/**
 * Returns the absolute preview image URL for Open Graph / Kakao Feed sharing.
 * Returns the dedicated 1200x630px horizontal archetype card image for result pages.
 */
export function getShareImageUrl(resultType?: ResultTypeInfo | ResultTypeId): string {
  const baseUrl = getBaseUrl();
  if (resultType) {
    const typeId = typeof resultType === 'string' ? resultType : resultType.id;
    const slug = TYPE_URL_SLUGS[typeId] || 'type-01';
    return `${baseUrl}/share/share-${slug}.png?v=2`;
  }
  return `${baseUrl}/og-image.png?v=2`;
}

/**
 * Robust clipboard copy function.
 * Attempts modern navigator.clipboard first, and falls back to
 * document.execCommand('copy') with a temporary textarea for
 * older browsers, in-app webviews (KakaoTalk, Instagram), and insecure contexts.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // SecurityError / NotAllowedError, fall through to execCommand
    }
  }

  try {
    if (typeof document === 'undefined') return false;

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999);

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Clipboard copy fallback failed:', err);
    return false;
  }
}

/**
 * Checks whether native Web Share API (navigator.share) is supported.
 */
export function isNativeShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Shares via the native OS share sheet (mobile message, KakaoTalk, AirDrop, etc.).
 * Gracefully ignores AbortError when the user dismisses the sheet without sharing.
 */
export async function shareViaNative(
  resultType?: ResultTypeInfo,
  breakdown?: ScoreBreakdown
): Promise<'success' | 'cancelled' | 'unsupported' | 'failed'> {
  if (!isNativeShareSupported()) {
    return 'unsupported';
  }

  const shareUrl = getShareUrl(resultType, breakdown);
  const title = resultType
    ? `나의 '우리' 유형: ${resultType.title}`
    : SHARE_CONTENT.title;
  const text = resultType
    ? `[우리 유형 테스트]\n나의 '우리' 유형은 ${resultType.title}입니다.\n${resultType.oneLineSummary}\n\n🔗 결과 링크:\n${shareUrl}\n\n나의 결과를 확인하고, 당신의 '우리' 유형도 찾아보세요!`
    : SHARE_CONTENT.description;

  try {
    await navigator.share({
      title,
      text,
      url: shareUrl,
    });
    return 'success';
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return 'cancelled';
    }
    console.warn('Native Web Share encountered an issue:', error);
    return 'failed';
  }
}

/**
 * Initializes the Kakao JavaScript SDK if available on window and key is provided.
 */
export function initKakaoSDK(appKey?: string): boolean {
  if (typeof window === 'undefined') return false;
  const kakao = (window as any).Kakao;
  if (!kakao) return false;

  if (kakao.isInitialized()) return true;

  const keyToUse =
    appKey ||
    import.meta.env?.VITE_KAKAO_JS_KEY ||
    (window as any).KAKAO_JS_KEY ||
    DEFAULT_KAKAO_JS_KEY;

  if (keyToUse && typeof keyToUse === 'string' && keyToUse.trim().length > 0) {
    try {
      kakao.init(keyToUse.trim());
      return kakao.isInitialized();
    } catch (err) {
      console.warn('Failed to initialize Kakao SDK:', err);
      return false;
    }
  }

  return false;
}

/**
 * Shares test link via KakaoTalk.
 * - Always links directly to the sender's dedicated archetype result page (/result/tX).
 * - Button & Image link both open the dedicated URL.
 * - 1200x630 horizontal share image used for crystal clarity.
 */
export function shareViaKakao(
  resultType?: ResultTypeInfo,
  breakdown?: ScoreBreakdown
): {
  status: 'sent' | 'needs_config' | 'error';
  message?: string;
} {
  if (typeof window === 'undefined') {
    return { status: 'error', message: '브라우저 환경이 아닙니다.' };
  }

  const kakao = (window as any).Kakao;
  const isReady = kakao && (kakao.isInitialized() || initKakaoSDK());

  if (!isReady) {
    return {
      status: 'needs_config',
      message: '카카오 JavaScript SDK 키 설정이 필요합니다.',
    };
  }

  try {
    const baseUrl = getBaseUrl();
    const resultShareUrl = getShareUrl(resultType, breakdown);
    const targetUrl = resultType ? resultShareUrl : baseUrl;
    const shareImageUrl = getShareImageUrl(resultType);
    const imageWidth = 1200;
    const imageHeight = 630;

    const title = resultType
      ? `나의 '우리' 유형은 ${resultType.title}`
      : SHARE_CONTENT.title;

    const description = resultType
      ? resultType.oneLineSummary
      : SHARE_CONTENT.description;

    const buttons = resultType
      ? [
          {
            title: '결과 확인하기',
            link: {
              mobileWebUrl: targetUrl,
              webUrl: targetUrl,
            },
          },
          {
            title: '나도 테스트하기',
            link: {
              mobileWebUrl: `${baseUrl}/?fresh=1`,
              webUrl: `${baseUrl}/?fresh=1`,
            },
          },
        ]
      : [
          {
            title: '테스트 시작하기',
            link: {
              mobileWebUrl: `${baseUrl}/?fresh=1`,
              webUrl: `${baseUrl}/?fresh=1`,
            },
          },
        ];

    const payload: any = {
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl: shareImageUrl,
        imageWidth,
        imageHeight,
        link: {
          mobileWebUrl: targetUrl,
          webUrl: targetUrl,
        },
      },
      buttons,
    };

    kakao.Share.sendDefault(payload);

    return { status: 'sent' };
  } catch (err: any) {
    console.error('Kakao Share execution error:', err);
    return {
      status: 'error',
      message: err?.message || '카카오톡 공유 실행 중 오류가 발생했습니다.',
    };
  }
}
