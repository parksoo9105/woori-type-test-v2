import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WHEEL_CARDS, CardItem, TYPE_CONFIG } from '../data/cardDesigns';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface CardWheelProps {
  onStart: () => void;
  // Optional controlled angle for reveal mode
  controlledAngle?: number;
  isControlled?: boolean;
  highlightedCardId?: string | null;
  animatingCardId?: string | null;
}

export const CardWheel: React.FC<CardWheelProps> = ({
  onStart,
  controlledAngle,
  isControlled = false,
  highlightedCardId = null,
  animatingCardId = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive radius & card sizing
  const [dimensions, setDimensions] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (w < 480) {
      return { radius: 180, cardWidth: 46, cardHeight: 82, centerSize: 220 };
    } else if (w < 768) {
      return { radius: 215, cardWidth: 54, cardHeight: 96, centerSize: 240 };
    } else if (w < 1024) {
      return { radius: 260, cardWidth: 64, cardHeight: 114, centerSize: 260 };
    } else {
      return { radius: 310, cardWidth: 72, cardHeight: 128, centerSize: 280 };
    }
  });

  // Angle state for idle rotation and dragging
  const [angleOffset, setAngleOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [previewCard, setPreviewCard] = useState<CardItem | null>(null);

  // Drag physics tracking
  const dragRef = useRef({
    active: false,
    lastAngle: 0,
    velocity: 0,
    lastTime: 0,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setDimensions({ radius: 180, cardWidth: 46, cardHeight: 82, centerSize: 220 });
      } else if (w < 768) {
        setDimensions({ radius: 215, cardWidth: 54, cardHeight: 96, centerSize: 240 });
      } else if (w < 1024) {
        setDimensions({ radius: 260, cardWidth: 64, cardHeight: 114, centerSize: 260 });
      } else {
        setDimensions({ radius: 310, cardWidth: 72, cardHeight: 128, centerSize: 280 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync controlled angle if supplied
  useEffect(() => {
    if (isControlled && typeof controlledAngle === 'number') {
      setAngleOffset(controlledAngle);
    }
  }, [isControlled, controlledAngle]);

  // Idle rotation & momentum deceleration loop
  useEffect(() => {
    if (isControlled) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!dragRef.current.active) {
        if (Math.abs(dragRef.current.velocity) > 0.001) {
          // Momentum decay
          setAngleOffset((prev) => prev + dragRef.current.velocity * dt);
          dragRef.current.velocity *= 0.94;
        } else {
          // Normal idle slow rotation
          const speed = hoveredIndex !== null ? 0 : 0.08; // pause on hover
          setAngleOffset((prev) => (prev + speed * dt) % (Math.PI * 2));
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isControlled, hoveredIndex]);

  // Pointer Drag Handlers for rotation
  const getAngleFromPointer = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - centerY, e.clientX - centerX);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isControlled) return;
    const target = e.target as HTMLElement;
    // Don't drag if clicking center buttons or links
    if (target.closest('button') || target.closest('a')) return;

    const angle = getAngleFromPointer(e);
    dragRef.current = {
      active: true,
      lastAngle: angle,
      velocity: 0,
      lastTime: performance.now(),
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active || isControlled) return;
    const currentAngle = getAngleFromPointer(e);
    let delta = currentAngle - dragRef.current.lastAngle;

    // Handle crossing -PI / +PI wrap
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    const now = performance.now();
    const dt = (now - dragRef.current.lastTime) / 1000;
    if (dt > 0) {
      dragRef.current.velocity = delta / dt;
    }

    dragRef.current.lastAngle = currentAngle;
    dragRef.current.lastTime = now;

    setAngleOffset((prev) => prev + delta);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const totalCards = WHEEL_CARDS.length;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full aspect-square max-w-[720px] max-h-[720px] mx-auto flex items-center justify-center select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        perspective: '1200px',
      }}
    >
      {/* Background Soft Pastel Glow */}
      <div className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-amber-100/40 via-pink-100/30 to-sky-100/40 filter blur-3xl pointer-events-none" />

      {/* Orbit Track Reference Ring */}
      <div
        className="absolute rounded-full border border-sage-200/50 pointer-events-none"
        style={{
          width: dimensions.radius * 2,
          height: dimensions.radius * 2,
        }}
      />

      {/* 24 Radial Cards Wheel */}
      {WHEEL_CARDS.map((card, index) => {
        const isHovered = hoveredIndex === index;
        const isHighlighted = highlightedCardId === card.id;
        const isAnimatingToCenter = animatingCardId === card.id;

        // Radial angle: 360 / 24 = 15 deg
        const cardAngle = angleOffset + (index / totalCards) * Math.PI * 2;
        const x = Math.cos(cardAngle) * dimensions.radius;
        const y = Math.sin(cardAngle) * dimensions.radius;
        const rotationDeg = (cardAngle * 180) / Math.PI + 90;

        // If card is being animated to the center during reveal, override transforms
        if (isAnimatingToCenter) {
          return null; // Rendered by the central reveal overlay
        }

        return (
          <div
            key={card.id}
            onMouseEnter={() => !isControlled && setHoveredIndex(index)}
            onMouseLeave={() => !isControlled && setHoveredIndex(null)}
            onClick={(e) => {
              if (isDragging) return;
              e.stopPropagation();
              if (!isControlled) {
                setPreviewCard(card);
              }
            }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ${
              isControlled ? 'pointer-events-none' : 'cursor-pointer'
            }`}
            style={{
              transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${rotationDeg}deg) scale(${
                isHovered ? 1.15 : isHighlighted ? 1.2 : 1
              })`,
              zIndex: isHighlighted ? 100 : isHovered ? 80 : 20,
              width: dimensions.cardWidth,
              height: dimensions.cardHeight,
            }}
          >
            {/* Card Inner with Rounded Corners & Soft Shadow */}
            <div
              className={`w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-card border transition-all duration-300 ${
                isHighlighted
                  ? 'ring-4 ring-amber-400 ring-offset-2 shadow-2xl scale-105'
                  : isHovered
                  ? 'border-white shadow-xl -translate-y-1'
                  : 'border-white/80 shadow-soft'
              }`}
            >
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover block select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
        );
      })}

      {/* Central Hub Container (Always visible & interactive) */}
      <div
        className="relative z-50 rounded-full flex flex-col items-center justify-center text-center p-4 sm:p-6 glass-card shadow-card border-2 border-white/95 pointer-events-auto"
        style={{
          width: dimensions.centerSize,
          height: dimensions.centerSize,
        }}
      >
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sage-100 text-sage-800 text-[10px] sm:text-[11px] font-bold mb-1.5 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-sage-600" />
          <span>우리 유형 테스트</span>
        </div>

        {/* Main Title */}
        <h1 className="text-base sm:text-xl font-extrabold text-sage-950 tracking-tight leading-snug px-1 mb-3">
          나는 어떤 &lsquo;우리&rsquo;에<br />속해 있을까?
        </h1>

        {/* Start Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          className="group relative inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white bg-sage-900 hover:bg-black active:scale-95 rounded-full shadow-card transition-all duration-200"
        >
          <span>테스트 시작하기</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>

        {/* Drag Hint underneath */}
        <span className="text-[10px] sm:text-[11px] text-sage-400 font-medium mt-2">
          휠을 돌리거나 카드를 눌러보세요
        </span>
      </div>

      {/* Card Preview Modal (Shown when a card is clicked on start screen) */}
      {previewCard && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
          onClick={() => setPreviewCard(null)}
        >
          <div
            className="relative w-full max-w-xs bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-white space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setPreviewCard(null)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-sage-100/80 text-sage-600 hover:bg-sage-200 transition-colors"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Thumbnail Card Image */}
            <div className="w-36 aspect-[241/429] mx-auto rounded-2xl overflow-hidden shadow-card border border-sage-100">
              <img
                src={previewCard.imageUrl}
                alt={previewCard.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card Information */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-sage-500 uppercase tracking-wider">
                {TYPE_CONFIG[previewCard.typeId].tag}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-sage-950">
                {previewCard.name}
              </h3>
              <p className="text-xs text-sage-600 leading-relaxed pt-1">
                {previewCard.vibeText}
              </p>
            </div>

            {/* CTA in Preview Modal */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setPreviewCard(null);
                  onStart();
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-sage-900 hover:bg-black rounded-2xl shadow-card active:scale-95 transition-all"
              >
                <span>내 유형 확인하러 가기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
