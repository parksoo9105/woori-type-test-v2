import React from 'react';
import { ResultTypeId } from '../../types';
import { CARD_IMAGES, TYPE_CONFIG } from '../../data/cardDesigns';

interface TypeIllustrationProps {
  typeId: ResultTypeId;
  className?: string;
  showTextOverlay?: boolean;
}

export const TypeIllustration: React.FC<TypeIllustrationProps> = ({
  typeId,
  className = '',
  showTextOverlay = true,
}) => {
  const config = TYPE_CONFIG[typeId];
  const imgSrc = CARD_IMAGES[typeId];

  // When showTextOverlay is true (e.g. on ResultScreen), display the complete, high-res result card image
  // This guarantees 1:1 visual match with KakaoTalk sharing, preview modal, and card downloads
  if (showTextOverlay) {
    return (
      <div
        className={`relative aspect-[470/836] w-full rounded-3xl overflow-hidden select-none shadow-[0_16px_36px_-6px_rgba(23,25,35,0.12)] ${className}`}
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
  }

  // When showTextOverlay is false (e.g. on StartScreen archetype showcase)
  return (
    <div
      className={`relative aspect-[470/836] w-full rounded-[24px] overflow-hidden select-none shadow-[0_16px_36px_-6px_rgba(23,25,35,0.14)] ${className}`}
    >
      <img
        src={imgSrc}
        alt={`${config.title} - ${config.subtitle}`}
        className="w-full h-full object-cover block select-none"
        draggable={false}
      />
    </div>
  );
};
