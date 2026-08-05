import React from 'react';
import { DifficultyLevel } from '../../types';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel | string;
  size?: 'sm' | 'md';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'md' }) => {
  const getStyles = (diff: string) => {
    switch (diff) {
      case 'Mastered':
      case 'Easy':
        return 'bg-[#16A34A]/10 text-[#15803D] dark:text-[#4ADE80] border-[#16A34A]/30';
      case 'Review':
      case 'Medium':
        return 'bg-[#EAB308]/10 text-[#A16207] dark:text-[#FACC15] border-[#EAB308]/30';
      case 'Difficult':
      case 'Hard':
        return 'bg-[#DC2626]/10 text-[#B91C1C] dark:text-[#F87171] border-[#DC2626]/30';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getLabel = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'Fácil';
      case 'Medium':
        return 'Médio';
      case 'Hard':
        return 'Difícil';
      case 'Mastered':
        return 'Dominada';
      case 'Review':
        return 'Em Revisão';
      case 'Difficult':
        return 'Com Dificuldade';
      default:
        return diff;
    }
  };

  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span className={`inline-flex items-center ${sizeClass} rounded-full font-medium border ${getStyles(difficulty)} shrink-0`}>
      {getLabel(difficulty)}
    </span>
  );
};
