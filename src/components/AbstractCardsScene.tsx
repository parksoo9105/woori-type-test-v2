import React, { useState } from 'react';
import { ResultTypeId } from '../types';
import { AbstractCard } from './AbstractCard';

interface AbstractCardsSceneProps {
  className?: string;
  onSelectType?: (typeId: ResultTypeId) => void;
}

const CARDS_DATA: Array<{
  id: ResultTypeId;
  num: string;
  label: string;
  color: string;
  bgDot: string;
  rotation: string;
  offsetY: string;
}> = [
  {
    id: 'type-1',
    num: '01',
    label: '정원사',
    color: '#FF654F',
    bgDot: 'bg-[#FF654F]',
    rotation: '-rotate-[4deg]',
    offsetY: '-translate-y-2',
  },
  {
    id: 'type-2',
    num: '02',
    label: '항해자',
    color: '#4169E1',
    bgDot: 'bg-[#4169E1]',
    rotation: '-rotate-[1deg]',
    offsetY: 'translate-y-3',
  },
  {
    id: 'type-3',
    num: '03',
    label: '수집가',
    color: '#B8E34A',
    bgDot: 'bg-[#B8E34A]',
    rotation: 'rotate-[1.5deg]',
    offsetY: '-translate-y-1',
  },
  {
    id: 'type-4',
    num: '04',
    label: '등대',
    color: '#8064D8',
    bgDot: 'bg-[#8064D8]',
    rotation: 'rotate-[4deg]',
    offsetY: 'translate-y-2',
  },
];

export const AbstractCardsScene: React.FC<AbstractCardsSceneProps> = ({
  className = '',
  onSelectType,
}) => {
  const [hoveredCard, setHoveredCard] = useState<ResultTypeId | null>(null);
  const [activeMobileCard, setActiveMobileCard] = useState<ResultTypeId>('type-1');

  return (
    <div className={`relative w-full select-none ${className}`}>
      
      {/* 🎨 Ambient Organic Blob Shapes in Background (Vector SVG) */}
      <div className="absolute inset-0 pointer-events-none overflow-visible -z-10" aria-hidden="true">
        <svg
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full scale-110"
        >
          {/* Coral Top-Left Splash */}
          <path
            d="M 120 180 C 40 140, 20 280, 70 360 C 130 460, 240 430, 280 340 C 320 250, 200 220, 120 180 Z"
            fill="#FF654F"
            fillOpacity="0.85"
          />
          <circle cx="85" cy="480" r="24" fill="#FF654F" />

          {/* Electric Blue Central Splash */}
          <path
            d="M 320 80 C 260 40, 360 -20, 430 30 C 510 90, 480 200, 410 210 C 340 220, 380 120, 320 80 Z"
            fill="#4169E1"
            fillOpacity="0.88"
          />

          {/* Lime Green Top-Right Splash */}
          <path
            d="M 520 110 C 460 70, 560 -10, 650 30 C 740 70, 750 200, 680 260 C 610 320, 580 150, 520 110 Z"
            fill="#B8E34A"
            fillOpacity="0.9"
          />
          <circle cx="730" cy="110" r="28" fill="#B8E34A" />

          {/* Soft Violet Bottom-Right Splash */}
          <path
            d="M 640 240 C 740 220, 830 320, 780 430 C 730 540, 600 560, 560 470 C 520 380, 540 260, 640 240 Z"
            fill="#8064D8"
            fillOpacity="0.88"
          />
        </svg>
      </div>

      {/* ======================================================== */}
      {/* 🖥️ DESKTOP / TABLET: Fanned Overlapping 4-Card Composition */}
      {/* ======================================================== */}
      <div className="hidden sm:grid sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 items-center max-w-[720px] mx-auto py-6">
        {CARDS_DATA.map((card, idx) => {
          const isHovered = hoveredCard === card.id;
          const isAnotherHovered = hoveredCard !== null && !isHovered;

          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => onSelectType?.(card.id)}
              className={`relative cursor-pointer transition-all duration-300 ease-out transform ${
                isHovered
                  ? 'scale-[1.05] -translate-y-4 rotate-0 z-30 shadow-[0_24px_48px_-8px_rgba(23,25,35,0.18)]'
                  : `${card.rotation} ${card.offsetY} ${
                      isAnotherHovered ? 'opacity-85 scale-[0.98]' : 'opacity-100 hover:scale-[1.02]'
                    } shadow-[0_16px_32px_-6px_rgba(23,25,35,0.12),0_4px_12px_-2px_rgba(23,25,35,0.06)]`
              }`}
              style={{
                zIndex: isHovered ? 40 : 10 + idx,
              }}
            >
              <AbstractCard
                typeId={card.id}
                isHovered={isHovered}
              />
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 📱 MOBILE: Interactive Showcase with Segmented Switcher   */}
      {/* ======================================================== */}
      <div className="sm:hidden flex flex-col items-center w-full px-2">
        {/* Active Card Preview */}
        <div className="w-full max-w-[280px] mx-auto my-2 shadow-[0_18px_36px_-6px_rgba(23,25,35,0.14)] rounded-[28px] overflow-hidden">
          <AbstractCard typeId={activeMobileCard} />
        </div>

        {/* 4 Types Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1.5 w-full max-w-[320px] mt-4 p-1.5 bg-white/90 backdrop-blur rounded-2xl border border-[#E4E2D8]">
          {CARDS_DATA.map((card) => {
            const isActive = activeMobileCard === card.id;
            return (
              <button
                key={card.id}
                onClick={() => setActiveMobileCard(card.id)}
                className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#171923] text-white shadow-xs font-semibold'
                    : 'text-[#64748B] hover:text-[#171923] font-medium'
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-sans">
                  {card.num}
                </span>
                <span className="text-[11px] truncate w-full mt-0.5">
                  {card.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
