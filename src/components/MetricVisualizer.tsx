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
              관계의 지표
            </h3>
            <p className="text-[12px] text-[#666666] font-normal mt-0.5">
              응답을 바탕으로 분석된 나의 관계 특성과 인식
            </p>
          </div>
        </div>
        <span className="text-[10.5px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#F5F3EE] text-[#443E3B] uppercase font-mono">
          METRICS
        </span>
      </div>

      {/* 📈 3 Metrics Percentage Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
        {/* 1. 연결감 */}
        <div className="bg-[#FAF9F5] rounded-2xl p-4 sm:p-4.5 border border-[#E4E2D8] space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#F08300]" />
                <span className="text-[13px] font-bold text-[#000000]">연결감</span>
              </div>
              <span className="text-[16px] font-bold text-[#F08300] font-mono">
                {percentC}%
              </span>
            </div>
            <p className="text-[11.5px] text-[#666666] leading-tight">
              가까운 사람들과의 정서적 유대와 소속감
            </p>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-[#E5E2D9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F08300] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentC}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. 개방도 */}
        <div className="bg-[#FAF9F5] rounded-2xl p-4 sm:p-4.5 border border-[#E4E2D8] space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#007CC3]" />
                <span className="text-[13px] font-bold text-[#000000]">개방도</span>
              </div>
              <span className="text-[16px] font-bold text-[#007CC3] font-mono">
                {percentO}%
              </span>
            </div>
            <p className="text-[11.5px] text-[#666666] leading-tight">
              새로운 만남과 다양한 생각에 열려 있는 태도
            </p>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-[#E5E2D9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#007CC3] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentO}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. AI 관계 인식 */}
        <div className="bg-[#FAF9F5] rounded-2xl p-4 sm:p-4.5 border border-[#E4E2D8] space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#443E3B]" />
                <span className="text-[13px] font-bold text-[#000000]">AI 관계 인식</span>
              </div>
              <span className="text-[16px] font-bold text-[#443E3B] font-mono">
                {percentAI}%
              </span>
            </div>
            <p className="text-[11.5px] text-[#666666] leading-tight">
              인공지능과 기술을 바라보는 관계적 관점
            </p>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-[#E5E2D9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#443E3B] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentAI}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
