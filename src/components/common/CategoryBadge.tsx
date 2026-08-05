import React from 'react';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  const getCategoryStyles = (cat: string) => {
    const normalized = cat.toLowerCase();
    if (normalized.includes('business')) {
      return 'bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/25';
    }
    if (normalized.includes('travel')) {
      return 'bg-[#06B6D4]/10 text-[#0891B2] dark:text-[#22D3EE] border-[#06B6D4]/25';
    }
    if (normalized.includes('daily')) {
      return 'bg-[#10B981]/10 text-[#059669] dark:text-[#34D399] border-[#10B981]/25';
    }
    if (normalized.includes('academic')) {
      return 'bg-[#8B5CF6]/10 text-[#7C3AED] dark:text-[#A78BFA] border-[#8B5CF6]/25';
    }
    if (normalized.includes('tech')) {
      return 'bg-[#F59E0B]/10 text-[#D97706] dark:text-[#FBBF24] border-[#F59E0B]/25';
    }
    if (normalized.includes('health')) {
      return 'bg-[#EF4444]/10 text-[#DC2626] dark:text-[#F87171] border-[#EF4444]/25';
    }
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span className={`inline-flex items-center ${sizeClass} rounded-full font-medium border ${getCategoryStyles(category)} shrink-0`}>
      {category}
    </span>
  );
};
