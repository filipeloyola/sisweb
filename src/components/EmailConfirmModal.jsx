import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, X, Inbox, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * EmailConfirmModal
 *
 * Simulates the "verify your e-mail" step after registration.
 * The modal shows a mock inbox notification with the confirmation
 * token. When the user clicks "Simular Clique no Link de Confirmação",
 * the account is activated and the user is automatically logged in.
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen
 * @param {Function} props.onClose     - Called when user dismisses before confirming
 * @param {string}   props.userId
 * @param {string}   props.token       - Simulated verification token
 * @param {string}   props.email       - Recipient address shown in the mock inbox
 * @param {string}   props.name        - User's display name
 */
export function EmailConfirmModal({ isOpen, onClose, userId, token, email, name }) {
  const { confirmEmail } = useApp();

  // Drives the two-step animation: 'inbox' → 'confirmed'
  const [step, setStep] = useState('inbox');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setLoading(true);
    // Small delay to simulate a network round-trip feel
    setTimeout(() => {
      const ok = confirmEmail(userId, token);
      setLoading(false);
      if (ok) {
        setStep('confirmed');
        // The parent will hide this modal once currentUser is set;
        // we auto-close after a short celebration moment.
        setTimeout(() => {
          if (onClose) onClose();
        }, 2200);
      }
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-md bg-[#181818] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1DB954] via-sky-400 to-[#1DB954]" />

        {/* Close button (only shown before confirmation) */}
        {step === 'inbox' && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#B3B3B3] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="px-8 py-8">

          {/* ── STEP 1: Inbox simulation ────────────────────────────────── */}
          {step === 'inbox' && (
            <div className="flex flex-col items-center text-center gap-6">

              {/* Icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-sky-950/60 border border-sky-500/30 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-sky-400" />
                </div>
                {/* New message dot */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1DB954] rounded-full border-2 border-[#181818] flex items-center justify-center text-[10px] font-black text-black">
                  1
                </span>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-white">Confirme seu e-mail</h2>
                <p className="text-sm text-[#B3B3B3] mt-2 leading-relaxed">
                  Um e-mail de ativação foi enviado para{' '}
                  <strong className="text-white">{email}</strong>.<br />
                  Por favor, clique no link de confirmação para ativar sua conta.
                </p>
              </div>

              {/* Simulated inbox card */}
              <div className="w-full bg-[#121212] border border-[#333] rounded-xl overflow-hidden">
                {/* Fake email client toolbar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border-b border-[#282828]">
                  <Inbox className="w-4 h-4 text-[#B3B3B3]" />
                  <span className="text-xs font-semibold text-[#B3B3B3]">Caixa de Entrada</span>
                  <span className="ml-auto text-[10px] bg-[#1DB954]/20 text-[#1DB954] font-bold px-2 py-0.5 rounded-full">
                    1 nova
                  </span>
                </div>

                {/* The simulated e-mail row */}
                <div className="flex items-start gap-3 p-4">
                  <div className="w-8 h-8 rounded-full bg-[#1DB954]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm">🎵</span>
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">Spiritfy</span>
                      <span className="text-[10px] text-[#555]">agora</span>
                    </div>
                    <span className="text-xs font-semibold text-white truncate">
                      Ative sua conta, {name}! 🎸
                    </span>
                    <p className="text-[11px] text-[#B3B3B3] leading-relaxed mt-1">
                      Olá <strong className="text-white">{name}</strong>, obrigado por se cadastrar no Spiritfy!
                      Clique no botão abaixo para confirmar seu endereço de e-mail e começar a pedir músicas ao vivo.
                    </p>

                    {/* Token display */}
                    <div className="mt-3 p-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-center">
                      <p className="text-[10px] text-[#555] mb-1 uppercase tracking-wider">
                        Código de ativação
                      </p>
                      <code className="text-base font-black tracking-[0.25em] text-[#1DB954]">
                        {token}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] active:scale-[0.98] text-black font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#1DB954]/20"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Simular Clique no Link de Confirmação
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-[#555] -mt-2">
                Não recebeu? Verifique sua pasta de spam ou{' '}
                <button
                  type="button"
                  className="text-[#1DB954] hover:underline"
                  onClick={handleConfirm}
                >
                  reenviar e-mail
                </button>
                .
              </p>
            </div>
          )}

          {/* ── STEP 2: Success / Celebration ───────────────────────────── */}
          {step === 'confirmed' && (
            <div className="flex flex-col items-center text-center gap-5 py-4">
              <div className="w-24 h-24 rounded-full bg-[#1DB954]/15 border-2 border-[#1DB954]/40 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-[#1DB954]" />
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                    Conta Ativada!
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  Bem-vindo(a), {name}! 🎉
                </h2>
                <p className="text-sm text-[#B3B3B3] mt-3 leading-relaxed">
                  Sua conta foi confirmada com sucesso.<br />
                  Você já está logado e pode começar a pedir músicas ao vivo!
                </p>
              </div>

              <div className="w-full h-1 rounded-full bg-[#282828] overflow-hidden">
                <div className="h-full bg-[#1DB954] rounded-full animate-[expand_2.2s_ease-in-out_forwards]" />
              </div>
              <p className="text-xs text-[#555]">Redirecionando para o app…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmModal;
