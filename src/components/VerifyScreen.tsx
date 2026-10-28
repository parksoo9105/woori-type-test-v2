import React, { useState } from 'react';
import { Search, KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { SurveyResponseRecord } from '../types';
import { RESULT_TYPES, AI_DESCRIPTIONS } from '../data/results';
import { QUESTIONS } from '../data/questions';
import { verifyParticipantToken } from '../services/api';

export const VerifyScreen: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<SurveyResponseRecord | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanToken = tokenInput.trim();
    if (!cleanToken) {
      setError('확인 토큰을 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setRecord(null);

    try {
      const res = await verifyParticipantToken(cleanToken);
      if (res) {
        setRecord(res);
      } else {
        setError('해당 토큰으로 등록된 응답 데이터를 찾을 수 없습니다. 토큰 번호를 다시 확인해 주세요.');
      }
    } catch (err: any) {
      setError(err?.message || '조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const archetypeInfo = record ? RESULT_TYPES[record.archetype_id] : null;
  const aiDescription = record?.q7_answer ? AI_DESCRIPTIONS[record.q7_answer] : null;

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#171923] flex flex-col items-center py-8 px-4 font-sans selection:bg-[#E4E2D8]">
      <div className="w-full max-w-xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>테스트 홈으로</span>
          </a>
          <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
            RESPONSE VERIFICATION
          </span>
        </div>

        {/* Title & Introduction */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4E2D8] shadow-xs text-left space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#171923] text-white flex items-center justify-center shadow-xs">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#171923] tracking-tight">
            나의 응답 확인
          </h1>
          <p className="text-[14px] sm:text-[15px] text-slate-600 leading-relaxed">
            설문 완료 시 발급받으신 <strong>본인 확인 토큰</strong>을 입력하시면, 저장된 나의 테스트 결과와 응답 내역을 확인하실 수 있습니다.
          </p>

          {/* Form */}
          <form onSubmit={handleSearch} className="pt-2 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="발급받은 토큰 (예: 32자리 16진수 문자열)"
                className="w-full px-4 py-3.5 pr-11 bg-[#FAF9F5] border border-[#E4E2D8] rounded-2xl text-[14px] font-mono focus:outline-none focus:ring-2 focus:ring-[#171923] transition-all placeholder:text-slate-400 placeholder:font-sans"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#171923] text-white flex items-center justify-center hover:bg-black transition-all disabled:opacity-50"
                aria-label="토큰 검색"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[13px]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        {/* Search Result */}
        {record && archetypeInfo && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4E2D8] shadow-xs text-left space-y-6 animate-fadeIn">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-[#E4E2D8] pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-[13px] font-bold text-emerald-800">본인 응답 확인 완료</span>
              </div>
              <span className="text-[12px] text-slate-400 font-mono">
                {new Date(record.created_at).toLocaleString('ko-KR')}
              </span>
            </div>

            {/* Archetype banner */}
            <div className="bg-[#FAF9F5] rounded-2xl p-5 border border-[#E4E2D8] space-y-2">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                {archetypeInfo.typeTag}
              </span>
              <h2 className="text-[24px] font-extrabold text-[#171923] tracking-tight">
                {archetypeInfo.title}
              </h2>
              <p className="text-[14px] text-slate-600">
                &ldquo;{archetypeInfo.oneLineSummary}&rdquo;
              </p>
            </div>

            {/* Score Badges */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3">
                <span className="text-[11px] font-semibold text-rose-700 block mb-0.5">연결감 C</span>
                <span className="text-[18px] font-extrabold text-rose-900">{record.connection_score} <span className="text-[11px] text-rose-600 font-normal">/ 9점</span></span>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3">
                <span className="text-[11px] font-semibold text-emerald-700 block mb-0.5">개방도 O</span>
                <span className="text-[18px] font-extrabold text-emerald-900">{record.openness_score} <span className="text-[11px] text-emerald-600 font-normal">/ 9점</span></span>
              </div>
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3">
                <span className="text-[11px] font-semibold text-blue-700 block mb-0.5">AI 인식</span>
                <span className="text-[18px] font-extrabold text-blue-900">{record.ai_score} <span className="text-[11px] text-blue-600 font-normal">/ 3점</span></span>
              </div>
            </div>

            {/* AI Explanation */}
            {aiDescription && (
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-left space-y-1">
                <span className="text-[11.5px] font-bold text-blue-900 block">• AI 관계 인식 설명</span>
                <p className="text-[13.5px] text-slate-700 leading-relaxed">
                  {aiDescription}
                </p>
              </div>
            )}

            {/* Questions Choice Breakdown */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                제출한 문항별 선택 내역
              </h3>
              <div className="space-y-2 text-[13px] text-slate-700">
                {QUESTIONS.map((q) => {
                  let answerText = '-';
                  if (q.id === 1) {
                    const chosen = q.options.filter((opt) => record.q1_answers.includes(opt.id));
                    answerText = chosen.map((c) => c.label).join(' / ') || '선택 없음';
                  } else {
                    const ansKey = `q${q.id}_answer` as keyof SurveyResponseRecord;
                    const optId = record[ansKey] as string;
                    const matchOpt = q.options.find((opt) => opt.id === optId);
                    answerText = matchOpt ? matchOpt.label : optId;
                  }
                  return (
                    <div key={q.id} className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E4E2D8] space-y-1">
                      <span className="font-semibold text-slate-900 block text-[12.5px]">Q{q.id}. {q.title}</span>
                      <p className="text-slate-600 pl-2 border-l-2 border-[#171923]/20">{answerText}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
