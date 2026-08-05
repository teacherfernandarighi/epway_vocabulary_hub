import React, { useState, useEffect } from 'react';
import { VocabularyWord, CEFRLevel, PartOfSpeech, DifficultyLevel } from '../../types';
import { analyzeWord } from '../../services/aiService';
import { X, Sparkles, Loader2, Save, Volume2 } from 'lucide-react';
import { speakWord } from '../../utils/ipaAudio';
import { formatContextString } from '../../utils/formatUtils';

interface WordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (wordData: Omit<VocabularyWord, 'id' | 'userId'>) => Promise<void>;
  editWord?: VocabularyWord | null;
}

export const WordFormModal: React.FC<WordFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editWord,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Omit<VocabularyWord, 'id' | 'userId'>>({
    word: '',
    pronunciation: '',
    audioUrl: '',
    meaning: '',
    translation: '',
    partOfSpeech: 'noun',
    cefr: 'B1',
    category: 'General',
    lesson: 'General Vocabulary',
    collocations: [],
    wordFamily: [],
    synonyms: [],
    antonyms: [],
    commonMistakes: '',
    whatComesBefore: '',
    whatComesAfter: '',
    exampleSentence: '',
    exampleTranslation: '',
    mySentence: '',
    teacherFeedback: '',
    reviewDate: new Date().toISOString().split('T')[0],
    difficulty: 'Medium',
    mastered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [collocationsInput, setCollocationsInput] = useState('');
  const [wordFamilyInput, setWordFamilyInput] = useState('');
  const [synonymsInput, setSynonymsInput] = useState('');
  const [antonymsInput, setAntonymsInput] = useState('');

  const [autoExplainOnSave, setAutoExplainOnSave] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editWord) {
      setFormData({
        word: editWord.word || '',
        pronunciation: editWord.pronunciation || '',
        audioUrl: editWord.audioUrl || '',
        meaning: editWord.meaning || '',
        translation: editWord.translation || '',
        partOfSpeech: editWord.partOfSpeech || 'noun',
        cefr: editWord.cefr || 'B1',
        category: editWord.category || 'General',
        lesson: editWord.lesson || 'General Vocabulary',
        collocations: editWord.collocations || [],
        wordFamily: Array.isArray(editWord.wordFamily) ? editWord.wordFamily : [],
        synonyms: editWord.synonyms || [],
        antonyms: editWord.antonyms || [],
        commonMistakes: editWord.commonMistakes || '',
        whatComesBefore: editWord.whatComesBefore || '',
        whatComesAfter: editWord.whatComesAfter || '',
        exampleSentence: editWord.exampleSentence || '',
        exampleTranslation: editWord.exampleTranslation || '',
        mySentence: editWord.mySentence || '',
        teacherFeedback: editWord.teacherFeedback || '',
        reviewDate: editWord.reviewDate || new Date().toISOString().split('T')[0],
        difficulty: editWord.difficulty || 'Medium',
        mastered: editWord.mastered || false,
        createdAt: editWord.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setCollocationsInput((editWord.collocations || []).join(', '));
      setWordFamilyInput((editWord.wordFamily || []).map((wf) => (typeof wf === 'string' ? wf : wf.word)).join(', '));
      setSynonymsInput((editWord.synonyms || []).join(', '));
      setAntonymsInput((editWord.antonyms || []).join(', '));
    } else {
      setFormData({
        word: '',
        pronunciation: '',
        audioUrl: '',
        meaning: '',
        translation: '',
        partOfSpeech: 'noun',
        cefr: 'B1',
        category: 'General',
        lesson: 'General Vocabulary',
        collocations: [],
        wordFamily: [],
        synonyms: [],
        antonyms: [],
        commonMistakes: '',
        whatComesBefore: '',
        whatComesAfter: '',
        exampleSentence: '',
        exampleTranslation: '',
        mySentence: '',
        teacherFeedback: '',
        reviewDate: new Date().toISOString().split('T')[0],
        difficulty: 'Medium',
        mastered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setCollocationsInput('');
      setWordFamilyInput('');
      setSynonymsInput('');
      setAntonymsInput('');
    }
    setAiMessage(null);
  }, [editWord, isOpen]);

  const handleAiAnalysis = async (wordToAnalyzeOverride?: string): Promise<Partial<VocabularyWord> | null> => {
    const targetWord = (wordToAnalyzeOverride || formData.word).trim();
    if (!targetWord) {
      alert('Por favor digite uma palavra antes de analisar.');
      return null;
    }

    setIsAnalyzing(true);
    setAiMessage(null);

    try {
      const result = await analyzeWord(targetWord, formData.lesson);

      const updatedFields = {
        word: result.word || targetWord,
        pronunciation: result.pronunciation || formData.pronunciation,
        meaning: result.meaning || formData.meaning,
        translation: result.translation || formData.translation,
        partOfSpeech: result.partOfSpeech || formData.partOfSpeech,
        cefr: result.cefr || formData.cefr,
        category: result.category || formData.category,
        collocations: result.collocations || formData.collocations,
        wordFamily: result.wordFamily || formData.wordFamily,
        synonyms: result.synonyms || formData.synonyms,
        antonyms: result.antonyms || formData.antonyms,
        commonMistakes: result.commonMistakes || formData.commonMistakes,
        whatComesBefore: formatContextString(result.whatComesBefore) || formData.whatComesBefore,
        whatComesAfter: formatContextString(result.whatComesAfter) || formData.whatComesAfter,
        exampleSentence: result.exampleSentence || formData.exampleSentence,
        exampleTranslation: result.exampleTranslation || formData.exampleTranslation,
        mySentence: formData.mySentence || result.mySentenceSuggestion || '',
        difficulty: result.difficultyRecommendation || formData.difficulty,
      };

      setFormData((prev) => ({
        ...prev,
        ...updatedFields,
      }));

      setCollocationsInput((result.collocations || []).join(', '));
      setWordFamilyInput((result.wordFamily || []).join(', '));
      setSynonymsInput((result.synonyms || []).join(', '));
      setAntonymsInput((result.antonyms || []).join(', '));

      setAiMessage('Explicação e análise de IA geradas com sucesso.');
      return updatedFields;
    } catch (err: any) {
      console.error('Análise de IA falhou:', err);
      setAiMessage('Análise manual ativada.');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWord = formData.word.trim();
    if (!cleanWord) return;

    setIsSubmitting(true);
    setAiMessage(null);

    let currentData = { ...formData, word: cleanWord };

    const isMissingExplanation = !currentData.meaning.trim() || !currentData.translation.trim();
    if ((autoExplainOnSave || isMissingExplanation) && !isAnalyzing) {
      setAiMessage('Gerando explicação completa com IA EPWAY...');
      try {
        const result = await analyzeWord(cleanWord, currentData.lesson);
        if (result) {
          currentData = {
            ...currentData,
            word: result.word || cleanWord,
            pronunciation: currentData.pronunciation || result.pronunciation || '',
            meaning: currentData.meaning || result.meaning || '',
            translation: currentData.translation || result.translation || '',
            partOfSpeech: result.partOfSpeech || currentData.partOfSpeech,
            cefr: result.cefr || currentData.cefr,
            category: currentData.category !== 'General' ? currentData.category : (result.category || 'General'),
            collocations: currentData.collocations.length > 0 ? currentData.collocations : (result.collocations || []),
            wordFamily: currentData.wordFamily.length > 0 ? currentData.wordFamily : (result.wordFamily || []),
            synonyms: currentData.synonyms.length > 0 ? currentData.synonyms : (result.synonyms || []),
            antonyms: currentData.antonyms.length > 0 ? currentData.antonyms : (result.antonyms || []),
            commonMistakes: currentData.commonMistakes || result.commonMistakes || '',
            whatComesBefore: formatContextString(currentData.whatComesBefore || result.whatComesBefore || ''),
            whatComesAfter: formatContextString(currentData.whatComesAfter || result.whatComesAfter || ''),
            exampleSentence: currentData.exampleSentence || result.exampleSentence || '',
            exampleTranslation: currentData.exampleTranslation || result.exampleTranslation || '',
            mySentence: currentData.mySentence || result.mySentenceSuggestion || '',
            difficulty: result.difficultyRecommendation || currentData.difficulty,
          };
          if (!collocationsInput && result.collocations) {
            setCollocationsInput(result.collocations.join(', '));
          }
          if (!wordFamilyInput && result.wordFamily) {
            setWordFamilyInput(result.wordFamily.join(', '));
          }
          if (!synonymsInput && result.synonyms) {
            setSynonymsInput(result.synonyms.join(', '));
          }
          if (!antonymsInput && result.antonyms) {
            setAntonymsInput(result.antonyms.join(', '));
          }
        }
      } catch (aiErr) {
        console.warn('Auto AI analysis fallback during save:', aiErr);
      }
    }

    const parseTags = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const finalWordData: Omit<VocabularyWord, 'id' | 'userId'> = {
      ...currentData,
      collocations: collocationsInput ? parseTags(collocationsInput) : currentData.collocations,
      wordFamily: wordFamilyInput ? parseTags(wordFamilyInput) : currentData.wordFamily,
      synonyms: synonymsInput ? parseTags(synonymsInput) : currentData.synonyms,
      antonyms: antonymsInput ? parseTags(antonymsInput) : currentData.antonyms,
    };

    try {
      await onSave(finalWordData);
      onClose();
    } catch (err) {
      console.error('Error saving word:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1E293B] rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-[#E2E8F0] dark:border-[#334155] my-8 overflow-hidden text-[#1E293B] dark:text-[#F8FAFC]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold font-heading text-[#1E293B] dark:text-[#F8FAFC]">
              {editWord ? 'Editar Palavra' : 'Adicionar Nova Palavra ao Banco EPWAY'}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
              Ao salvar, a Inteligência Artificial EPWAY gera automaticamente significados, tradução, collocations e exemplos.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#E2E8F0] dark:hover:bg-[#334155] text-[#1E293B] dark:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Word & AI Analyze Row */}
          <div className="p-4 rounded-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
                  Palavra ou Expressão em Inglês (Word) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: resilient, figure out, ubiquitous, breakthrough..."
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  className="w-full px-4 py-2.5 text-base font-semibold rounded-[12px] bg-white dark:bg-[#1E293B] text-[#15303D] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] focus:border-[#00A8B5] focus:outline-none"
                />
              </div>

              <div className="sm:self-end">
                <button
                  type="button"
                  onClick={() => handleAiAnalysis()}
                  disabled={isAnalyzing || !formData.word.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] bg-[#00A8B5] hover:bg-[#008C96] dark:bg-[#00A8B5] dark:hover:bg-[#008C96] text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Analisando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Preencher com IA EPWAY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Auto Explain Toggle Checkbox */}
            <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC]">
                <input
                  type="checkbox"
                  checked={autoExplainOnSave}
                  onChange={(e) => setAutoExplainOnSave(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] accent-[#2563EB]"
                />
                <span>Gerar explicação completa com IA EPWAY ao salvar (Recomendado)</span>
              </label>
            </div>

            {aiMessage && (
              <div className="p-2.5 rounded-[10px] bg-[#0F172A] text-[#60A5FA] text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>{aiMessage}</span>
              </div>
            )}
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Pronúncia (IPA)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/rɪˈzɪl.jənt/"
                  value={formData.pronunciation}
                  onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-numbers rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
                />
                {formData.word && (
                  <button
                    type="button"
                    onClick={() => speakWord(formData.word)}
                    title="Testar Pronúncia"
                    className="p-2 rounded-[12px] bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/40 dark:text-[#60A5FA] border border-[#2563EB]/20 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Classe Gramatical (Part of Speech)
              </label>
              <select
                value={formData.partOfSpeech}
                onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              >
                <option value="noun">Noun (Substantivo)</option>
                <option value="verb">Verb (Verbo)</option>
                <option value="adjective">Adjective (Adjetivo)</option>
                <option value="adverb">Adverb (Advérbio)</option>
                <option value="phrasal verb">Phrasal Verb</option>
                <option value="idiom">Idiom (Expressão)</option>
                <option value="preposition">Preposition</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Nível CEFR
              </label>
              <select
                value={formData.cefr}
                onChange={(e) => setFormData({ ...formData, cefr: e.target.value as CEFRLevel })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] font-semibold"
              >
                <option value="A1">A1 - Iniciante</option>
                <option value="A2">A2 - Básico</option>
                <option value="B1">B1 - Intermediário</option>
                <option value="B2">B2 - Pós-Intermediário</option>
                <option value="C1">C1 - Avançado</option>
                <option value="C2">C2 - Proficiente</option>
              </select>
            </div>
          </div>

          {/* Meaning & Translation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Meaning (Significado em Inglês) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Ex: Able to recover quickly from difficulties..."
                value={formData.meaning}
                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Portuguese Translation (Tradução em Português) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Ex: resiliente, resistente..."
                value={formData.translation}
                onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>
          </div>

          {/* Category & Lesson */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Categoria / Tema
              </label>
              <input
                type="text"
                placeholder="Ex: Business, Daily Life, Academic, Tech..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Lição (Lesson)
              </label>
              <input
                type="text"
                placeholder="Ex: Lesson 1: Professional Mindset..."
                value={formData.lesson}
                onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>
          </div>

          {/* Collocations & Word Family */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Collocations (separadas por vírgula)
              </label>
              <input
                type="text"
                placeholder="highly resilient, remain resilient"
                value={collocationsInput}
                onChange={(e) => setCollocationsInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Word Family (separadas por vírgula)
              </label>
              <input
                type="text"
                placeholder="resilience (noun), resiliently (adverb)"
                value={wordFamilyInput}
                onChange={(e) => setWordFamilyInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>
          </div>

          {/* Synonyms & Antonyms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Sinônimos (separados por vírgula)
              </label>
              <input
                type="text"
                placeholder="tough, adaptable, buoyant"
                value={synonymsInput}
                onChange={(e) => setSynonymsInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Antônimos (separados por vírgula)
              </label>
              <input
                type="text"
                placeholder="fragile, vulnerable"
                value={antonymsInput}
                onChange={(e) => setAntonymsInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>
          </div>

          {/* Common Mistakes */}
          <div>
            <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
              Common Mistakes (Erros Comuns de Alunos Brasileiros)
            </label>
            <input
              type="text"
              placeholder="Ex: Cuidado para não confundir com resistente apenas no aspecto físico..."
              value={formData.commonMistakes}
              onChange={(e) => setFormData({ ...formData, commonMistakes: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
            />
          </div>

          {/* What Comes Before & After */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                What Comes Before (Palavras frequentes antes)
              </label>
              <input
                type="text"
                placeholder="be, become, remarkably, highly"
                value={formData.whatComesBefore}
                onChange={(e) => setFormData({ ...formData, whatComesBefore: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                What Comes After (Palavras frequentes depois)
              </label>
              <input
                type="text"
                placeholder="against, to stress, in the face of"
                value={formData.whatComesAfter}
                onChange={(e) => setFormData({ ...formData, whatComesAfter: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>
          </div>

          {/* Example Sentence & Example Translation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Example Sentence (Frase Exemplo)
              </label>
              <textarea
                rows={2}
                placeholder="Successful entrepreneurs are remarkably resilient..."
                value={formData.exampleSentence}
                onChange={(e) => setFormData({ ...formData, exampleSentence: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Example Translation (Tradução da Frase)
              </label>
              <textarea
                rows={2}
                placeholder="Empreendedores de sucesso são notavelmente resilientes..."
                value={formData.exampleTranslation}
                onChange={(e) => setFormData({ ...formData, exampleTranslation: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>
          </div>

          {/* My Sentence & Teacher Feedback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                My Sentence (Sua Frase Pessoal)
              </label>
              <textarea
                rows={2}
                placeholder="Sua frase autoral usando a palavra..."
                value={formData.mySentence}
                onChange={(e) => setFormData({ ...formData, mySentence: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Teacher Feedback (Comentário do Professor)
              </label>
              <textarea
                rows={2}
                placeholder="Observação do professor EPWAY..."
                value={formData.teacherFeedback}
                onChange={(e) => setFormData({ ...formData, teacherFeedback: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
              />
            </div>
          </div>

          {/* Difficulty & Mastered */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex-wrap">
            <div>
              <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                Dificuldade Inicial
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value as DifficultyLevel })
                }
                className="px-3 py-1.5 text-xs rounded-[8px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] font-semibold text-[#1E293B] dark:text-[#F8FAFC]"
              >
                <option value="Easy">Fácil / Easy</option>
                <option value="Medium">Médio / Medium</option>
                <option value="Hard">Difícil / Hard</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC]">
              <input
                type="checkbox"
                checked={formData.mastered}
                onChange={(e) => setFormData({ ...formData, mastered: e.target.checked })}
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] accent-[#2563EB]"
              />
              <span>Marcar como Aprendido / Mastered</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#334155] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-[14px] border border-[#CBD5E1] dark:border-[#334155] text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isAnalyzing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[14px] bg-[#00A8B5] hover:bg-[#008C96] dark:bg-[#00A8B5] dark:hover:bg-[#008C96] text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting || isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Gerando Explicação e Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar no Banco EPWAY</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
