import React, { useState, useEffect, useRef, useCallback } from 'react';
import cardType1 from '../assets/cards/card-type-1.png';
import cardType2 from '../assets/cards/card-type-2.png';
import cardType3 from '../assets/cards/card-type-3.png';
import cardType4 from '../assets/cards/card-type-4.png';

interface SpatialCardStageProps {
  onStart: () => void;
  onCardClick?: (cardId: string) => void;
}

interface CardMeta {
  id: string;
  name: string;
  typeNumber: string;
  colorName: string;
  accentHex: string;
  image: string;
  // Spatial resting configuration
  desktopX: number; // px offset from center
  desktopY: number;
  desktopZ: number;
  desktopRotY: number; // degrees
  desktopRotZ: number; // degrees
  parallaxMultiplier: number;
}

const CARDS: CardMeta[] = [
  {
    id: 'type-1',
    name: '마주보며 연결되는 우리',
    typeNumber: '01',
    colorName: '노랑',
    accentHex: '#EAB308',
    image: cardType1,
    desktopX: -260,
    desktopY: 10,
    desktopZ: -24,
    desktopRotY: 10,
    desktopRotZ: -3.5,
    parallaxMultiplier: 1.1,
  },
  {
    id: 'type-2',
    name: '온라인으로 연결되는 우리',
    typeNumber: '02',
    colorName: '분홍',
    accentHex: '#EC4899',
    image: cardType2,
    desktopX: -88,
    desktopY: -8,
    desktopZ: 14,
    desktopRotY: 3,
    desktopRotZ: -1,
    parallaxMultiplier: 1.5,
  },
  {
    id: 'type-3',
    name: '새로운 만남에 열린 우리',
    typeNumber: '03',
    colorName: '파랑',
    accentHex: '#38BDF8',
    image: cardType3,
    desktopX: 88,
    desktopY: -8,
    desktopZ: 14,
    desktopRotY: -3,
    desktopRotZ: 1,
    parallaxMultiplier: 1.5,
  },
  {
    id: 'type-4',
    name: '나만의 속도로 관계 맺는 우리',
    typeNumber: '04',
    colorName: '보라',
    accentHex: '#A855F7',
    image: cardType4,
    desktopX: 260,
    desktopY: 10,
    desktopZ: -24,
    desktopRotY: -10,
    desktopRotZ: 3.5,
    parallaxMultiplier: 1.1,
  },
];

