import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { EpwayLogo } from './EpwayLogo';
import { EPWAY_AVATAR_URL } from '../../constants/assets';
import {
  Plus,
  Search,
  Sun,
  Moon,
  LogOut,
  Flame,
  BookOpen,
  ShieldCheck,
  UserCheck,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenAddModal: () => void;
  activeTab: 'dashboard' | 'analyze' | 'vocabulary' | 'review' | 'statistics' | 'settings';
  totalWordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onOpenAddModal,
  activeTab,
  totalWordsCount,
}) => {
  const { user, isAdmin, isTeacherAccount, isStudentPreviewMode, toggleStudentPreviewMode, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* EPWAY Brand Logo */}
        <div className="flex items-center gap-3">
          <EpwayLogo size="md" showText={true} showSubtitle={true} />

          {/* Role Badge */}
          {isAdmin ? (
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F7F8] dark:bg-[#00A8B5]/20 text-[#00A8B5] dark:text-[#38BDF8] border border-[#00A8B5]/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Professora Fernanda (Admin)</span>
            </div>
          ) : isTeacherAccount && isStudentPreviewMode ? (
            <button
              onClick={toggleStudentPreviewMode}
              title="Voltar ao Modo Professora"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Simulando Visão do Aluno</span>
            </button>
          ) : (
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[#1E293B] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-700 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5 text-[#00A8B5]" />
              <span>Aluno EPWAY</span>
            </div>
          )}
        </div>

        {/* Quick Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar palavra, significado ou tradução..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-[12px] bg-[#F4F8FA] dark:bg-[#0F172A] text-[#15303D] dark:text-white placeholder-[#64748B] dark:placeholder-[#94A3B8] border border-[#E2E8F0] dark:border-[#334155] focus:border-[#00A8B5] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Word Counter Pill & User Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Word Count Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#E6F7F8] text-[#00A8B5] border border-[#00A8B5]/25 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-numbers">{totalWordsCount} {totalWordsCount === 1 ? 'word' : 'words'}</span>
          </div>

          {/* Streak Counter */}
          <div
            title="Sequência de Estudos Diários"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-numbers">{user?.streak || 1} {user?.streak === 1 ? 'dia' : 'dias'}</span>
          </div>

          {/* Add Word Button */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[14px] bg-[#00A8B5] hover:bg-[#008C96] text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar Palavra</span>
            <span className="sm:hidden">Nova</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            className="p-2.5 rounded-[12px] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E6F7F8] dark:hover:bg-[#334155] transition-colors cursor-pointer border border-[#E2E8F0] dark:border-[#334155]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#15303D]" />}
          </button>

          {/* Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
            <img
              src={user?.photoURL || EPWAY_AVATAR_URL}
              alt={user?.displayName || 'Student'}
              className="w-8 h-8 rounded-full border border-[#CBD5E1] bg-[#F8FAFC] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="hidden lg:block text-left text-xs">
              <p className="font-semibold text-[#15303D] truncate max-w-[120px]">
                {user?.displayName || (isAdmin ? 'Professora Fernanda' : 'Aluno EPWAY')}
              </p>
              <span className="text-[10px] text-[#00A8B5] font-medium block">
                {isAdmin ? 'Admin' : 'Aluno'}
              </span>
            </div>

            <button
              onClick={logout}
              title="Sair da Conta"
              className="p-1.5 rounded-[8px] text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
