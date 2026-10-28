import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareModal } from './ShareModal';
import * as shareUtils from '../utils/share';

describe('ShareModal Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('isOpen이 false일 때는 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<ShareModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('isOpen이 true일 때 모달 타이틀과 공유 옵션들이 렌더링된다', () => {
    render(<ShareModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('테스트 링크 공유하기')).toBeInTheDocument();
    expect(screen.getByText('우리 유형 테스트')).toBeInTheDocument();
    expect(screen.getByText('카카오톡으로 공유')).toBeInTheDocument();
    expect(screen.getByText(/링크 복사하기/i)).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose 콜백이 호출된다', () => {
    const handleClose = vi.fn();
    render(<ShareModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByRole('button', { name: '닫기' });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('ESC 키 입력 시 onClose 콜백이 호출된다', () => {
    const handleClose = vi.fn();
    render(<ShareModal isOpen={true} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('링크 복사 클릭 시 copyToClipboard가 호출되고 성공 메시지가 표시된다', async () => {
    vi.spyOn(shareUtils, 'copyToClipboard').mockResolvedValue(true);

    render(<ShareModal isOpen={true} onClose={vi.fn()} />);

    const copyBtn = screen.getByText(/링크 복사하기/i);
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByText('링크가 복사되었습니다!')).toBeInTheDocument();
    });
  });

  it('카카오 키가 없을 때 안내 문구가 나타난다', async () => {
    vi.spyOn(shareUtils, 'shareViaKakao').mockReturnValue({
      status: 'needs_config',
      message: '카카오 키 필요',
    });
    vi.spyOn(shareUtils, 'isNativeShareSupported').mockReturnValue(false);

    render(<ShareModal isOpen={true} onClose={vi.fn()} />);

    const kakaoBtn = screen.getByText('카카오톡으로 공유');
    fireEvent.click(kakaoBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/카카오톡 공식 공유를 활성화하려면 Kakao Developers의 JavaScript 키 등록이 필요합니다/i)
      ).toBeInTheDocument();
    });
  });
});