export const SpatialCardStage: React.FC<SpatialCardStageProps> = ({
  onStart,
  onCardClick,
}) => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Raw mouse coordinates (-1 to +1)
  const targetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // Damped/interpolated coordinates for organic fluidity
  const [smoothPos, setSmoothPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Smooth Lerp loop for cinematic Houmahani parallax
  useEffect(() => {
    if (prefersReducedMotion) return;

    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      // Lerp coefficient: 0.08 produces silky, premium inertia
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

  // Mouse Move Handler on the Stage Viewport
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
    setHoveredCardId(null);
  }, []);

  const handleCardPress = (cardId: string) => {
    setActiveCardId(cardId);
    if (onCardClick) {
      onCardClick(cardId);
    } else {
      onStart();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full select-none py-2"
    >
      {/* ============================================================== */}
      {/* 🖥️ DESKTOP: Houmahani 3D Spatial Parallax Stage (md: and above) */}
      {/* ============================================================== */}
      <div
        className="hidden md:flex relative w-full max-w-4xl h-[400px] mx-auto items-center justify-center"
        style={{
          perspective: '1400px',
        }}
      >
        {/* Soft Ambient Light Halo beneath the cards */}
        <div
          className="absolute w-[680px] h-[240px] rounded-[50%] filter blur-3xl pointer-events-none transition-transform duration-700 ease-out"
          style={{
            background:
              'radial-gradient(circle, rgba(254, 240, 138, 0.22) 0%, rgba(224, 231, 255, 0.28) 45%, rgba(251, 207, 232, 0.18) 70%, transparent 85%)',
            transform: `translate3d(${smoothPos.x * -25}px, ${smoothPos.y * -15}px, -40px) scale(${
              hoveredCardId ? 1.08 : 1
            })`,
          }}
        />

        {/* 3D Transform Scene Node (Entire camera tilt) */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: prefersReducedMotion
              ? 'none'
              : `rotateX(${smoothPos.y * -5.5}deg) rotateY(${smoothPos.x * 7.5}deg)`,
          }}
        >
          {CARDS.map((card) => {
            const isHovered = hoveredCardId === card.id;
            const isAnyHovered = hoveredCardId !== null;

            // Parallax offset based on depth layer
            const parallaxX = smoothPos.x * 20 * card.parallaxMultiplier;
            const parallaxY = smoothPos.y * 14 * card.parallaxMultiplier;

            // Final 3D Transformation
            let transformStr: string;
            if (isHovered) {
              // Hovered: Steps forward toward camera, centers rotation, scales smoothly
              transformStr = `translate3d(${card.desktopX + parallaxX}px, ${
                card.desktopY - 18
              }px, 60px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.08)`;
            } else if (isAnyHovered) {
              // Unhovered when a peer is hovered: calm receding state
              transformStr = `translate3d(${card.desktopX + parallaxX * 0.7}px, ${
                card.desktopY
              }px, ${card.desktopZ - 10}px) rotateY(${card.desktopRotY}deg) rotateZ(${
                card.desktopRotZ
              }deg) scale(0.96)`;
            } else {
              // Default resting spatial pose with parallax shift
              transformStr = `translate3d(${card.desktopX + parallaxX}px, ${
                card.desktopY + parallaxY
              }px, ${card.desktopZ}px) rotateY(${
                card.desktopRotY + smoothPos.x * 3
              }deg) rotateZ(${card.desktopRotZ}deg) scale(1)`;
            }

            const zIndexVal = isHovered ? 50 : isAnyHovered ? 10 : 20 + Math.round(card.desktopZ);

            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onClick={() => handleCardPress(card.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardPress(card.id);
                  }
                }}
                className="absolute cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-[22px]"
                style={{
                  transform: transformStr,
                  zIndex: zIndexVal,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease-out',
                  opacity: isAnyHovered && !isHovered ? 0.65 : 1,
                  willChange: 'transform, opacity',
                }}
              >
                {/* 🎴 Card Physical Object Frame */}
                <div
                  className={`relative w-[172px] rounded-[22px] overflow-hidden transition-all duration-300 ${
                    isHovered
                      ? 'shadow-[0_28px_50px_-10px_rgba(15,23,42,0.22),0_12px_24px_-8px_rgba(15,23,42,0.12)] ring-1 ring-white/80'
                      : 'shadow-[0_12px_32px_-6px_rgba(15,23,42,0.1)]'
                  }`}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* High-Resolution Artwork Image */}
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-auto object-cover block select-none pointer-events-none rounded-[22px]"
                    loading="eager"
                    width="240"
                    height="426"
                  />

                  {/* Specular Light Reflection Sheen (Houmahani signature) */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[22px] transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(${
                        115 + smoothPos.x * 25
                      }deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.15) 100%)`,
                      opacity: isHovered ? 0.7 : 0.25,
                    }}
                  />
                </div>

                {/* Card Floating Type Caption Pill */}
                <div
                  className={`mt-2.5 px-3 py-1 rounded-full text-center text-[12.5px] font-medium tracking-tight transition-all duration-300 ${
                    isHovered
                      ? 'bg-slate-900 text-white shadow-md scale-105'
                      : 'bg-white/80 backdrop-blur-xs text-slate-700 border border-slate-200/60 shadow-xs'
                  }`}
                >
                  <span>{card.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 📱 MOBILE: Tactile 2x2 Spatial Grid Layout (Below md:)        */}
      {/* ============================================================== */}
      <div className="md:hidden w-full max-w-[340px] sm:max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 items-stretch">
          {CARDS.map((card) => {
            const isActive = activeCardId === card.id;

            return (
              <div
                key={card.id}
                onClick={() => handleCardPress(card.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardPress(card.id);
                  }
                }}
                className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-2xl ${
                  isActive ? 'scale-98' : ''
                }`}
              >
                {/* Mobile Card Physical Frame */}
                <div className="w-full rounded-[20px] overflow-hidden shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] border border-slate-200/60 bg-white/60 backdrop-blur-xs">
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
                <p className="mt-2 text-center text-[12.5px] sm:text-[13.5px] font-medium text-slate-800 tracking-tight leading-snug">
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
