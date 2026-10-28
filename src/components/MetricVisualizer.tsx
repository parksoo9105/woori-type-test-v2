import React from 'react';
import { ScoreBreakdown } from '../types';
import { Compass, Sparkles, Heart, Bot } from 'lucide-react';
import { toConnectionPercentage, toOpennessPercentage, toAIPercentage } from '../utils/scoring';

interface MetricVisualizerProps {
  breakdown: ScoreBreakdown;
  accentColor?: string;
}

export const MetricVisualizer: React.FC<MetricVisualizerProps> = ({
  breakdown,
}) => {
  const cScore = Math.min(Math.max(Number(breakdown.connectionScore) || 0, 0), 9);
  const oScore = Math.min(Math.max(Number(breakdown.opennessScore) || 0, 0), 9);
  const percentC = toConnectionPercentage(cScore);
  const percentO = toOpennessPercentage(oScore);
  const percentAI = toAIPercentage(breakdown.aiScore ?? 0);

  // 2D Plane Coordinate Geometry
  // SVG ViewBox: 0 0 380 320
  // Plotting bounds:
  // X: 50 (C=0) to 340 (C=9) => width = 290
  // Y: 260 (O=0) to 40 (O=9) => height = 220 (inverted top-down SVG)
  const plotLeft = 52;
  const plotRight = 342;
  const plotWidth = plotRight - plotLeft; // 290

  const plotBottom = 260;
  const plotTop = 40;
  const plotHeight = plotBottom - plotTop; // 220

  // Thresholds at C = 5 and O = 5
  const thresholdX = plotLeft + (5 / 9) * plotWidth; // ~213.1
  const thresholdY = plotBottom - (5 / 9) * plotHeight; // ~137.8

  // User Point Position
  const userX = plotLeft + (cScore / 9) * plotWidth;
  const userY = plotBottom - (oScore / 9) * plotHeight;

  // Active quadrant determination
  const isHighC = cScore >= 5;
  const isHighO = oScore >= 5;

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 space-y-6 border border-[#E4E2D8] shadow-xs text-left">
      {/* 🧭 Section Header */}
      <div className="flex items-center justify-between border-b border-[#E4E2D8] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#007CC3] text-white flex items-center justify-center shadow-xs">
            <Compass className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-[16px] sm:text-[17px] font-bold text-[#000000] tracking-tight">
              관계의 두 가지 지표 (2D 좌표계)
            </h3>
            <p className="text-[12px] text-[#666666] font-normal mt-0.5">
              연결감(C)과 개방도(O)의 상호작용으로 형성된 나의 좌표
            </p>
          </div>
        </div>
        <span className="text-[10.5px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#F5F3EE] text-[#443E3B] uppercase font-mono">
          2D MATRIX
        </span>
      </div>

      {/* 📊 2D Coordinate Graph (Swiss Editorial Style) */}
      <div className="relative w-full aspect-[380/320] bg-[#FAF9F5] rounded-2xl border border-[#E4E2D8] p-2 overflow-hidden shadow-2xs select-none">
        <svg
          viewBox="0 0 380 320"
          className="w-full h-full overflow-visible font-sans"
          aria-label={`2차원 관계 지표 좌표계: 연결감 ${cScore}점, 개방도 ${oScore}점`}
        >
          <defs>
            {/* Glow Filter for User Dot */}
            <filter id="userDotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#007CC3" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* 4 Quadrants Background Tints */}
          {/* Top-Right: TYPE 03 다리를 놓는 탐험가 (C>=5, O>=5) */}
          <rect
            x={thresholdX}
            y={plotTop}
            width={plotRight - thresholdX}
            height={thresholdY - plotTop}
            fill={isHighC && isHighO ? 'rgba(68, 62, 59, 0.12)' : 'rgba(68, 62, 59, 0.04)'}
            rx="8"
          />
          {/* Top-Left: TYPE 02 연결망의 항해자 (C<5, O>=5) */}
          <rect
            x={plotLeft}
            y={plotTop}
            width={thresholdX - plotLeft}
            height={thresholdY - plotTop}
            fill={!isHighC && isHighO ? 'rgba(0, 124, 195, 0.16)' : 'rgba(0, 124, 195, 0.05)'}
            rx="8"
          />
          {/* Bottom-Right: TYPE 01 마주보는 정원사 (C>=5, O<5) */}
          <rect
            x={thresholdX}
            y={thresholdY}
            width={plotRight - thresholdX}
            height={plotBottom - thresholdY}
            fill={isHighC && !isHighO ? 'rgba(240, 131, 0, 0.16)' : 'rgba(240, 131, 0, 0.05)'}
            rx="8"
          />
          {/* Bottom-Left: TYPE 04 고요한 등대 (C<5, O<5) */}
          <rect
            x={plotLeft}
            y={thresholdY}
            width={thresholdX - plotLeft}
            height={plotBottom - thresholdY}
            fill={!isHighC && !isHighO ? 'rgba(0, 0, 0, 0.10)' : 'rgba(0, 0, 0, 0.03)'}
            rx="8"
          />

          {/* Quadrant Archetype Text Badges */}
          {/* Top-Right Label */}
          <text
            x={thresholdX + (plotRight - thresholdX) / 2}
            y={plotTop + 24}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight={isHighC && isHighO ? '700' : '500'}
            fill={isHighC && isHighO ? '#171923' : '#777777'}
          >
            TYPE 03 탐험가
          </text>
          <text
            x={thresholdX + (plotRight - thresholdX) / 2}
            y={plotTop + 37}
            textAnchor="middle"
            fontSize="8.5"
            fill="#888888"
          >
            높은 연결감 · 높은 개방도
          </text>

          {/* Top-Left Label */}
          <text
            x={plotLeft + (thresholdX - plotLeft) / 2}
            y={plotTop + 24}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight={!isHighC && isHighO ? '700' : '500'}
            fill={!isHighC && isHighO ? '#007CC3' : '#777777'}
          >
            TYPE 02 항해자
          </text>
          <text
            x={plotLeft + (thresholdX - plotLeft) / 2}
            y={plotTop + 37}
            textAnchor="middle"
            fontSize="8.5"
            fill="#888888"
          >
            낮은 연결감 · 높은 개방도
          </text>

          {/* Bottom-Right Label */}
          <text
            x={thresholdX + (plotRight - thresholdX) / 2}
            y={plotBottom - 26}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight={isHighC && !isHighO ? '700' : '500'}
            fill={isHighC && !isHighO ? '#F08300' : '#777777'}
          >
            TYPE 01 정원사
          </text>
          <text
            x={thresholdX + (plotRight - thresholdX) / 2}
            y={plotBottom - 13}
            textAnchor="middle"
            fontSize="8.5"
            fill="#888888"
          >
            높은 연결감 · 낮은 개방도
          </text>

          {/* Bottom-Left Label */}
          <text
            x={plotLeft + (thresholdX - plotLeft) / 2}
            y={plotBottom - 26}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight={!isHighC && !isHighO ? '700' : '500'}
            fill={!isHighC && !isHighO ? '#000000' : '#777777'}
          >
            TYPE 04 등대
          </text>
          <text
            x={plotLeft + (thresholdX - plotLeft) / 2}
            y={plotBottom - 13}
            textAnchor="middle"
            fontSize="8.5"
            fill="#888888"
          >
            낮은 연결감 · 낮은 개방도
          </text>

          {/* Threshold Divider Lines (Dashed, at C=5, O=5) */}
          <line
            x1={thresholdX}
            y1={plotTop}
            x2={thresholdX}
            y2={plotBottom}
            stroke="#007CC3"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            opacity="0.45"
          />
          <line
            x1={plotLeft}
            y1={thresholdY}
            x2={plotRight}
            y2={thresholdY}
            stroke="#007CC3"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            opacity="0.45"
          />

          {/* Outer Border Frame */}
          <rect
            x={plotLeft}
            y={plotTop}
            width={plotWidth}
            height={plotHeight}
            fill="none"
            stroke="#D5D2C5"
            strokeWidth="1.2"
            rx="6"
          />

          {/* Axis Labels & Ticks */}
          {/* X-Axis (연결감 C) */}
          <text x={plotLeft} y={plotBottom + 16} fontSize="9" fill="#888888" textAnchor="middle">0</text>
          <text x={thresholdX} y={plotBottom + 16} fontSize="9.5" fontWeight="600" fill="#007CC3" textAnchor="middle">5 (기준점)</text>
          <text x={plotRight} y={plotBottom + 16} fontSize="9" fill="#888888" textAnchor="middle">9</text>
          <text x={plotLeft + plotWidth / 2} y={plotBottom + 32} fontSize="11" fontWeight="700" fill="#222222" textAnchor="middle">
            가로축: 연결감 (C) →
          </text>

          {/* Y-Axis (개방도 O) */}
          <text x={plotLeft - 8} y={plotBottom} fontSize="9" fill="#888888" textAnchor="end">0</text>
          <text x={plotLeft - 8} y={thresholdY + 3} fontSize="9.5" fontWeight="600" fill="#007CC3" textAnchor="end">5</text>
          <text x={plotLeft - 8} y={plotTop + 6} fontSize="9" fill="#888888" textAnchor="end">9</text>
          <text
            x={-(plotTop + plotHeight / 2)}
            y="18"
            transform="rotate(-90)"
            fontSize="11"
            fontWeight="700"
            fill="#222222"
            textAnchor="middle"
          >
            세로축: 개방도 (O) →
          </text>

          {/* User Location: Outer Pulsing Halo */}
          <circle
            cx={userX}
            cy={userY}
            r="16"
            fill="rgba(0, 124, 195, 0.18)"
            className="animate-ping"
            style={{ transformOrigin: `${userX}px ${userY}px`, animationDuration: '2.5s' }}
          />

          {/* User Location: Solid Dot */}
          <circle
            cx={userX}
            cy={userY}
            r="7"
            fill="#007CC3"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            filter="url(#userDotGlow)"
          />

          {/* User Location: Floating Coordinate Badge */}
          <g transform={`translate(${Math.min(Math.max(userX, 85), 300)}, ${userY > 90 ? userY - 14 : userY + 24})`}>
            <rect
              x="-48"
              y="-12"
              width="96"
              height="22"
              rx="11"
              fill="#000000"
              stroke="#FFFFFF"
              strokeWidth="1.2"
            />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="700"
              fontFamily="monospace"
            >
              내 위치 (C:{cScore}, O:{oScore})
            </text>
          </g>
        </svg>
      </div>

      {/* 📈 3 Metrics Percentage Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* 1. 연결감 (Connection, C) */}
        <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E4E2D8] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#F08300]" />
              <span className="text-[12px] font-bold text-[#000000]">연결감</span>
            </div>
            <span className="text-[15px] font-bold text-[#F08300] font-mono">
              {percentC}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#E5E2D9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F08300] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentC}%` }}
            />
          </div>
          <div className="flex justify-between text-[10.5px] text-[#666666]">
            <span>점수: {cScore} / 9점</span>
            <span>{isHighC ? '높음' : '낮음'}</span>
          </div>
        </div>

        {/* 2. 개방도 (Openness, O) */}
        <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E4E2D8] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#007CC3]" />
              <span className="text-[12px] font-bold text-[#000000]">개방도</span>
            </div>
            <span className="text-[15px] font-bold text-[#007CC3] font-mono">
              {percentO}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#E5E2D9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#007CC3] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentO}%` }}
            />
          </div>
          <div className="flex justify-between text-[10.5px] text-[#666666]">
            <span>점수: {oScore} / 9점</span>
            <span>{isHighO ? '높음' : '낮음'}</span>
          </div>
        </div>

        {/* 3. AI 관계 인식 */}
        <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E4E2D8] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#443E3B]" />
              <span className="text-[12px] font-bold text-[#000000]">AI 관계 인식</span>
            </div>
            <span className="text-[15px] font-bold text-[#443E3B] font-mono">
              {percentAI}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#E5E2D9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#443E3B] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentAI}%` }}
            />
          </div>
          <div className="flex justify-between text-[10.5px] text-[#666666]">
            <span>척도: {breakdown.aiScore ?? 0} / 3점</span>
            <span>백분율: {percentAI}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
