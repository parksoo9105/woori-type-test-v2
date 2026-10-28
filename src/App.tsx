import { useState, useEffect } from 'react';
import { QUESTIONS } from './data/questions';
import { RESULT_TYPES } from './data/results';
import { calculateScores, classifyResultType } from './utils/scoring';
import { Answers, ResultTypeId, ScoreBreakdown } from './types';
import { StartScreen } from './components/StartScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultScreen } from './components/ResultScreen';
import { SharedResultScreen } from './components/SharedResultScreen';
import { LedDisplayScreen } from './components/LedDisplayScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { VerifyScreen } from './components/VerifyScreen';
import { generateParticipantToken } from './utils/token';
import { submitSurvey } from './services/api';

const STORAGE_KEY = 'woori_state_houmahani_v1';
const TOKEN_STORAGE_KEY = 'woori_verification_token_v1';

// Default representative scores for shared types when metric params are omitted
const DEFAULT_TYPE_METRICS: Record<ResultTypeId, ScoreBreakdown> = {
  'type-1': { connectionScore: 7, opennessScore: 2, aiScore: 1, aiOptionId: 'ai_assistant', metricA: 7, metricB: 1, metricC: 2 },
  'type-2': { connectionScore: 2, opennessScore: 7, aiScore: 1, aiOptionId: 'ai_assistant', metricA: 2, metricB: 1, metricC: 7 },
  'type-3': { connectionScore: 7, opennessScore: 7, aiScore: 2, aiOptionId: 'ai_conversation', metricA: 7, metricB: 2, metricC: 7 },
  'type-4': { connectionScore: 2, opennessScore: 2, aiScore: 0, aiOptionId: 'ai_tool', metricA: 2, metricB: 0, metricC: 2 },
};

