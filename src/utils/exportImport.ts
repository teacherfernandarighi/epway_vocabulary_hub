import { VocabularyWord } from '../types';

export function exportToJSON(words: VocabularyWord[], fileName = 'epway-vocabulary-bank.json'): void {
  const cleanWords = words.map(({ id, userId, ...rest }) => rest);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cleanWords, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportToCSV(words: VocabularyWord[], fileName = 'epway-vocabulary-bank.csv'): void {
  const headers = [
    'Word',
    'Pronunciation',
    'Part of Speech',
    'CEFR',
    'Category',
    'Lesson',
    'Meaning',
    'Translation',
    'Example Sentence',
    'Example Translation',
    'My Sentence',
    'Teacher Feedback',
    'Collocations',
    'Synonyms',
    'Antonyms',
    'Common Mistakes',
    'Review Date',
    'Difficulty',
    'Mastered',
  ];

  const rows = words.map((w) => [
    `"${(w.word || '').replace(/"/g, '""')}"`,
    `"${(w.pronunciation || '').replace(/"/g, '""')}"`,
    `"${(w.partOfSpeech || '').replace(/"/g, '""')}"`,
    `"${(w.cefr || '').replace(/"/g, '""')}"`,
    `"${(w.category || '').replace(/"/g, '""')}"`,
    `"${(w.lesson || '').replace(/"/g, '""')}"`,
    `"${(w.meaning || '').replace(/"/g, '""')}"`,
    `"${(w.translation || '').replace(/"/g, '""')}"`,
    `"${(w.exampleSentence || '').replace(/"/g, '""')}"`,
    `"${(w.exampleTranslation || '').replace(/"/g, '""')}"`,
    `"${(w.mySentence || '').replace(/"/g, '""')}"`,
    `"${(w.teacherFeedback || '').replace(/"/g, '""')}"`,
    `"${(Array.isArray(w.collocations) ? w.collocations.join('; ') : '').replace(/"/g, '""')}"`,
    `"${(Array.isArray(w.synonyms) ? w.synonyms.join('; ') : '').replace(/"/g, '""')}"`,
    `"${(Array.isArray(w.antonyms) ? w.antonyms.join('; ') : '').replace(/"/g, '""')}"`,
    `"${(w.commonMistakes || '').replace(/"/g, '""')}"`,
    `"${(w.reviewDate || '').replace(/"/g, '""')}"`,
    `"${(w.difficulty || '').replace(/"/g, '""')}"`,
    `"${w.mastered ? 'Yes' : 'No'}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function parseJSONImport(fileContent: string): Omit<VocabularyWord, 'id' | 'userId'>[] {
  try {
    const data = JSON.parse(fileContent);
    if (!Array.isArray(data)) {
      throw new Error('Imported JSON must be an array of vocabulary words.');
    }
    return data.map((item) => ({
      word: item.word || 'Untitled',
      pronunciation: item.pronunciation || '',
      audioUrl: item.audioUrl || '',
      meaning: item.meaning || '',
      translation: item.translation || '',
      partOfSpeech: item.partOfSpeech || 'noun',
      cefr: item.cefr || 'B1',
      category: item.category || 'General',
      lesson: item.lesson || 'General Vocabulary',
      collocations: Array.isArray(item.collocations) ? item.collocations : [],
      wordFamily: Array.isArray(item.wordFamily) ? item.wordFamily : [],
      synonyms: Array.isArray(item.synonyms) ? item.synonyms : [],
      antonyms: Array.isArray(item.antonyms) ? item.antonyms : [],
      commonMistakes: item.commonMistakes || '',
      whatComesBefore: item.whatComesBefore || '',
      whatComesAfter: item.whatComesAfter || '',
      exampleSentence: item.exampleSentence || '',
      exampleTranslation: item.exampleTranslation || '',
      mySentence: item.mySentence || '',
      teacherFeedback: item.teacherFeedback || '',
      reviewDate: item.reviewDate || new Date().toISOString().split('T')[0],
      difficulty: item.difficulty || 'Medium',
      mastered: Boolean(item.mastered),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  } catch (err: any) {
    throw new Error('Formato de arquivo JSON inválido: ' + err.message);
  }
}
