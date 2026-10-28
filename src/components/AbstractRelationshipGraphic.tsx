import React, { useState } from 'react';
import { ResultTypeId } from '../types';

export type GraphicMode = ResultTypeId | 'all';

interface AbstractRelationshipGraphicProps {
  typeId: GraphicMode;
  className?: string;
  interactive?: boolean;
}

export const AbstractRelationshipGraphic: React.FC<AbstractRelationshipGraphicProps> = ({
  typeId,
  className = '',
  interactive = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Common colors strictly matching specification
  const CORAL = '#FF654F';
  const BLUE = '#4169E1';
  const LIME = '#B8E34A';
  const VIOLET = '#8064D8';
  const INK = '#171923';

  // 1. TYPE 01: Coral Red #FF654F — 마주하며 부분적으로 겹치는 두 원 (가까움·직접 교감)
  if (typeId === 'type-1') {
    return (
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full block ${className}`}
        aria-label="마주보며 연결되는 우리 추상 도식"
      >
        {/* Left Circle */}
        <circle
          cx="90"
          cy="120"
          r="54"
          fill={CORAL}
          fillOpacity="0.92"
          className="transition-transform duration-300 ease-out"
          style={{
            transform: interactive && isHovered ? 'translateX(-2px)' : 'none',
          }}
        />
        {/* Right Circle */}
        <circle
          cx="150"
          cy="120"
          r="54"
          fill={CORAL}
          fillOpacity="0.92"
          className="transition-transform duration-300 ease-out"
          style={{
            transform: interactive && isHovered ? 'translateX(2px)' : 'none',
          }}
        />
        {/* Overlapping intersection lens */}
        <path
          d="M 120 75 A 54 54 0 0 1 120 165 A 54 54 0 0 1 120 75 Z"
          fill="#E64530"
          fillOpacity="0.95"
        />
      </svg>
    );
  }

  // 2. TYPE 02: Electric Blue #4169E1 — 서로 떨어진 여러 점을 연결하는 선·네트워크 (비대면 연결)
  if (typeId === 'type-2') {
    return (
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full block ${className}`}
        aria-label="온라인으로 연결되는 우리 추상 도식"
      >
        {/* Connection Network Lines */}
        <path
          d="M 50 80 L 115 55 L 185 85 L 195 160 L 125 185 L 65 155 Z"
          stroke={BLUE}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5 3"
        />
        <line x1="115" y1="55" x2="125" y2="185" stroke={BLUE} strokeWidth="2.5" strokeOpacity="0.75" />
        <line x1="50" y1="80" x2="185" y2="85" stroke={BLUE} strokeWidth="2.5" strokeOpacity="0.75" />
        <line x1="65" y1="155" x2="195" y2="160" stroke={BLUE} strokeWidth="2.5" strokeOpacity="0.75" />

        {/* Nodes / Dots */}
        <circle cx="50" cy="80" r="7.5" fill={BLUE} />
        <circle cx="115" cy="55" r="9" fill={BLUE} />
        <circle cx="185" cy="85" r="7.5" fill={BLUE} />
        <circle cx="195" cy="160" r="8.5" fill={BLUE} />
        <circle cx="125" cy="185" r="9.5" fill={BLUE} />
        <circle cx="65" cy="155" r="7.5" fill={BLUE} />
        <circle cx="120" cy="120" r="5" fill={INK} />
      </svg>
    );
  }

  // 3. TYPE 03: Lime Green #B8E34A — 크기가 다른 원들이 느슨하게 모인 열린 군집 (모임·개방성)
  if (typeId === 'type-3') {
    return (
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full block ${className}`}
        aria-label="새로운 만남에 열린 우리 추상 도식"
      >
        {/* Loose open cluster of varied circles */}
        <circle cx="85" cy="85" r="32" fill={LIME} />
        <circle cx="150" cy="75" r="22" fill={LIME} />
        <circle cx="170" cy="135" r="28" fill={LIME} />
        <circle cx="115" cy="165" r="24" fill={LIME} />
        <circle cx="60" cy="145" r="17" fill={LIME} />
        <circle cx="122" cy="115" r="11" fill={INK} />
      </svg>
    );
  }

  // 4. TYPE 04: Soft Violet #8064D8 — 서로 다른 위치의 두 점을 하나의 부드러운 곡선으로 연결 (리듬과 지속성)
  if (typeId === 'type-4') {
    return (
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full block ${className}`}
        aria-label="나만의 속도로 관계 맺는 우리 추상 도식"
      >
        {/* Harmonic S-Curve Path connecting the two points */}
        <path
          d="M 45 165 C 80 215, 120 45, 195 75"
          stroke={VIOLET}
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Secondary rhythm echo line */}
        <path
          d="M 45 165 C 80 215, 120 45, 195 75"
          stroke={VIOLET}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeDasharray="4 4"
        />
        {/* Anchor point 1 */}
        <circle cx="45" cy="165" r="11" fill={VIOLET} />
        <circle cx="45" cy="165" r="4.5" fill="#FFFFFF" />

        {/* Anchor point 2 */}
        <circle cx="195" cy="75" r="11" fill={VIOLET} />
        <circle cx="195" cy="75" r="4.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // =========================================================================
  // 5. UNIFIED HERO COMPOSITION ('all') for Screen A (시작 / INTRO)
  // 하나의 대담한 추상 구성: 4개 유형의 컬러와 도식이 서로 만나고 겹침
  // =========================================================================
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full aspect-[5/4] max-w-[540px] mx-auto select-none ${className}`}
    >
      <svg
        viewBox="0 0 540 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
        aria-label="우리 유형 4가지의 유기적 추상 결합 도식"
      >
        {/* Frame boundary / background accent plate */}
        <rect width="540" height="440" rx="32" fill="#FFFFFF" />

        {/* 1. TYPE 01: Coral Red Overlapping Circles (Top Left / Center) */}
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transform: isHovered ? 'translate(-2px, -2px)' : 'none',
          }}
        >
          <circle cx="130" cy="150" r="74" fill={CORAL} fillOpacity="0.9" />
          <circle cx="215" cy="150" r="74" fill={CORAL} fillOpacity="0.9" />
          {/* Overlap area with deep contrast */}
          <path
            d="M 172.5 88 A 74 74 0 0 1 172.5 212 A 74 74 0 0 1 172.5 88 Z"
            fill="#E64530"
          />
        </g>

        {/* 2. TYPE 02: Electric Blue Network (Top Right / Center) */}
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transform: isHovered ? 'translate(3px, -2px)' : 'none',
          }}
        >
          <path
            d="M 330 90 L 415 65 L 470 120 L 440 185 L 360 170 Z"
            stroke={BLUE}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 4"
          />
          <line x1="330" y1="90" x2="440" y2="185" stroke={BLUE} strokeWidth="3" strokeOpacity="0.6" />
          <line x1="415" y1="65" x2="360" y2="170" stroke={BLUE} strokeWidth="3" strokeOpacity="0.6" />
          <circle cx="330" cy="90" r="9" fill={BLUE} />
          <circle cx="415" cy="65" r="10" fill={BLUE} />
          <circle cx="470" cy="120" r="9" fill={BLUE} />
          <circle cx="440" cy="185" r="10" fill={BLUE} />
          <circle cx="360" cy="170" r="8.5" fill={BLUE} />
        </g>

        {/* 3. TYPE 03: Lime Green Open Cluster (Bottom Left) */}
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transform: isHovered ? 'translate(-2px, 3px)' : 'none',
          }}
        >
          <circle cx="105" cy="305" r="42" fill={LIME} />
          <circle cx="180" cy="285" r="28" fill={LIME} />
          <circle cx="215" cy="350" r="34" fill={LIME} />
          <circle cx="145" cy="375" r="26" fill={LIME} />
          <circle cx="75" cy="365" r="20" fill={LIME} />
        </g>

        {/* 4. TYPE 04: Soft Violet Harmonic Curve (Bottom Right across to Center) */}
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transform: isHovered ? 'translate(2px, 2px)' : 'none',
          }}
        >
          <path
            d="M 285 360 C 330 425, 410 240, 480 290"
            stroke={VIOLET}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="285" cy="360" r="13" fill={VIOLET} />
          <circle cx="285" cy="360" r="5" fill="#FFFFFF" />
          <circle cx="480" cy="290" r="13" fill={VIOLET} />
          <circle cx="480" cy="290" r="5" fill="#FFFFFF" />
        </g>

        {/* Central Intersection Anchor (Where all 4 modes touch) */}
        <circle cx="270" cy="220" r="6" fill={INK} />
        <circle cx="270" cy="220" r="14" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    </div>
  );
};
