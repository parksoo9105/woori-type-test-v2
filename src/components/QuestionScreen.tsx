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
  // CRITICAL: Selecting does NOT automatically advance to the next question.
  // The user must manually click '다음 질문 →' or '결과 확인하기 →'.
  const handleSingleClick = (optionId: string) => {
    setSingleSelection(optionId);
  };

  // Handle multi choice selection (Q1)
  // Options 1~3 add 1 point each. Option 4 (alone) is non-scoring and can be multi-selected together.
  const handleMultiClick = (optionId: string) => {
    let updated: (string | number)[];
    if (multiSelection.includes(optionId)) {
      updated = multiSelection.filter((s) => s !== optionId);
    } else {
      updated = [...multiSelection, optionId];
    }
    setMultiSelection(updated);
  };

  // Advance to next step (called ONLY when the user clicks the Next button)
  const handleNext = () => {
    if (isMultiple) {
      if (multiSelection.length > 0) {
        onSelectOption(multiSelection);
      }
    } else {
      if (singleSelection !== undefined) {
        onSelectOption(singleSelection);
      }
    }
  };

  const isSelected = isMultiple
    ? multiSelection.length > 0
    : singleSelection !== undefined;

  const isLastQuestion = currentIndex + 1 >= totalQuestions;
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="relative min-h-[calc(100vh-2rem)] max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-between z-10 animate-fadeIn">
      {/* 🌌 Subtle Ambient Editorial Gradient Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#007CC3]/6 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#F08300]/6 blur-3xl -z-10"
      />

      {/* 🧭 Top Navigation & Progress Header */}
      <header className="w-full mb-6 sm:mb-8">
        <div className="flex items-center justify-between h-10 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold tracking-[0.18em] text-[#666666] uppercase font-sans">
              MY 'WE' ARCHETYPE TEST ·
            </span>
            <span className="text-[11px] font-bold tracking-[0.18em] text-[#666666] uppercase font-sans">
              QUESTION {currentIndex + 1}
            </span>
          </div>

          {/* Step Counter: 1 / 7 */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-xs rounded-full text-[13px] font-mono font-medium text-[#443E3B] border border-[#E4E2D8] shadow-2xs">
            <span className="text-[#000000] font-bold">{currentIndex + 1}</span>
            <span className="text-[#999999]">/</span>
            <span className="text-[#666666]">{totalQuestions}</span>
          </div>
        </div>

        {/* Minimal Thin Progress Bar */}
        <div className="h-1.5 w-full bg-[#E5E2D9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#007CC3] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* 📝 Main Question Area */}
      <main
        key={question.id}
        className="flex-1 flex flex-col justify-center py-2 sm:py-4 transition-all duration-350"
      >
        {/* Question Title & Description */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-serif text-[24px] sm:text-[28px] md:text-[31px] font-bold text-[#000000] leading-[1.38] tracking-[-0.02em] break-keep px-1">
            {question.title}
          </h2>

          {question.description && (
            <p className="mt-2.5 text-[14px] sm:text-[15px] text-[#666666] font-normal leading-[1.6] tracking-[-0.01em] break-keep max-w-lg mx-auto">
              {question.description}
            </p>
          )}

          {isMultiple && (
            <div className="mt-3">
              <span className="text-[11.5px] font-semibold text-[#007CC3] bg-[#007CC3]/10 border border-[#007CC3]/30 px-3 py-1 rounded-full">
                복수 선택 가능
              </span>
            </div>
          )}
        </div>

        {/* Options List */}
        <div
          className="space-y-3 w-full max-w-lg mx-auto"
          role={isMultiple ? 'group' : 'radiogroup'}
          aria-label={question.title}
        >
          {question.options.map((option, idx) => {
            const optionSelected = isMultiple
              ? multiSelection.includes(option.id) || multiSelection.includes(option.score)
              : singleSelection === option.id || singleSelection === option.score;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  isMultiple
                    ? handleMultiClick(option.id)
                    : handleSingleClick(option.id)
                }
                role={isMultiple ? 'checkbox' : 'radio'}
                aria-checked={optionSelected}
                className={`w-full min-h-[56px] text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 flex items-center justify-between group relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007CC3] ${
                  optionSelected
                    ? 'bg-[#EBF5FB] border-[#007CC3] text-[#000000] shadow-xs scale-[1.01]'
                    : 'bg-white/85 backdrop-blur-xs border-[#E4E2D8] text-[#333333] hover:border-[#007CC3]/50 hover:bg-white active:scale-[0.99] shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5 pr-3">
                  {/* Number Badge */}
                  <span
                    className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full flex items-center justify-center text-[12px] font-semibold transition-colors font-mono ${
                      optionSelected
                        ? 'bg-[#007CC3] text-white'
                        : 'bg-[#F0EEE6] text-[#666666] group-hover:bg-[#E5E2D9]'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  {/* Label Text */}
                  <div className="flex flex-col">
                    <span
                      className={`text-[15px] sm:text-[16px] leading-snug tracking-[-0.01em] break-keep ${
                        optionSelected ? 'font-bold text-[#000000]' : 'font-medium text-[#222222]'
                      }`}
                    >
                      {option.label}
                    </span>
                    {option.subLabel && (
                      <span
                        className={`text-[13px] mt-1 leading-[1.5] font-normal tracking-[-0.01em] ${
                          optionSelected ? 'text-[#005A8C]' : 'text-[#666666]'
                        }`}
                      >
                        {option.subLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Selection Indicator (Checkbox or Radio) */}
                <div
                  className={`flex-shrink-0 w-6 h-6 ${
                    isMultiple ? 'rounded-lg' : 'rounded-full'
                  } border flex items-center justify-center transition-all ${
                    option.subLabel ? 'self-start mt-0.5' : ''
                  } ${
                    optionSelected
                      ? 'bg-[#007CC3] border-[#007CC3] text-white shadow-2xs'
                      : 'border-[#CBD5E1] bg-white group-hover:border-[#007CC3]/40'
                  }`}
                >
                  {optionSelected && (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* 🚀 Bottom Navigation Bar (이전 / 다음 질문) */}
      <footer className="w-full max-w-lg mx-auto pt-6 pb-2">
        <div className="flex items-center gap-3">
          {/* Previous Button (Active on Q2~Q7) */}
          {currentIndex > 0 ? (
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-4 min-h-[52px] rounded-full font-medium text-[15px] text-[#443E3B] bg-white border border-[#E4E2D8] hover:bg-[#F0EEE6] active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
              aria-label="이전 질문으로 돌아가기"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>이전</span>
            </button>
          ) : null}

          {/* Next / Submit Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!isSelected}
            aria-label={
              isLastQuestion
                ? '결과 확인하기'
                : isMultiple
                ? '선택 완료하고 다음으로'
                : '다음 질문'
            }
            className={`flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 min-h-[52px] rounded-full font-bold text-[15.5px] transition-all duration-200 shadow-md ${
              isSelected
                ? 'bg-[#007CC3] text-white hover:bg-[#0066A0] active:scale-[0.98] shadow-[#007CC3]/20 cursor-pointer'
                : 'bg-[#E5E2D9] text-[#999999] cursor-not-allowed shadow-none'
            }`}
          >
            <span>{isLastQuestion ? '결과 확인하기 →' : isMultiple ? '선택 완료하고 다음으로 →' : '다음 질문 →'}</span>
          </button>
        </div>

        {/* Helpful Bottom Hint */}
        <p className="mt-3 text-center text-[12px] text-[#888888] font-normal tracking-[-0.01em]">
          {isMultiple
            ? '해당하는 항목을 모두 선택한 후 [다음 질문 →]을 눌러주세요'
            : '답변을 선택한 후 [다음 질문 →]을 눌러 진행해 주세요'}
        </p>
      </footer>
    </div>
  );
};
