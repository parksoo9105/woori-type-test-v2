import React, { useRef, useState, useEffect } from 'react';

interface InteractivePosterSceneProps {
  className?: string;
  onStart: () => void;
  onScrollToDetails?: () => void;
}

export const InteractivePosterScene: React.FC<InteractivePosterSceneProps> = ({
  className = '',
  onStart,
  onScrollToDetails,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse state normalized between -1 and 1
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  // Corner proximities (0: far, 1: directly hovering)
  const [proximity, setProximity] = useState({
    tl: 0, // Coral (Top-Left)
    tr: 0, // Blue (Top-Right)
    bl: 0, // Violet (Bottom-Left)
    br: 0, // Lime (Bottom-Right)
  });

  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetX = Math.max(-1, Math.min(1, nx));
      targetY = Math.max(-1, Math.min(1, ny));
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      const ease = 0.08;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      const distTL = Math.hypot(currentX - -1, currentY - -1);
      const distTR = Math.hypot(currentX - 1, currentY - -1);
      const distBL = Math.hypot(currentX - -1, currentY - 1);
      const distBR = Math.hypot(currentX - 1, currentY - 1);

      const maxDist = 1.5;
      const pTL = Math.max(0, 1 - distTL / maxDist);
      const pTR = Math.max(0, 1 - distTR / maxDist);
      const pBL = Math.max(0, 1 - distBL / maxDist);
      const pBR = Math.max(0, 1 - distBR / maxDist);

      setMouse({ x: currentX, y: currentY });
      setProximity({ tl: pTL, tr: pTR, bl: pBL, br: pBR });

      animationFrameId = requestAnimationFrame(tick);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // -------------------------------------------------------------
  // DYNAMIC GEOMETRY CALCULATIONS
  // -------------------------------------------------------------

  // 1. CORAL (Top-Left):
  const coralOverlapOffset = proximity.tl * 16;
  const coralDotProgress = proximity.tl * 0.25;

  // 2. BLUE (Top-Right):
  const pTR = proximity.tr;
  const blueNodes = [
    { id: 'center', x: 190 + mouse.x * 5 + pTR * 4, y: 130 + mouse.y * 5 - pTR * 5, r: 18 },
    { id: 'top', x: 130 + mouse.x * 9 - pTR * 10, y: 55 + mouse.y * 9 - pTR * 8, r: 10 },
    { id: 'rightTop', x: 285 + mouse.x * 12 + pTR * 10, y: 140 + mouse.y * 12 + pTR * 6, r: 9 },
    { id: 'leftBottom', x: 85 + mouse.x * 10 - pTR * 12, y: 185 + mouse.y * 10 + pTR * 8, r: 12 },
    { id: 'bigSphere', x: 65 + mouse.x * 6 - pTR * 5, y: 80 + mouse.y * 6 - pTR * 6, r: 44 },
  ];

  // 3. VIOLET (Bottom-Left):
  const pBL = proximity.bl;
  const violetP1 = {
    x: 85 + mouse.x * 12 - pBL * 8,
    y: 75 + mouse.y * 15 - pBL * 10,
    r: 14,
  };
  const violetP2 = {
    x: 205 + mouse.x * 7 + pBL * 6,
    y: 205 + mouse.y * 9 + pBL * 8,
    r: 34,
  };
  const violetCP1 = {
    x: violetP1.x + 60 + pBL * 18,
    y: violetP1.y + 30 - pBL * 14,
  };
  const violetCP2 = {
    x: violetP2.x - 80 - pBL * 20,
    y: violetP2.y - 50 + pBL * 16,
  };
  const violetCurvePath = `M ${violetP1.x} ${violetP1.y} C ${violetCP1.x} ${violetCP1.y}, ${violetCP2.x} ${violetCP2.y}, ${violetP2.x} ${violetP2.y}`;

  // 4. LIME (Bottom-Right):
  const pBR = proximity.br;
  const limeBloom = pBR * 18;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[100svh] min-h-[560px] max-h-[1080px] overflow-hidden bg-[#F8F7F3] select-none text-[#171923] flex flex-col justify-between ${className}`}
    >
      {/* ======================================================== */}
      {/* 🎨 4 CORNER GRAPHICS: Connected to 4 corners             */}
      {/* ======================================================== */}

      {/* 🔴 A. TOP-LEFT: Coral Red #FF654F (마주보며 연결되는 우리) */}
      <div
        className="absolute top-0 left-0 w-[34vw] max-w-[170px] sm:w-[32vw] sm:max-w-[420px] lg:max-w-[480px] h-[30vh] max-h-[200px] sm:h-[34vh] sm:max-h-[350px] pointer-events-none z-10 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouse.x * 7}px, ${mouse.y * 7}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Main Solid Coral Circle */}
          <circle
            cx="90"
            cy="110"
            r="150"
            fill="#FF654F"
            className="transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${-coralOverlapOffset * 0.4}px, 0, 0)`,
            }}
          />

          {/* Overlapping Translucent Coral Circle / Petal */}
          <circle
            cx={210 - coralOverlapOffset}
            cy="130"
            r="105"
            fill="#FF8573"
            fillOpacity="0.62"
            className="transition-all duration-500 ease-out"
          />

          {/* Curved Orbit Line */}
          <path
            d="M 100 240 C 200 250, 290 170, 310 50"
            stroke="#FF654F"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Orbiting Satellite Coral Dot */}
          <circle
            cx={285 - coralDotProgress * 30}
            cy={80 + coralDotProgress * 25}
            r="8"
            fill="#FF654F"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Clean Label positioned inside the solid Coral shape */}
        <div className="absolute top-[65px] sm:top-[85px] left-[20px] sm:left-[32px] text-white text-left font-sans pointer-events-auto">
          <span className="sr-only">마주보며 연결되는 우리</span>
          <p className="text-[12px] sm:text-[14px] font-semibold leading-[1.3] text-white drop-shadow-2xs">
            마주보며<br />
            연결되는 우리
          </p>
          <div className="w-5 h-[1.5px] bg-white/80 mt-1.5" />
        </div>
      </div>

      {/* 🔵 B. TOP-RIGHT: Electric Blue #4169E1 (온라인으로 연결되는 우리) */}
      <div
        className="absolute top-0 right-0 w-[34vw] max-w-[170px] sm:w-[32vw] sm:max-w-[420px] lg:max-w-[480px] h-[30vh] max-h-[200px] sm:h-[34vh] sm:max-h-[350px] pointer-events-none z-10 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouse.x * 9}px, ${mouse.y * 9}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Pale Translucent Blue Background Circle */}
          <circle cx="310" cy="130" r="145" fill="#D8E5FF" fillOpacity="0.68" />

          {/* Additional Soft Blue Cloud */}
          <circle cx="210" cy="20" r="100" fill="#E8EFFF" fillOpacity="0.75" />

          {/* Network Connection Lines */}
          <line
            x1={blueNodes[4].x}
            y1={blueNodes[4].y}
            x2={blueNodes[0].x}
            y2={blueNodes[0].y}
            stroke="#4169E1"
            strokeWidth="1.75"
          />
          <line
            x1={blueNodes[1].x}
            y1={blueNodes[1].y}
            x2={blueNodes[0].x}
            y2={blueNodes[0].y}
            stroke="#4169E1"
            strokeWidth="1.75"
          />
          <line
            x1={blueNodes[2].x}
            y1={blueNodes[2].y}
            x2={blueNodes[0].x}
            y2={blueNodes[0].y}
            stroke="#4169E1"
            strokeWidth="1.75"
          />
          <line
            x1={blueNodes[3].x}
            y1={blueNodes[3].y}
            x2={blueNodes[0].x}
            y2={blueNodes[0].y}
            stroke="#4169E1"
            strokeWidth="1.75"
          />

          {/* Solid Electric Blue Hero Circle */}
          <circle
            cx={blueNodes[4].x}
            cy={blueNodes[4].y}
            r={blueNodes[4].r}
            fill="#4169E1"
            className="transition-transform duration-500 ease-out"
          />

          {/* Connected Network Nodes */}
          {blueNodes.slice(0, 4).map((node) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="#4169E1"
              className="transition-all duration-300 ease-out"
            />
          ))}
        </svg>

        {/* Clean Label for Blue in dedicated clear space */}
        <div className="absolute top-[65px] sm:top-[90px] right-[20px] sm:right-[32px] text-right font-sans pointer-events-auto">
          <span className="sr-only">온라인으로 연결되는 우리</span>
          <p className="text-[12px] sm:text-[14px] font-semibold leading-[1.3] text-[#171923]">
            온라인으로<br />
            연결되는 우리
          </p>
          <div className="w-5 h-[1.5px] bg-[#171923]/40 mt-1.5 ml-auto" />
        </div>
      </div>

      {/* 🟣 C. BOTTOM-LEFT: Soft Violet #8064D8 (나만의 속도로 관계 맺는 우리) */}
      <div
        className="absolute bottom-0 left-0 w-[34vw] max-w-[170px] sm:w-[32vw] sm:max-w-[420px] lg:max-w-[480px] h-[30vh] max-h-[200px] sm:h-[34vh] sm:max-h-[350px] pointer-events-none z-10 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 6}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Organic Violet Flowing Blob Shape */}
          <path
            d="M -20 140 C 40 110, 110 140, 160 210 C 220 280, 270 320, 340 340 L -20 340 Z"
            fill="#9F86EC"
            fillOpacity="0.48"
          />
          <path
            d="M -20 230 C 30 210, 80 230, 130 290 C 170 330, 220 340, 270 340 L -20 340 Z"
            fill="#D5C7F7"
            fillOpacity="0.6"
          />

          {/* Connecting Harmonic S-Curve */}
          <path
            d={violetCurvePath}
            stroke="#8064D8"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-200 ease-out"
          />

          {/* Anchor Node 1 */}
          <circle
            cx={violetP1.x}
            cy={violetP1.y}
            r={violetP1.r}
            fill="#8064D8"
            className="transition-all duration-300 ease-out"
          />

          {/* Anchor Node 2 */}
          <circle
            cx={violetP2.x}
            cy={violetP2.y}
            r={violetP2.r}
            fill="#8064D8"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Clean Label for Violet in clear open space */}
        <div className="absolute bottom-[52px] sm:bottom-[65px] left-[20px] sm:left-[32px] text-left font-sans pointer-events-auto">
          <span className="sr-only">나만의 속도로 관계 맺는 우리</span>
          <p className="text-[12px] sm:text-[14px] font-semibold leading-[1.3] text-[#171923]">
            나만의 속도로<br />
            관계 맺는 우리
          </p>
          <div className="w-5 h-[1.5px] bg-[#171923]/40 mt-1.5" />
        </div>
      </div>

      {/* 🟢 D. BOTTOM-RIGHT: Lime Green #B8E34A (새로운 만남에 열린 우리) */}
      <div
        className="absolute bottom-0 right-0 w-[34vw] max-w-[170px] sm:w-[32vw] sm:max-w-[420px] lg:max-w-[480px] h-[30vh] max-h-[200px] sm:h-[34vh] sm:max-h-[350px] pointer-events-none z-10 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouse.x * 7}px, ${mouse.y * 7}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Main Lime Circle */}
          <circle cx="330" cy="280" r="170" fill="#B8E34A" fillOpacity="0.88" />

          {/* Medium Translucent Lime Circle */}
          <circle
            cx={220 - limeBloom * 0.4}
            cy={250 + limeBloom * 0.2}
            r={95 + limeBloom * 0.25}
            fill="#CCF06E"
            fillOpacity="0.65"
            className="transition-all duration-400 ease-out"
          />

          {/* Dark Forest Green Center Circle */}
          <circle
            cx="330"
            cy="280"
            r="60"
            fill="#76A31D"
            className="transition-transform duration-500 ease-out"
          />

          {/* Small Satellite Circle */}
          <circle
            cx={155 - limeBloom * 0.6}
            cy={270 - limeBloom * 0.2}
            r={28}
            fill="#CCF06E"
            className="transition-all duration-300 ease-out"
          />

          {/* Dashed Orbit Arc */}
          <path
            d="M 230 130 C 260 180, 290 200, 330 210"
            stroke="#76A31D"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="230" cy="130" r="6" fill="#B8E34A" />
        </svg>

        {/* Clean Label for Lime in clear open space */}
        <div className="absolute bottom-[48px] sm:bottom-[60px] right-[20px] sm:right-[32px] text-right font-sans pointer-events-auto">
          <span className="sr-only">새로운 만남에 열린 우리</span>
          <p className="text-[12px] sm:text-[14px] font-semibold leading-[1.3] text-[#171923]">
            새로운 만남에<br />
            열린 우리
          </p>
          <div className="w-5 h-[1.5px] bg-[#171923]/40 mt-1.5 ml-auto" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🏛️ CENTER HERO CONTENT: GUARANTEED ZERO OVERLAP           */}
      {/* ======================================================== */}
      <main className="relative z-20 my-auto flex flex-col items-center justify-center text-center px-4 max-w-lg sm:max-w-xl mx-auto">
        
        {/* 4 Colored Archetype Dots */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#FF654F] shadow-xs" title="Coral: 마주보며 연결되는 우리" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#4169E1] shadow-xs" title="Blue: 온라인으로 연결되는 우리" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#B8E34A] shadow-xs" title="Lime: 새로운 만남에 열린 우리" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#8064D8] shadow-xs" title="Violet: 나만의 속도로 관계 맺는 우리" />
        </div>

        {/* Top Caption: 서로 다른 우리가 만드는 더 큰 우리 */}
        <p className="text-[14px] sm:text-[15.5px] text-[#171923] font-medium tracking-[-0.01em] mb-2 sm:mb-2.5">
          서로 다른 우리가 만드는 더 큰 우리
        </p>

        {/* Big Bold 2-Line Title: ‘우리’ 유형 \n 테스트 */}
        <h1 className="relative font-bold text-[#171923] text-center leading-[1.06] mb-3.5 sm:mb-4">
          <span className="sr-only">‘우리’ 유형 테스트</span>
          <span
            aria-hidden="true"
            className="block text-[clamp(44px,6.4vw,88px)] font-black tracking-[-0.04em] font-sans"
          >
            ‘우리’ 유형
          </span>
          <span
            aria-hidden="true"
            className="block text-[clamp(44px,6.4vw,88px)] font-black tracking-[-0.04em] font-sans"
          >
            테스트
          </span>
        </h1>

        {/* Subtitle & Introduction Text */}
        <div className="mb-6 sm:mb-8 max-w-md mx-auto">
          <p className="text-[15px] sm:text-[17px] font-medium text-[#171923] tracking-[-0.02em]">
            여섯 개의 질문에 답하면 나의 &lsquo;우리&rsquo; 유형을 볼 수 있어요.
          </p>
        </div>

        {/* Primary CTA Button: 검정색 둥근 테스트 시작 버튼 */}
        <button
          onClick={onStart}
          className="group inline-flex items-center justify-center gap-2.5 w-full max-w-[260px] sm:max-w-[280px] h-[54px] sm:h-[62px] text-[16px] sm:text-[18px] font-medium text-white bg-[#171923] hover:bg-[#252836] active:scale-[0.98] rounded-full transition-all duration-250 ease-out shadow-[0_12px_28px_-6px_rgba(23,25,35,0.22)] hover:shadow-[0_16px_36px_-6px_rgba(23,25,35,0.32)] hover:scale-[1.04]"
        >
          <span>테스트 시작하기</span>
          <span
            aria-hidden="true"
            className="text-[20px] transition-transform duration-250 ease-out group-hover:translate-x-1.5"
          >
            →
          </span>
        </button>

      </main>

      {/* ======================================================== */}
      {/* ⬇️ BOTTOM SCROLL CONTROL                                  */}
      {/* ======================================================== */}
      <footer className="relative z-30 pb-4 sm:pb-6 flex flex-col items-center justify-center font-sans">
        <button
          onClick={onScrollToDetails}
          className="group flex flex-col items-center gap-1.5 text-[#64748B] hover:text-[#171923] transition-colors focus:outline-hidden"
          aria-label="유형 및 테스트 소개로 스크롤 이동"
        >
          <div className="w-8 h-8 rounded-full border border-[#171923]/25 group-hover:border-[#171923] flex items-center justify-center transition-all duration-200 group-hover:translate-y-0.5">
            <span className="text-[13px] text-[#171923]/70 group-hover:text-[#171923] leading-none">
              ↓
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-[0.18em] text-[#171923]/60 group-hover:text-[#171923] uppercase">
            SCROLL
          </span>
        </button>
      </footer>

    </div>
  );
};
