import React from 'react';

export const OpenMindIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <svg
      viewBox="0 0 270 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="새로운 만남에 열린 우리 카드 일러스트레이션"
    >
      <defs>
        <linearGradient id="open-card-bg" x1="135" y1="0" x2="135" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FAF5F0" />
          <stop offset="0.6" stopColor="#EFE4D9" />
          <stop offset="1" stopColor="#E2D2C3" />
        </linearGradient>
        <linearGradient id="open-sun-port" x1="135" y1="60" x2="135" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EFA078" />
          <stop offset="1" stopColor="#DB7346" />
        </linearGradient>
        <linearGradient id="open-door-port" x1="90" y1="90" x2="180" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF9F5" />
          <stop offset="1" stopColor="#F5ECE2" />
        </linearGradient>
      </defs>

      {/* Card Canvas Base */}
      <rect width="270" height="360" rx="20" fill="url(#open-card-bg)" />

      {/* Delicate Inner Frame Hairline */}
      <rect x="10" y="10" width="250" height="340" rx="14" stroke="#D8C3B3" strokeWidth="1" strokeDasharray="4 3" />

      {/* Radiant Concentric Curiosity Rings */}
      <circle cx="135" cy="155" r="105" stroke="#E2CDBC" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="135" cy="155" r="82" stroke="#DBBEA8" strokeWidth="1.5" />
      <circle cx="135" cy="155" r="58" stroke="#D3AE94" strokeWidth="1.5" strokeDasharray="5 5" />

      {/* Rising Sun of Perspective */}
      <circle cx="135" cy="120" r="36" fill="url(#open-sun-port)" opacity="0.85" />

      {/* Portal / Arch of Possibility */}
      <path
        d="M85 280V140C85 112.38 107.38 90 135 90C162.62 90 185 112.38 185 140V280H85Z"
        fill="url(#open-door-port)"
        stroke="#C49B7E"
        strokeWidth="1.5"
      />

      {/* Ground Line */}
      <line x1="30" y1="280" x2="240" y2="280" stroke="#9A6548" strokeWidth="2" strokeLinecap="round" />

      {/* Welcoming Figure Stepping Through the Arch */}
      <g>
        <circle cx="135" cy="165" r="16" fill="#583120" />
        <path d="M112 280C112 215 121 200 135 200C149 200 158 215 158 280" fill="#884424" />
        {/* Open Welcoming Arms */}
        <path
          d="M110 220C90 212 74 218 62 228"
          stroke="#884424"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M160 220C180 212 196 218 208 228"
          stroke="#884424"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      {/* Floating Geometric Elements / New Perspectives */}
      <rect x="48" y="90" width="16" height="16" rx="4" transform="rotate(25 48 90)" fill="#D47B4D" opacity="0.8" />
      <circle cx="215" cy="95" r="10" fill="#C9683B" opacity="0.75" />
      <polygon points="200,160 214,180 186,180" fill="#B95C33" opacity="0.65" />
      <path d="M42,165 L56,174 L46,188 Z" fill="#C9754E" opacity="0.65" />
    </svg>
  );
};
