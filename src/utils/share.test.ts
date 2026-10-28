import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getShareUrl,
  getShareImageUrl,
  copyToClipboard,
  shareViaNative,
  shareViaKakao,
  initKakaoSDK,
  DEFAULT_PRODUCTION_URL,
  SHARE_CONTENT,
} from './share';

describe('Share Utilities (src/utils/share.ts)', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  describe('getShareUrl', () => {
    it('로컬호스트(localhost) 환경에서는 기본 배포 주소를 반환하여 로컬 주소를 공유하지 않는다', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'localhost',
          origin: 'http://localhost:3000',
          protocol: 'http:',
        },
        writable: true,
      });

      const url = getShareUrl();
      expect(url).toBe(DEFAULT_PRODUCTION_URL);
      expect(url).not.toContain('localhost');
    });

    it('127.0.0.1 환경에서도 기본 배포 주소를 반환한다', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: '127.0.0.1',
          origin: 'http://127.0.0.1:5173',
          protocol: 'http:',
        },
        writable: true,
      });

      const url = getShareUrl();
      expect(url).toBe(DEFAULT_PRODUCTION_URL);
    });

    it('실제 배포 도메인 환경에서는 해당 도메인의 origin을 반환한다', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'collective-karma.org',
          origin: 'https://collective-karma.org',
          protocol: 'https:',
        },
        writable: true,
      });

      const url = getShareUrl();
      expect(url).toBe('https://collective-karma.org');
    });

    it('resultType이 전달되면 해당 유형의 고유 주소(/result/type-01, /result/type-02 등)를 반환한다', () => {
      expect(getShareUrl({ id: 'type-1' } as any)).toBe(`${DEFAULT_PRODUCTION_URL}/result/type-01`);
      expect(getShareUrl({ id: 'type-2' } as any)).toBe(`${DEFAULT_PRODUCTION_URL}/result/type-02`);
      expect(getShareUrl({ id: 'type-3' } as any)).toBe(`${DEFAULT_PRODUCTION_URL}/result/type-03`);
      expect(getShareUrl({ id: 'type-4' } as any)).toBe(`${DEFAULT_PRODUCTION_URL}/result/type-04`);
    });
  });

  describe('getShareImageUrl', () => {
    it('배포 URL을 기준으로 /og-image.png?v=2 절대 경로를 반환한다', () => {
      const imgUrl = getShareImageUrl();
      expect(imgUrl).toBe(`${DEFAULT_PRODUCTION_URL}/og-image.png?v=2`);
    });

    it('resultType이 전달되면 해당 유형의 1200x630 공유용 이미지(/share/share-type-XX.png?v=2) 절대 경로를 반환한다', () => {
      expect(getShareImageUrl({ id: 'type-1' } as any)).toBe(`${DEFAULT_PRODUCTION_URL}/share/share-type-01.png?v=2`);
      expect(getShareImageUrl({ id: 'type-2' } as any)).toBe(`${DEFAULT_PRODUCTION_URL}/share/share-type-02.png?v=2`);
      expect(getShareImageUrl({ id: 'type-3' } as any)).toBe(`${DEFAULT_PRODUCTION_URL}/share/share-type-03.png?v=2`);
      expect(getShareImageUrl({ id: 'type-4' } as any)).toBe(`${DEFAULT_PRODUCTION_URL}/share/share-type-04.png?v=2`);
    });
  });

  describe('copyToClipboard', () => {
    it('navigator.clipboard.writeText가 존재할 때 정상 복사한다', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        configurable: true,
      });

      const result = await copyToClipboard('https://test.url');
      expect(result).toBe(true);
      expect(writeTextMock).toHaveBeenCalledWith('https://test.url');
    });

    it('navigator.clipboard가 실패할 경우 execCommand 대체 방식으로 복사한다', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
        },
        configurable: true,
      });

      document.execCommand = vi.fn().mockReturnValue(true);

      const result = await copyToClipboard('https://test.url');
      expect(result).toBe(true);
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });

  describe('shareViaNative', () => {
    it('navigator.share 지원 시 올바른 제목, 설명, URL로 공유를 호출한다', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        configurable: true,
      });

      const result = await shareViaNative();
      expect(result).toBe('success');
      expect(shareMock).toHaveBeenCalledWith({
        title: SHARE_CONTENT.title,
        text: SHARE_CONTENT.description,
        url: getShareUrl(),
      });
    });

    it('사용자가 공유 창을 취소(AbortError)했을 때 에러를 발생시키지 않고 cancelled 상태를 반환한다', async () => {
      const abortError = new Error('Share canceled');
      abortError.name = 'AbortError';
      const shareMock = vi.fn().mockRejectedValue(abortError);

      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        configurable: true,
      });

      const result = await shareViaNative();
      expect(result).toBe('cancelled');
    });
  });

  describe('shareViaKakao & initKakaoSDK', () => {
    it('initKakaoSDK는 Kakao 객체가 없으면 false를 반환한다', () => {
      (window as any).Kakao = undefined;
      expect(initKakaoSDK()).toBe(false);
    });

    it('카카오 SDK가 초기화되지 않았을 때 needs_config 상태를 반환한다', () => {
      (window as any).Kakao = undefined;
      const result = shareViaKakao();
      expect(result.status).toBe('needs_config');
    });

    it('카카오 SDK가 초기화되어 있을 때 sendDefault를 호출한다', () => {
      const sendDefaultMock = vi.fn();
      (window as any).Kakao = {
        isInitialized: () => true,
        Share: {
          sendDefault: sendDefaultMock,
        },
      };

      const result = shareViaKakao();
      expect(result.status).toBe('sent');
      expect(sendDefaultMock).toHaveBeenCalledWith(
        expect.objectContaining({
          objectType: 'feed',
          content: expect.objectContaining({
            title: SHARE_CONTENT.title,
          }),
        })
      );
    });

    it('유형 결과가 전달되면 1200x630 이미지와 /result/type-02 주소로 카카오톡 공유를 호출하며, "결과 확인하기" 버튼을 포함한다', () => {
      const sendDefaultMock = vi.fn();
      (window as any).Kakao = {
        isInitialized: () => true,
        Share: {
          sendDefault: sendDefaultMock,
        },
      };

      const mockType = {
        id: 'type-2',
        title: '연결망의 항해자',
        subtitle: '새로운 사람과 생각에 열린 우리',
        oneLineSummary: '새로운 사람과 생각에 열린 태도로 다가가며 다양한 관계의 가능성을 탐색하는 유형',
      } as any;

      const result = shareViaKakao(mockType);
      expect(result.status).toBe('sent');
      expect(sendDefaultMock).toHaveBeenCalledWith({
        objectType: 'feed',
        content: {
          title: "나의 '우리' 유형은 연결망의 항해자",
          description: "새로운 사람과 생각에 열린 태도로 다가가며 다양한 관계의 가능성을 탐색하는 유형",
          imageUrl: `${DEFAULT_PRODUCTION_URL}/share/share-type-02.png?v=2`,
          imageWidth: 1200,
          imageHeight: 630,
          link: {
            mobileWebUrl: `${DEFAULT_PRODUCTION_URL}/result/type-02`,
            webUrl: `${DEFAULT_PRODUCTION_URL}/result/type-02`,
          },
        },
        buttons: [
          {
            title: '결과 확인하기',
            link: {
              mobileWebUrl: `${DEFAULT_PRODUCTION_URL}/result/type-02`,
              webUrl: `${DEFAULT_PRODUCTION_URL}/result/type-02`,
            },
          },
          {
            title: '나도 테스트하기',
            link: {
              mobileWebUrl: `${DEFAULT_PRODUCTION_URL}/?fresh=1`,
              webUrl: `${DEFAULT_PRODUCTION_URL}/?fresh=1`,
            },
          },
        ],
      });
    });
  });
});
