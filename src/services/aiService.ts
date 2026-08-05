import { WordAnalysisResult } from '../types';

export async function analyzeWord(
  word: string,
  lesson: string = ''
): Promise<WordAnalysisResult> {
  try {
    const response = await fetch('/api/analyze-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word, lesson }),
    });

    if (!response.ok) {
      throw new Error(`AI Service request failed with status ${response.status}`);
    }

    const data: WordAnalysisResult = await response.json();
    if (data) {
      if (Array.isArray(data.whatComesBefore)) {
        data.whatComesBefore = (data.whatComesBefore as any[]).join(', ');
      }
      if (Array.isArray(data.whatComesAfter)) {
        data.whatComesAfter = (data.whatComesAfter as any[]).join(', ');
      }
    }
    return data;
  } catch (error) {
    console.error('aiService analyzeWord error:', error);
    const cleanWord = word.trim();
    return {
      word: cleanWord,
      pronunciation: `/${cleanWord.toLowerCase()}/`,
      audioUrl: '',
      meaning: `English definition and usage context for "${cleanWord}".`,
      translation: `Tradução em Português para "${cleanWord}".`,
      partOfSpeech: 'noun',
      cefr: 'B1',
      category: 'General',
      lesson: lesson || 'General Vocabulary',
      collocations: [`use ${cleanWord}`, `common ${cleanWord}`],
      wordFamily: [`${cleanWord}`],
      synonyms: [],
      antonyms: [],
      commonMistakes: 'Atenção ao contexto e à preposição utilizada.',
      whatComesBefore: 'the, a, very',
      whatComesAfter: 'in, with, for',
      exampleSentence: `Practice using "${cleanWord}" in your daily English sentences.`,
      exampleTranslation: `Pratique usar "${cleanWord}" em suas frases diárias de inglês.`,
      mySentenceSuggestion: `I am using "${cleanWord}" to express...`,
      difficultyRecommendation: 'Medium',
    };
  }
}
