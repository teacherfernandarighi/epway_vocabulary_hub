import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EpwayLogo } from '../common/EpwayLogo';
import { Lock, Mail, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, loginAsDemoUser, loginAsTeacherDemo } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name.trim()) throw new Error('Por favor insira seu nome completo.');
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado. Tente fazer login.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(err.message || 'Falha ao realizar autenticação.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError('Não foi possível conectar com o Google. Use e-mail ou Modo Demo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0A161E] flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* EPWAY Logo Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <EpwayLogo size="xl" showText={true} showSubtitle={true} />
          <h1 className="text-2xl font-black font-serif tracking-tight text-[#15303D] dark:text-white">
            EPWAY Vocabulary Hub
          </h1>
          <p className="text-xs text-[#64748B] dark:text-slate-400">
            Plataforma oficial de vocabulário para alunos EPWAY English School
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-[#15303D] p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogle}
            className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-[#FAF8F5] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#15303D] dark:text-slate-200 font-extrabold text-xs shadow-2xs hover:border-[#00A8B5] transition active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com o Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E2E8F0] dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-[#15303D] px-3 text-[10px] text-[#64748B] font-extrabold uppercase tracking-widest shrink-0">
              ou com e-mail
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-[10px] font-extrabold text-[#15303D] dark:text-slate-300 uppercase tracking-widest mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#FAF8F5] dark:bg-slate-800 text-[#15303D] dark:text-white border border-[#E2E8F0] dark:border-slate-700 focus:outline-none focus:border-[#00A8B5]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-extrabold text-[#15303D] dark:text-slate-300 uppercase tracking-widest mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aluno@epway.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#FAF8F5] dark:bg-slate-800 text-[#15303D] dark:text-white border border-[#E2E8F0] dark:border-slate-700 focus:outline-none focus:border-[#00A8B5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-[#15303D] dark:text-slate-300 uppercase tracking-widest mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#FAF8F5] dark:bg-slate-800 text-[#15303D] dark:text-white border border-[#E2E8F0] dark:border-slate-700 focus:outline-none focus:border-[#00A8B5]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#00A8B5] hover:bg-[#008C96] text-white font-black text-xs shadow-md transition disabled:opacity-50"
            >
              <span>{isRegistering ? 'Criar Minha Conta EPWAY' : 'Entrar no Sistema'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-[#00A8B5] dark:text-[#38BDF8] font-extrabold hover:underline"
            >
              {isRegistering
                ? 'Já possui uma conta? Faça login'
                : 'Novo aluno EPWAY? Crie sua conta aqui'}
            </button>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 space-y-2">
            <button
              type="button"
              onClick={loginAsTeacherDemo}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E6F7F8] dark:bg-slate-800 text-[#15303D] dark:text-[#38BDF8] hover:bg-[#D0F2F4] font-black text-xs border-2 border-[#00A8B5] shadow-sm transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#00A8B5]" />
              <span>👑 Entrar como Professora Fernanda (Admin)</span>
            </button>

            <button
              type="button"
              onClick={loginAsDemoUser}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-slate-800 text-[#15303D] dark:text-slate-200 hover:bg-[#E2E8F0]/50 font-black text-xs border border-[#CBD5E1] dark:border-slate-700 transition active:scale-95"
            >
              <User className="w-4 h-4 text-[#00A8B5]" />
              <span>🎓 Entrar como Aluno EPWAY (Acesso Aluno)</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-center text-[#64748B] dark:text-slate-500">
          EPWAY English School &copy; {new Date().getFullYear()} &bull; Notion Embed Ready
        </p>
      </div>
    </div>
  );
};

