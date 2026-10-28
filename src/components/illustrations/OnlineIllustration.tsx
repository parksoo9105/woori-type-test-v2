import React from 'react';

export const OnlineIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <svg
      viewBox="0 0 270 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="온라인으로 연결되는 우리 카드 일러스트레이션"
    >
      <defs>
        <linearGradient id="online-card-bg" x1="135" y1="0" x2="135" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F7F9" />
          <stop offset="0.6" stopColor="#E4EFF3" />
          <stop offset="1" stopColor="#D5E6EC" />
        </linearGradient>
        <linearGradient id="screen-grad-left" x1="25" y1="90" x2="120" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EDF5F8" />
        </linearGradient>
        <linearGradient id="screen-grad-right" x1="150" y1="80" x2="245" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EDF5F8" />
        </linearGradient>
      </defs>

      {/* Card Canvas Base */}
      <rect width="270" height="360" rx="20" fill="url(#online-card-bg)" />

      {/* Delicate Inner Frame Hairline */}
      <rect x="10" y="10" width="250" height="340" rx="14" stroke="#B8D3DD" strokeWidth="1" strokeDasharray="4 3" />

      {/* Constellation Arch Lines */}
      <path
        d="M72 150 C 105 85, 165 85, 198 140"
        stroke="#457A8C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M75 195 C 115 240, 155 240, 195 190"
        stroke="#76A4B4"
        strokeWidth="1.5"
      />

      {/* Radiant Central Intersection Node */}
      <circle cx="135" cy="110" r="16" fill="#D3E8EE" opacity="0.8" />
      <circle cx="135" cy="110" r="8" fill="#2E6375" />
      <circle cx="135" cy="225" r="5" fill="#4B8294" />

      {/* Floating Card Screen Left */}
      <rect x="28" y="105" width="90" height="120" rx="14" fill="url(#screen-grad-left)" stroke="#B3D0DC" strokeWidth="1.5" />
      <circle cx="43" cy="120" r="3" fill="#9FBECB" />
      <circle cx="52" cy="120" r="3" fill="#CFE2E8" />
      <line x1="38" y1="130" x2="108" y2="130" stroke="#E3EEF3" strokeWidth="1" />
      
      {/* Figure Left Inside Screen */}
      <circle cx="73" cy="158" r="14" fill="#204654" />
      <path d="M52 225C52 192 61 180 73 180C85 180 94 192 94 225" fill="#366677" />

      {/* Floating Card Screen Right (Elevated) */}
      <rect x="152" y="85" width="90" height="120" rx="14" fill="url(#screen-grad-right)" stroke="#B3D0DC" strokeWidth="1.5" />
      <circle cx="167" cy="100" r="3" fill="#9FBECB" />
      <circle cx="176" cy="100" r="3" fill="#CFE2E8" />
      <line x1="162" y1="110" x2="232" y2="110" stroke="#E3EEF3" strokeWidth="1" />
      
      {/* Figure Right Inside Screen */}
      <circle cx="197" cy="138" r="14" fill="#173945" />
      <path d="M176 205C176 172 185 160 197 160C209 160 218 172 218 205" fill="#2D5C6D" />

      {/* Digital Data Ripples / Stars */}
      <circle cx="55" cy="65" r="3" fill="#A8CAD6" />
      <circle cx="215" cy="55" r="4" fill="#A8CAD6" />
      <circle cx="135" cy="50" r="5" fill="#91BCCB" />
      <circle cx="85" cy="285" r="4" fill="#A8CAD6" />
      <circle cx="185" cy="275" r="5" fill="#A8CAD6" />

      {/* Floating Signal Waves */}
      <path d="M125 155C135 150 135 160 145 155" stroke="#689AAF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
