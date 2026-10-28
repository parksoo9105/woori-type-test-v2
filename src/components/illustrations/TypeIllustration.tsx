import React from 'react';
import { ResultTypeId } from '../../types';
import { TYPE_CONFIG } from '../../data/cardDesigns';

interface TypeIllustrationProps {
  typeId: ResultTypeId;
  className?: string;
  showTextOverlay?: boolean;
}

export const TypeIllustration: React.FC<TypeIllustrationProps> = ({
  typeId,
  className = '',
}) => {
  const config = TYPE_CONFIG[typeId];

  return (
    <div
      className={`relative aspect-[470/836] w-full rounded-[26px] overflow-hidden select-none shadow-[0_16px_36px_-6px_rgba(23,25,35,0.12)] border border-[#E4E2D8]/80 ${className}`}
    >
      <img
        src={`/cards/card-${typeId}.png`}
        alt={`${config.title} - ${config.subtitle}`}
        className="w-full h-full object-cover block select-none"
        draggable={false}
      />
      {/* Semantic accessibility nodes for screen readers and automated tests */}
      <span className="sr-only">{config.title}</span>
      <span className="sr-only">{config.subtitle}</span>
    </div>
  );
};
