import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { VocabularyWord, VocabularyStats } from '../../types';
import { WordCard } from '../vocabulary/WordCard';
import { EpwayLogo } from '../common/EpwayLogo';
import {
  Flame,
  Plus,
  BookOpen,
  RotateCcw,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface DashboardOverviewProps {
  stats: VocabularyStats;
  recentWords: VocabularyWord[];
  todayReviewWords: VocabularyWord[];
  onOpenAddModal: () => void;
  onSelectWord: (word: VocabularyWord) => void;
  onToggleMastered: (id: string, e: React.MouseEvent) => void;
  onNavigateTab: (tab: 'dashboard' | 'analyze' | 'vocabulary' | 'review' | 'statistics' | 'settings') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  recentWords,
  todayReviewWords,
  onOpenAddModal,
  onSelectWord,
  onToggleMastered,
  onNavigateTab,
}) => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* EPWAY Welcome Hero Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-[20px] bg-gradient-to-r from-[#E0F2FE] via-[#F0F9FF] to-[#E6F7F8] border border-[#BAE6FD] shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-6">
        {/* Top bar with Branding & Streak */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#BAE6FD]/80">
          <div className="flex items-center gap-3">
            <EpwayLogo size="sm" showText={true} />
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white text-[#00A8B5] border border-[#00A8B5]/30 font-numbers shadow-2xs">
              EPWAY Vocabulary Hub
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-white px-3 py-1 rounded-full border border-amber-200 shadow-2xs">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-numbers">Streak: {user?.streak || 1} dias</span>
            </span>
          </div>
        </div>

        {/* Greeting Body */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-[#0C3859]">
            Welcome back, {user?.displayName || 'Professora Fernanda Righi'}! 🎓
          </h1>

          <p className="text-xs sm:text-sm text-[#2D587B] leading-relaxed max-w-3xl">
            Construa seu banco de vocabulário pessoal durante todo o curso de inglês na <strong className="text-[#0C3859] font-bold">EPWAY English School</strong>.
            Você possui <strong className="text-[#00A8B5] font-bold font-numbers">{stats.totalWords} palavras</strong> registradas.
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('analyze')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-[#00A8B5] hover:bg-[#008C96] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Analisar</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-white text-[#0C3859] border border-[#CBD5E1] hover:bg-[#F8FAFC] font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#00A8B5]" />
            <span>Adicionar Palavra</span>
          </button>

          {todayReviewWords.length > 0 ? (
            <button
              onClick={() => onNavigateTab('review')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-white" />
              <span>Revisar Hoje ({todayReviewWords.length})</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateTab('review')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-white text-[#64748B] border border-[#E2E8F0] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#64748B]" />
              <span>Revisão em Dia</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row (SaaS Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab('vocabulary')}
          className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:border-[#00A8B5] cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Total de Palavras
            </span>
            <BookOpen className="w-4 h-4 text-[#00A8B5] dark:text-[#38BDF8] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-bold font-numbers text-[#15303D] dark:text-[#F8FAFC]">
            {stats.totalWords}
          </div>
          <p className="text-xs text-[#00A8B5] dark:text-[#38BDF8] font-medium flex items-center gap-1">
            <span>Ver banco</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab('review')}
          className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:border-amber-500 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Revisão Hoje
            </span>
            <RotateCcw className="w-4 h-4 text-amber-500 group-hover:rotate-180 transition-transform duration-500" />
          </div>
          <div className="text-3xl font-bold font-numbers text-amber-600 dark:text-amber-400">
            {todayReviewWords.length}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <span>Iniciar revisão</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab('statistics')}
          className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:border-[#8B5CF6] cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Níveis CEFR
            </span>
            <Award className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="flex items-center gap-1 flex-wrap pt-1 font-numbers">
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
              <span
                key={lvl}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EFF6FF] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155]"
              >
                {lvl}: {stats.byCefr[lvl] || 0}
              </span>
            ))}
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigateTab('statistics')}
          className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:border-[#16A34A] cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Dominadas (Mastered)
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-3xl font-bold font-numbers text-[#16A34A]">
            {stats.masteredCount}
          </div>
          <p className="text-xs text-[#16A34A] font-medium flex items-center gap-1">
            <span>Estatísticas completas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </p>
        </div>
      </div>

      {/* Recent Vocabulary Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold font-heading text-[#1E293B] dark:text-[#F8FAFC]">
              Palavras Adicionadas Recentes
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Seu vocabulário pessoal em desenvolvimento na EPWAY
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('vocabulary')}
            className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todas ({stats.totalWords})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentWords.slice(0, 6).map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onSelect={onSelectWord}
              onToggleMastered={onToggleMastered}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
