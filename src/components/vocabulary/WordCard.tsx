import React from 'react';
import { VocabularyWord } from '../../types';
import { CEFRBadge } from '../common/CEFRBadge';
import { DifficultyBadge } from '../common/DifficultyBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { Volume2, CheckCircle2, Calendar } from 'lucide-react';
import { speakWord } from '../../utils/ipaAudio';

interface WordCardProps {
  word: VocabularyWord;
  onSelect: (word: VocabularyWord) => void;
  onToggleMastered: (wordId: string, e: React.MouseEvent) => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, onSelect, onToggleMastered }) => {
  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakWord(word.word);
  };

  const formattedDate = new Date(word.createdAt || Date.now()).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <div
      onClick={() => onSelect(word)}
      className="group relative bg-white dark:bg-[#1E293B] rounded-[20px] p-6 border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:border-[#00A8B5] dark:hover:border-[#00A8B5] transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CEFRBadge level={word.cefr} size="sm" />
            <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#E6F7F8] text-[#00A8B5] dark:bg-cyan-950/40 dark:text-[#38BDF8] border border-[#00A8B5]/20">
              {word.partOfSpeech || 'noun'}
            </span>
            <DifficultyBadge difficulty={word.difficulty || 'Medium'} size="sm" />
          </div>

          <button
            onClick={(e) => onToggleMastered(word.id!, e)}
            title={word.mastered ? 'Marcar como não dominado' : 'Marcar como aprendido'}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              word.mastered
                ? 'text-[#16A34A] bg-[#16A34A]/10 hover:bg-[#16A34A]/20'
                : 'text-slate-300 dark:text-slate-600 hover:text-[#00A8B5]'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Word Title & Pronunciation */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="text-xl font-bold font-heading text-[#15303D] dark:text-[#F8FAFC] group-hover:text-[#00A8B5] dark:group-hover:text-[#38BDF8] transition-colors">
            {word.word}
          </h3>
          {word.pronunciation && (
            <span className="text-xs font-numbers text-[#64748B] dark:text-[#94A3B8]">
              {word.pronunciation}
            </span>
          )}
        </div>

        {/* Listen Button */}
        <button
          onClick={handleAudio}
          className="inline-flex items-center gap-1.5 text-xs text-[#00A8B5] dark:text-[#38BDF8] hover:underline mb-3 font-medium cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Ouvir Pronúncia</span>
        </button>

        {/* Meaning & Translation */}
        <div className="space-y-1.5 mb-4">
          <p className="text-xs text-[#1E293B] dark:text-[#F8FAFC] line-clamp-2 leading-relaxed font-sans">
            {word.meaning}
          </p>
          <p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            PT: <span className="text-[#1E293B] dark:text-[#F8FAFC] font-normal">{word.translation}</span>
          </p>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="pt-3.5 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
        <CategoryBadge category={word.category || 'Daily Life'} size="sm" />
        <span className="flex items-center gap-1 font-numbers text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>{formattedDate}</span>
        </span>
      </div>
    </div>
  );
};
