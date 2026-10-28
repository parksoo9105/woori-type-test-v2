import React from 'react';
import { ScoreBreakdown } from '../types';
import { Sparkles, Heart, Compass, Bot } from 'lucide-react';
import { toConnectionPercentage, toOpennessPercentage, toAIPercentage } from '../utils/scoring';

interface MetricVisualizerProps {
  breakdown: ScoreBreakdown;
  accentColor?: string;
}

export const MetricVisualizer: React.FC<MetricVisualizerProps> = ({
  breakdown,
}) => {
  const percentC = toConnectionPercentage(breakdown.connectionScore);
  const percentO = toOpennessPercentage(breakdown.opennessScore);
  const percentAI = toAIPercentage(breakdown.aiScore ?? 1);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 space-y-6 border border-[#E4E2D8] shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E4E2D8] pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#171923] text-white flex items-center justify-center text-xs shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#171923] tracking-tight">
              나의 관계 지표
            </h3>
            <p className="text-[11px] text-[#64748B] font-medium">
              우열이 아닌 현재 나의 연결감과 개방도, AI 인식을 백분율로 나타냅니다
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#F1F0E8] text-[#171923]">
          PERCENTAGE
        </span>
      </div>

      {/* 1. 현재의 연결감 (Connection, C) */}
      <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E4E2D8] space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#171923]">
                연결감
              </h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                일상에서 타인과 연결되어 있다고 느끼는 주관적 정도
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg sm:text-xl font-extrabold text-rose-800 font-mono">
              {percentC}%
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="pt-2">
          <div className="h-3 w-full bg-[#E4E2D8]/80 rounded-full overflow-hidden relative p-0.5">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-[#FF654F] rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${percentC}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#64748B] mt-1.5 font-medium px-0.5">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* 2. 마주봄에 대한 개방도 (Openness, O) */}
      <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E4E2D8] space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#171923]">
                개방도
              </h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                새로운 사람과 다양한 관점을 향한 열린 태도
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg sm:text-xl font-extrabold text-emerald-800 font-mono">
              {percentO}%
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="pt-2">
          <div className="h-3 w-full bg-[#E4E2D8]/80 rounded-full overflow-hidden relative p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-[#10B981] rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${percentO}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#64748B] mt-1.5 font-medium px-0.5">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* 3. AI 관계 인식 */}
      <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E4E2D8] space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#171923]">
                AI 관계 인식
              </h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                AI를 바라보는 나의 관계적 관점
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg sm:text-xl font-extrabold text-blue-800 font-mono">
              {percentAI}%
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="pt-2">
          <div className="h-3 w-full bg-[#E4E2D8]/80 rounded-full overflow-hidden relative p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-[#3B82F6] rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${percentAI}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#64748B] mt-1.5 font-medium px-0.5">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
