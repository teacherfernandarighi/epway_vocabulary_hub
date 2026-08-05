import React, { useState } from 'react';
import { VocabularyWord } from '../../types';
import { CEFRBadge } from '../common/CEFRBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { speakWord } from '../../utils/ipaAudio';
import { formatContextString } from '../../utils/formatUtils';
import {
  ChevronDown,
  Volume2,
  Trash2,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AccordionWordCardProps {
  word: VocabularyWord;
  onSelect: (word: VocabularyWord) => void;
  onDelete: (wordId: string, e: React.MouseEvent) => void;
  onToggleMastered: (wordId: string, e: React.MouseEvent) => void;
}

export const AccordionWordCard: React.FC<AccordionWordCardProps> = ({
  word,
  onSelect,
  onDelete,
  onToggleMastered,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = new Date(word.createdAt || Date.now()).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[20px] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] overflow-hidden transition-all duration-200">
      {/* Accordion Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#E6F7F8]/50 dark:hover:bg-[#0F172A]/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMastered(word.id!, e);
            }}
            title={word.mastered ? 'Marcar como não dominado' : 'Marcar como aprendido'}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              word.mastered
                ? 'text-[#16A34A] bg-[#16A34A]/10 hover:bg-[#16A34A]/20'
                : 'text-slate-300 dark:text-slate-600 hover:text-[#00A8B5]'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 fill-current" />
          </button>

          <h3 className="text-lg font-bold font-heading text-[#15303D] dark:text-[#F8FAFC] flex items-center gap-2">
            <span>{word.word}</span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#E6F7F8] dark:bg-cyan-950/40 text-[#00A8B5] dark:text-[#38BDF8] border border-[#00A8B5]/20">
              {word.partOfSpeech}
            </span>
          </h3>

          <CEFRBadge level={word.cefr} size="sm" />
          <CategoryBadge category={word.category || 'Daily Life'} size="sm" />
        </div>

        <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span className="hidden sm:inline-flex items-center gap-1 font-numbers text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>{formattedDate}</span>
          </span>

          <ChevronDown
            className={`w-5 h-5 text-[#64748B] dark:text-[#94A3B8] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#00A8B5]' : ''
            }`}
          />
        </div>
      </div>

      {/* Accordion Expanded Body */}
      {isOpen && (
        <div className="p-5 pt-0 border-t border-[#E2E8F0] dark:border-[#334155] space-y-4 animate-fade-in bg-[#FAF8F5]/50 dark:bg-[#020617]/50">
          {/* Quick Pronunciation & Actions */}
          <div className="flex items-center justify-between gap-2 pt-3">
            <button
              onClick={() => speakWord(word.word)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] bg-white dark:bg-[#1E293B] hover:bg-[#E6F7F8] text-[#00A8B5] dark:text-[#38BDF8] border border-[#CBD5E1] dark:border-[#334155] font-semibold text-xs transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Ouvir Pronúncia ({word.pronunciation || '/.../'})</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelect(word)}
                className="px-4 py-2 rounded-[14px] bg-[#00A8B5] text-white hover:bg-[#008C96] dark:bg-[#00A8B5] font-semibold text-xs transition-colors shadow-xs cursor-pointer"
              >
                Ver Detalhes Completo
              </button>

              <button
                onClick={(e) => onDelete(word.id!, e)}
                title="Excluir palavra"
                className="p-2 rounded-[14px] text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Meaning & Translation */}
          <div className="p-4 rounded-[16px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Meaning & Tradução
            </span>
            <p className="text-sm font-medium text-[#15303D] dark:text-[#F8FAFC] leading-relaxed">
              {word.meaning}
            </p>
            <p className="text-xs font-semibold text-[#00A8B5] dark:text-[#38BDF8] pt-1">
              Português: <span className="font-normal text-[#15303D] dark:text-[#F8FAFC]">{word.translation}</span>
            </p>
          </div>

          {/* Collocations */}
          {word.collocations && word.collocations.length > 0 && (
            <div className="p-4 rounded-[16px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                Collocations
              </span>
              <div className="flex flex-wrap gap-1.5">
                {word.collocations.map((col, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#E6F7F8] dark:bg-[#0F172A] border border-[#00A8B5]/20 text-[#00A8B5] dark:text-[#38BDF8] font-medium text-xs"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grid 2: Before & After */}
          {(word.whatComesBefore || word.whatComesAfter) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {word.whatComesBefore && (
                <div className="p-3.5 rounded-[14px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    What comes before
                  </span>
                  <p className="text-xs font-medium text-[#15303D] dark:text-[#F8FAFC] mt-1">
                    {formatContextString(word.whatComesBefore)}
                  </p>
                </div>
              )}

              {word.whatComesAfter && (
                <div className="p-3.5 rounded-[14px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    What comes after
                  </span>
                  <p className="text-xs font-medium text-[#15303D] dark:text-[#F8FAFC] mt-1">
                    {formatContextString(word.whatComesAfter)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Example Sentence */}
          {word.exampleSentence && (
            <div className="p-4 rounded-[16px] bg-white dark:bg-[#1E293B] border-l-4 border-l-[#00A8B5] border border-[#E2E8F0] dark:border-[#334155] space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00A8B5] dark:text-[#38BDF8]">
                Example sentence
              </span>
              <p className="text-xs italic font-medium text-[#15303D] dark:text-[#F8FAFC] leading-relaxed">
                "{word.exampleSentence}"
              </p>
              {word.exampleTranslation && (
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  {word.exampleTranslation}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
