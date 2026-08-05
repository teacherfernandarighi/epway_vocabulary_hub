import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { VocabularyWord } from '../../types';
import { exportToJSON, exportToCSV, parseJSONImport } from '../../utils/exportImport';
import { EPWAY_AVATAR_URL } from '../../constants/assets';
import {
  User,
  Sun,
  Moon,
  Download,
  Upload,
  Save,
  Check,
  FileText,
  ShieldCheck,
  Lock,
  Eye,
  Sparkles,
} from 'lucide-react';

interface SettingsViewProps {
  words: VocabularyWord[];
  onImportWords: (imported: Omit<VocabularyWord, 'id' | 'userId'>[]) => Promise<number>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ words, onImportWords }) => {
  const { user, isAdmin, isTeacherAccount, isStudentPreviewMode, toggleStudentPreviewMode, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isSaved, setIsSaved] = useState(false);

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ displayName, photoURL });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      setImportStatus('Ação Bloqueada: Apenas a Professora Fernanda (Admin) pode importar bancos de dados.');
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = parseJSONImport(text);
      const count = await onImportWords(imported);
      setImportStatus(`Sucesso! ${count} palavras importadas para o banco de dados.`);
    } catch (err: any) {
      setImportStatus(`Erro na importação: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Teacher / Admin Controls Panel */}
      {isTeacherAccount && (
        <div className="p-6 sm:p-8 rounded-[20px] bg-white dark:bg-[#1E293B] border-2 border-[#2563EB] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-[14px] bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/40 dark:text-[#60A5FA]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold font-heading text-[#1E293B] dark:text-[#F8FAFC]">
                    Painel da Professora (Administração EPWAY)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-[10px] font-semibold uppercase tracking-wider">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Gerencie permissões, segurança e controle total da plataforma de vocabulário
                </p>
              </div>
            </div>

            <button
              onClick={toggleStudentPreviewMode}
              className={`px-4 py-2.5 rounded-[14px] font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer ${
                isStudentPreviewMode
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-[#EFF6FF] dark:bg-[#0F172A] text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 hover:bg-[#2563EB]/15'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>
                {isStudentPreviewMode
                  ? 'Voltar para Visão da Professora'
                  : 'Simular Visão do Aluno'}
              </span>
            </button>
          </div>

          <div className="p-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-xs space-y-2 text-[#1E293B] dark:text-[#F8FAFC]">
            <p className="font-semibold text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Status das Travas de Segurança dos Alunos:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              <li><strong>Logotipo da Escola:</strong> Exclusivo da Administração. Alunos não podem modificar a logo do cabeçalho.</li>
              <li><strong>Importação de Dados:</strong> Bloqueada para alunos para evitar corrupção do banco de dados da escola.</li>
              <li><strong>Edição de Palavras Escolares:</strong> Protegida. Apenas a professora pode reescrever dados mestres de palavras.</li>
            </ul>
          </div>

          {/* School Logo Admin Section */}
          {isAdmin && (
            <div className="p-4 rounded-[16px] bg-[#E6F7F8] border border-[#00A8B5]/30 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-[#0C3859]">
                  <Sparkles className="w-4 h-4 text-[#00A8B5]" />
                  <span>Logotipo Oficial da EPWAY English School (Exclusivo Admin)</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#00A8B5] bg-white px-2 py-0.5 rounded-full border border-[#00A8B5]/20">
                  Visível para Todos os Alunos
                </span>
              </div>
              <p className="text-[11px] text-[#2D587B]">
                Como administradora, você pode personalizar o logotipo oficial que aparece no cabeçalho do app para todos os estudantes.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#00A8B5] hover:bg-[#008C96] text-white text-xs font-semibold transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Carregar Nova Logo da Escola</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            localStorage.setItem('epway_custom_school_logo', reader.result);
                            window.dispatchEvent(new Event('epway_logo_updated'));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('epway_custom_school_logo');
                    window.dispatchEvent(new Event('epway_logo_updated'));
                  }}
                  className="px-3 py-2 rounded-[10px] bg-white hover:bg-slate-50 text-[#0C3859] border border-[#CBD5E1] text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Restaurar Logo Padrão
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile Settings */}
      <div className="p-6 sm:p-8 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
          <div className="p-2.5 rounded-[12px] bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/40 dark:text-[#60A5FA]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-heading text-[#1E293B] dark:text-[#F8FAFC]">
              Perfil de Usuário ({isAdmin ? 'Professora Fernanda' : 'Aluno EPWAY'})
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Personalize seu nome de exibição e sua foto de perfil pessoal
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
                Nome de Exibição
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ex: Fernanda Righi"
                className="w-full px-3.5 py-2.5 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
                Foto de Perfil Pessoal
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="Cole a URL ou envie uma imagem"
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-[12px] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:border-[#2563EB]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-[12px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Enviar Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setPhotoURL(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoURL(EPWAY_AVATAR_URL)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Restaurar Foto Padrão</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <img
                src={photoURL || EPWAY_AVATAR_URL}
                alt="Preview"
                className="w-10 h-10 rounded-full border-2 border-[#2563EB] bg-[#F8FAFC] object-cover shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">Visualização do Perfil</span>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Theme Settings */}
      <div className="p-6 sm:p-8 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[12px] bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA]">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold font-heading text-[#1E293B] dark:text-[#F8FAFC]">
                Tema de Apresentação
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Alterne entre Tema Claro (Light) e Tema Escuro (Dark)
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2.5 rounded-[14px] bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-[#E2E8F0] dark:hover:bg-[#334155] text-[#1E293B] dark:text-[#F8FAFC] font-semibold text-xs border border-[#E2E8F0] dark:border-[#334155] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? 'Ativar Tema Claro' : 'Ativar Tema Escuro'}
          </button>
        </div>
      </div>

      {/* Export & Import Data */}
      <div className="p-6 sm:p-8 rounded-[20px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
          <div className="p-2.5 rounded-[12px] bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA]">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-heading text-[#1E293B] dark:text-[#F8FAFC]">
              Exportar & Importar Vocabulário
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {isAdmin
                ? 'Exportação livre e importação de lotes para a professora'
                : 'Exporte suas anotações pessoais em JSON ou CSV'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Buttons */}
          <div className="p-4 rounded-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Exportar Seu Vocabulário
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => exportToJSON(words)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar em JSON (.json)</span>
              </button>

              <button
                onClick={() => exportToCSV(words)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Exportar em Planilha CSV (.csv)</span>
              </button>
            </div>
          </div>

          {/* Import JSON Button */}
          <div className="p-4 rounded-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
              <span>Importar Banco em Lote</span>
              {!isAdmin && <Lock className="w-3.5 h-3.5 text-amber-500" />}
            </h4>

            {isAdmin ? (
              <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#E2E8F0] dark:bg-[#334155] hover:bg-[#CBD5E1] dark:hover:bg-[#475569] text-[#1E293B] dark:text-[#F8FAFC] font-semibold text-xs cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#2563EB]" />
                <span>Selecionar Arquivo JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-3 rounded-[12px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-[11px] space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Restrito a Alunos</span>
                </p>
                <p>Apenas a Professora Fernanda (Admin) pode importar ou restaurar arquivos JSON para proteger a integridade do banco de palavras.</p>
              </div>
            )}

            {importStatus && (
              <p className="text-xs font-medium text-[#1E293B] dark:text-[#F8FAFC]">
                {importStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
