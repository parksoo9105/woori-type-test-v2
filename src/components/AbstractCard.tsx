import React from 'react';
import { ResultTypeId } from '../types';

interface AbstractCardProps {
  typeId: ResultTypeId;
  className?: string;
  isHovered?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const AbstractCard: React.FC<AbstractCardProps> = ({
  typeId,
  className = '',
  isHovered = false,
  onClick,
  style,
}) => {
  if (typeId === 'type-1') {
    // 01: Coral Red #FF654F — 마주보는 정원사 (익숙한 이들과 깊게 연결되는 우리)
    return (
      <div
        onClick={onClick}
        style={style}
        className={`relative aspect-[340/500] w-full rounded-[28px] overflow-hidden select-none transition-all duration-300 ${className}`}
      >
        <span className="sr-only">TYPE 01 · RED 마주보는 정원사 - 익숙한 이들과 깊게 연결되는 우리</span>
        <svg
          viewBox="0 0 340 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
        >
          {/* Card Base */}
          <rect width="340" height="500" rx="28" fill="#FFF4F1" />

          {/* Organic Coral Wave Blobs */}
          <path
            d="M 160 0 C 230 40, 260 90, 280 140 C 310 200, 310 260, 340 280 L 340 0 Z"
            fill="#FF8573"
            fillOpacity="0.45"
          />
          <path
            d="M 0 160 C 50 130, 110 160, 150 210 C 200 270, 220 370, 340 370 L 340 500 L 0 500 Z"
            fill="#FF654F"
            fillOpacity="0.92"
          />
          <path
            d="M 0 350 C 60 310, 110 330, 140 370 C 180 430, 220 480, 260 500 L 0 500 Z"
            fill="#E64530"
          />

          {/* Top Header Badge */}
          <text
            x="28"
            y="54"
            fill="#FF654F"
            fontFamily="Pretendard, Inter, sans-serif"
            fontSize="26"
            fontWeight="700"
          >
            01
          </text>
          <text
            x="28"
            y="74"
            fill="#FF654F"
            fontFamily="Inter, sans-serif"
            fontSize="10.5"
            fontWeight="600"
            letterSpacing="0.08em"
          >
            TYPE 01 · RED
          </text>

          {/* Center Graphic: Two Overlapping Circles & Axis */}
          <g
            className="transition-transform duration-300 ease-out"
            style={{
              transform: isHovered ? 'scale(1.03) translateY(-2px)' : 'none',
              transformOrigin: '160px 220px',
            }}
          >
            {/* Left Primary White Circle */}
            <circle cx="116" cy="220" r="64" fill="#FFFFFF" fillOpacity="0.92" />
            {/* Right Translucent Circle */}
            <circle cx="204" cy="220" r="64" fill="#FFFFFF" fillOpacity="0.55" />
            {/* Central Focal Point / Lens Accent */}
            <circle cx="160" cy="220" r="18" fill="#FF654F" fillOpacity="0.9" />

            {/* Diagonal Axis line & Endpoints */}
            <line
              x1="86"
              y1="160"
              x2="234"
              y2="280"
              stroke="#FF654F"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.75"
            />
            <circle cx="86" cy="160" r="3.5" fill="#FF654F" />
            <circle cx="234" cy="280" r="3.5" fill="#FF654F" />
          </g>

          {/* Bottom Content: Title & Subtitle */}
          <text
            x="28"
            y="432"
            fill="#FFFFFF"
            fontFamily="Pretendard, sans-serif"
            fontSize="24"
            fontWeight="800"
            letterSpacing="-0.03em"
          >
            마주보는 정원사
          </text>
          <text
            x="28"
            y="462"
            fill="#FFFFFF"
            fillOpacity="0.92"
            fontFamily="Pretendard, sans-serif"
            fontSize="13.5"
            fontWeight="500"
            letterSpacing="-0.01em"
          >
            익숙한 이들과 깊게 연결되는 우리
          </text>
        </svg>
      </div>
    );
  }

  if (typeId === 'type-2') {
    // 02: Electric Blue #4169E1 — 연결망의 항해자 (온라인으로 연결되는 우리)
    return (
      <div
        onClick={onClick}
        style={style}
        className={`relative aspect-[340/500] w-full rounded-[28px] overflow-hidden select-none transition-all duration-300 ${className}`}
      >
        <span className="sr-only">TYPE 02 · BLUE 연결망의 항해자 - 온라인으로 연결되는 우리</span>
        <svg
          viewBox="0 0 340 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
        >
          {/* Card Base */}
          <rect width="340" height="500" rx="28" fill="#F0F5FF" />

          {/* Organic Blue Wave Blobs */}
          <path
            d="M 120 0 C 180 30, 240 80, 260 140 C 290 220, 310 270, 340 290 L 340 0 Z"
            fill="#7598F5"
            fillOpacity="0.4"
          />
          <path
            d="M 0 170 C 60 140, 120 170, 160 220 C 210 290, 230 380, 340 370 L 340 500 L 0 500 Z"
            fill="#4169E1"
            fillOpacity="0.95"
          />
          <path
            d="M 0 370 C 50 330, 100 340, 130 390 C 170 450, 210 490, 250 500 L 0 500 Z"
            fill="#274BB8"
          />

          {/* Top Header Badge */}
          <text
            x="28"
            y="54"
            fill="#4169E1"
            fontFamily="Pretendard, Inter, sans-serif"
            fontSize="26"
            fontWeight="700"
          >
            02
          </text>
          <text
            x="28"
            y="74"
            fill="#4169E1"
            fontFamily="Inter, sans-serif"
            fontSize="10.5"
            fontWeight="600"
            letterSpacing="0.08em"
          >
            TYPE 02 · BLUE
          </text>

          {/* Center Graphic: Connected Nodes Network */}
          <g
            className="transition-transform duration-300 ease-out"
            style={{
              transform: isHovered ? 'scale(1.03) translateY(-2px)' : 'none',
              transformOrigin: '160px 220px',
            }}
          >
            {/* Surrounding orbit line */}
            <path
              d="M 85 170 C 160 120, 240 130, 255 175 C 270 230, 230 280, 175 295 C 120 310, 70 260, 85 170 Z"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="5 5"
              strokeOpacity="0.75"
              fill="none"
            />

            {/* Network Connection Lines */}
            <path
              d="M 90 175 L 245 165 L 180 290 L 98 275 L 90 175 M 90 175 L 180 290 M 245 165 L 98 275"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeOpacity="0.8"
              fill="none"
            />

            {/* Nodes */}
            <circle cx="90" cy="175" r="17" fill="#FFFFFF" />
            <circle cx="90" cy="175" r="8" fill="#4169E1" />

            <circle cx="245" cy="165" r="23" fill="#FFFFFF" />
            <circle cx="245" cy="165" r="12" fill="#4169E1" />

            <circle cx="180" cy="290" r="27" fill="#FFFFFF" />
            <circle cx="180" cy="290" r="14" fill="#4169E1" />

            <circle cx="98" cy="275" r="14" fill="#FFFFFF" />
            <circle cx="98" cy="275" r="7" fill="#4169E1" />
          </g>

          {/* Bottom Content: Title & Subtitle */}
          <text
            x="28"
            y="432"
            fill="#FFFFFF"
            fontFamily="Pretendard, sans-serif"
            fontSize="24"
            fontWeight="800"
            letterSpacing="-0.03em"
          >
            연결망의 항해자
          </text>
          <text
            x="28"
            y="462"
            fill="#FFFFFF"
            fillOpacity="0.92"
            fontFamily="Pretendard, sans-serif"
            fontSize="13.5"
            fontWeight="500"
            letterSpacing="-0.01em"
          >
            온라인으로 연결되는 우리
          </text>
        </svg>
      </div>
    );
  }

  if (typeId === 'type-3') {
    // 03: Lime Green #B8E34A — 다리를 놓는 탐험가 (새로운 만남에 열린 우리)
    return (
      <div
        onClick={onClick}
        style={style}
        className={`relative aspect-[340/500] w-full rounded-[28px] overflow-hidden select-none transition-all duration-300 ${className}`}
      >
        <span className="sr-only">TYPE 03 · GREEN 다리를 놓는 탐험가 - 새로운 만남에 열린 우리</span>
        <svg
          viewBox="0 0 340 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
        >
          {/* Card Base */}
          <rect width="340" height="500" rx="28" fill="#F7FBEF" />

          {/* Organic Lime Wave Blobs */}
          <path
            d="M 130 0 C 190 30, 240 70, 270 130 C 300 200, 310 270, 340 280 L 340 0 Z"
            fill="#D5F285"
            fillOpacity="0.55"
          />
          <path
            d="M 0 170 C 60 130, 120 160, 160 210 C 210 280, 230 380, 340 370 L 340 500 L 0 500 Z"
            fill="#B8E34A"
            fillOpacity="0.95"
          />
          <path
            d="M 0 360 C 50 320, 100 330, 130 380 C 170 440, 200 480, 240 500 L 0 500 Z"
            fill="#9AC72E"
          />

          {/* Top Header Badge */}
          <text
            x="28"
            y="54"
            fill="#243221"
            fontFamily="Pretendard, Inter, sans-serif"
            fontSize="26"
            fontWeight="700"
          >
            03
          </text>
          <text
            x="28"
            y="74"
            fill="#243221"
            fontFamily="Inter, sans-serif"
            fontSize="10.5"
            fontWeight="600"
            letterSpacing="0.08em"
          >
            TYPE 03 · GREEN
          </text>

          {/* Center Graphic: Open Cluster of Circles */}
          <g
            className="transition-transform duration-300 ease-out"
            style={{
              transform: isHovered ? 'scale(1.03) translateY(-2px)' : 'none',
              transformOrigin: '160px 220px',
            }}
          >
            {/* Dashed outer orbit ring */}
            <circle
              cx="165"
              cy="225"
              r="84"
              fill="none"
              stroke="#243221"
              strokeWidth="2"
              strokeDasharray="4 7"
              strokeOpacity="0.75"
            />

            {/* Dark Forest Anchor Circle */}
            <circle cx="112" cy="205" r="44" fill="#243221" />

            {/* White Crisp Circle */}
            <circle cx="212" cy="188" r="34" fill="#FFFFFF" />

            {/* Translucent Soft White Circle */}
            <circle cx="192" cy="270" r="38" fill="#FFFFFF" fillOpacity="0.75" />

            {/* Small Anchor Dot */}
            <circle cx="120" cy="285" r="14" fill="#243221" />
          </g>

          {/* Bottom Content: Title & Subtitle */}
          <text
            x="28"
            y="432"
            fill="#243221"
            fontFamily="Pretendard, sans-serif"
            fontSize="24"
            fontWeight="800"
            letterSpacing="-0.03em"
          >
            다리를 놓는 탐험가
          </text>
          <text
            x="28"
            y="462"
            fill="#243221"
            fillOpacity="0.9"
            fontFamily="Pretendard, sans-serif"
            fontSize="13.5"
            fontWeight="500"
            letterSpacing="-0.01em"
          >
            새로운 만남에 열린 우리
          </text>
        </svg>
      </div>
    );
  }

  // 04: Soft Violet #8064D8 — 고요한 등대 (나만의 속도로 관계 맺는 우리)
  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative aspect-[340/500] w-full rounded-[28px] overflow-hidden select-none transition-all duration-300 ${className}`}
    >
      <span className="sr-only">TYPE 04 · PURPLE 고요한 등대 - 나만의 속도로 관계 맺는 우리</span>
      <svg
        viewBox="0 0 340 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
      >
        {/* Card Base */}
        <rect width="340" height="500" rx="28" fill="#F6F2FF" />

        {/* Organic Violet Wave Blobs */}
        <path
          d="M 120 0 C 180 30, 240 70, 270 130 C 300 200, 310 270, 340 280 L 340 0 Z"
          fill="#A894EB"
          fillOpacity="0.45"
        />
        <path
          d="M 0 170 C 60 130, 120 160, 160 210 C 210 280, 230 380, 340 370 L 340 500 L 0 500 Z"
          fill="#8064D8"
          fillOpacity="0.95"
        />
        <path
          d="M 0 360 C 50 320, 100 330, 130 380 C 170 440, 200 480, 240 500 L 0 500 Z"
          fill="#6649BD"
        />

        {/* Top Header Badge */}
        <text
          x="28"
          y="54"
          fill="#8064D8"
          fontFamily="Pretendard, Inter, sans-serif"
          fontSize="26"
          fontWeight="700"
        >
          04
        </text>
        <text
          x="28"
          y="74"
          fill="#8064D8"
          fontFamily="Inter, sans-serif"
          fontSize="10.5"
          fontWeight="600"
          letterSpacing="0.08em"
        >
          TYPE 04 · PURPLE
        </text>

        {/* Center Graphic: Harmonic S-Curve & Independent Points */}
        <g
          className="transition-transform duration-300 ease-out"
          style={{
            transform: isHovered ? 'scale(1.03) translateY(-2px)' : 'none',
            transformOrigin: '160px 220px',
          }}
        >
          {/* Harmonic S-Curve Path */}
          <path
            d="M 72 290 C 132 292, 116 138, 185 155 S 228 260, 275 185"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Anchor Point & Radiating Guide */}
          <circle cx="72" cy="290" r="28" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
          <circle cx="72" cy="290" r="19" fill="#FFFFFF" />
          <circle cx="72" cy="290" r="8" fill="#8064D8" />

          {/* Right Anchor Point */}
          <circle cx="275" cy="185" r="26" fill="#FFFFFF" />
          <circle cx="275" cy="185" r="11" fill="#8064D8" />

          {/* Harmonic Midpoint Echo */}
          <circle cx="185" cy="155" r="6" fill="#FFFFFF" fillOpacity="0.75" />
        </g>

        {/* Bottom Content: Title & Subtitle */}
        <text
          x="28"
          y="432"
          fill="#FFFFFF"
          fontFamily="Pretendard, sans-serif"
          fontSize="24"
          fontWeight="800"
          letterSpacing="-0.03em"
        >
          고요한 등대
        </text>
        <text
          x="28"
          y="462"
          fill="#FFFFFF"
          fillOpacity="0.92"
          fontFamily="Pretendard, sans-serif"
          fontSize="13.5"
          fontWeight="500"
          letterSpacing="-0.01em"
        >
          나만의 속도로 관계 맺는 우리
        </text>
      </svg>
    </div>
  );
};
