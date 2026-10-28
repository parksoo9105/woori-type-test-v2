import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface ArchetypeItem {
  typeId: 'type-1' | 'type-2' | 'type-3' | 'type-4';
  typeNum: '01' | '02' | '03' | '04';
  title: string;
  enTitle: string;
  colorName: string;
  hex: string;
  svgPath: string;
  desc: string;
}

export const ARCHETYPES: ArchetypeItem[] = [
  {
    typeId: 'type-1',
    typeNum: '01',
    title: '마주보는 정원사',
    enTitle: 'THE FACE-TO-FACE GARDENER',
    colorName: 'Orange',
    hex: '#F08300',
    svgPath: '/assets/type-01-face-to-face.svg',
    desc: '서로 마주보는 두 인물과 꽃',
  },
  {
    typeId: 'type-2',
    typeNum: '02',
    title: '연결망의 항해자',
    enTitle: 'VOYAGER OF THE NETWORK',
    colorName: 'Blue (Key)',
    hex: '#007CC3',
    svgPath: '/assets/type-02-online.svg',
    desc: '온라인 공간과 항해하는 배',
  },
  {
    typeId: 'type-3',
    typeNum: '03',
    title: '다리를 놓는 탐험가',
    enTitle: 'THE BRIDGE BUILDER',
    colorName: 'Dim Gray',
    hex: '#443E3B',
    svgPath: '/assets/type-03-open.svg',
    desc: '두 손으로 받쳐 든 그릇과 별, 식물',
  },
  {
    typeId: 'type-4',
    typeNum: '04',
    title: '고요한 등대',
    enTitle: 'THE SERENE LIGHTHOUSE',
    colorName: 'Deep Black',
    hex: '#000000',
    svgPath: '/assets/type-04-own-pace.svg',
    desc: '바다 위의 등대와 빛',
  },
];

interface GlassCarousel3DProps {
  className?: string;
  onActiveChange?: (activeItem: ArchetypeItem) => void;
}

