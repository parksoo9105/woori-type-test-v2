import React, { useState, useEffect } from 'react';
import {
  Lock,
  RefreshCw,
  LogOut,
  Download,
  AlertCircle,
  Trash2,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { AggregateStats, SurveyResponseRecord, ResultTypeId } from '../types';
import { QUESTIONS } from '../data/questions';
import { RESULT_TYPES } from '../data/results';
import { fetchAdminStats, fetchAdminResponses, resetAdminData } from '../services/api';

const ADMIN_STORAGE_KEY = 'woori_admin_auth_token_v1';

export const AdminDashboard: React.FC = () => {
  const [adminKey, setAdminKey] = useState<string>(() => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) || '';
  });
  const [keyInput, setKeyInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem(ADMIN_STORAGE_KEY));
  });

  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [responses, setResponses] = useState<SurveyResponseRecord[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Reset Modal States (2-step confirmation)
  const [resetStep, setResetStep] = useState<0 | 1 | 2>(0);
  const [resetInput, setResetInput] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetToast, setResetToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Handle Login
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = keyInput.trim();
    if (!clean) {
      setAuthError('관리자 비밀번호를 입력해 주세요.');
      return;
    }
    setAdminKey(clean);
    sessionStorage.setItem(ADMIN_STORAGE_KEY, clean);
    setIsAuthenticated(true);
    setAuthError(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminKey('');
    setIsAuthenticated(false);
    setStats(null);
    setResponses([]);
    setResetStep(0);
  };

  const handleExecuteReset = async () => {
    if (resetInput.trim() !== '초기화') {
      setResetError("정확히 '초기화'를 입력해 주세요.");
      return;
    }

    setIsResetting(true);
    setResetError(null);

    try {
      const res = await resetAdminData(adminKey);
      if (res.success) {
        setStats({
          totalCount: 0,
          archetypeDistribution: {
            'type-1': { count: 0, percentage: 0 },
            'type-2': { count: 0, percentage: 0 },
            'type-3': { count: 0, percentage: 0 },
            'type-4': { count: 0, percentage: 0 },
          },
          averageScores: { connection: 0, openness: 0, ai: 0 },
          q1Distribution: { c1_1: { count: 0, percentage: 0 }, c1_2: { count: 0, percentage: 0 }, c1_3: { count: 0, percentage: 0 }, c1_4: { count: 0, percentage: 0 } },
          q2Distribution: { c2_1: { count: 0, percentage: 0 }, c2_2: { count: 0, percentage: 0 }, c2_3: { count: 0, percentage: 0 }, c2_4: { count: 0, percentage: 0 } },
          q3Distribution: { c3_1: { count: 0, percentage: 0 }, c3_2: { count: 0, percentage: 0 }, c3_3: { count: 0, percentage: 0 }, c3_4: { count: 0, percentage: 0 } },
          q4Distribution: { o1_1: { count: 0, percentage: 0 }, o1_2: { count: 0, percentage: 0 }, o1_3: { count: 0, percentage: 0 }, o1_4: { count: 0, percentage: 0 } },
          q5Distribution: { o2_1: { count: 0, percentage: 0 }, o2_2: { count: 0, percentage: 0 }, o2_3: { count: 0, percentage: 0 }, o2_4: { count: 0, percentage: 0 } },
          q6Distribution: { o6_1: { count: 0, percentage: 0 }, o6_2: { count: 0, percentage: 0 }, o6_3: { count: 0, percentage: 0 }, o6_4: { count: 0, percentage: 0 } },
          q7Distribution: {
            ai_tool: { count: 0, percentage: 0 },
            ai_assistant: { count: 0, percentage: 0 },
            ai_conversation: { count: 0, percentage: 0 },
            ai_companion: { count: 0, percentage: 0 },
            ai_no_relationship: { count: 0, percentage: 0 },
          },
        });
        setResponses([]);
        setTotalResponses(0);
        setTotalPages(1);
        setPage(1);
        setResetToast({ type: 'success', message: '모든 설문 응답 및 통계가 성공적으로 초기화되었습니다.' });
        setResetStep(0);
        setResetInput('');
      } else {
        setResetError('데이터 초기화에 실패했습니다.');
      }
    } catch (err: any) {
      setResetError(err.message || '초기화 처리 중 오류가 발생했습니다.');
    } finally {
      setIsResetting(false);
    }
  };

  // Fetch data
  const loadData = async (currentPage = page) => {
    if (!adminKey) return;
    setLoading(true);
    try {
      const [statsData, responsesData] = await Promise.all([
        fetchAdminStats(adminKey),
        fetchAdminResponses(adminKey, currentPage, limit),
      ]);
      setStats(statsData);
      setResponses(responsesData.records);
      setTotalResponses(responsesData.total);
      setTotalPages(responsesData.totalPages);
      setLastRefreshed(new Date());
      setAuthError(null);
    } catch (err: any) {
      if (err.message?.includes('비밀번호') || err.message?.includes('인증')) {
        handleLogout();
        setAuthError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      loadData(page);
    }
  }, [isAuthenticated, adminKey, page]);

  // 5s Auto-refresh timer
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return;
    const interval = setInterval(() => {
      loadData(page);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefresh, adminKey, page]);

  // CSV Export
  const handleExportCSV = () => {
    if (responses.length === 0) return;
    const headers = ['ID', '제출시각', '관계유형', '연결감C(0-9)', '개방도O(0-9)', 'AI인식(0-3)', 'Q7답변'];
    const rows = responses.map((r) => [
      r.id,
      new Date(r.created_at).toLocaleString('ko-KR'),
      RESULT_TYPES[r.archetype_id]?.title || r.archetype_id,
      r.connection_score,
      r.openness_score,
      r.ai_score,
      r.q7_answer,
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `우리유형테스트_응답목록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Password Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] text-[#171923] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-[#E4E2D8] shadow-md text-left space-y-5 animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-[#171923] text-white flex items-center justify-center shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#171923]">관리자 인증</h1>
            <p className="text-xs text-slate-500 mt-1">
              〈우리 유형 테스트〉 전시 통계 및 응답 관리를 위해 비밀번호를 입력해 주세요.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                ADMIN PASSWORD
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E4E2D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171923]"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#171923] text-white font-bold text-sm rounded-xl hover:bg-black transition-all shadow-sm active:scale-98"
            >
              대시보드 로그인
            </button>
          </form>

          <div className="text-center pt-2">
            <a href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              ← 테스트 메인으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#171923] p-4 sm:p-8 font-sans selection:bg-[#E4E2D8]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Control Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E4E2D8] shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                ADMIN CONSOLE · 갱신 {lastRefreshed.toLocaleTimeString('ko-KR')}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <h1 className="text-2xl font-black text-[#171923] tracking-tight">
              〈우리 유형 테스트〉 관리자 대시보드
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Auto Refresh Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-[#FAF9F5] px-3.5 py-2 rounded-xl border border-[#E4E2D8] text-xs font-semibold">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded accent-[#171923] w-3.5 h-3.5"
              />
              <span>5초 자동 갱신</span>
            </label>

            {/* Manual Refresh */}
            <button
              onClick={() => loadData(page)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E4E2D8] text-xs font-semibold hover:bg-slate-50 transition-all active:scale-95 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>

            {/* 전체 통계 초기화 Button */}
            <button
              onClick={() => {
                setResetStep(1);
                setResetInput('');
                setResetError(null);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all text-xs font-semibold active:scale-95 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>전체 통계 초기화</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </header>

        {/* Reset Notification Toast */}
        {resetToast && (
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{resetToast.message}</span>
            </div>
            <button
              onClick={() => setResetToast(null)}
              className="text-xs text-emerald-700 hover:text-emerald-950 font-bold px-2 py-1"
            >
              닫기
            </button>
          </div>
        )}

        {/* 1. Overview Metric Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E4E2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              누적 응답 수
            </span>
            <div className="text-3xl font-black text-[#171923]">
              {(stats?.totalCount ?? 0).toLocaleString()} <span className="text-sm font-normal text-slate-500">건</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E4E2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
              평균 연결감 (C)
            </span>
            <div className="text-3xl font-black text-rose-950">
              {stats?.averageScores.connection ?? 0} <span className="text-sm font-normal text-slate-500">/ 9점</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium pt-0.5">
              환산 백분율 {Math.round(((stats?.averageScores.connection ?? 0) / 9) * 100)}%
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E4E2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              평균 개방도 (O)
            </span>
            <div className="text-3xl font-black text-emerald-950">
              {stats?.averageScores.openness ?? 0} <span className="text-sm font-normal text-slate-500">/ 9점</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium pt-0.5">
              환산 백분율 {Math.round(((stats?.averageScores.openness ?? 0) / 9) * 100)}%
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E4E2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
              평균 AI 관계 인식
            </span>
            <div className="text-3xl font-black text-blue-950">
              {stats?.averageScores.ai ?? 0} <span className="text-sm font-normal text-slate-500">/ 4점</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium pt-0.5">
              환산 백분율 {stats?.totalCount ? Math.round(((stats.averageScores.ai) / 4) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* 2. 4 Archetypes Breakdown Cards */}
        <div className="bg-white p-6 rounded-3xl border border-[#E4E2D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#171923] tracking-tight">
              4가지 관계 유형별 응답 분포
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              총 {stats?.totalCount ?? 0}명 기준
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['type-1', 'type-2', 'type-3', 'type-4'] as ResultTypeId[]).map((typeId) => {
              const info = RESULT_TYPES[typeId];
              const dist = stats?.archetypeDistribution[typeId] || { count: 0, percentage: 0 };
              return (
                <div
                  key={typeId}
                  className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E4E2D8] space-y-2 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                      {info.typeTag}
                    </span>
                    <span className="text-sm font-extrabold text-[#171923] font-mono">
                      {dist.percentage}%
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#171923]">{info.title}</h3>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${dist.percentage}%`,
                        backgroundColor: info.accentColor,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 text-right">
                    {dist.count.toLocaleString()}명
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Question-by-Question Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-[#E4E2D8] shadow-xs space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-[#E4E2D8] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#171923] tracking-tight">
                문항별 상세 응답 분포
              </h2>
              <p className="text-xs text-slate-500">
                Q1 복수선택 비율(응답자 기준 %), Q2~Q6 단일선택 비율, Q7 AI 인식(①과 ⑤ 분리)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUESTIONS.map((q) => {
              const distMapKey = `q${q.id}Distribution` as keyof AggregateStats;
              const distMap = (stats ? (stats[distMapKey] as Record<string, { count: number; percentage: number }>) : {}) || {};

              return (
                <div key={q.id} className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E4E2D8] space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-[#E4E2D8] shrink-0">
                      Q{q.id} {q.isMultiple ? '(복수선택)' : ''}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug flex-1">
                      {q.title}
                    </h3>
                  </div>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const optStats = distMap[opt.id] || { count: 0, percentage: 0 };
                      return (
                        <div key={opt.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-700 flex-1 pr-2 line-clamp-1">
                              {optIdx + 1}. {opt.label}
                            </span>
                            <span className="font-mono text-slate-900 font-bold shrink-0">
                              {optStats.percentage}% <span className="text-slate-400 font-normal">({optStats.count}명)</span>
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-800 rounded-full transition-all duration-500"
                              style={{ width: `${optStats.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Anonymous Responses Table */}
        <div className="bg-white p-6 rounded-3xl border border-[#E4E2D8] shadow-xs space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#171923] tracking-tight">
                익명 응답 데이터 목록
              </h2>
              <p className="text-xs text-slate-500">
                개인식별정보(PII)는 일절 수집 및 저장되지 않습니다. (최신 제출순 정렬)
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-slate-100 border border-[#E4E2D8] text-xs font-semibold text-slate-700 transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 다운로드</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-[#E4E2D8] rounded-2xl">
            <table className="w-full text-left text-xs text-slate-700 font-sans">
              <thead className="bg-[#FAF9F5] text-slate-600 font-bold border-b border-[#E4E2D8] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">제출 시각</th>
                  <th className="py-3 px-4">판정 유형</th>
                  <th className="py-3 px-4 text-center">연결감 C</th>
                  <th className="py-3 px-4 text-center">개방도 O</th>
                  <th className="py-3 px-4 text-center">AI 인식</th>
                  <th className="py-3 px-4">AI 선택지</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E2D8]/60">
                {responses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      등록된 응답 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  responses.map((r) => {
                    const typeInfo = RESULT_TYPES[r.archetype_id];
                    return (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          {new Date(r.created_at).toLocaleString('ko-KR')}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                            style={{
                              backgroundColor: `${typeInfo?.accentColor}18`,
                              color: typeInfo?.accentColor,
                            }}
                          >
                            {typeInfo?.title || r.archetype_id}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-rose-900">
                          {r.connection_score} <span className="text-[10px] text-slate-400 font-normal">/ 9</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-emerald-900">
                          {r.openness_score} <span className="text-[10px] text-slate-400 font-normal">/ 9</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-blue-900">
                          {r.ai_score} <span className="text-[10px] text-slate-400 font-normal">/ 4</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {r.q7_answer}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              페이지 {page} / {totalPages} (총 {totalResponses}건)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-[#E4E2D8] bg-white text-xs disabled:opacity-40 hover:bg-slate-50"
              >
                이전
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-[#E4E2D8] bg-white text-xs disabled:opacity-40 hover:bg-slate-50"
              >
                다음
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 🛑 2-Step Reset Confirmation Modal */}
      {resetStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-rose-200 shadow-2xl space-y-5 text-left animate-scaleIn">
            
            {/* Step 1: Warning */}
            {resetStep === 1 && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#171923]">
                      전체 통계를 초기화하시겠습니까?
                    </h3>
                    <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase">
                      1단계 확인 (경고)
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-100 text-xs sm:text-[13px] text-rose-900 leading-relaxed space-y-2">
                  <p className="font-semibold">
                    현재까지 저장된 모든 설문 응답과 통계가 삭제됩니다.
                  </p>
                  <p className="text-rose-700">
                    삭제된 데이터는 복구할 수 없습니다. 계속 진행하시겠습니까?
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setResetStep(0)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => setResetStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    초기화 진행 →
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Confirmation with text input */}
            {resetStep === 2 && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-rose-950">
                      정말로 모든 통계를 초기화하시겠습니까?
                    </h3>
                    <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase">
                      2단계 최종 확인
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    이 작업은 되돌릴 수 없습니다.<br />
                    계속하려면 아래 입력란에 <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">&lsquo;초기화&rsquo;</span>를 입력해 주세요.
                  </p>

                  <input
                    type="text"
                    value={resetInput}
                    onChange={(e) => {
                      setResetInput(e.target.value);
                      setResetError(null);
                    }}
                    placeholder="'초기화'를 입력하세요"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-sm font-semibold transition-all"
                    disabled={isResetting}
                    autoFocus
                  />

                  {resetError && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setResetStep(0);
                      setResetInput('');
                      setResetError(null);
                    }}
                    disabled={isResetting}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleExecuteReset}
                    disabled={resetInput.trim() !== '초기화' || isResetting}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>삭제 처리 중...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>전체 데이터 삭제</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
