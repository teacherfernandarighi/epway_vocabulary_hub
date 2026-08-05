import React, { useState } from 'react';
import { VocabularyWord, DifficultyLevel } from '../../types';
import { CEFRBadge } from '../common/CEFRBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { DifficultyBadge } from '../common/DifficultyBadge';
import {
  RotateCcw,
  Volume2,
  Eye,
  Award,
  BookOpen,
} from 'lucide-react';
import { speakWord } from '../../utils/ipaAudio';
import confetti from 'canvas-confetti';

interface TodayReviewViewProps {
  todayWords: VocabularyWord[];
  onMarkReviewed: (wordId: string, rating: DifficultyLevel) => Promise<void>;
  onGoToVocabulary: () => void;
}

export const TodayReviewView: React.FC<TodayReviewViewProps> = ({
  todayWords,
  onMarkReviewed,
  onGoToVocabulary,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentWord = todayWords[currentIndex];

  const handleRating = async (rating: DifficultyLevel) => {
    if (!currentWord || !currentWord.id) return;

    setIsSubmitting(true);
    await onMarkReviewed(currentWord.id, rating);
    setIsSubmitting(false);
    setIsFlipped(false);

    if (currentIndex >= todayWords.length - 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (todayWords.length === 0 || !currentWord) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-white dark:bg-[#1E293B] rounded-[20px] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-[16px] bg-[#E6F7F8] dark:bg-cyan-950/40 text-[#00A8B5] dark:text-[#38BDF8] mx-auto flex items-center justify-center border border-[#00A8B5]/20">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-heading text-[#15303D] dark:text-[#F8FAFC]">
            Revisão Diária Concluída
          </h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto leading-relaxed">
            Parabéns! Você revisou todas as suas palavras agendadas para hoje. O sistema de
            Revisão Espaçada agendará os próximos ciclos automaticamente.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onGoToVocabulary}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-[#00A8B5] hover:bg-[#008C96] dark:bg-[#00A8B5] dark:hover:bg-[#008C96] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Ver Meu Banco de Vocabulário</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner Progress */}
      <div className="flex items-center justify-between px-5 py-3 rounded-[14px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-xs text-[#64748B] dark:text-[#94A3B8] shadow-xs">
        <div className="flex items-center gap-2 font-medium">
          <RotateCcw className="w-4 h-4 text-[#00A8B5]" />
          <span>Modo Spaced Repetition</span>
        </div>
        <div className="font-semibold font-numbers">
          Cartão <span className="text-[#00A8B5] dark:text-[#38BDF8]">{currentIndex + 1}</span> de{' '}
          <span>{todayWords.length}</span>
        </div>
      </div>

      {/* Flashcard Box */}
      <div className="relative bg-white dark:bg-[#1E293B] rounded-[20px] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] overflow-hidden min-h-[380px] flex flex-col justify-between p-6 sm:p-10 transition-all duration-300">
        {/* Card Header Info */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
          <div className="flex items-center gap-2">
            <CEFRBadge level={currentWord.cefr} size="md" />
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E6F7F8] dark:bg-cyan-950/40 text-[#00A8B5] dark:text-[#38BDF8] capitalize">
              {currentWord.partOfSpeech}
            </span>
          </div>
          <CategoryBadge category={currentWord.category || 'Business'} size="sm" />
        </div>

        {/* Word Front View */}
        <div className="my-8 text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold font-heading text-[#15303D] dark:text-[#F8FAFC] tracking-tight">
            {currentWord.word}
          </h2>

          {currentWord.pronunciation && (
            <p className="text-base font-numbers text-[#00A8B5] dark:text-[#38BDF8]">
              {currentWord.pronunciation}
            </p>
          )}

          <button
            onClick={() => speakWord(currentWord.word)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#E6F7F8] dark:bg-[#0F172A] hover:bg-[#00A8B5]/15 text-[#00A8B5] dark:text-[#38BDF8] font-semibold text-xs transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir Pronúncia</span>
          </button>
        </div>

        {/* Revealed Details (Card Back) */}
        {isFlipped ? (
          <div className="space-y-4 p-5 rounded-[16px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] animate-fade-in text-left">
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                Significado em Inglês:
              </span>
              <p className="text-sm font-medium text-[#15303D] dark:text-[#F8FAFC] mt-0.5 leading-relaxed">
                {currentWord.meaning}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                Tradução em Português:
              </span>
              <p className="text-sm font-semibold text-[#00A8B5] dark:text-[#38BDF8] mt-0.5">
                {currentWord.translation}
              </p>
            </div>

            {currentWord.exampleSentence && (
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155]">
                <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                  Frase de Exemplo:
                </span>
                <p className="text-xs italic text-[#15303D] dark:text-[#F8FAFC] font-medium mt-0.5">
                  "{currentWord.exampleSentence}"
                </p>
                {currentWord.exampleTranslation && (
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    {currentWord.exampleTranslation}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <button
              onClick={() => setIsFlipped(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-[#00A8B5] hover:bg-[#008C96] dark:bg-[#00A8B5] dark:hover:bg-[#008C96] text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Revelar Significado & Tradução</span>
            </button>
          </div>
        )}

        {/* Rating Decision Bar */}
        {isFlipped && (
          <div className="pt-6 border-t border-[#E2E8F0] dark:border-[#334155] space-y-3">
            <p className="text-center text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              Como foi a sua lembrança desta palavra?
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                disabled={isSubmitting}
                onClick={() => handleRating('Hard')}
                className="py-3 px-3 rounded-[14px] bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-[#DC2626] dark:text-rose-300 font-semibold text-xs border border-rose-200 dark:border-rose-800 transition-colors text-center cursor-pointer"
              >
                <div>Difícil</div>
                <div className="text-[10px] font-normal opacity-75 mt-0.5 font-numbers">+1 dia</div>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleRating('Medium')}
                className="py-3 px-3 rounded-[14px] bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-[#EAB308] dark:text-amber-300 font-semibold text-xs border border-amber-200 dark:border-amber-800 transition-colors text-center cursor-pointer"
              >
                <div>Médio</div>
                <div className="text-[10px] font-normal opacity-75 mt-0.5 font-numbers">+3 dias</div>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleRating('Easy')}
                className="py-3 px-3 rounded-[14px] bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-[#16A34A] dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800 transition-colors text-center cursor-pointer"
              >
                <div>Fácil</div>
                <div className="text-[10px] font-normal opacity-75 mt-0.5 font-numbers">+7 dias</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
