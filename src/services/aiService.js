/**
 * EPWAY Vocabulary Hub - AI Integration Service
 * Preparado para integração com Google Gemini API via server route /api/analyze-word
 */

/**
 * Analisa uma palavra em inglês gerando IPA, tradução, nível CEFR, collocations, sinônimos, etc.
 * @param {string} word - A palavra ou expressão em inglês
 * @param {string} [lesson] - Lição ou capítulo opcional
 * @returns {Promise<Object>} Dados de análise do vocabulário
 */
export async function analyzeWord(word, lesson = '') {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('aiService analyzeWord error:', error);
    // Retorno fallback estruturado em caso de ausência de rede ou erro na API
    return {
      word: word.trim(),
      pronunciation: `/${word.toLowerCase()}/`,
      audioUrl: '',
      meaning: `English definition for "${word}".`,
      translation: `Tradução em Português para "${word}".`,
      partOfSpeech: 'noun',
      cefr: 'B1',
      category: 'General',
      lesson: lesson || 'General Vocabulary',
      collocations: [`use ${word}`, `common ${word}`],
      wordFamily: [`${word}`],
      synonyms: [],
      antonyms: [],
      commonMistakes: 'Verifique o contexto de uso com seu professor EPWAY.',
      whatComesBefore: 'the, a, very',
      whatComesAfter: 'in, with, for',
      exampleSentence: `Here is an example sentence using ${word}.`,
      exampleTranslation: `Aqui está uma frase de exemplo usando ${word}.`,
      mySentenceSuggestion: `I am practicing ${word} today.`,
      difficultyRecommendation: 'Medium',
    };
  }
}
