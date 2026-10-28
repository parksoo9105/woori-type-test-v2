import React from 'react';

export const FaceToFaceIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <svg
      viewBox="0 0 270 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="마주보며 연결되는 우리 카드 일러스트레이션"
    >
      <defs>
        <linearGradient id="face-card-bg" x1="135" y1="0" x2="135" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5F8F6" />
          <stop offset="0.6" stopColor="#EBF2ED" />
          <stop offset="1" stopColor="#DEE8E1" />
        </linearGradient>
        <linearGradient id="face-sun" x1="135" y1="60" x2="135" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDDCBF" />
          <stop offset="1" stopColor="#D8BE96" />
        </linearGradient>
      </defs>

      {/* Card Canvas Base */}
      <rect width="270" height="360" rx="20" fill="url(#face-card-bg)" />
      
      {/* Delicate Inner Frame Hairline */}
      <rect x="10" y="10" width="250" height="340" rx="14" stroke="#CBDDD2" strokeWidth="1" strokeDasharray="4 3" />

      {/* Sun of Warm Connection */}
      <circle cx="135" cy="115" r="42" fill="url(#face-sun)" opacity="0.75" />

      {/* Architectural Connection Arch */}
      <path
        d="M60 280V155C60 113.58 93.58 80 135 80C176.42 80 210 113.58 210 155V280"
        stroke="#B4CDC0"
        strokeWidth="1.5"
      />

      {/* Floating Gentle Leaves / Olive branch */}
      <path
        d="M135 60C135 60 141 50 150 53C150 60 141 64 135 65C129 64 120 60 120 53C129 50 135 60 135 60Z"
        fill="#4D7563"
      />

      {/* Shared Ground Line */}
      <line x1="32" y1="280" x2="238" y2="280" stroke="#719685" strokeWidth="2" strokeLinecap="round" />

      {/* Shared Meeting Table */}
      <path d="M100 280H170V220C170 216 166 213 162 213H108C104 213 100 216 100 220V280Z" fill="#365B4B" />
      <path d="M92 213H178" stroke="#1F3A2F" strokeWidth="3.5" strokeLinecap="round" />

      {/* Steaming Warm Cup in the Center */}
      <rect x="127" y="198" width="16" height="15" rx="3" fill="#EBD9C1" />
      <path d="M143 203C145 203 147 205 147 207C147 209 145 211 143 211" stroke="#D3B896" strokeWidth="1.5" />
      <path d="M135 190C134 185 136 182 135 177" stroke="#9BB8AA" strokeWidth="1.5" strokeLinecap="round" />

      {/* Left Person - Leaning In */}
      <g>
        <circle cx="58" cy="180" r="18" fill="#29483A" />
        <path d="M32 280C32 225 44 208 58 208C72 208 84 225 84 280" fill="#426C58" />
        <path d="M66 230C82 236 96 230 110 222" stroke="#426C58" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Right Person - Leaning In */}
      <g>
        <circle cx="212" cy="180" r="18" fill="#203A2E" />
        <path d="M186 280C186 225 198 208 212 208C226 208 238 225 238 280" fill="#335948" />
        <path d="M204 230C188 236 174 230 160 222" stroke="#335948" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Little Star / Spark of Connection */}
      <circle cx="135" cy="145" r="3.5" fill="#E8D1B5" />
      <circle cx="95" cy="130" r="2" fill="#ADC9BB" />
      <circle cx="175" cy="130" r="2" fill="#ADC9BB" />
    </svg>
  );
};
