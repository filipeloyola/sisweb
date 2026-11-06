import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * AuthModal
 *
 * Modal de autenticação integrado ao Supabase Auth com suporte a confirmação real por e-mail
 * e controle de colaboradores/administrador.
 *
 * Pode ser fechado livremente para que qualquer visitante continue navegando publicamente.
 */
export function AuthModal({ isOpen, onClose }) {
  const { supabaseSignIn, supabaseSignUp } = useApp();

  // 'login' | 'signup'
  const [tab, setTab] = useState('login');

  // ---------- Login form state ----------
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ---------- Sign-up form state ----------
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccessData, setSignupSuccessData] = useState(null);

  // Clear errors when switching tabs
  useEffect(() => {
    setLoginError('');
    setSignupError('');
    setSignupSuccessData(null);
  }, [tab, isOpen]);

  if (!isOpen) return null;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) return setLoginError('Informe o seu e-mail.');
    if (!isValidEmail(loginEmail)) return setLoginError('Formato de e-mail inválido.');
    if (!loginPassword) return setLoginError('Informe a senha.');

    setLoginLoading(true);
    const result = await supabaseSignIn({ email: loginEmail, password: loginPassword });
    setLoginLoading(false);

    if (!result.success) {
      setLoginError(result.error);
    } else {
      if (onClose) onClose();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName.trim()) return setSignupError('Informe seu nome completo.');
    if (!signupEmail.trim()) return setSignupError('Informe o e-mail.');
    if (!isValidEmail(signupEmail)) return setSignupError('Formato de e-mail inválido.');
    if (signupPassword.length < 6) return setSignupError('A senha precisa ter pelo menos 6 caracteres.');
    if (signupPassword !== signupConfirm) return setSignupError('As senhas não coincidem.');

    setSignupLoading(true);
    const result = await supabaseSignUp({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    });
    setSignupLoading(false);

    if (!result.success) {
      setSignupError(result.error);
      return;
    }

    setSignupSuccessData({
      email: result.email,
      name: result.name,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      {/* Card */}
      <div className="relative w-full max-w-md bg-[#181818] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Decorative green top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-spotify-green via-emerald-400 to-teal-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-spotify-gray hover:text-white hover:bg-white/10 transition-colors z-20"
          title="Fechar e continuar como visitante"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-black">
              <img
                src="/logo.jpeg"
                alt="Spiritfy"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
              Spiritfy
              <span className="w-1.5 h-1.5 rounded-full bg-spotify-green" />
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white">
            {tab === 'login' ? 'Área do Colaborador & Banda' : 'Solicitar Cadastro'}
          </h2>
          <p className="text-xs sm:text-sm text-spotify-gray mt-1">
            {tab === 'login'
              ? 'Acesse para gerenciar repertórios, editar playlists e adicionar músicas.'
              : 'Cadastre-se com validação por e-mail do Supabase.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex mx-8 mb-5 bg-[#121212] rounded-2xl p-1 gap-1 border border-white/5">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              tab === 'login'
                ? 'bg-spotify-green text-black shadow-md'
                : 'text-spotify-gray hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              tab === 'signup'
                ? 'bg-spotify-green text-black shadow-md'
                : 'text-spotify-gray hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Criar Conta
          </button>
        </div>

        {/* ── LOGIN FORM ───────────────────────────────────────────────────── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="px-8 pb-8 flex flex-col gap-3.5" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-spotify-gray uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-spotify-gray pointer-events-none" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#555] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-spotify-gray uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-spotify-gray pointer-events-none" />
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl pl-10 pr-12 py-2.5 text-sm text-white placeholder-[#555] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-spotify-gray hover:text-white transition-colors"
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="flex items-start gap-2 text-red-400 text-xs sm:text-sm bg-red-950/40 border border-red-500/30 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-1 py-3 rounded-full bg-spotify-green hover:bg-spotify-green-light active:scale-[0.98] text-black font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-spotify-green/20 disabled:opacity-60"
            >
              {loginLoading ? (
                <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar com Supabase</span>
                </>
              )}
            </button>

            {/* Pre-configured accounts for quick testing */}
            <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-spotify-gray uppercase tracking-wider text-center">
                Acesso Rápido para Testes:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@spiritfy.app');
                    setLoginPassword('AdminPassword123!');
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-colors"
                >
                  <span className="block font-bold text-amber-400">👑 Admin</span>
                  <span className="text-[10px] text-spotify-gray truncate block">admin@spiritfy.app</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('filipe@spiritfy.app');
                    setLoginPassword('FilipePassword123!');
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-colors"
                >
                  <span className="block font-bold text-spotify-green">🎸 Filipe</span>
                  <span className="text-[10px] text-spotify-gray truncate block">filipe@spiritfy.app</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── SIGN-UP FORM ─────────────────────────────────────────────────── */}
        {tab === 'signup' && (
          <div className="px-8 pb-8">
            {signupSuccessData ? (
              <div className="flex flex-col items-center text-center py-4 gap-4 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-spotify-green/20 border-2 border-spotify-green flex items-center justify-center text-spotify-green">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">E-mail de Confirmação Enviado!</h3>
                  <p className="text-xs sm:text-sm text-spotify-gray mt-2 leading-relaxed">
                    O <strong>Supabase Auth</strong> enviou um link de validação real para:
                  </p>
                  <div className="mt-2 py-1.5 px-3 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-spotify-green">
                    {signupSuccessData.email}
                  </div>
                </div>

                <div className="bg-amber-950/30 border border-amber-500/20 rounded-2xl p-3.5 text-xs text-amber-200/90 text-left flex gap-2.5">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-400" />
                  <span>
                    <strong>Importante:</strong> Após confirmar seu e-mail, seu cadastro precisará ser
                    aprovado pelo administrador do Spiritfy para desbloquear a adição e edição de músicas.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="w-full py-2.5 rounded-full bg-spotify-green text-black font-extrabold text-xs transition-transform active:scale-95"
                >
                  Ir para a tela de Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="flex flex-col gap-3" noValidate>
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-spotify-gray uppercase tracking-wider">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-spotify-gray pointer-events-none" />
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Seu nome"
                      autoComplete="name"
                      className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#555] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-spotify-gray uppercase tracking-wider">
                    E-mail (Receberá validação real)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-spotify-gray pointer-events-none" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="seu@email.com"
                      autoComplete="email"
                      className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#555] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-spotify-gray uppercase tracking-wider">
                    Senha <span className="normal-case font-normal">(mín. 6 caracteres)</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-spotify-gray pointer-events-none" />
                    <input
                      type={showSignupPass ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl pl-10 pr-12 py-2 text-sm text-white placeholder-[#555] outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPass((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-spotify-gray hover:text-white transition-colors"
                    >
                      {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-spotify-gray uppercase tracking-wider">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-spotify-gray pointer-events-none" />
                    <input
                      type={showSignupPass ? 'text' : 'password'}
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#555] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Error */}
                {signupError && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/40 border border-red-500/30 rounded-xl p-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full mt-2 py-2.5 rounded-full bg-spotify-green hover:bg-spotify-green-light active:scale-[0.98] text-black font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-spotify-green/20 disabled:opacity-60"
                >
                  {signupLoading ? (
                    <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Cadastrar no Supabase</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
