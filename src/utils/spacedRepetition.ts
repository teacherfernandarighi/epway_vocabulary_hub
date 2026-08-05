import { DifficultyLevel } from '../types';

/**
 * Calculates the next review date based on spaced repetition difficulty rating
 * @param currentDifficulty - 'Easy' | 'Medium' | 'Hard'
 * @returns YYYY-MM-DD formatted string
 */
export function calculateNextReviewDate(difficulty: DifficultyLevel): string {
  const date = new Date();
  let daysToAdd = 3;

  switch (difficulty) {
    case 'Easy':
      daysToAdd = 7;
      break;
    case 'Medium':
      daysToAdd = 3;
      break;
    case 'Hard':
      daysToAdd = 1;
      break;
    default:
      daysToAdd = 3;
  }

  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}

export function isDueForReview(reviewDate: string): boolean {
  if (!reviewDate) return true;
  const today = new Date().toISOString().split('T')[0];
  return reviewDate <= today;
}
