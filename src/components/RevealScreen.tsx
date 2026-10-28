import React, { useState, useEffect, useRef } from 'react';
import { ResultTypeId } from '../types';
import { WHEEL_CARDS, CARD_IMAGES, TYPE_CONFIG } from '../data/cardDesigns';
import { Sparkles, FastForward } from 'lucide-react';

interface RevealScreenProps {
  targetTypeId: ResultTypeId;
  onComplete: () => void;
}

export const RevealScreen: React.FC<RevealScreenProps> = ({
  targetTypeId,
  onComplete,
}) => {
  // Steps: 'spinning' -> 'snapped' -> 'moving-to-center' -> 'revealed'
  const [step, setStep] = useState<
    'spinning' | 'snapped' | 'moving-to-center' | 'revealed'
  >('spinning');

  // Find a target card index among the 24 cards that matches targetTypeId
  const targetIndex = WHEEL_CARDS.findIndex((c) => c.typeId === targetTypeId);
  const targetCard = WHEEL_CARDS[targetIndex];

  // Responsive radius & card sizing
  const [dimensions, setDimensions] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (w < 480) {
      return { radius: 180, cardWidth: 46, cardHeight: 82, heroWidth: 200, heroHeight: 356 };
    } else if (w < 768) {
      return { radius: 215, cardWidth: 54, cardHeight: 96, heroWidth: 220, heroHeight: 391 };
    } else if (w < 1024) {
      return { radius: 260, cardWidth: 64, cardHeight: 114, heroWidth: 235, heroHeight: 418 };
    } else {
      return { radius: 310, cardWidth: 72, cardHeight: 128, heroWidth: 245, heroHeight: 436 };
    }
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setDimensions({ radius: 180, cardWidth: 46, cardHeight: 82, heroWidth: 200, heroHeight: 356 });
      } else if (w < 768) {
        setDimensions({ radius: 215, cardWidth: 54, cardHeight: 96, heroWidth: 220, heroHeight: 391 });
      } else if (w < 1024) {
        setDimensions({ radius: 260, cardWidth: 64, cardHeight: 114, heroWidth: 235, heroHeight: 418 });
      } else {
        setDimensions({ radius: 310, cardWidth: 72, cardHeight: 128, heroWidth: 245, heroHeight: 436 });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. Calculate stopping angle so targetIndex lands at 12 o'clock (-Math.PI / 2)
    const targetCardAngleInWheel = (targetIndex / 24) * Math.PI * 2;
    // We add 3 full extra rotations (3 * 2 * PI = 6 * PI) for dramatic spin
    const targetOffset = -Math.PI / 2 - targetCardAngleInWheel + Math.PI * 6;

    const startAngle = 0;
    const duration = 2400; // 2.4 seconds
    const startTime = performance.now();

    // Cubic ease-out function
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animateSpin = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      const angle = startAngle + (targetOffset - startAngle) * eased;
      setCurrentAngle(angle);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateSpin);
      } else {
        // Step 4 & 5: Snapped at top, highlight effect!
        setStep('snapped');

        // After 600ms highlight, move card to center
        setTimeout(() => {
          setStep('moving-to-center');
        }, 600);

        // After card reaches center (800ms), 3D flip card
        setTimeout(() => {
          setStep('revealed');
        }, 1400);

        // After reveal animation completes, transition to ResultScreen
        setTimeout(() => {
          onComplete();
        }, 2700);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateSpin);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetIndex, onComplete]);

  const totalCards = WHEEL_CARDS.length;

  return (
    <div className="relative w-full min-h-[calc(100vh-2rem)] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      
      {/* Top Status Header */}
      <div className="absolute top-6 left-0 right-0 z-50 flex flex-col items-center text-center px-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 shadow-sm border border-sage-200 text-sage-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>
            {step === 'spinning' && '나의 우리 유형 탐색 중...'}
            {step === 'snapped' && '유형 발견!'}
            {step === 'moving-to-center' && '카드 공개 중...'}
            {step === 'revealed' && '나의 유형을 확인하세요!'}
          </span>
        </div>
        <p className="text-xs text-sage-500 font-medium">
          여섯 가지 응답을 바탕으로 카드를 찾고 있습니다
        </p>
      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-5 z-50 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-sage-600 shadow-sm border border-sage-200/80 active:scale-95 transition-all"
      >
        <span>건너뛰기</span>
        <FastForward className="w-3 h-3" />
      </button>

      {/* 12 O'clock Target Pointer Indicator at Top */}
      <div
        className="absolute z-40 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300"
        style={{
          top: `calc(50% - ${dimensions.radius + dimensions.cardHeight / 2 + 24}px)`,
          left: '50%',
        }}
      >
        <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-bold shadow-md animate-bounce">
          ▼
        </div>
      </div>

      {/* 24 Radial Wheel */}
      <div
        className="relative aspect-square max-w-[720px] max-h-[720px] w-full mx-auto flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {/* Orbit Reference Ring */}
        <div
          className="absolute rounded-full border border-sage-200/40 pointer-events-none"
          style={{
            width: dimensions.radius * 2,
            height: dimensions.radius * 2,
          }}
        />

        {WHEEL_CARDS.map((card, index) => {
          const isTargetCard = card.id === targetCard.id;

          // Radial angle: 360 / 24 = 15 deg
          const cardAngle = currentAngle + (index / totalCards) * Math.PI * 2;
          const x = Math.cos(cardAngle) * dimensions.radius;
          const y = Math.sin(cardAngle) * dimensions.radius;
          const rotationDeg = (cardAngle * 180) / Math.PI + 90;

          // If moving to center or revealed, hide from the wheel track
          if (isTargetCard && (step === 'moving-to-center' || step === 'revealed')) {
            return null;
          }

          const isHighlighted = isTargetCard && step === 'snapped';

          return (
            <div
              key={card.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
              style={{
                transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${rotationDeg}deg) scale(${
                  isHighlighted ? 1.25 : 1
                })`,
                zIndex: isHighlighted ? 100 : 20,
                width: dimensions.cardWidth,
                height: dimensions.cardHeight,
              }}
            >
              <div
                className={`w-full h-full rounded-xl overflow-hidden bg-white shadow-card border transition-all duration-300 ${
                  isHighlighted
                    ? 'ring-4 ring-amber-400 ring-offset-2 shadow-2xl scale-110'
                    : 'border-white/80'
                }`}
              >
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover block"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}

        {/* Hero Card Animation: Moves to center & 3D Flips */}
        {(step === 'moving-to-center' || step === 'revealed') && (
          <div
            className="absolute z-[150] transition-all duration-700 ease-out flex items-center justify-center"
            style={{
              width: dimensions.heroWidth,
              height: dimensions.heroHeight,
              transform: `translate(-50%, -50%) ${
                step === 'revealed' ? 'scale(1)' : 'scale(0.95)'
              }`,
              top: '50%',
              left: '50%',
            }}
          >
            {/* 3D Flip Card */}
            <div
              className={`relative w-full h-full rounded-3xl shadow-2xl transition-transform duration-700 ${
                step === 'revealed' ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: step === 'revealed' ? 'rotateY(360deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Card Face */}
              <div
                className="w-full h-full rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-white p-1"
                style={{ backfaceVisibility: 'visible' }}
              >
                <img
                  src={CARD_IMAGES[targetTypeId]}
                  alt={targetCard.name}
                  className="w-full h-full object-cover rounded-2xl block"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Target Type Vibe Banner when revealed */}
      {step === 'revealed' && (
        <div className="absolute bottom-10 z-[160] text-center animate-fadeIn px-4">
          <div className="glass-card rounded-2xl px-5 py-3 shadow-lg border border-white">
            <span className="text-xs font-bold text-sage-500 uppercase tracking-wider block mb-0.5">
              {TYPE_CONFIG[targetTypeId].tag}
            </span>
            <h3 className="text-lg font-extrabold text-sage-950">
              {targetCard.name}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};
