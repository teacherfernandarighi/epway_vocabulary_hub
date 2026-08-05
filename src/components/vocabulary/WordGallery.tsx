import React, { useState } from 'react';
import { VocabularyWord, VocabularyFilters } from '../../types';
import { WordCard } from './WordCard';
import { AccordionWordCard } from './AccordionWordCard';
import { Search, Filter, RefreshCw, Plus, BookOpen, LayoutGrid, List } from 'lucide-react';

interface WordGalleryProps {
  words: VocabularyWord[];
  filters: VocabularyFilters;
  setFilters: React.Dispatch<React.SetStateAction<VocabularyFilters>>;
  categoriesList: string[];
  lessonsList: string[];
  onSelectWord: (word: VocabularyWord) => void;
  onToggleMastered: (wordId: string, e: React.MouseEvent) => void;
  onDeleteWord?: (wordId: string, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
}

export const WordGallery: React.FC<WordGalleryProps> = ({
  words,
  filters,
  setFilters,
  categoriesList,
  lessonsList,
  onSelectWord,
  onToggleMastered,
  onDeleteWord,
  onOpenAddModal,
}) => {
  const [viewMode, setViewMode] = useState<'accordion' | 'grid'>('accordion');

  const hasActiveFilters =
    filters.search ||
    filters.cefr !== 'all' ||
    filters.category !== 'all' ||
    filters.partOfSpeech !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.mastered !== 'all' ||
    filters.lesson !== 'all';

  const resetFilters = () => {
    setFilters({
      search: '',
      cefr: 'all',
      category: 'all',
      partOfSpeech: 'all',
      difficulty: 'all',
      mastered: 'all',
      lesson: 'all',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search & Filters Bar */}
      <div className="p-5 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Main Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Buscar palavra, significado ou nota..."
                className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-[12px] bg-[#FAF8F5] dark:bg-[#0F172A] text-[#15303D] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:border-[#00A8B5]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {/* View Mode Switcher */}
              <div className="flex items-center p-1 rounded-[12px] bg-[#FAF8F5] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
                <button
                  onClick={() => setViewMode('accordion')}
                  title="Visão em Lista"
                  className={`p-1.5 rounded-[8px] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'accordion'
                      ? 'bg-[#00A8B5] text-white dark:bg-[#00A8B5]'
                      : 'text-[#64748B] hover:text-[#15303D] dark:text-[#94A3B8]'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lista</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  title="Visão em Grade"
                  className={`p-1.5 rounded-[8px] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#00A8B5] text-white dark:bg-[#00A8B5]'
                      : 'text-[#64748B] hover:text-[#15303D] dark:text-[#94A3B8]'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grade</span>
                </button>
              </div>

            {/* CEFR Filter */}
            <select
              value={filters.cefr}
              onChange={(e) => setFilters((prev) => ({ ...prev, cefr: e.target.value }))}
              className="px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] font-semibold"
            >
              <option value="all">CEFR: Todos</option>
              <option value="A1">A1 - Iniciante</option>
              <option value="A2">A2 - Básico</option>
              <option value="B1">B1 - Intermediário</option>
              <option value="B2">B2 - Pós-Intermediário</option>
              <option value="C1">C1 - Avançado</option>
              <option value="C2">C2 - Proficiente</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] font-semibold"
            >
              <option value="all">Categoria: Todas</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Mastered Filter */}
            <select
              value={filters.mastered}
              onChange={(e) => setFilters((prev) => ({ ...prev, mastered: e.target.value }))}
              className="px-3 py-2 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] font-semibold"
            >
              <option value="all">Status: Todos</option>
              <option value="pending">Em Aprendizado</option>
              <option value="mastered">Aprendidas (Mastered)</option>
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-[12px] transition-colors font-medium shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-[#94A3B8] overflow-x-auto pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
          <span className="font-semibold shrink-0 flex items-center gap-1.5 text-[#15303D] dark:text-[#F8FAFC]">
            <Filter className="w-3.5 h-3.5 text-[#00A8B5]" />
            <span>Filtros Adicionais:</span>
          </span>

          <select
            value={filters.partOfSpeech}
            onChange={(e) => setFilters((prev) => ({ ...prev, partOfSpeech: e.target.value }))}
            className="px-2.5 py-1 text-xs rounded-[8px] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155]"
          >
            <option value="all">Part of Speech: Todas</option>
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="adjective">Adjective</option>
            <option value="adverb">Adverb</option>
            <option value="phrasal verb">Phrasal Verb</option>
            <option value="idiom">Idiom</option>
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
            className="px-2.5 py-1 text-xs rounded-[8px] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155]"
          >
            <option value="all">Dificuldade: Todas</option>
            <option value="Easy">Fácil</option>
            <option value="Medium">Médio</option>
            <option value="Hard">Difícil</option>
          </select>

          {lessonsList.length > 0 && (
            <select
              value={filters.lesson}
              onChange={(e) => setFilters((prev) => ({ ...prev, lesson: e.target.value }))}
              className="px-2.5 py-1 text-xs rounded-[8px] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155]"
            >
              <option value="all">Lição: Todas</option>
              {lessonsList.map((les) => (
                <option key={les} value={les}>
                  {les}
                </option>
              ))}
            </select>
          )}

          <span className="ml-auto font-semibold font-numbers text-[#00A8B5] dark:text-[#38BDF8] shrink-0">
            {words.length} {words.length === 1 ? 'palavra' : 'palavras'}
          </span>
        </div>
      </div>

      {/* Words Content */}
      {words.length > 0 ? (
        viewMode === 'accordion' ? (
          <div className="space-y-3">
            {words.map((w) => (
              <AccordionWordCard
                key={w.id}
                word={w}
                onSelect={onSelectWord}
                onDelete={onDeleteWord || (() => {})}
                onToggleMastered={onToggleMastered}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {words.map((w) => (
              <WordCard
                key={w.id}
                word={w}
                onSelect={onSelectWord}
                onToggleMastered={onToggleMastered}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-[#1E293B] rounded-[20px] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#EFF6FF] dark:bg-[#0F172A] text-[#2563EB] dark:text-[#60A5FA] mx-auto flex items-center justify-center border border-[#2563EB]/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-heading text-[#1E293B] dark:text-[#F8FAFC]">
              Nenhuma palavra encontrada
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-sm mx-auto mt-1">
              {hasActiveFilters
                ? 'Nenhuma palavra corresponde aos filtros selecionados. Tente limpar a busca.'
                : 'Seu banco de vocabulário está vazio. Adicione sua primeira palavra!'}
            </p>
          </div>
          <button
            onClick={hasActiveFilters ? resetFilters : onOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            {hasActiveFilters ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Limpar Filtros</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Adicionar Primeira Palavra</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
