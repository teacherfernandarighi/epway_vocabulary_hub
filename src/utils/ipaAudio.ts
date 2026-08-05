/**
 * Pronunciation Audio Utility using SpeechSynthesis API (Web Speech API)
 * with High-Quality Natural Voice Selection & Audio Fallback
 */

let voicesCache: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    voicesCache = window.speechSynthesis.getVoices();
  }
  return voicesCache;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function speakWord(text: string, accent: 'US' | 'UK' = 'US'): void {
  const cleanText = text.trim();
  if (!cleanText) return;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    fallbackGoogleTts(cleanText, accent);
    return;
  }

  try {
    // Cancel any ongoing speech to prevent overlapping or distorted audio
    window.speechSynthesis.cancel();

    const availableVoices = voicesCache.length > 0 ? voicesCache : window.speechSynthesis.getVoices();
    const targetLang = accent === 'UK' ? 'en-GB' : 'en-US';

    // Prioritize natural, high-fidelity voices (Google, Natural, Samantha, Karen, Microsoft, Daniel, Victoria)
    const bestVoice =
      availableVoices.find(
        (v) =>
          v.lang.replace('_', '-').startsWith(targetLang) &&
          (v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Daniel') ||
            v.name.includes('Microsoft') ||
            v.name.includes('Victoria') ||
            v.name.includes('Ava'))
      ) ||
      availableVoices.find((v) => v.lang.replace('_', '-').startsWith(targetLang)) ||
      availableVoices.find((v) => v.lang.startsWith('en'));

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLang;
    utterance.rate = 0.95; // Natural clear pace for language learning
    utterance.pitch = 1.0; // Standard natural pitch
    utterance.volume = 1.0;

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onerror = () => {
      fallbackGoogleTts(cleanText, accent);
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis error, playing fallback TTS:', err);
    fallbackGoogleTts(cleanText, accent);
  }
}

function fallbackGoogleTts(text: string, accent: 'US' | 'UK') {
  try {
    const lang = accent === 'UK' ? 'en-GB' : 'en-US';
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const audio = new Audio(audioUrl);
    audio.play().catch((e) => console.warn('Audio playback prevented:', e));
  } catch (err) {
    console.error('TTS audio playback error:', err);
  }
}

