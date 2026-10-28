import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { Question } from '../types';

interface QuestionScreenProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedScore: string | number | (string | number)[] | undefined;
  onSelectOption: (val: string | number | (string | number)[]) => void;
  onPrev: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedScore,
  onSelectOption,
  onPrev,
}) => {
  const isMultiple = Boolean(question.isMultiple);

  // Local selection state
  const [multiSelection, setMultiSelection] = useState<(string | number)[]>(() => {
    if (Array.isArray(selectedScore)) return selectedScore;
    if (selectedScore !== undefined && isMultiple) return [selectedScore];
    return [];
  });

  const [singleSelection, setSingleSelection] = useState<string | number | undefined>(() => {
    if (!isMultiple && selectedScore !== undefined && !Array.isArray(selectedScore)) {
      return selectedScore;
    }
    return undefined;
  });

  // Sync state if question or selectedScore changes
  useEffect(() => {
    if (isMultiple) {
      if (Array.isArray(selectedScore)) {
        setMultiSelection(selectedScore);
      } else if (selectedScore !== undefined) {
        setMultiSelection([selectedScore]);
      } else {
        setMultiSelection([]);
      }
    } else {
      if (selectedScore !== undefined && !Array.isArray(selectedScore)) {
        setSingleSelection(selectedScore);
      } else {
        setSingleSelection(undefined);
      }
    }
  }, [question.id, selectedScore, isMultiple]);

  // Handle single choice selection (Q2~Q7)
  const handleSingleClick = (optionId: string) => {
    setSingleSelection(optionId);
    onSelectOption(optionId);
  };

  // Handle multi choice selection (Q1)
  const handleMultiClick = (optionId: string) => {
    let updated: (string | number)[];
    if (multiSelection.includes(optionId)) {
      updated = multiSelection.filter((s) => s !== optionId);
    } else {
      updated = [...multiSelection, optionId];
    }
    setMultiSelection(updated);
  };

  const handleNextMultiple = () => {
    if (multiSelection.length > 0) {
      onSelectOption(multiSelection);
    }
  };

  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] max-w-lg mx-auto px-4 py-5 sm:py-8 relative z-10 animate-fadeIn">
      {/* 🧭 Top Navigation & Progress Header */}
      <header className="w-full mb-6 sm:mb-8">
        <div className="flex items-center justify-between h-11 mb-3">
          {currentIndex > 0 ? (
            <button
              onClick={onPrev}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 -ml-2 text-[14px] font-medium text-slate-700 hover:text-slate-900 rounded-xl transition-all active:scale-95 hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              aria-label="이전 질문으로 돌아가기"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>이전</span>
            </button>
          ) : (
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 bg-white/60 border border-slate-200/60 px-3 py-1 rounded-full uppercase">
              START
            </span>
          )}

          {/* Current Step Counter: 1 / 7 */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/70 backdrop-blur-xs rounded-full text-[13px] font-medium text-slate-700 shadow-xs border border-white/90">
            <span className="text-slate-900 font-semibold">{currentIndex + 1}</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-slate-500">{totalQuestions}</span>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="h-1.5 w-full bg-slate-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* 📝 Main Question Area */}
      <main className="flex-1 flex flex-col justify-start">
        {/* Question Heading */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[12px] font-semibold text-slate-400 tracking-wider uppercase">
              QUESTION {currentIndex + 1}
            </span>
            {isMultiple && (
              <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-full">
                복수 선택 가능
              </span>
            )}
          </div>
          <h2 className="text-[22px] sm:text-[25px] md:text-[27px] font-semibold text-slate-900 leading-[1.3] tracking-[-0.02em]">
            {question.title}
          </h2>
          {question.description && (
            <p className="mt-2.5 text-[14px] sm:text-[15px] text-slate-600 font-normal leading-[1.65] tracking-[-0.01em]">
              {question.description}
            </p>
          )}
        </div>

        {/* Options Pick Cards List */}
        <div
          className="space-y-3 my-auto pb-4"
          role={isMultiple ? 'group' : 'radiogroup'}
          aria-label={question.title}
        >
          {question.options.map((option, idx) => {
            const isSelected = isMultiple
              ? multiSelection.includes(option.id) || multiSelection.includes(option.score)
              : singleSelection === option.id || singleSelection === option.score;

            return (
              <button
                key={option.id}
                onClick={() =>
                  isMultiple
                    ? handleMultiClick(option.id)
                    : handleSingleClick(option.id)
                }
                role={isMultiple ? 'checkbox' : 'radio'}
                aria-checked={isSelected}
                className={`w-full min-h-[52px] text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 flex items-center justify-between group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-[1.01]'
                    : 'bg-white/75 backdrop-blur-xs border-slate-200/80 text-slate-800 hover:border-slate-400 hover:bg-white active:scale-[0.99] shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5 pr-2">
                  <span
                    className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full flex items-center justify-center text-[12px] font-medium transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex flex-col">
                    <span
                      className={`text-[15px] sm:text-[16px] font-medium leading-snug tracking-[-0.01em] ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {option.label}
                    </span>
                    {option.subLabel && (
                      <span
                        className={`text-[13px] sm:text-[13.5px] mt-1 leading-[1.5] font-normal tracking-[-0.01em] ${
                          isSelected ? 'text-white/80' : 'text-slate-500'
                        }`}
                      >
                        {option.subLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`flex-shrink-0 w-6 h-6 ${isMultiple ? 'rounded-lg' : 'rounded-full'} border flex items-center justify-center transition-all ${
                    option.subLabel ? 'self-start mt-0.5' : ''
                  } ${
                    isSelected
                      ? 'bg-white border-white text-slate-900 shadow-xs'
                      : 'border-slate-300 opacity-60 group-hover:opacity-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Multi-Select Next Button */}
        {isMultiple && (
          <div className="pt-2 pb-4">
            <button
              onClick={handleNextMultiple}
              disabled={multiSelection.length === 0}
              className={`w-full py-4 px-6 rounded-full font-bold text-[15.5px] transition-all duration-200 shadow-md ${
                multiSelection.length > 0
                  ? 'bg-[#171923] text-white hover:bg-black active:scale-[0.98] shadow-slate-900/10'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              선택 완료하고 다음으로 →
            </button>
          </div>
        )}
      </main>

      {/* Helpful bottom hint */}
      <footer className="py-2 text-center text-[12px] sm:text-[13px] text-slate-400 font-normal tracking-[-0.01em]">
        {isMultiple
          ? '해당하는 항목을 모두 선택한 후 [선택 완료]를 눌러주세요'
          : '선택지를 클릭하면 다음 문항으로 이동합니다'}
      </footer>
    </div>
  );
};
