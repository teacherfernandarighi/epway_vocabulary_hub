import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { VocabularyWord, VocabularyFilters, VocabularyStats, DifficultyLevel } from '../types';
import {
  subscribeToWords,
  addVocabularyWord,
  updateVocabularyWord,
  deleteVocabularyWord,
  importBatchWords,
} from '../services/firebase/firestore';
import { INITIAL_SAMPLE_WORDS } from '../data/sampleWords';
import { calculateNextReviewDate, isDueForReview } from '../utils/spacedRepetition';
import { analyzeWord } from '../services/aiService';

export function useVocabulary() {
  const { user, recordActivity } = useAuth();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<VocabularyFilters>({
    search: '',
    cefr: 'all',
    category: 'all',
    partOfSpeech: 'all',
    difficulty: 'all',
    mastered: 'all',
    lesson: 'all',
  });

  useEffect(() => {
    if (!user) {
      setWords([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (user.isDemo) {
      // Demo User state stored in localStorage/sessionStorage
      const localKey = `epway_words_${user.uid}`;
      const saved = localStorage.getItem(localKey);
      if (saved) {
        setWords(JSON.parse(saved));
      } else {
        const demoWords = INITIAL_SAMPLE_WORDS.map((w, index) => ({
          ...w,
          id: `demo_${index + 1}`,
          userId: user.uid,
        }));
        setWords(demoWords as VocabularyWord[]);
        localStorage.setItem(localKey, JSON.stringify(demoWords));
      }
      setLoading(false);
      return;
    }

    // Real Firestore Subscription
    const unsubscribe = subscribeToWords(
      user.uid,
      async (fetchedWords) => {
        if (fetchedWords.length === 0) {
          // Auto-seed initial sample words for a brand new student profile
          try {
            await importBatchWords(user.uid, INITIAL_SAMPLE_WORDS);
          } catch (seedErr) {
            console.error('Auto-seed sample words error:', seedErr);
          }
        } else {
          setWords(fetchedWords);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching vocabulary:', err);
        setError('Não foi possível carregar suas palavras no momento.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Persist demo mode updates
  const updateDemoStorage = (newWords: VocabularyWord[]) => {
    if (user?.isDemo) {
      localStorage.setItem(`epway_words_${user.uid}`, JSON.stringify(newWords));
    }
  };

  // Actions
  const addWord = async (wordData: Omit<VocabularyWord, 'id' | 'userId'>) => {
    if (!user) return;
    recordActivity();

    let finalData = { ...wordData };

    // Safety net: Auto-enrich with Gemini AI if meaning or translation is empty
    if ((!finalData.meaning?.trim() || !finalData.translation?.trim()) && finalData.word?.trim()) {
      try {
        const aiResult = await analyzeWord(finalData.word.trim(), finalData.lesson);
        if (aiResult) {
          finalData = {
            ...finalData,
            meaning: finalData.meaning || aiResult.meaning || '',
            translation: finalData.translation || aiResult.translation || '',
            pronunciation: finalData.pronunciation || aiResult.pronunciation || '',
            partOfSpeech: finalData.partOfSpeech || aiResult.partOfSpeech || 'noun',
            cefr: finalData.cefr || aiResult.cefr || 'B1',
            category: finalData.category !== 'General' ? finalData.category : (aiResult.category || 'General'),
            collocations: finalData.collocations?.length ? finalData.collocations : (aiResult.collocations || []),
            wordFamily: finalData.wordFamily?.length ? finalData.wordFamily : (aiResult.wordFamily || []),
            synonyms: finalData.synonyms?.length ? finalData.synonyms : (aiResult.synonyms || []),
            antonyms: finalData.antonyms?.length ? finalData.antonyms : (aiResult.antonyms || []),
            commonMistakes: finalData.commonMistakes || aiResult.commonMistakes || '',
            whatComesBefore: finalData.whatComesBefore || aiResult.whatComesBefore || '',
            whatComesAfter: finalData.whatComesAfter || aiResult.whatComesAfter || '',
            exampleSentence: finalData.exampleSentence || aiResult.exampleSentence || '',
            exampleTranslation: finalData.exampleTranslation || aiResult.exampleTranslation || '',
            mySentence: finalData.mySentence || aiResult.mySentenceSuggestion || '',
            difficulty: aiResult.difficultyRecommendation || finalData.difficulty || 'Medium',
          };
        }
      } catch (err) {
        console.warn('Auto AI analysis fallback failed during addWord:', err);
      }
    }

    const fullWord: Omit<VocabularyWord, 'id'> = {
      ...finalData,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (user.isDemo) {
      const newWord: VocabularyWord = {
        ...fullWord,
        id: `demo_${Date.now()}`,
      };
      const updated = [newWord, ...words];
      setWords(updated);
      updateDemoStorage(updated);
      return newWord.id;
    }

    return await addVocabularyWord(fullWord);
  };

  const updateWord = async (wordId: string, updates: Partial<VocabularyWord>) => {
    if (!user) return;

    if (user.isDemo) {
      const updated = words.map((w) =>
        w.id === wordId ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      );
      setWords(updated);
      updateDemoStorage(updated);
      return;
    }

    await updateVocabularyWord(wordId, updates);
  };

  const deleteWord = async (wordId: string) => {
    if (!user) return;

    if (user.isDemo) {
      const updated = words.filter((w) => w.id !== wordId);
      setWords(updated);
      updateDemoStorage(updated);
      return;
    }

    await deleteVocabularyWord(wordId);
  };

  const toggleMastered = async (wordId: string) => {
    const word = words.find((w) => w.id === wordId);
    if (!word) return;
    await updateWord(wordId, { mastered: !word.mastered });
  };

  const markReviewed = async (wordId: string, rating: DifficultyLevel) => {
    recordActivity();
    const nextDate = calculateNextReviewDate(rating);
    await updateWord(wordId, {
      reviewDate: nextDate,
      difficulty: rating,
      updatedAt: new Date().toISOString(),
    });
  };

  const importWords = async (importedList: Omit<VocabularyWord, 'id' | 'userId'>[]) => {
    if (!user) return 0;

    if (user.isDemo) {
      const newItems: VocabularyWord[] = importedList.map((w, i) => ({
        ...w,
        id: `imported_${Date.now()}_${i}`,
        userId: user.uid,
      }));
      const updated = [...newItems, ...words];
      setWords(updated);
      updateDemoStorage(updated);
      return newItems.length;
    }

    return await importBatchWords(user.uid, importedList);
  };

  // Filtered Words
  const filteredWords = useMemo(() => {
    return words.filter((item) => {
      // Search term match across Word, Meaning, Translation, Category, Lesson
      if (filters.search) {
        const term = filters.search.toLowerCase().trim();
        const matchesWord = item.word.toLowerCase().includes(term);
        const matchesMeaning = item.meaning.toLowerCase().includes(term);
        const matchesTranslation = item.translation.toLowerCase().includes(term);
        const matchesCategory = item.category.toLowerCase().includes(term);
        const matchesLesson = item.lesson.toLowerCase().includes(term);
        if (!matchesWord && !matchesMeaning && !matchesTranslation && !matchesCategory && !matchesLesson) {
          return false;
        }
      }

      // CEFR Filter
      if (filters.cefr !== 'all' && item.cefr !== filters.cefr) return false;

      // Category Filter
      if (filters.category !== 'all' && item.category !== filters.category) return false;

      // Part of Speech Filter
      if (filters.partOfSpeech !== 'all' && item.partOfSpeech !== filters.partOfSpeech) return false;

      // Difficulty Filter
      if (filters.difficulty !== 'all' && item.difficulty !== filters.difficulty) return false;

      // Mastered Filter
      if (filters.mastered === 'mastered' && !item.mastered) return false;
      if (filters.mastered === 'pending' && item.mastered) return false;

      // Lesson Filter
      if (filters.lesson !== 'all' && item.lesson !== filters.lesson) return false;

      return true;
    });
  }, [words, filters]);

  // Review List (words due today or earlier)
  const todayReviewWords = useMemo(() => {
    return words.filter((w) => isDueForReview(w.reviewDate) && !w.mastered);
  }, [words]);

  // Statistics Calculation
  const stats: VocabularyStats = useMemo(() => {
    const byCefr: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
    const byCategory: Record<string, number> = {};
    const monthlyMap: Record<string, number> = {};

    let reviewedCount = 0;
    let pendingReviewCount = 0;
    let masteredCount = 0;

    const todayStr = new Date().toISOString().split('T')[0];

    words.forEach((w) => {
      // CEFR
      if (w.cefr && byCefr[w.cefr] !== undefined) {
        byCefr[w.cefr] += 1;
      }

      // Category
      const cat = w.category || 'Outros';
      byCategory[cat] = (byCategory[cat] || 0) + 1;

      // Mastered
      if (w.mastered) {
        masteredCount += 1;
      }

      // Pending vs Reviewed
      if (w.reviewDate && w.reviewDate <= todayStr) {
        pendingReviewCount += 1;
      } else {
        reviewedCount += 1;
      }

      // Monthly progress based on createdAt
      if (w.createdAt) {
        const d = new Date(w.createdAt);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
      }
    });

    // Format monthly data sorted
    const monthlyProgress = Object.keys(monthlyMap)
      .sort()
      .map((key) => {
        const [y, m] = key.split('-');
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, 1);
        const monthLabel = dateObj.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        return { month: monthLabel, count: monthlyMap[key] };
      });

    return {
      totalWords: words.length,
      byCefr,
      byCategory,
      monthlyProgress,
      reviewedCount,
      pendingReviewCount,
      masteredCount,
    };
  }, [words]);

  // Category and Lesson lists for filters
  const categoriesList = useMemo(() => {
    const set = new Set(words.map((w) => w.category).filter(Boolean));
    return Array.from(set).sort();
  }, [words]);

  const lessonsList = useMemo(() => {
    const set = new Set(words.map((w) => w.lesson).filter(Boolean));
    return Array.from(set).sort();
  }, [words]);

  return {
    words,
    filteredWords,
    todayReviewWords,
    stats,
    categoriesList,
    lessonsList,
    loading,
    error,
    filters,
    setFilters,
    addWord,
    updateWord,
    deleteWord,
    toggleMastered,
    markReviewed,
    importWords,
  };
}
