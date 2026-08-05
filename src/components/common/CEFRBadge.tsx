import React from 'react';
import { CEFRLevel } from '../../types';

interface CEFRBadgeProps {
  level: CEFRLevel | string;
  size?: 'sm' | 'md' | 'lg';
}

export const CEFRBadge: React.FC<CEFRBadgeProps> = ({ level, size = 'md' }) => {
  const getStyle = (l: string) => {
    switch (l) {
      case 'A1':
        return 'bg-[#22C55E]/15 text-[#15803D] dark:text-[#4ADE80] border-[#22C55E]/30';
      case 'A2':
        return 'bg-[#84CC16]/15 text-[#4D7C0F] dark:text-[#A3E635] border-[#84CC16]/30';
      case 'B1':
        return 'bg-[#3B82F6]/15 text-[#1D4ED8] dark:text-[#60A5FA] border-[#3B82F6]/30';
      case 'B2':
        return 'bg-[#6366F1]/15 text-[#4338CA] dark:text-[#818CF8] border-[#6366F1]/30';
      case 'C1':
        return 'bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] border-[#8B5CF6]/30';
      case 'C2':
        return 'bg-[#EC4899]/15 text-[#BE185D] dark:text-[#F472B6] border-[#EC4899]/30';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 rounded-full font-semibold border font-numbers',
    md: 'text-xs px-2.5 py-0.5 rounded-full font-bold border tracking-wide font-numbers',
    lg: 'text-xs px-3 py-1 rounded-full font-extrabold border tracking-wider font-numbers',
  };

  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${getStyle(level)} ${sizeClasses[size]}`}>
      {level || 'B1'}
    </span>
  );
};
