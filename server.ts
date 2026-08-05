import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'EPWAY Vocabulary Hub' });
  });

  // Gemini API Endpoint for Word Analysis
  app.post('/api/analyze-word', async (req, res) => {
    try {
      const { word, lesson } = req.body;
      if (!word || typeof word !== 'string' || !word.trim()) {
        return res.status(400).json({ error: 'Word is required' });
      }

      const cleanWord = word.trim();
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        console.warn('GEMINI_API_KEY not configured, returning structured fallback analysis');
        return res.json(getMockAnalysis(cleanWord, lesson));
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `You are an expert English teacher at EPWAY English School helping Brazilian students.
Analyze the following English word or phrase: "${cleanWord}".
Lesson context: "${lesson || 'General Vocabulary'}".

Your output MUST be a valid JSON object explaining this word thoroughly. Do not wrap in backticks or markdown formatting.

Format requirements:
- "word": "${cleanWord}"
- "pronunciation": accurate IPA string (e.g. "/rɪˈzɪl.jənt/")
- "audioUrl": ""
- "meaning": clear, learner-friendly English explanation of what "${cleanWord}" means in context.
- "translation": natural Portuguese (Brasil) translation of "${cleanWord}".
- "partOfSpeech": one of ["noun", "verb", "adjective", "adverb", "phrasal verb", "idiom", "preposition"]
- "cefr": one of ["A1", "A2", "B1", "B2", "C1", "C2"]
- "category": relevant category name (e.g., "General", "Business", "Academic", "Daily Life", "Idioms")
- "lesson": "${lesson || 'General Vocabulary'}"
- "collocations": array of 3 to 5 real natural collocations with "${cleanWord}"
- "wordFamily": array of word family members (e.g. ["resilience (noun)", "resiliently (adverb)"])
- "synonyms": array of 2 to 4 English synonyms
- "antonyms": array of 1 to 3 antonyms (if applicable)
- "commonMistakes": practical advice in Portuguese for Brazilian learners (e.g. false cognates, preposition errors, pronunciation traps)
- "whatComesBefore": string of common words or structures before "${cleanWord}", separated by comma and space (e.g. "be, become, highly, remarkably")
- "whatComesAfter": string of common words or prepositions after "${cleanWord}", separated by comma and space (e.g. "against, to, in the face of")
- "exampleSentence": natural English example sentence demonstrating real usage
- "exampleTranslation": Portuguese translation of the example sentence
- "mySentenceSuggestion": fill-in-the-blank starter sentence for student practice
- "difficultyRecommendation": "Easy" | "Medium" | "Hard"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';
      const cleanedJson = responseText.replace(/```json|```/g, '').trim();
      const analysis = JSON.parse(cleanedJson);

      // Ensure mandatory fields exist and are formatted correctly
      if (!analysis.meaning) {
        analysis.meaning = `Detailed English definition of "${cleanWord}".`;
      }
      if (!analysis.translation) {
        analysis.translation = `Tradução em Português para "${cleanWord}".`;
      }

      if (Array.isArray(analysis.whatComesBefore)) {
        analysis.whatComesBefore = analysis.whatComesBefore.map((item: any) => String(item).trim()).filter(Boolean).join(', ');
      } else if (typeof analysis.whatComesBefore === 'string') {
        analysis.whatComesBefore = analysis.whatComesBefore.split(',').map((s: string) => s.trim()).filter(Boolean).join(', ');
      }

      if (Array.isArray(analysis.whatComesAfter)) {
        analysis.whatComesAfter = analysis.whatComesAfter.map((item: any) => String(item).trim()).filter(Boolean).join(', ');
      } else if (typeof analysis.whatComesAfter === 'string') {
        analysis.whatComesAfter = analysis.whatComesAfter.split(',').map((s: string) => s.trim()).filter(Boolean).join(', ');
      }

      res.json(analysis);
    } catch (error: any) {
      console.error('Error analyzing word with Gemini:', error);
      res.json(getMockAnalysis(req.body.word || 'word', req.body.lesson));
    }
  });

  // Helper dictionary generator for offline/fallback mode
  function getMockAnalysis(word: string, lesson?: string) {
    const cleanWord = word.trim().toLowerCase();

    // Extended offline database of common words & idioms
    const mockDb: Record<string, any> = {
      resilient: {
        word: 'resilient',
        pronunciation: '/rɪˈzɪl.jənt/',
        meaning: 'Able to withstand or recover quickly from difficult conditions or setbacks.',
        translation: 'resiliente, resistente, capaz de se recuperar rapidamente',
        partOfSpeech: 'adjective',
        cefr: 'B2',
        category: 'Psychology & Mindset',
        collocations: ['highly resilient', 'resilient nature', 'become resilient', 'resilient workforce'],
        wordFamily: ['resilience (noun)', 'resiliently (adverb)'],
        synonyms: ['adaptable', 'tough', 'buoyant', 'strong', 'flexible'],
        antonyms: ['fragile', 'vulnerable', 'weak'],
        commonMistakes: 'Atenção: em português usamos "resiliente" tanto para metal quanto para pessoas, mas em inglês é extremamente comum no mundo corporativo e no desenvolvimento pessoal.',
        whatComesBefore: 'be, become, highly, remarkably, surprisingly',
        whatComesAfter: 'against, to, in the face of, during crises',
        exampleSentence: 'Successful entrepreneurs are remarkably resilient when facing unexpected business challenges.',
        exampleTranslation: 'Empreendedores de sucesso são notavelmente resilientes ao enfrentar desafios de negócios inesperados.',
        mySentenceSuggestion: 'I need to stay resilient whenever I encounter...',
        difficultyRecommendation: 'Medium',
      },
      ubiquitous: {
        word: 'ubiquitous',
        pronunciation: '/juːˈbɪk.wɪ.təs/',
        meaning: 'Present, appearing, or found everywhere at the same time.',
        translation: 'onipresente, encontrado em toda parte',
        partOfSpeech: 'adjective',
        cefr: 'C1',
        category: 'Academic',
        collocations: ['ubiquitous presence', 'become ubiquitous', 'ubiquitous technology'],
        wordFamily: ['ubiquity (noun)', 'ubiquitously (adverb)'],
        synonyms: ['omnipresent', 'pervasive', 'universal', 'widespread'],
        antonyms: ['rare', 'scarce', 'uncommon'],
        commonMistakes: 'Dica de Pronúncia EPWAY: o som inicial é "yoo" (/juː/), igual ao pronome "you". Não pronuncie "u-biquitous".',
        whatComesBefore: 'increasingly, almost, practically, now',
        whatComesAfter: 'in modern society, across the globe, in daily life',
        exampleSentence: 'Smartphones and wireless internet have become ubiquitous in urban centers worldwide.',
        exampleTranslation: 'Smartphones e internet sem fio tornaram-se onipresentes em centros urbanos no mundo todo.',
        mySentenceSuggestion: 'In my daily routine, ... has become ubiquitous.',
        difficultyRecommendation: 'Hard',
      },
      breakthrough: {
        word: 'breakthrough',
        pronunciation: '/ˈbreɪk.θruː/',
        meaning: 'A sudden, dramatic, and important discovery or development.',
        translation: 'avanço significativo, descoberta importante, conquista',
        partOfSpeech: 'noun',
        cefr: 'B2',
        category: 'Technology & Science',
        collocations: ['major breakthrough', 'scientific breakthrough', 'achieve a breakthrough'],
        wordFamily: ['break through (phrasal verb)'],
        synonyms: ['advance', 'innovation', 'leap forward', 'discovery'],
        antonyms: ['setback', 'stalemate'],
        commonMistakes: 'Como substantivo é uma palavra só ("breakthrough"). O verbo frasal é separado ("break through").',
        whatComesBefore: 'major, significant, technological, medical, personal',
        whatComesAfter: 'in medicine, in AI technology, for humanity',
        exampleSentence: 'Scientists made a major breakthrough in renewable energy technology last year.',
        exampleTranslation: 'Cientistas alcançaram um grande avanço na tecnologia de energia renovável no ano passado.',
        mySentenceSuggestion: 'Achieving fluency in English will be a major breakthrough in my...',
        difficultyRecommendation: 'Medium',
      },
      'put off': {
        word: 'put off',
        pronunciation: '/pʊt ɒf/',
        meaning: 'To postpone or delay doing something until a later time.',
        translation: 'adiar, postergar, procrastinar',
        partOfSpeech: 'phrasal verb',
        cefr: 'B1',
        category: 'Daily Life',
        collocations: ['put off a decision', 'put off doing homework', 'keep putting things off'],
        wordFamily: ['postpone (synonym verb)', 'procrastinate (synonym verb)'],
        synonyms: ['postpone', 'delay', 'defer', 'procrastinate'],
        antonyms: ['do immediately', 'advance', 'prioritize'],
        commonMistakes: 'Quando seguido de outro verbo, use a forma -ING. Exemplo correto: "put off studying" (e não "put off to study").',
        whatComesBefore: 'don\'t, decided to, tend to, keep',
        whatComesAfter: 'until tomorrow, making a choice, studying',
        exampleSentence: 'Don\'t put off your English practice until the night before your test.',
        exampleTranslation: 'Não adie sua prática de inglês para a noite anterior à sua prova.',
        mySentenceSuggestion: 'I used to put off ..., but now I practice every day.',
        difficultyRecommendation: 'Medium',
      },
      enlighten: {
        word: 'enlighten',
        pronunciation: '/ɪnˈlaɪ.tən/',
        meaning: 'To give greater knowledge and understanding about a subject or situation.',
        translation: 'esclarecer, instruir, iluminar (dar conhecimento)',
        partOfSpeech: 'verb',
        cefr: 'C1',
        category: 'Academic & Culture',
        collocations: ['enlighten someone on a topic', 'enlightening conversation', 'greatly enlighten'],
        wordFamily: ['enlightenment (noun)', 'enlightening (adjective)'],
        synonyms: ['inform', 'educate', 'illuminate', 'clarify'],
        antonyms: ['confuse', 'mislead', 'becloud'],
        commonMistakes: 'Não confunda com "light up" (acender luz). "Enlighten" é sempre no sentido figurado de transmissão de sabedoria.',
        whatComesBefore: 'please, could you, hoping to, seek to',
        whatComesAfter: 'me on this matter, the audience, us about',
        exampleSentence: 'Could you please enlighten me on how this new software feature works?',
        exampleTranslation: 'Você poderia por favor me esclarecer sobre como essa nova funcionalidade do software funciona?',
        mySentenceSuggestion: 'The teacher enlightened the class about...',
        difficultyRecommendation: 'Hard',
      },
    };

    if (mockDb[cleanWord]) {
      return {
        ...mockDb[cleanWord],
        lesson: lesson || 'General Vocabulary',
        audioUrl: '',
      };
    }

    // Smart fallback generator for any word
    const formattedWord = word.trim();
    const capitalized = formattedWord.charAt(0).toUpperCase() + formattedWord.slice(1);

    return {
      word: formattedWord,
      pronunciation: `/${cleanWord.toLowerCase()}/`,
      audioUrl: '',
      meaning: `Clear English definition and context for the word "${formattedWord}".`,
      translation: `Tradução e significado em Português para "${formattedWord}".`,
      partOfSpeech: cleanWord.endsWith('ing') ? 'verb' : cleanWord.endsWith('ly') ? 'adverb' : cleanWord.endsWith('ive') || cleanWord.endsWith('ous') ? 'adjective' : 'noun',
      cefr: 'B1',
      category: 'General',
      lesson: lesson || 'General Vocabulary',
      collocations: [`use ${cleanWord}`, `important ${cleanWord}`, `common ${cleanWord}`, `master ${cleanWord}`],
      wordFamily: [`${cleanWord} (base)`, `${cleanWord}s (plural/3rd person)`],
      synonyms: ['term', 'expression', 'vocabulary item'],
      antonyms: [],
      commonMistakes: `Atenção de Português para Brasileiros: pratique a pronúncia de "${cleanWord}" e note o contexto de uso nas frases.`,
      whatComesBefore: 'the, a, very, highly',
      whatComesAfter: 'in, with, for, to',
      exampleSentence: `Learning how to use "${formattedWord}" correctly will expand your vocabulary in English.`,
      exampleTranslation: `Aprender a usar "${formattedWord}" corretamente irá expandir seu vocabulário em inglês.`,
      mySentenceSuggestion: `I learned the word "${formattedWord}" in my EPWAY English class and I want to practice it when...`,
      difficultyRecommendation: 'Medium',
    };
  }

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EPWAY Hub Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
