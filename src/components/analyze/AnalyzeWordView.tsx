import React, { useState } from 'react';
import { WordAnalysisResult, VocabularyWord } from '../../types';
import { analyzeWord as analyzeWordApi } from '../../services/aiService';
import { speakWord } from '../../utils/ipaAudio';
import { formatContextString } from '../../utils/formatUtils';
import { CEFRBadge } from '../common/CEFRBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import {
  Search,
  Sparkles,
  Loader2,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  BookmarkPlus,
  ArrowRight,
  Info,
} from 'lucide-react';

interface AnalyzeWordViewProps {
  onSaveWord: (wordData: Omit<VocabularyWord, 'id' | 'userId'>) => Promise<void>;
  existingWords: VocabularyWord[];
}

export const AnalyzeWordView: React.FC<AnalyzeWordViewProps> = ({
  onSaveWord,
  existingWords,
}) => {
  const [inputText, setInputText] = useState('');
  const [lessonContext, setLessonContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WordAnalysisResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'exists'>('idle');
  const [error, setError] = useState<string | null>(null);

  const isAlreadySaved = analysisResult
    ? existingWords.some(
        (w) => w.word.toLowerCase() === analysisResult.word.toLowerCase()
      )
    : false;

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const wordToAnalyze = inputText.trim();
    if (!wordToAnalyze) return;

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSaveStatus('idle');

    try {
      const result = await analyzeWordApi(wordToAnalyze, lessonContext);
      setAnalysisResult(result);
      if (existingWords.some((w) => w.word.toLowerCase() === result.word.toLowerCase())) {
        setSaveStatus('exists');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError('Ocorreu um erro ao analisar a palavra. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!analysisResult) return;

    if (isAlreadySaved) {
      setSaveStatus('exists');
      return;
    }

    setSaveStatus('saving');
    try {
      const today = new Date().toISOString().split('T')[0];
      await onSaveWord({
        word: analysisResult.word,
        pronunciation: analysisResult.pronunciation || '',
        audioUrl: analysisResult.audioUrl || '',
        meaning: analysisResult.meaning || '',
        translation: analysisResult.translation || '',
        partOfSpeech: analysisResult.partOfSpeech || 'noun',
        cefr: analysisResult.cefr || 'B1',
        category: analysisResult.category || 'Geral',
        lesson: analysisResult.lesson || lessonContext || 'Estudo Livre',
        collocations: analysisResult.collocations || [],
        wordFamily: analysisResult.wordFamily || [],
        synonyms: analysisResult.synonyms || [],
        antonyms: analysisResult.antonyms || [],
        commonMistakes: analysisResult.commonMistakes || '',
        whatComesBefore: analysisResult.whatComesBefore || '',
        whatComesAfter: analysisResult.whatComesAfter || '',
        exampleSentence: analysisResult.exampleSentence || '',
        exampleTranslation: analysisResult.exampleTranslation || '',
        mySentence: analysisResult.mySentenceSuggestion || '',
        teacherFeedback: '',
        reviewDate: today,
        difficulty: analysisResult.difficultyRecommendation || 'Medium',
        mastered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setSaveStatus('saved');
    } catch (err) {
      console.error('Error saving word:', err);
      setSaveStatus('idle');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Search Header Banner */}
      <div className="p-6 rounded-[20px] bg-gradient-to-r from-[#E0F2FE] via-[#EBF5FF] to-[#F0F9FF] dark:from-[#0F263B] dark:via-[#132F4C] dark:to-[#0F263B] border border-[#BAE6FD] dark:border-[#1C4164] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-[12px] bg-white/80 text-[#00A8B5] dark:bg-cyan-950/50 dark:text-[#38BDF8]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold font-heading text-[#0C3859] dark:text-[#F8FAFC]">
              Analisar Palavra ou Expressão
            </h2>
            <p className="text-xs text-[#2D587B] dark:text-[#94A3B8]">
              Digite uma palavra em inglês para receber análise instantânea de collocations, gramática e tradução.
            </p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
                Palavra ou expressão (Inglês)
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ex: enlighten, put off, resilient, ubiquitous..."
                className="w-full px-4 py-2.5 text-xs font-medium rounded-[12px] bg-[#FAF8F5] dark:bg-[#0F172A] text-[#15303D] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:border-[#00A8B5]"
              />
            </div>

            <div className="w-full sm:w-48">
              <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
                Lição / Módulo (Opcional)
              </label>
              <input
                type="text"
                value={lessonContext}
                onChange={(e) => setLessonContext(e.target.value)}
                placeholder="Ex: Lesson 4"
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-[12px] bg-[#FAF8F5] dark:bg-[#0F172A] text-[#15303D] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:border-[#00A8B5]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] bg-[#00A8B5] hover:bg-[#008C96] dark:bg-[#00A8B5] dark:hover:bg-[#008C96] text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analisando...</span>
                  </>
                ) : (
                  <>
                    <span>Analisar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#E2E8F0] dark:border-[#334155] text-xs">
          <span className="font-semibold text-[#64748B] dark:text-[#94A3B8] text-[11px]">Exemplos rápidos:</span>
          {['resilient', 'put off', 'ubiquitous', 'breakthrough', 'overcome'].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setInputText(sample);
              }}
              className="px-2.5 py-1 rounded-full bg-[#E6F7F8] dark:bg-[#0F172A] text-[#00A8B5] dark:text-[#38BDF8] border border-[#00A8B5]/20 font-medium text-[11px] hover:bg-[#00A8B5]/15 transition-colors cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-12 px-6 bg-white dark:bg-[#1E293B] rounded-[20px] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-3">
          <div className="w-8 h-8 border-3 border-[#E2E8F0] border-t-[#2563EB] dark:border-[#334155] dark:border-t-[#3B82F6] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC]">
            Processando palavra com Inteligência Artificial EPWAY...
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-[14px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Result Card */}
      {analysisResult && !loading && (
        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-0 animate-fade-in">
          {/* Card Header */}
          <div className="bg-[#0F172A] text-white p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#F8FAFC]">
                {analysisResult.word}
              </h3>
              {analysisResult.pronunciation && (
                <span className="text-xs font-numbers text-[#94A3B8]">
                  {analysisResult.pronunciation}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <CEFRBadge level={analysisResult.cefr} size="sm" />
              <CategoryBadge category={analysisResult.category || 'Business'} size="sm" />
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            {/* Audio Button */}
            <div>
              <button
                onClick={() => speakWord(analysisResult.word)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#2563EB] dark:text-[#60A5FA] border border-[#CBD5E1] dark:border-[#334155] font-semibold text-xs transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ouvir Pronúncia</span>
              </button>
            </div>

            {/* Meaning & Translation Block */}
            <div className="p-4 rounded-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                Meaning & Tradução
              </span>
              <p className="text-sm font-medium text-[#1E293B] dark:text-[#F8FAFC] leading-relaxed">
                {analysisResult.meaning}
              </p>
              <p className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] pt-1 border-t border-[#E2E8F0] dark:border-[#334155]">
                Português: <span className="font-normal text-[#1E293B] dark:text-[#F8FAFC]">{analysisResult.translation}</span>
              </p>
            </div>

            {/* Collocations */}
            {analysisResult.collocations && analysisResult.collocations.length > 0 && (
              <div className="p-4 rounded-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Collocations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.collocations.map((col, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#EFF6FF] dark:bg-[#1E293B] border border-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] font-medium text-xs"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Grid 2: Before & After */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  What comes before
                </span>
                <p className="text-xs font-medium text-[#1E293B] dark:text-[#F8FAFC]">
                  {formatContextString(analysisResult.whatComesBefore) || 'Comum após artigos e advérbios'}
                </p>
              </div>

              <div className="p-4 rounded-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  What comes after
                </span>
                <p className="text-xs font-medium text-[#1E293B] dark:text-[#F8FAFC]">
                  {formatContextString(analysisResult.whatComesAfter) || 'Comum antes de preposições (to, of, in)'}
                </p>
              </div>
            </div>

            {/* Example Sentence */}
            {analysisResult.exampleSentence && (
              <div className="p-4 rounded-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border-l-4 border-l-[#2563EB] border border-[#E2E8F0] dark:border-[#334155] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA]">
                  Example sentence
                </span>
                <p className="text-sm italic font-medium text-[#1E293B] dark:text-[#F8FAFC] leading-relaxed">
                  "{analysisResult.exampleSentence}"
                </p>
                {analysisResult.exampleTranslation && (
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    {analysisResult.exampleTranslation}
                  </p>
                )}
              </div>
            )}

            {/* Common Mistakes */}
            {analysisResult.commonMistakes && (
              <div className="p-4 rounded-[16px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Dica EPWAY para Brasileiros:</span>
                </span>
                <p className="leading-relaxed font-medium">{analysisResult.commonMistakes}</p>
              </div>
            )}
          </div>

          {/* Card Footer: Save Button */}
          <div className="p-5 bg-[#F8FAFC] dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-3">
            {saveStatus === 'saved' ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[12px] bg-emerald-50 dark:bg-emerald-950/40 text-[#16A34A] border border-emerald-200 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvo em Minhas Palavras</span>
              </div>
            ) : isAlreadySaved || saveStatus === 'exists' ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[12px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Esta palavra já está salva na sua lista</span>
              </div>
            ) : (
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Adicione ao seu banco pessoal do curso EPWAY.
              </span>
            )}

            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving' || saveStatus === 'saved' || isAlreadySaved}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] text-white font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>
                {saveStatus === 'saving'
                  ? 'Salvando...'
                  : saveStatus === 'saved'
                  ? 'Salvo'
                  : isAlreadySaved
                  ? 'Já Salvo'
                  : 'Salvar em Minhas Palavras'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
