import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useVocabulary } from './hooks/useVocabulary';
import { VocabularyWord } from './types';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AnalyzeWordView } from './components/analyze/AnalyzeWordView';
import { WordGallery } from './components/vocabulary/WordGallery';
import { WordDetailModal } from './components/vocabulary/WordDetailModal';
import { WordFormModal } from './components/vocabulary/WordFormModal';
import { TodayReviewView } from './components/review/TodayReviewView';
import { StatisticsView } from './components/statistics/StatisticsView';
import { SettingsView } from './components/settings/SettingsView';
import { LoginPage } from './components/auth/LoginPage';
import { Loader2 } from 'lucide-react';

function MainAppContent() {
  const { user, loading: authLoading } = useAuth();
  const {
    words,
    filteredWords,
    todayReviewWords,
    stats,
    categoriesList,
    lessonsList,
    loading: vocabLoading,
    filters,
    setFilters,
    addWord,
    updateWord,
    deleteWord,
    toggleMastered,
    markReviewed,
    importWords,
  } = useVocabulary();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'analyze' | 'vocabulary' | 'review' | 'statistics' | 'settings'
  >('dashboard');

  // Modal states
  const [selectedDetailWord, setSelectedDetailWord] = useState<VocabularyWord | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);

  if (authLoading || (user && vocabLoading)) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-[#15303D] dark:text-[#F8FAFC] font-extrabold text-sm">
          <Loader2 className="w-6 h-6 animate-spin text-[#00A8B5]" />
          <span>Carregando EPWAY Vocabulary Hub...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleOpenAddModal = () => {
    setEditingWord(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (word: VocabularyWord) => {
    setEditingWord(word);
    setIsFormModalOpen(true);
  };

  const handleSaveWord = async (wordData: Omit<VocabularyWord, 'id' | 'userId'>) => {
    if (editingWord && editingWord.id) {
      await updateWord(editingWord.id, wordData);
    } else {
      await addWord(wordData);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#15303D] dark:text-[#F8FAFC] flex flex-col transition-colors selection:bg-[#00A8B5] selection:text-white">
      {/* Top Header */}
      <Header
        searchTerm={filters.search}
        onSearchChange={(val) => {
          setFilters((prev) => ({ ...prev, search: val }));
          if (activeTab !== 'vocabulary' && val) {
            setActiveTab('vocabulary');
          }
        }}
        onOpenAddModal={handleOpenAddModal}
        activeTab={activeTab}
        totalWordsCount={words.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalWordsCount={words.length}
          todayReviewCount={todayReviewWords.length}
        />

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              stats={stats}
              recentWords={words}
              todayReviewWords={todayReviewWords}
              searchTerm={filters.search}
              onSearchChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
              onOpenAddModal={handleOpenAddModal}
              onSelectWord={(word) => setSelectedDetailWord(word)}
              onToggleMastered={(wordId, e) => {
                e.stopPropagation();
                toggleMastered(wordId);
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'analyze' && (
            <AnalyzeWordView
              onSaveWord={addWord}
              existingWords={words}
            />
          )}

          {activeTab === 'vocabulary' && (
            <WordGallery
              words={filteredWords}
              filters={filters}
              setFilters={setFilters}
              categoriesList={categoriesList}
              lessonsList={lessonsList}
              onSelectWord={(word) => setSelectedDetailWord(word)}
              onToggleMastered={(wordId, e) => {
                e.stopPropagation();
                toggleMastered(wordId);
              }}
              onDeleteWord={(wordId, e) => {
                e.stopPropagation();
                deleteWord(wordId);
              }}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {activeTab === 'review' && (
            <TodayReviewView
              todayWords={todayReviewWords}
              onMarkReviewed={markReviewed}
              onGoToVocabulary={() => setActiveTab('vocabulary')}
            />
          )}

          {activeTab === 'statistics' && <StatisticsView stats={stats} />}

          {activeTab === 'settings' && (
            <SettingsView words={words} onImportWords={importWords} />
          )}
        </main>
      </div>

      {/* Modals */}
      <WordDetailModal
        word={selectedDetailWord}
        onClose={() => setSelectedDetailWord(null)}
        onEdit={(word) => handleOpenEditModal(word)}
        onDelete={(wordId) => deleteWord(wordId)}
        onUpdate={updateWord}
        onToggleMastered={toggleMastered}
      />

      <WordFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveWord}
        editWord={editingWord}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

