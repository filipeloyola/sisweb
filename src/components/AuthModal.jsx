import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * AuthModal
 *
 * Full-screen overlay that gates the application when no user is logged in.
 * Provides two tabs:
 *   - "Entrar"      → email + password login form
 *   - "Criar Conta" → name + email + password sign-up form
 *
 * On successful sign-up it calls `onSignUpSuccess` with the pending
 * confirmation data so the parent can show the EmailConfirmModal.
 *
 * @param {Object} props
 * @param {boolean}  props.isOpen
 * @param {Function} props.onSignUpSuccess - Called with { userId, token, email, name }
 */
export function AuthModal({ isOpen, onSignUpSuccess }) {
  const { loginUser, registerUser } = useApp();

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

  // Clear errors when switching tabs
  useEffect(() => {
    setLoginError('');
    setSignupError('');
  }, [tab]);

  if (!isOpen) return null;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /** Very lightweight e-mail format check. */
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // Basic validation
    if (!loginEmail.trim()) return setLoginError('Informe o e-mail.');
    if (!isValidEmail(loginEmail)) return setLoginError('Formato de e-mail inválido.');
    if (!loginPassword) return setLoginError('Informe a senha.');

    setLoginLoading(true);

    // Simulate a tiny async delay for UX feedback
    setTimeout(() => {
      const result = loginUser({ email: loginEmail, password: loginPassword });
      setLoginLoading(false);

      if (!result.success) {
        setLoginError(result.error);

        // If account exists but unconfirmed, re-surface confirmation modal
        if (result.needsConfirmation && onSignUpSuccess) {
          onSignUpSuccess({
            userId: result.userId,
            token: result.token,
            email: result.email,
            name: result.name,
          });
        }
      }
      // On success the parent AppContext sets currentUser → modal auto-closes
    }, 350);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSignupError('');

    // Field validation
    if (!signupName.trim()) return setSignupError('Informe seu nome.');
    if (!signupEmail.trim()) return setSignupError('Informe o e-mail.');
    if (!isValidEmail(signupEmail)) return setSignupError('Formato de e-mail inválido.');
    if (signupPassword.length < 6) return setSignupError('A senha precisa ter pelo menos 6 caracteres.');
    if (signupPassword !== signupConfirm) return setSignupError('As senhas não coincidem.');

    setSignupLoading(true);

    setTimeout(() => {
      const result = registerUser({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      setSignupLoading(false);

      if (!result.success) {
        setSignupError(result.error);
        return;
      }

      // Pass pending confirmation data up to parent
      if (onSignUpSuccess) {
        onSignUpSuccess({
          userId: result.userId,
          token: result.token,
          email: result.email,
          name: result.name,
        });
      }
    }, 400);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/98 backdrop-blur-lg"
      aria-modal="true"
      role="dialog"
      aria-labelledby="auth-modal-title"
    >
      {/* Card */}
      <div className="relative w-full max-w-md bg-[#181818] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">

        {/* Decorative green top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1DB954] via-[#21d85f] to-[#158f3f]" />

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
              <img
                src="/logo.jpeg"
                alt="Spiritfy"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Spiritfy
              <span className="inline-block w-1.5 h-1.5 ml-1 rounded-full bg-[#1DB954] align-middle" />
            </span>
          </div>

          <h2 id="auth-modal-title" className="text-lg font-bold text-white">
            {tab === 'login' ? 'Acessar sua conta' : 'Criar nova conta'}
          </h2>
          <p className="text-sm text-[#B3B3B3] mt-1">
            {tab === 'login'
              ? 'Entre para pedir músicas ao vivo.'
              : 'Junte-se e escolha o que o músico vai tocar!'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex mx-8 mb-6 bg-[#121212] rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === 'login'
                ? 'bg-[#1DB954] text-black shadow-md'
                : 'text-[#B3B3B3] hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === 'signup'
                ? 'bg-[#1DB954] text-black shadow-md'
                : 'text-[#B3B3B3] hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Criar Conta
          </button>
        </div>

        {/* ── LOGIN FORM ───────────────────────────────────────────────────── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="px-8 pb-8 flex flex-col gap-4" noValidate>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B3B3B3] pointer-events-none" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full bg-[#121212] border border-[#333333] focus:border-[#1DB954] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B3B3B3] pointer-events-none" />
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#121212] border border-[#333333] focus:border-[#1DB954] rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B3B3B3] hover:text-white transition-colors"
                  aria-label={showLoginPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {loginError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-1 py-3 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] active:scale-[0.98] text-black font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginLoading ? (
                <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Entrar
                </>
              )}
            </button>

            {/* Hint for demo users */}
            <p className="text-center text-xs text-[#555] mt-1">
              Conta demo:{' '}
              <button
                type="button"
                className="text-[#1DB954] hover:underline"
                onClick={() => {
                  setLoginEmail('joao@spiritfy.app');
                  setLoginPassword('demo1234');
                }}
              >
                joao@spiritfy.app
              </button>
              {' / '}senha: <code className="text-[#B3B3B3]">demo1234</code>
            </p>
          </form>
        )}

        {/* ── SIGN-UP FORM ─────────────────────────────────────────────────── */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} className="px-8 pb-8 flex flex-col gap-4" noValidate>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B3B3B3] pointer-events-none" />
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                  className="w-full bg-[#121212] border border-[#333333] focus:border-[#1DB954] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B3B3B3] pointer-events-none" />
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full bg-[#121212] border border-[#333333] focus:border-[#1DB954] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider">
                Senha <span className="normal-case font-normal">(mín. 6 caracteres)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B3B3B3] pointer-events-none" />
                <input
                  type={showSignupPass ? 'text' : 'password'}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full bg-[#121212] border border-[#333333] focus:border-[#1DB954] rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B3B3B3] hover:text-white transition-colors"
                  aria-label={showSignupPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B3B3B3] pointer-events-none" />
                <input
                  type={showSignupPass ? 'text' : 'password'}
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full bg-[#121212] border border-[#333333] focus:border-[#1DB954] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Error */}
            {signupError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={signupLoading}
              className="w-full mt-1 py-3 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] active:scale-[0.98] text-black font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {signupLoading ? (
                <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Criar Conta
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
