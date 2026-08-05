import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  BookOpen,
  RotateCcw,
  BarChart3,
  Settings,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'analyze' | 'vocabulary' | 'review' | 'statistics' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'analyze' | 'vocabulary' | 'review' | 'statistics' | 'settings') => void;
  totalWordsCount: number;
  todayReviewCount: number;
}

interface NavItem {
  id: 'dashboard' | 'analyze' | 'vocabulary' | 'review' | 'statistics' | 'settings';
  label: string;
  icon: React.ElementType;
  badge: number | null;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  totalWordsCount,
  todayReviewCount,
}) => {
  const { isAdmin } = useAuth();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'analyze',
      label: 'Analisar',
      icon: Search,
      badge: null,
    },
    {
      id: 'vocabulary',
      label: 'Minhas Palavras',
      icon: BookOpen,
      badge: totalWordsCount > 0 ? totalWordsCount : null,
    },
    {
      id: 'review',
      label: 'Revisão do Dia',
      icon: RotateCcw,
      badge: todayReviewCount > 0 ? todayReviewCount : null,
      badgeColor: 'bg-[#DC2626] text-white',
    },
    {
      id: 'statistics',
      label: 'Estatísticas',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings',
      label: isAdmin ? 'Configurações (Admin)' : 'Configurações',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 bg-[#F0FBF7] dark:bg-[#1E293B] border-r border-[#C9EBE3] dark:border-[#334155] p-5 space-y-6 flex flex-col justify-between text-[#15303D] dark:text-[#F8FAFC]">
      <div className="space-y-1.5">
        <p className="px-3 text-[10px] font-bold tracking-widest uppercase text-[#3B7A6E] dark:text-[#38BDF8] mb-3">
          Navegação EPWAY
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[14px] text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#00A8B5] text-white shadow-xs'
                  : 'text-[#184E44] dark:text-[#94A3B8] hover:bg-[#DCF3EC] dark:hover:bg-[#334155] hover:text-[#0C3830] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#00A8B5]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-numbers ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor || 'bg-[#D2EFE7] text-[#0D5246] border border-[#B4E5D8]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-3 pt-4 border-t border-[#C9EBE3]">
        {/* Active Role Indicator */}
        <div className="p-3.5 rounded-[16px] bg-[#E3F6F0] border border-[#BDE8DC] text-xs space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            {isAdmin ? (
              <>
                <ShieldCheck className="w-4 h-4 text-[#00A8B5]" />
                <span className="text-[#0C3830]">Acesso Administrador</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#0C3830]">Acesso Aluno</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-[#2D665B] leading-relaxed">
            {isAdmin
              ? 'Edição master e controle avançado ativos.'
              : 'Nível de estudante. Modos de treino e progresso.'}
          </p>
        </div>

        {/* EPWAY Notion Embed Badge (Visible only to Admin) */}
        {isAdmin && (
          <div className="p-3.5 rounded-[16px] bg-[#E3F6F0]/80 border border-[#BDE8DC] text-xs text-[#2D665B]">
            <div className="flex items-center gap-1.5 font-semibold mb-1 text-[#00A8B5]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Integrável com Notion</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Incorpore no Notion usando <code className="px-1 py-0.5 rounded bg-[#D2EFE7] border border-[#B4E5D8] font-mono text-[10px] text-[#0C3830]">/embed</code>.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
