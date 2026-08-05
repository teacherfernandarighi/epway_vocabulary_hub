import React from 'react';
import { VocabularyStats } from '../../types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { BookOpen, Award, CheckCircle2, RotateCw, Layers, TrendingUp } from 'lucide-react';

interface StatisticsViewProps {
  stats: VocabularyStats;
}

const CEFR_COLORS: Record<string, string> = {
  A1: '#22C55E',
  A2: '#84CC16',
  B1: '#3B82F6',
  B2: '#6366F1',
  C1: '#8B5CF6',
  C2: '#EC4899',
};

const CATEGORY_COLORS: Record<string, string> = {
  Business: '#2563EB',
  Travel: '#06B6D4',
  'Daily Life': '#10B981',
  Academic: '#8B5CF6',
  Technology: '#F59E0B',
  Health: '#EF4444',
};

export const StatisticsView: React.FC<StatisticsViewProps> = ({ stats }) => {
  // Format CEFR Bar Data
  const cefrChartData = Object.keys(stats.byCefr).map((level) => ({
    level,
    count: stats.byCefr[level] || 0,
    fill: CEFR_COLORS[level] || '#2563EB',
  }));

  // Format Category Pie Data
  const categoryChartData = Object.keys(stats.byCategory).map((cat) => ({
    name: cat,
    value: stats.byCategory[cat],
    color: CATEGORY_COLORS[cat] || '#2563EB',
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-2">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Palavras</span>
            <BookOpen className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-3xl font-bold font-numbers text-[#1E293B] dark:text-[#F8FAFC]">
            {stats.totalWords}
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Banco pessoal de vocabulário</p>
        </div>

        <div className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-2">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Aprendidas (Mastered)</span>
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-3xl font-bold font-numbers text-[#16A34A]">
            {stats.masteredCount}
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            {stats.totalWords > 0
              ? `${Math.round((stats.masteredCount / stats.totalWords) * 100)}% do seu banco`
              : '0% do total'}
          </p>
        </div>

        <div className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-2">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Revisões Pendentes</span>
            <RotateCw className="w-4 h-4 text-[#EAB308]" />
          </div>
          <div className="text-3xl font-bold font-numbers text-[#EAB308]">
            {stats.pendingReviewCount}
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Agendadas para hoje ou em atraso</p>
        </div>

        <div className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-2">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Categorias</span>
            <Layers className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-3xl font-bold font-numbers text-[#1E293B] dark:text-[#F8FAFC]">
            {Object.keys(stats.byCategory).length}
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Tópicos de estudo distintos</p>
        </div>
      </div>

      {/* Charts Row 1: CEFR Level & Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CEFR Distribution Bar Chart */}
        <div className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold font-heading text-[#1E293B] dark:text-[#F8FAFC]">
                Distribuição por Nível CEFR
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Quantidade de palavras por nível de inglês</p>
            </div>
            <Award className="w-5 h-5 text-[#2563EB]" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cefrChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="level" tickLine={false} tick={{ fontSize: 12, fontWeight: '600' }} />
                <YAxis allowDecimals={false} tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    borderRadius: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {cefrChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold font-heading text-[#1E293B] dark:text-[#F8FAFC]">
                Palavras por Categoria
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Áreas de conhecimento mais praticadas</p>
            </div>
            <Layers className="w-5 h-5 text-[#8B5CF6]" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#F8FAFC',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Nenhum dado de categoria disponível.</p>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Monthly Progress Line Chart */}
      <div className="p-6 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold font-heading text-[#1E293B] dark:text-[#F8FAFC]">
              Evolução do Banco de Vocabulário
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Palavras adicionadas ao longo do tempo</p>
          </div>
          <TrendingUp className="w-5 h-5 text-[#10B981]" />
        </div>

        <div className="h-64 w-full">
          {stats.monthlyProgress.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.monthlyProgress}
                margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    borderRadius: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2563EB' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#64748B] dark:text-[#94A3B8]">
              Adicione palavras para visualizar o gráfico de evolução mensal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
