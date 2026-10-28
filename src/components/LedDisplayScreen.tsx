import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Users } from 'lucide-react';
import { AggregateStats } from '../types';
import { fetchDisplayStats } from '../services/api';

const ARCHETYPE_META = [
  {
    id: 'type-1' as const,
    name: '마주보는 정원사',
    tag: 'TYPE 01 · CORAL',
    desc: '익숙한 이들과 깊게 연결되는 우리',
    color: '#FF654F',
    bg: 'bg-[#FF654F]',
    border: 'border-[#FF654F]',
  },
  {
    id: 'type-2' as const,
    name: '연결망의 항해자',
    tag: 'TYPE 02 · BLUE',
    desc: '새로운 사람과 생각에 열린 우리',
    color: '#4169E1',
    bg: 'bg-[#4169E1]',
    border: 'border-[#4169E1]',
  },
  {
    id: 'type-3' as const,
    name: '다리를 놓는 탐험가',
    tag: 'TYPE 03 · LIME',
    desc: '새로운 만남에 열린 우리',
    color: '#B8E34A',
    bg: 'bg-[#B8E34A]',
    border: 'border-[#B8E34A]',
  },
  {
    id: 'type-4' as const,
    name: '고요한 등대',
    tag: 'TYPE 04 · VIOLET',
    desc: '나만의 속도로 관계 맺는 우리',
    color: '#8064D8',
    bg: 'bg-[#8064D8]',
    border: 'border-[#8064D8]',
  },
];

const AI_OPTIONS_META = [
  { id: 'ai_tool', label: '필요할 때 사용하는 도구 (1점)', color: '#94A3B8' },
  { id: 'ai_assistant', label: '생각을 돕는 조력자 (2점)', color: '#38BDF8' },
  { id: 'ai_conversation', label: '편안한 대화 상대 (3점)', color: '#818CF8' },
  { id: 'ai_companion', label: '함께하는 동반자 (4점)', color: '#C084FC' },
  { id: 'ai_no_relationship', label: '특별한 대상 아님 (1점)', color: '#64748B' },
];

export const LedDisplayScreen: React.FC = () => {
  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadData = async () => {
    try {
      const data = await fetchDisplayStats();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('LED data load error:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const totalCount = stats?.totalCount ?? 0;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0C14] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 font-sans select-none aspect-video">
      
      {/* 🧭 Top Bar: Title & Total Count & Fullscreen Toggle */}
      <header className="relative z-20 flex items-start justify-between border-b border-white/10 pb-6 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE REAL-TIME
            </span>
            <span className="text-white/40 text-xs tracking-wider font-mono">
              5s AUTO-REFRESH · {lastUpdated.toLocaleTimeString('ko-KR')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            〈우리 유형 테스트〉 실시간 참여 현황
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Total Participant Counter Banner */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/90">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest block">
                TOTAL PARTICIPANTS
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                {totalCount.toLocaleString()}<span className="text-lg text-white/60 ml-1 font-sans">명</span>
              </div>
            </div>
          </div>

          {/* Discreet Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            aria-label="전체화면 토글"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 🏛️ Main Content Area */}
      {totalCount === 0 ? (
        // Empty State Waiting Screen
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 my-auto">
          <div className="flex items-center gap-4 mb-2">
            <span className="w-4 h-4 rounded-full bg-[#FF654F] animate-ping" />
            <span className="w-4 h-4 rounded-full bg-[#4169E1] animate-ping delay-150" />
            <span className="w-4 h-4 rounded-full bg-[#B8E34A] animate-ping delay-300" />
            <span className="w-4 h-4 rounded-full bg-[#8064D8] animate-ping delay-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            우리의 연결이 시작되기를 기다리고 있습니다
          </h2>
          <p className="text-lg sm:text-xl text-white/50 max-w-xl font-light">
            참가자가 설문을 제출하면 실시간 관계 유형 분포와 AI 인식이 이 화면에 실시간으로 집계됩니다.
          </p>
        </div>
      ) : (
        // Active Exhibition Dashboard
        <div className="flex-1 grid grid-cols-12 gap-8 my-auto items-center py-4">
          
          {/* Left Column: 4 Archetype Cards (7 Columns) */}
          <div className="col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                4 RELATIONSHIP ARCHETYPES DISTRIBUTION
              </span>
              <span className="text-xs font-semibold text-white/40 font-mono">
                REAL-TIME SHARE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {ARCHETYPE_META.map((meta) => {
                const dist = stats?.archetypeDistribution[meta.id] || { count: 0, percentage: 0 };
                return (
                  <div
                    key={meta.id}
                    className="relative bg-white/5 border border-white/10 rounded-3xl p-5 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-white/20"
                  >
                    {/* Top color bar indicator */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-700"
                      style={{ backgroundColor: meta.color }}
                    />

                    <div className="flex items-start justify-between mb-3 pt-1">
                      <div>
                        <span
                          className="text-[10.5px] font-bold tracking-widest uppercase block"
                          style={{ color: meta.color }}
                        >
                          {meta.tag}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                          {meta.name}
                        </h3>
                        <p className="text-[12px] text-white/60 line-clamp-1 mt-0.5">
                          {meta.desc}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight" style={{ color: meta.color }}>
                          {dist.percentage}<span className="text-lg font-sans ml-0.5">%</span>
                        </div>
                        <span className="text-xs text-white/50 font-mono">{dist.count}명</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.max(dist.percentage, 3)}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: C / O Averages & Q7 AI Distribution (5 Columns) */}
          <div className="col-span-5 space-y-6">
            
            {/* Top: Average C & O Scores */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40 block">
                OVERALL METRIC AVERAGES
              </span>

              <div className="grid grid-cols-2 gap-4">
                {/* Connection Average */}
                <div className="bg-white/5 rounded-2xl p-4 border border-rose-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-400 mb-1">
                    <span>연결감 (C) 평균</span>
                    <span className="text-white/40 font-normal">/ 9점</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                    {stats?.averageScores.connection ?? 0}
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all duration-700"
                      style={{ width: `${((stats?.averageScores.connection ?? 0) / 9) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Openness Average */}
                <div className="bg-white/5 rounded-2xl p-4 border border-emerald-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                    <span>개방도 (O) 평균</span>
                    <span className="text-white/40 font-normal">/ 9점</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                    {stats?.averageScores.openness ?? 0}
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${((stats?.averageScores.openness ?? 0) / 9) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Q7 AI Relationship Perception Breakdown */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                  AI RELATIONSHIP PERCEPTION (Q7)
                </span>
                <span className="text-[11px] text-blue-400 font-semibold">독립 지표</span>
              </div>

              <div className="space-y-2.5">
                {AI_OPTIONS_META.map((opt) => {
                  const dist = stats?.q7Distribution[opt.id] || { count: 0, percentage: 0 };
                  return (
                    <div key={opt.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/80 font-medium">{opt.label}</span>
                        <span className="font-mono text-white/90 font-bold">
                          {dist.percentage}% <span className="text-white/40 font-normal font-sans">({dist.count}명)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${dist.percentage}%`,
                            backgroundColor: opt.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🧭 Footer: Subtext */}
      <footer className="relative z-20 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/40 shrink-0">
        <div>우리 유형 테스트 · Collective Karma Exhibition</div>
        <div className="font-mono">DISPLAY INTERFACE · 16:9 OPTIMIZED</div>
      </footer>

    </div>
  );
};