export function parseResultFromUrl(): { resultType: ResultTypeId; breakdown: ScoreBreakdown } | null {
  if (typeof window === 'undefined') return null;

  try {
    // If user requested a fresh start or reset, do not parse as shared result
    const searchStr = window.location.search || window.location.hash || '';
    if (searchStr.includes('fresh') || searchStr.includes('start') || searchStr.includes('reset')) {
      return null;
    }

    const normalizeId = (val: string | null | undefined): ResultTypeId | null => {
      if (!val) return null;
      const cleaned = String(val).trim().toLowerCase().replace(/^[\/#?]+/, '');
      if (['t1', 'type-1', 'type-01', 'type1', '1', 'red'].includes(cleaned)) return 'type-1';
      if (['t2', 'type-2', 'type-02', 'type2', '2', 'blue'].includes(cleaned)) return 'type-2';
      if (['t3', 'type-3', 'type-03', 'type3', '3', 'green'].includes(cleaned)) return 'type-3';
      if (['t4', 'type-4', 'type-04', 'type4', '4', 'purple'].includes(cleaned)) return 'type-4';
      return null;
    };

    let candidate: ResultTypeId | null = null;
    let params: URLSearchParams | null = null;

    // 1. Direct pathname check (e.g. /result/t1, /result/t2, /result/t3, /result/t4)
    if (window.location.pathname) {
      const decodedPath = decodeURIComponent(window.location.pathname);
      const pathMatch = decodedPath.match(/\/result\/(t[1-4]|type-?0?[1-4]|[1-4])/i);
      if (pathMatch && pathMatch[1]) {
        const res = normalizeId(pathMatch[1]);
        if (res) candidate = res;
      }
    }

    // 2. Query parameter check (?result=t1, ?result=type-1)
    if (!candidate && window.location.search) {
      const searchParams = new URLSearchParams(window.location.search);
      const res = normalizeId(searchParams.get('result') || searchParams.get('type') || searchParams.get('r'));
      if (res) {
        candidate = res;
        params = searchParams;
      }
    }

    // 3. Hash parameter check (#result=t1, #/result/t1)
    if (!candidate && window.location.hash) {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const hashMatch = hash.match(/(?:result|type)[\/=](t[1-4]|type-?0?[1-4]|[1-4])/i);
      if (hashMatch && hashMatch[1]) {
        candidate = normalizeId(hashMatch[1]);
      } else {
        const queryIdx = hash.indexOf('?');
        const queryString = queryIdx !== -1 ? hash.slice(queryIdx + 1) : hash;
        const hashParams = new URLSearchParams(queryString);
        const res = normalizeId(hashParams.get('result') || hashParams.get('type') || hashParams.get('r'));
        if (res) {
          candidate = res;
          params = hashParams;
        }
      }
    }

    // 4. Fallback: Parse entire href for parameter pattern
    if (!candidate && window.location.href) {
      const decodedHref = decodeURIComponent(window.location.href);
      const match = decodedHref.match(/(?:\/result\/|[?&#](?:result|type|r)=)(t[1-4]|type-?0?[1-4]|[1-4])/i);
      if (match && match[1]) {
        candidate = normalizeId(match[1]);
      }
    }

    if (candidate) {
      const a = params?.get('a');
      const b = params?.get('b');
      const c = params?.get('c');
      const conn = params?.get('conn');
      const open = params?.get('open');

      let breakdown = DEFAULT_TYPE_METRICS[candidate];
      if (conn !== null && open !== null && conn !== undefined && open !== undefined) {
        const cVal = Math.min(Math.max(Number(conn) || 0, 0), 9);
        const oVal = Math.min(Math.max(Number(open) || 0, 0), 9);
        const aiVal = Math.min(Math.max(Number(params?.get('ai')) || 0, 0), 3);
        const aiOpt = params?.get('aio') || DEFAULT_TYPE_METRICS[candidate].aiOptionId;
        breakdown = {
          connectionScore: cVal,
          opennessScore: oVal,
          aiScore: aiVal,
          aiOptionId: aiOpt,
          metricA: cVal,
          metricB: aiVal,
          metricC: oVal,
        };
      } else if (a !== null && b !== null && c !== null && a !== undefined && b !== undefined && c !== undefined) {
        const cVal = Math.min(Math.max(Number(a) || 0, 0), 9);
        const oVal = Math.min(Math.max(Number(c) || 0, 0), 9);
        const aiVal = Math.min(Math.max(Number(b) || 0, 0), 3);
        breakdown = {
          connectionScore: cVal,
          opennessScore: oVal,
          aiScore: aiVal,
          aiOptionId: DEFAULT_TYPE_METRICS[candidate].aiOptionId,
          metricA: cVal,
          metricB: aiVal,
          metricC: oVal,
        };
      }
      return { resultType: candidate, breakdown };
    }
  } catch (err) {
    console.warn('parseResultFromUrl error:', err);
  }

  return null;
}

export function App() {
  const pathname = typeof window !== 'undefined' ? (window.location.pathname || '') : '';

  // Dedicated Route: LED Display (/display)
  if (pathname.startsWith('/display')) {
    return <LedDisplayScreen />;
  }

  // Dedicated Route: Admin Dashboard (/admin)
  if (pathname.startsWith('/admin')) {
    return <AdminDashboard />;
  }

  // Dedicated Route: Participant Verification (/verify)
  if (pathname.startsWith('/verify')) {
    return <VerifyScreen />;
  }

  const initialShared = parseResultFromUrl();

  // Check if viewing a shared result via URL (e.g. ?result=type-1)
  const [sharedResultType, setSharedResultType] = useState<ResultTypeId | null>(
    () => initialShared?.resultType ?? null
  );

  const [sharedBreakdown, setSharedBreakdown] = useState<ScoreBreakdown | null>(
    () => initialShared?.breakdown ?? null
  );

  const [verificationToken, setVerificationToken] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem(TOKEN_STORAGE_KEY) || undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  });

  const [screen, setScreen] = useState<'start' | 'questions' | 'result'>(() => {
    if (typeof window !== 'undefined') {
      const searchStr = window.location.search || window.location.hash || '';
      if (searchStr.includes('fresh') || searchStr.includes('start') || searchStr.includes('reset')) {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Ignore
        }
        return 'start';
      }
    }

    if (initialShared) {
      return 'result';
    }

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.screen && ['start', 'questions', 'result'].includes(parsed.screen)) {
          return parsed.screen;
        }
      }
    } catch {
      // Fallback
    }
    return 'start';
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const searchStr = window.location.search || window.location.hash || '';
      if (searchStr.includes('fresh') || searchStr.includes('start') || searchStr.includes('reset')) {
        return 0;
      }
    }

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.questionIndex === 'number') return parsed.questionIndex;
      }
    } catch {
      // Fallback
    }
    return 0;
  });

  const [answers, setAnswers] = useState<Answers>(() => {
    if (typeof window !== 'undefined') {
      const searchStr = window.location.search || window.location.hash || '';
      if (searchStr.includes('fresh') || searchStr.includes('start') || searchStr.includes('reset')) {
        return {};
      }
    }

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) return parsed.answers;
      }
    } catch {
      // Fallback
    }
    return {};
  });

  // Sync URL changes (e.g. back/forward navigation or hash changes)
  useEffect(() => {
    const handleUrlChange = () => {
      const searchStr = typeof window !== 'undefined' ? (window.location.search || window.location.hash || '') : '';
      if (searchStr.includes('fresh') || searchStr.includes('start') || searchStr.includes('reset')) {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Ignore
        }
        setSharedResultType(null);
        setSharedBreakdown(null);
        setVerificationToken(undefined);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setScreen('start');
        return;
      }

      const parsed = parseResultFromUrl();
      if (parsed) {
        setSharedResultType(parsed.resultType);
        setSharedBreakdown(parsed.breakdown);
        setScreen('result');
      }
    };

    // Run immediately on mount to ensure shared view is active even in webviews
    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Save progress to SessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          screen,
          questionIndex: currentQuestionIndex,
          answers,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [screen, currentQuestionIndex, answers]);

  // Handle Starting Test
  const handleStart = () => {
    if (typeof window !== 'undefined' && (window.location.search || window.location.hash)) {
      window.history.pushState({}, '', window.location.pathname);
    }
    setSharedResultType(null);
    setSharedBreakdown(null);
    setVerificationToken(undefined);
    setScreen('questions');
    setCurrentQuestionIndex(0);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Selecting Option for a Question
  const handleSelectOption = (val: string | number | (string | number)[]) => {
    const currentQ = QUESTIONS[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQ.id]: val };
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 < QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // 🌟 Completed all 7 questions -> Generate 128-bit verification token
      const token = generateParticipantToken();
      setVerificationToken(token);
      try {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      } catch {
        // Ignore
      }

      // Submit anonymous response to backend API
      submitSurvey(token, newAnswers).catch((err) => {
        console.warn('Anonymous survey submit error:', err);
      });

      // Seamlessly enter Result screen
      setScreen('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Going Back to Previous Question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Handle Restarting Test / Navigating to Start
  const handleRestart = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.clear();
      } catch {
        // Ignore
      }
      if (window.location.pathname && window.location.pathname.startsWith('/result')) {
        try {
          window.location.href = 'https://woori-type-test.vercel.app';
        } catch {
          // Ignore
        }
      }
      if (window.location.pathname !== '/' || window.location.search || window.location.hash) {
        try {
          window.history.pushState({}, '', '/?fresh=1');
        } catch {
          // Ignore
        }
      }
    }
    setSharedResultType(null);
    setSharedBreakdown(null);
    setVerificationToken(undefined);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScreen('start');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate scores and classification
  const calculatedBreakdown = calculateScores(answers);
  const activeBreakdown = sharedBreakdown || calculatedBreakdown;
  const activeResultTypeId: ResultTypeId = sharedResultType || classifyResultType(activeBreakdown);
  const resultTypeInfo = RESULT_TYPES[activeResultTypeId];

  return (
    <div
      onClick={sharedResultType ? handleRestart : undefined}
      className={`relative min-h-screen bg-[#F8F7F3] text-[#171923] flex flex-col items-center ${screen === 'start' && !sharedResultType ? 'p-0' : 'justify-center py-2 sm:py-6'} selection:bg-[#E4E2D8] overflow-x-hidden font-sans ${sharedResultType ? 'cursor-pointer' : ''}`}
    >
      <main className={`w-full ${screen === 'start' && !sharedResultType ? 'max-w-none' : 'max-w-2xl min-h-screen sm:min-h-0 sm:my-auto'} relative z-10 transition-all duration-300`}>
        {sharedResultType ? (
          <SharedResultScreen
            resultType={resultTypeInfo}
            onStartTest={handleRestart}
          />
        ) : (
          <>
            {screen === 'start' && <StartScreen onStart={handleStart} />}

            {screen === 'questions' && (
              <QuestionScreen
                question={QUESTIONS[currentQuestionIndex]}
                currentIndex={currentQuestionIndex}
                totalQuestions={QUESTIONS.length}
                selectedScore={answers[QUESTIONS[currentQuestionIndex].id]}
                onSelectOption={handleSelectOption}
                onPrev={handlePrev}
              />
            )}

            {screen === 'result' && (
              <ResultScreen
                resultType={resultTypeInfo}
                breakdown={activeBreakdown}
                onRestart={handleRestart}
                verificationToken={verificationToken}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
