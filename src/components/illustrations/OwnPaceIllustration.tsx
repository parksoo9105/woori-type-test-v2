import React from 'react';

export const OwnPaceIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <svg
      viewBox="0 0 270 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="나만의 속도로 관계 맺는 우리 카드 일러스트레이션"
    >
      <defs>
        <linearGradient id="pace-card-bg" x1="135" y1="0" x2="135" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4F4F7" />
          <stop offset="0.6" stopColor="#E6E6EE" />
          <stop offset="1" stopColor="#D6D6E2" />
        </linearGradient>
        <linearGradient id="pace-aura-port" x1="135" y1="90" x2="135" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D8D8E8" />
          <stop offset="1" stopColor="#BCBCD1" />
        </linearGradient>
        <linearGradient id="moon-grad-port" x1="185" y1="50" x2="225" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE9D0" />
          <stop offset="1" stopColor="#D5D0B2" />
        </linearGradient>
      </defs>

      {/* Card Canvas Base */}
      <rect width="270" height="360" rx="20" fill="url(#pace-card-bg)" />

      {/* Delicate Inner Frame Hairline */}
      <rect x="10" y="10" width="250" height="340" rx="14" stroke="#C5C4D8" strokeWidth="1" strokeDasharray="4 3" />

      {/* Peaceful Crescent Moon */}
      <circle cx="205" cy="75" r="22" fill="url(#moon-grad-port)" />
      <circle cx="197" cy="70" r="20" fill="#F4F4F7" />

      {/* Rhythmic Orbital Path (One's Own Orbit) */}
      <ellipse
        cx="135"
        cy="225"
        rx="105"
        ry="42"
        stroke="#B4B2CA"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* Stepping Stones / Pebbles with Individual Spacing */}
      <ellipse cx="38" cy="228" rx="15" ry="8" fill="#C2C0D4" />
      <ellipse cx="78" cy="245" rx="17" ry="9" fill="#B0AEC6" />
      <ellipse cx="192" cy="245" rx="17" ry="9" fill="#B0AEC6" />
      <ellipse cx="232" cy="228" rx="15" ry="8" fill="#C2C0D4" />

      {/* Gentle Personal Space Capsule / Aura */}
      <ellipse cx="135" cy="210" rx="48" ry="58" fill="url(#pace-aura-port)" opacity="0.35" />
      <ellipse cx="135" cy="210" rx="48" ry="58" stroke="#9A96B6" strokeWidth="1" strokeDasharray="3 3" />

      {/* Resting Stone / Bench */}
      <path
        d="M105 252H165C170 252 172 255 170 259C168 263 163 266 158 266H112C107 266 102 263 100 259C98 255 100 252 105 252Z"
        fill="#3F435C"
      />

      {/* Contemplative Figure Sitting in Self-Tempo */}
      <g>
        <circle cx="135" cy="178" r="15" fill="#292C40" />
        <path d="M115 252C115 214 124 202 135 202C146 202 155 214 155 252" fill="#4B5172" />
        <path d="M125 224C129 232 141 232 145 224" stroke="#353952" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Subtle Mindfulness Sparks / Constellations */}
      <circle cx="65" cy="110" r="3" fill="#A8A4C2" />
      <circle cx="95" cy="85" r="2.5" fill="#BEBACF" />
      <circle cx="135" cy="60" r="3" fill="#A8A4C2" />
      <circle cx="170" cy="120" r="2.5" fill="#A8A4C2" />
      <circle cx="50" cy="165" r="3" fill="#A8A4C2" />
    </svg>
  );
};