export const GlassCarousel3D: React.FC<GlassCarousel3DProps> = ({
  className = '',
  onActiveChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Carousel rotation angle in degrees (0 = index 1, TYPE 02 front-center)
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const [angle, setAngle] = useState<number>(0);

  // Drag / touch state
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartAngleRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  // Active item index (0..3), default 1 (TYPE 02 Blue Key)
  const [activeIndex, setActiveIndex] = useState<number>(1);

  // Subtle hover tilt on desktop
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Responsiveness: Radius calculations
  const [radius, setRadius] = useState<{ rx: number; rz: number }>({ rx: 320, rz: 160 });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setRadius({ rx: 115, rz: 55 });
      } else if (w < 1024) {
        setRadius({ rx: 220, rz: 110 });
      } else {
        setRadius({ rx: 320, rz: 160 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Update active index based on angle
  const computeActiveIndex = useCallback((targetDeg: number) => {
    // index 1 is at angle 0.
    // angle increases as we drag right -> index decreases (1 -> 0 -> 3 -> 2)
    const step = Math.round(targetDeg / 90);
    const idx = (((1 - step) % 4) + 4) % 4;
    return idx;
  }, []);

  // Animation loop with requestAnimationFrame
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (!isDraggingRef.current) {
        const diff = targetAngleRef.current - currentAngleRef.current;
        if (Math.abs(diff) > 0.05) {
          currentAngleRef.current += diff * 0.12;
          setAngle(currentAngleRef.current);
        } else if (currentAngleRef.current !== targetAngleRef.current) {
          currentAngleRef.current = targetAngleRef.current;
          setAngle(currentAngleRef.current);
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Notify parent of active item changes
  useEffect(() => {
    const activeItem = ARCHETYPES[activeIndex];
    if (activeItem && onActiveChange) {
      onActiveChange(activeItem);
    }
  }, [activeIndex, onActiveChange]);

  // Pointer Down (Mouse & Touch unified)
  const handlePointerDown = (clientX: number) => {
    isDraggingRef.current = true;
    dragStartXRef.current = clientX;
    dragStartAngleRef.current = currentAngleRef.current;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - dragStartXRef.current;
    const sensitivity = window.innerWidth < 640 ? 0.45 : 0.35; // degrees per pixel
    const newAngle = dragStartAngleRef.current + deltaX * sensitivity;

    currentAngleRef.current = newAngle;
    targetAngleRef.current = newAngle;
    setAngle(newAngle);

    // Track velocity for flick/swipe
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 10) {
      velocityRef.current = (clientX - lastXRef.current) / dt;
      lastXRef.current = clientX;
      lastTimeRef.current = now;
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Determine snap target
    let snapTarget = Math.round(currentAngleRef.current / 90) * 90;

    // Apply velocity bonus for flick
    const vel = velocityRef.current;
    if (Math.abs(vel) > 0.4) {
      const bonus = vel > 0 ? 90 : -90;
      snapTarget = Math.round((currentAngleRef.current + bonus * 0.6) / 90) * 90;
    }

    targetAngleRef.current = snapTarget;
    const newIdx = computeActiveIndex(snapTarget);
    setActiveIndex(newIdx);
  };

  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerDown(e.clientX);

    const onGlobalMouseMove = (ev: MouseEvent) => {
      handlePointerMove(ev.clientX);
    };

    const onGlobalMouseUp = () => {
      handlePointerUp();
      window.removeEventListener('mousemove', onGlobalMouseMove);
      window.removeEventListener('mouseup', onGlobalMouseUp);
    };

    window.addEventListener('mousemove', onGlobalMouseMove);
    window.addEventListener('mouseup', onGlobalMouseUp);
  };

  // Touch event handlers (with pan-y preserved for vertical scrolling)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isHorizontalGesture = useRef<boolean | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartPos.current = { x: t.clientX, y: t.clientY };
      isHorizontalGesture.current = null;
      handlePointerDown(t.clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartPos.current.x;
    const dy = t.clientY - touchStartPos.current.y;

    if (isHorizontalGesture.current === null) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        isHorizontalGesture.current = Math.abs(dx) > Math.abs(dy);
      }
    }

    if (isHorizontalGesture.current) {
      if (e.cancelable) e.preventDefault();
      handlePointerMove(t.clientX);
    }
  };

  const onTouchEnd = () => {
    touchStartPos.current = null;
    isHorizontalGesture.current = null;
    handlePointerUp();
  };

  // Rotate directly to an item when clicked
  const rotateToItem = (itemIndex: number) => {
    // Current step
    const currentStep = Math.round(targetAngleRef.current / 90);
    // Target step where (1 - targetStep) % 4 === itemIndex
    // targetStep = 1 - itemIndex (+ 4k)
    let desiredStep = 1 - itemIndex;
    while (desiredStep - currentStep > 2) desiredStep -= 4;
    while (desiredStep - currentStep < -2) desiredStep += 4;

    targetAngleRef.current = desiredStep * 90;
    setActiveIndex(itemIndex);
  };

  // Mouse move for 3D tilt
  const onMouseMoveTilt = (e: React.MouseEvent) => {
    if (isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({ x: nx, y: ny });
  };

  const activeItem = ARCHETYPES[activeIndex];

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center justify-center select-none ${className}`}
      onMouseMove={onMouseMoveTilt}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
    >
      {/* ======================================================== */}
      {/* 1. DISCREET ACTIVE TYPE INDICATOR (Above Carousel)       */}
      {/* ======================================================== */}
      <div className="mb-2 sm:mb-6 flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-sm transition-all duration-300">
        <span
          className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-colors duration-300 shadow-sm"
          style={{ backgroundColor: activeItem.hex }}
        />
        <span className="text-[10px] sm:text-[12px] font-mono tracking-widest text-stone-500 uppercase">
          TYPE {activeItem.typeNum} / 04
        </span>
        <span className="w-px h-2.5 sm:h-3 bg-stone-300" />
        <span className="text-[11.5px] sm:text-[13px] font-medium text-stone-900 tracking-tight">
          {activeItem.title}
        </span>
      </div>

      {/* ======================================================== */}
      {/* 2. 3D GLASS CAROUSEL STAGE                               */}
      {/* ======================================================== */}
      <div
        className="relative w-full max-w-[960px] h-[255px] sm:h-[390px] md:h-[470px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {ARCHETYPES.map((item, idx) => {
          // Angle in degrees for this item
          // idx 1 (TYPE 02) has offset 0
          const itemAngleDeg = (idx - 1) * 90 + angle;
          const rad = (itemAngleDeg * Math.PI) / 180;

          // 3D coordinates on elliptical cylinder
          const x = Math.sin(rad) * radius.rx;
          const z = Math.cos(rad) * radius.rz; // +rz (front) to -rz (back)

          // Normalized depth factor [0: back, 1: front]
          const depth = (z + radius.rz) / (2 * radius.rz);

          // Visual scales & depth adjustments
          const scale = 0.65 + 0.35 * depth;
          const opacity = 0.42 + 0.58 * depth;
          const blur = (1 - depth) * 3.5;
          const zIndex = Math.round(depth * 100) + 10;
          const rotY = -Math.sin(rad) * 22;

          const isFront = depth > 0.88;

          // Apply micro tilt to the front-most card
          const tiltX = isFront && isHovered ? -tilt.y * 7 : 0;
          const tiltY = isFront && isHovered ? tilt.x * 7 : 0;

          return (
            <div
              key={item.typeId}
              onClick={() => {
                if (!isFront) {
                  rotateToItem(idx);
                }
              }}
              className="absolute top-1/2 left-1/2 transition-transform duration-75 will-change-transform"
              style={{
                transform: `translate3d(calc(-50% + ${x}px), calc(-50% + 0px), ${z}px) rotateY(${rotY + tiltY}deg) rotateX(${tiltX}deg) scale(${scale})`,
                zIndex,
                opacity,
                filter: `blur(${blur}px)`,
                cursor: isFront ? 'grab' : 'pointer',
              }}
            >
              {/* ======================================================== */}
              {/* 3. COLORLESS TRANSPARENT GLASS CAPSULE (Stadium / Oval)   */}
              {/* ======================================================== */}
              <div
                className={`group relative w-[170px] h-[270px] sm:w-[240px] sm:h-[380px] md:w-[280px] md:h-[440px] rounded-full overflow-hidden select-none transition-shadow duration-500`}
                style={{
                  // Pure colorless transparent glass
                  background: 'rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(16px) saturate(135%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(135%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.85)',
                  boxShadow: isFront
                    ? '0 32px 70px -15px rgba(28, 44, 37, 0.16), 0 12px 28px -6px rgba(28, 44, 37, 0.08), inset 0 1.5px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(0, 0, 0, 0.05), inset 1.5px 0 2px rgba(255, 255, 255, 0.7), inset -1.5px 0 2px rgba(255, 255, 255, 0.7)'
                    : '0 20px 40px -15px rgba(28, 44, 37, 0.10), inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.04)',
                }}
              >
                {/* A. Inner Concentric Stadium Hairline Rim (Double glass bevel) */}
                <div
                  className="absolute inset-[10px] sm:inset-[12px] rounded-full pointer-events-none z-10"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.65)',
                    boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.35)',
                  }}
                />

                {/* B. Internal SVG Illustration (Centered & crisp) */}
                <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5 z-0">
                  <img
                    src={item.svgPath}
                    alt={`${item.title} - ${item.desc}`}
                    className="w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
                    draggable={false}
                    loading="eager"
                  />
                </div>

                {/* C. Natural Diagonal Glass Caustics & Specular Reflection Sweep */}
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 30%, rgba(255, 255, 255, 0.02) 55%, transparent 100%)',
                  }}
                />

                {/* D. Vertical Specular Glint Along Glass Rim */}
                <div
                  className="absolute top-0 left-1/4 w-1/2 h-1/3 pointer-events-none z-20 rounded-full"
                  style={{
                    background:
                      'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 60%, transparent 80%)',
                  }}
                />

                {/* E. Subtle bottom glass refraction shadow */}
                <div
                  className="absolute bottom-0 inset-x-0 h-16 pointer-events-none z-20"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0, 0, 0, 0.06) 0%, transparent 100%)',
                  }}
                />

                {/* Accessible screen reader nodes */}
                <span className="sr-only">{item.title}</span>
                <span className="sr-only">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 4. DRAG / SWIPE HINT & 4-DOT TYPE SWITCHER               */}
      {/* ======================================================== */}
      <div className="mt-2 sm:mt-5 flex flex-col items-center gap-1.5 sm:gap-2.5 z-30">
        {/* 4 Archetype Color Indicator Dots */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-stone-200/50">
          {ARCHETYPES.map((item, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={item.typeId}
                onClick={() => rotateToItem(idx)}
                className="group relative flex items-center justify-center p-1 focus:outline-none"
                aria-label={`${item.title} 선택`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-3 h-3 ring-2 ring-offset-2 scale-110 shadow-sm'
                      : 'w-2 h-2 opacity-50 group-hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: item.hex,
                    // If current, ring color matches the item's hex
                    outlineColor: item.hex,
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Subtle Drag Guidance */}
        <p className="text-[11px] font-sans text-stone-400 tracking-wider">
          좌우로 드래그하여 4가지 유형을 탐색하세요
        </p>
      </div>
    </div>
  );
};
