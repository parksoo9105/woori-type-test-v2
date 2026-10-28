import React, { useState, useEffect, useRef, useCallback } from 'react';
import cardType1 from '../assets/cards/card-type-1.png';
import cardType2 from '../assets/cards/card-type-2.png';
import cardType3 from '../assets/cards/card-type-3.png';
import cardType4 from '../assets/cards/card-type-4.png';

interface AsymmetricCardGalleryProps {
  onCardClick?: (cardId: string) => void;
}

interface AsymmetricCardConfig {
  id: string;
  name: string;
  colorName: string;
  image: string;
  // Desktop Asymmetric Spatial Coordinates
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string; // e.g. '195px', '215px'
  baseZ: number; // Resting depth
  baseRotZ: number; // Subtle tilt angle
  baseRotY: number; // 3D Y-rotation
  parallaxMax: number; // 5px ~ 12px parallax range
  zIndex: number;
}

const CARDS: AsymmetricCardConfig[] = [
  {
    // 1. 첫 번째 카드: 왼쪽 위, 약간 뒤쪽
    id: 'type-1',
    name: '마주보며 연결되는 우리',
    colorName: '노랑',
    image: cardType1,
    top: '20px',
    left: '25px',
    width: '195px',
    baseZ: -16,
    baseRotZ: -3,
    baseRotY: 4,
    parallaxMax: 5, // 뒤쪽: 5px
    zIndex: 10,
  },
  {
    // 2. 두 번째 카드: 오른쪽 위, 조금 앞쪽
    id: 'type-2',
    name: '온라인으로 연결되는 우리',
    colorName: '분홍',
    image: cardType2,
    top: '5px',
    right: '35px',
    width: '205px',
    baseZ: 14,
    baseRotZ: 2.5,
    baseRotY: -3.5,
    parallaxMax: 8.5, // 중간 앞: 8.5px
    zIndex: 20,
  },
  {
    // 3. 세 번째 카드: 왼쪽 아래, 가장 앞쪽
    id: 'type-3',
    name: '새로운 만남에 열린 우리',
    colorName: '파랑',
    image: cardType3,
    bottom: '20px',
    left: '65px',
    width: '218px',
    baseZ: 36,
    baseRotZ: 1.5,
    baseRotY: -2,
    parallaxMax: 12, // 가장 앞쪽: 12px
    zIndex: 30,
  },
  {
    // 4. 네 번째 카드: 오른쪽 아래, 약간 뒤쪽
    id: 'type-4',
    name: '나만의 속도로 관계 맺는 우리',
    colorName: '보라',
    image: cardType4,
    bottom: '35px',
    right: '25px',
    width: '198px',
    baseZ: -10,
    baseRotZ: -2,
    baseRotY: 4.5,
    parallaxMax: 6, // 뒤쪽: 6px
    zIndex: 15,
  },
];

