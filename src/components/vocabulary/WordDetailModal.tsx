import React, { useState } from 'react';
import { VocabularyWord } from '../../types';
import { CEFRBadge } from '../common/CEFRBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { DifficultyBadge } from '../common/DifficultyBadge';
import {
  X,
  Volume2,
  CheckCircle2,
  Edit2,
  Trash2,
  Sparkles,
  AlertTriangle,
  Layers,
  GraduationCap,
  Save,
  Quote,
} from 'lucide-react';
import { speakWord } from '../../utils/ipaAudio';
import { formatContextString } from '../../utils/formatUtils';

interface WordDetailModalProps {
  word: VocabularyWord | null;
  onClose: () => void;
  onEdit: (word: VocabularyWord) => void;
  onDelete: (wordId: string) => void;
  onUpdate: (wordId: string, updates: Partial<VocabularyWord>) => Promise<void>;
  onToggleMastered: (wordId: string) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  onClose,
  onEdit,
  onDelete,
  onUpdate,
  onToggleMastered,
}) => {
  if (!word) return null;

  const [mySentenceInput, setMySentenceInput] = useState(word.mySentence || '');
  const [isSavingSentence, setIsSavingSentence] = useState(false);

  const handleSaveSentence = async () => {
    if (!word.id) return;
    setIsSavingSentence(true);
    await onUpdate(word.id, { mySentence: mySentenceInput });
    setIsSavingSentence(false);
  };

  const formattedDate = new Date(word.createdAt || Date.now()).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1E293B] rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-[#E2E8F0] dark:border-[#334155] my-8 overflow-hidden text-[#1E293B] dark:text-[#F8FAFC]">
        {/* Header Ribbon */}
        <div className="bg-[#0F172A] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 flex-wrap mb-3">
            <CEFRBadge level={word.cefr} size="md" />
            <span className="px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold capitalize">
              {word.partOfSpeech || 'noun'}
            </span>
            <DifficultyBadge difficulty={word.difficulty || 'Medium'} />
            <CategoryBadge category={word.category || 'Business'} size="sm" />
          </div>

          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-[#F8FAFC]">{word.word}</h2>
              {word.pronunciation && (
                <p className="text-sm font-numbers text-[#94A3B8] mt-1">{word.pronunciation}</p>
              )}
            </div>

            <button
              onClick={() => speakWord(word.word)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white text-[#2563EB] font-semibold text-xs shadow-xs hover:bg-[#EFF6FF] transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#2563EB]" />
              <span>Ouvir Pronúncia</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Meaning & Translation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                English Meaning
              </span>
              <p className="text-sm font-medium text-[#1E293B] dark:text-[#F8FAFC] mt-1 leading-relaxed">
                {word.meaning}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                Tradução (Português)
              </span>
              <p className="text-sm font-semibold text-[#2563EB] dark:text-[#60A5FA] mt-1">
                {word.translation}
              </p>
            </div>
          </div>

          {/* Collocations & Word Family */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {word.collocations && word.collocations.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Collocations</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {word.collocations.map((c, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full bg-[#EFF6FF] dark:bg-[#0F172A] text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {word.wordFamily && word.wordFamily.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Word Family</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {word.wordFamily.map((wf, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] dark:text-purple-300 border border-[#8B5CF6]/20 font-medium"
                    >
                      {typeof wf === 'string' ? wf : `${wf.pos}: ${wf.word}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Synonyms & Antonyms */}
          {(word.synonyms?.length > 0 || word.antonyms?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {word.synonyms && word.synonyms.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
                    Sinônimos
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {word.synonyms.map((syn, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#16A34A] dark:text-emerald-300 border border-[#16A34A]/20 font-medium"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {word.antonyms && word.antonyms.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
                    Antônimos
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {word.antonyms.map((ant, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 font-medium"
                      >
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Context Words (Before & After) */}
          {(word.whatComesBefore || word.whatComesAfter) && (
            <div className="p-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex flex-wrap gap-6 text-xs">
              {word.whatComesBefore && (
                <div>
                  <span className="font-semibold text-[#64748B] dark:text-[#94A3B8]">Vem antes: </span>
                  <span className="font-sans text-[#1E293B] dark:text-[#F8FAFC]">{formatContextString(word.whatComesBefore)}</span>
                </div>
              )}
              {word.whatComesAfter && (
                <div>
                  <span className="font-semibold text-[#64748B] dark:text-[#94A3B8]">Vem depois: </span>
                  <span className="font-sans text-[#1E293B] dark:text-[#F8FAFC]">{formatContextString(word.whatComesAfter)}</span>
                </div>
              )}
            </div>
          )}

          {/* Common Mistakes Warning Callout */}
          {word.commonMistakes && (
            <div className="p-4 rounded-[16px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-semibold mb-0.5">Atenção a Erros Comuns:</p>
                <p className="leading-relaxed">{word.commonMistakes}</p>
              </div>
            </div>
          )}

          {/* Example Sentences */}
          {word.exampleSentence && (
            <div className="p-4 rounded-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border-l-4 border-l-[#2563EB] border border-[#E2E8F0] dark:border-[#334155] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5" />
                <span>Exemplo de Uso</span>
              </div>
              <p className="text-sm font-semibold text-[#1E293B] dark:text-[#F8FAFC] italic">
                "{word.exampleSentence}"
              </p>
              {word.exampleTranslation && (
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {word.exampleTranslation}
                </p>
              )}
            </div>
          )}

          {/* My Sentence (Interactive Student Field) */}
          <div className="p-4 rounded-[16px] bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC] flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                <span>Minha Frase Pessoal (My Sentence)</span>
              </label>
              <button
                onClick={handleSaveSentence}
                disabled={isSavingSentence || mySentenceInput === word.mySentence}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white font-medium transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingSentence ? 'Salvando...' : 'Salvar Frase'}</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={mySentenceInput}
              onChange={(e) => setMySentenceInput(e.target.value)}
              placeholder="Escreva uma frase de exemplo criada por você..."
              className="w-full p-2.5 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Teacher Feedback */}
          {word.teacherFeedback && (
            <div className="p-4 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1 text-xs text-emerald-900 dark:text-emerald-200">
              <span className="font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#16A34A]" />
                Feedback do Professor EPWAY:
              </span>
              <p className="italic leading-relaxed">{word.teacherFeedback}</p>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
            <span>Lição: {word.lesson || 'Geral'}</span>
            <span className="font-numbers">Adicionado em: {formattedDate}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#F8FAFC] dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => onToggleMastered(word.id!)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-semibold transition-colors cursor-pointer ${
              word.mastered
                ? 'bg-emerald-100 text-[#16A34A] dark:bg-emerald-950/60'
                : 'bg-[#E2E8F0] text-[#1E293B] dark:bg-[#334155] dark:text-[#F8FAFC] hover:bg-[#CBD5E1]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{word.mastered ? 'Aprendido / Mastered' : 'Marcar como Aprendido'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(word);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-[#E2E8F0] dark:bg-[#334155] hover:bg-[#CBD5E1] text-[#1E293B] dark:text-[#F8FAFC] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>
            <button
              onClick={() => {
                if (confirm(`Tem certeza que deseja excluir "${word.word}"?`)) {
                  onDelete(word.id!);
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