export const AsymmetricCardGallery: React.FC<AsymmetricCardGalleryProps> = ({
  onCardClick,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse normalized coordinates (-1 to 1)
  const targetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Smooth Lerp loop for subtle organic parallax
  useEffect(() => {
    if (prefersReducedMotion) return;

    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      // Damped lerp coefficient 0.08
      currentX += (targetPosRef.current.x - currentX) * 0.08;
      currentY += (targetPosRef.current.y - currentY) * 0.08;

      setSmoothPos({ x: currentX, y: currentY });
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [prefersReducedMotion]);

  // Track Mouse movement relative to container
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    targetPosRef.current = {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetPosRef.current = { x: 0, y: 0 };
    setHoveredId(null);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full select-none"
    >
      {/* ============================================================== */}
      {/* 🖥️ DESKTOP: Asymmetric 3D Floating Gallery (lg: and above)     */}
      {/* ============================================================== */}
      <div
        className="hidden lg:block relative w-full max-w-[620px] h-[540px] xl:h-[580px] mx-auto"
        style={{
          perspective: '1200px',
        }}
      >
        {/* Soft Ambient Space Glow Behind the Asymmetric Cluster */}
        <div
          className="absolute inset-0 m-auto w-[520px] h-[440px] rounded-[50%] filter blur-3xl pointer-events-none transition-transform duration-700 ease-out"
          style={{
            background:
              'radial-gradient(circle, rgba(224, 238, 255, 0.45) 0%, rgba(237, 233, 254, 0.35) 45%, rgba(247, 247, 242, 0.1) 75%, transparent 90%)',
            transform: `translate3d(${smoothPos.x * -12}px, ${smoothPos.y * -8}px, -30px)`,
          }}
        />

        {/* 4 Asymmetric Cards */}
        {CARDS.map((card) => {
          const isHovered = hoveredId === card.id;

          // Parallax calculation (5px ~ 12px differentiated by depth)
          const parallaxX = prefersReducedMotion ? 0 : smoothPos.x * card.parallaxMax;
          const parallaxY = prefersReducedMotion ? 0 : smoothPos.y * card.parallaxMax;

          // 3D Transform String
          let transformStr: string;
          if (isHovered) {
            // Hover: 1.06x scale, 20px forward lift (translateZ + 20px)
            transformStr = `translate3d(${parallaxX}px, ${
              parallaxY - 8
            }px, ${card.baseZ + 20}px) scale(1.06) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
          } else {
            // Default resting: subtle tilt and micro-parallax
            transformStr = `translate3d(${parallaxX}px, ${parallaxY}px, ${
              card.baseZ
            }px) rotateZ(${card.baseRotZ}deg) rotateY(${card.baseRotY}deg) scale(1)`;
          }

          const zIndexVal = isHovered ? 50 : card.zIndex;

          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredId(card.id)}
              onClick={() => onCardClick && onCardClick(card.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onCardClick && onCardClick(card.id);
                }
              }}
              className="absolute cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-[22px]"
              style={{
                top: card.top,
                bottom: card.bottom,
                left: card.left,
                right: card.right,
                width: card.width,
                zIndex: zIndexVal,
                transform: transformStr,
                transformStyle: 'preserve-3d',
                transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform, box-shadow',
              }}
            >
              {/* Card Physical Frame with Soft Shadow */}
              <div
                className={`relative w-full rounded-[22px] overflow-hidden transition-all duration-300 ${
                  isHovered
                    ? 'shadow-[0_24px_48px_-10px_rgba(15,23,42,0.22),0_12px_24px_-8px_rgba(15,23,42,0.12)] ring-1 ring-white/90'
                    : 'shadow-[0_12px_32px_-6px_rgba(15,23,42,0.11),0_4px_12px_-2px_rgba(15,23,42,0.05)]'
                }`}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* 🖼️ High-Res Character Artwork (Original Card Image, unmodified) */}
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-auto object-cover block select-none pointer-events-none rounded-[22px]"
                  loading="eager"
                  width="240"
                  height="426"
                />

                {/* Subtle Specular Sheen on Hover */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-[22px] transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(${
                      120 + smoothPos.x * 20
                    }deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 55%)`,
                    opacity: isHovered ? 0.65 : 0.2,
                  }}
                />
              </div>

              {/* Floating Type Name Pill (Appears clearly on Hover or stays elegantly grounded) */}
              <div
                className={`mt-2.5 px-3 py-1 rounded-full text-center text-[12.5px] font-medium tracking-tight transition-all duration-300 ${
                  isHovered
                    ? 'bg-[#0F172A] text-white shadow-md scale-105 opacity-100'
                    : 'bg-white/80 backdrop-blur-xs text-slate-700 border border-slate-200/60 shadow-xs opacity-90'
                }`}
              >
                <span>{card.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 📱 MOBILE: Staggered Asymmetric 2x2 Gallery (Below lg:)        */}
      {/* ============================================================== */}
      <div className="lg:hidden w-full max-w-[360px] sm:max-w-md mx-auto py-2">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 items-stretch">
          {CARDS.map((card, idx) => {
            const isHovered = hoveredId === card.id;

            return (
              <div
                key={card.id}
                onClick={() => onCardClick && onCardClick(card.id)}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCardClick && onCardClick(card.id);
                  }
                }}
                className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-2xl ${
                  idx === 0 ? '-rotate-1' : idx === 1 ? 'rotate-1 translate-y-2' : idx === 2 ? 'rotate-1' : '-rotate-1 translate-y-2'
                }`}
              >
                {/* Mobile Card Physical Frame */}
                <div
                  className={`w-full rounded-[20px] overflow-hidden transition-all duration-200 ${
                    isHovered
                      ? 'shadow-[0_18px_36px_-6px_rgba(15,23,42,0.18)] scale-105'
                      : 'shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)]'
                  } border border-slate-200/60 bg-white/70 backdrop-blur-xs`}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-auto object-contain block select-none pointer-events-none rounded-[20px]"
                    loading="eager"
                    width="240"
                    height="426"
                  />
                </div>

                {/* Mobile Type Caption */}
                <p className="mt-2 text-center text-[12px] sm:text-[13px] font-medium text-slate-800 tracking-tight leading-snug">
                  {card.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
