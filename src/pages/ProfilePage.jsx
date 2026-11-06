import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Music,
  Flame,
  RefreshCw,
  Plus,
  Clock,
  Disc,
  LogOut,
  Mail,
  ShieldCheck,
  Users,
  Crown,
  CheckCircle2,
  XCircle,
  UserCheck,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import PlaylistCard from '../components/PlaylistCard';

/**
 * ProfilePage Component
 *
 * Exibe o perfil do usuário, status de permissão de colaborador,
 * playlists criadas e o Painel do Administrador para gerenciar e aprovar colaboradores.
 */
export function ProfilePage() {
  const {
    currentUser,
    isAdmin,
    isApprovedCollaborator,
    approvedCollaborators,
    approveCollaborator,
    revokeCollaborator,
    registeredUsers,
    switchUser,
    logout,
    openAuthModal,
    playlists,
    userRequests,
    resetToDefaults,
  } = useApp();

  // Input state for Admin approving a new email
  const [newCollabEmail, setNewCollabEmail] = useState('');

  // Playlists owned by the current user
  const userPlaylists = useMemo(() => {
    if (!currentUser) return [];
    return playlists.filter((pl) => pl.createdBy === currentUser.id);
  }, [playlists, currentUser]);

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    if (!newCollabEmail.trim()) return;
    approveCollaborator(newCollabEmail.trim());
    setNewCollabEmail('');
  };

  // Se nenhum usuário estiver logado, exibe tela de boas-vindas para visitantes
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center text-3xl mb-4">
          👤
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Você está navegando como Visitante</h2>
        <p className="text-sm text-spotify-gray mb-6 leading-relaxed">
          O repertório do Spiritfy está totalmente aberto para o público. Você pode navegar pelas
          playlists, acompanhar letras e cifras, e pedir músicas ao vivo no palco.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-spotify-green hover:bg-spotify-green-light text-black font-extrabold text-sm transition-all hover:scale-105 shadow-lg shadow-spotify-green/20 flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Login de Colaborador / Banda</span>
          </button>
          <Link
            to="/playlists"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#242424] hover:bg-[#323232] text-white font-bold text-sm transition-all"
          >
            Ver Playlists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* ── Profile Header Banner ──────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#181818] via-[#202020] to-[#181818] border border-white/5 p-6 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-800 border-2 border-spotify-green flex items-center justify-center text-5xl shadow-xl flex-shrink-0">
          {currentUser.avatar ?? '👤'}
        </div>

        {/* User Details */}
        <div className="flex flex-col text-center sm:text-left flex-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-spotify-green">
              Perfil Ativo
            </span>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-950/40 border border-amber-500/30 rounded-full px-2.5 py-0.5">
                <Crown className="w-3 h-3" />
                Administrador Geral
              </span>
            ) : isApprovedCollaborator ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-spotify-green bg-spotify-green/10 border border-spotify-green/30 rounded-full px-2.5 py-0.5">
                <ShieldCheck className="w-3 h-3" />
                Colaborador Aprovado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-yellow-400 bg-yellow-950/40 border border-yellow-500/30 rounded-full px-2.5 py-0.5">
                <AlertTriangle className="w-3 h-3" />
                Aguardando Aprovação de Admin
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentUser.name}
          </h1>

          {/* Email with confirmation badge */}
          <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
            <Mail className="w-3.5 h-3.5 text-spotify-gray" />
            <span className="text-sm text-spotify-gray">{currentUser.email}</span>
            {currentUser.confirmed && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-spotify-green bg-spotify-green/10 border border-spotify-green/30 rounded-full px-2 py-0.5">
                <ShieldCheck className="w-3 h-3" />
                Confirmado
              </span>
            )}
          </div>

          <p className="text-sm text-spotify-gray mt-1">
            Permissões:{' '}
            <strong className="text-white">
              {isAdmin
                ? 'Total (Gerenciar músicas, playlists e aprovar colaboradores)'
                : isApprovedCollaborator
                ? 'Inserção e edição de músicas liberada'
                : 'Apenas visualização (Aguardando liberação do administrador)'}
            </strong>
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-spotify-gray">
            <span>
              <strong className="text-white">{userPlaylists.length}</strong> playlists criadas
            </span>
            <span>•</span>
            <span>
              <strong className="text-white">{userRequests.length}</strong> pedidos feitos
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 self-center sm:self-start">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/40 hover:bg-red-950/70 text-red-400 hover:text-red-300 text-xs font-semibold border border-red-500/20 hover:border-red-500/40 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair da Conta
          </button>

          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-spotify-gray hover:text-white transition-colors border border-white/5"
            title="Restaurar repertório original no Supabase"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Repertório</span>
          </button>
        </div>
      </div>

      {/* ── PAINEL DO ADMINISTRADOR (Apenas para Admin) ───────────────────────── */}
      {isAdmin && (
        <section className="bg-gradient-to-b from-[#1c1c1c] to-[#161616] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  Painel do Administrador
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Exclusivo
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-spotify-gray">
                  Aprove novos usuários para que possam cadastrar e editar músicas e playlists no evento.
                </p>
              </div>
            </div>
          </div>

          {/* Form para aprovar novo colaborador manualmente */}
          <form onSubmit={handleAddCollaborator} className="flex flex-col sm:flex-row gap-3 mb-6 pt-4 border-t border-white/10">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-spotify-gray" />
              <input
                type="email"
                required
                value={newCollabEmail}
                onChange={(e) => setNewCollabEmail(e.target.value)}
                placeholder="Digite o e-mail do colaborador (ex: novo@igreja.org)..."
                className="w-full bg-[#121212] border border-white/10 focus:border-spotify-green rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-spotify-gray outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-spotify-green hover:bg-spotify-green-light text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-spotify-green/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Aprovar Colaborador</span>
            </button>
          </form>

          {/* Lista de Colaboradores Atuais */}
          <div>
            <h3 className="text-xs font-bold text-spotify-gray uppercase tracking-wider mb-3">
              Colaboradores com Permissão Ativa ({approvedCollaborators.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {approvedCollaborators.map((email) => {
                const isMainAdmin = email.toLowerCase() === 'admin@spiritfy.app';
                const isFilipe = email.toLowerCase() === 'filipe@spiritfy.app';

                return (
                  <div
                    key={email}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#202020] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-sm flex-shrink-0">
                        {isMainAdmin ? '👑' : isFilipe ? '🎹' : '🎸'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white truncate">{email}</span>
                        <span className="text-[10px] text-spotify-gray">
                          {isMainAdmin ? 'Administrador' : isFilipe ? 'Colaborador Inicial' : 'Colaborador Aprovado'}
                        </span>
                      </div>
                    </div>

                    {!isMainAdmin && (
                      <button
                        onClick={() => revokeCollaborator(email)}
                        className="p-1.5 rounded-lg text-spotify-gray hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Revogar permissão de colaborador"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Suas Playlists Section ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-spotify-green" />
              Suas Playlists
            </h2>
            <p className="text-xs sm:text-sm text-spotify-gray mt-1">
              Repertórios criados por {currentUser?.name}
            </p>
          </div>

          {isApprovedCollaborator && (
            <Link
              to="/playlists"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242424] hover:bg-[#333333] text-xs font-bold text-white transition-all"
            >
              <Plus className="w-4 h-4 text-spotify-green" />
              <span>Criar Playlist</span>
            </Link>
          )}
        </div>

        {userPlaylists.length === 0 ? (
          <div className="p-8 text-center bg-[#181818] border border-white/5 rounded-3xl">
            <Disc className="w-12 h-12 text-spotify-gray opacity-40 mx-auto mb-3" />
            <h4 className="font-bold text-white mb-1">Nenhuma playlist própria ainda</h4>
            <p className="text-xs sm:text-sm text-spotify-gray mb-4">
              Crie seu próprio conjunto de faixas para o repertório do palco!
            </p>
            <Link
              to="/playlists"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-spotify-green text-black font-extrabold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Ver Todas as Playlists</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPlaylists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        )}
      </section>

      {/* ── Histórico de Pedidos ──────────────────────────────────────────── */}
      <section className="bg-[#181818] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
              Histórico de Pedidos ao Vivo
            </h2>
            <p className="text-xs sm:text-sm text-spotify-gray mt-1">
              Músicas solicitadas recentemente nesta sessão
            </p>
          </div>
        </div>

        {userRequests.length === 0 ? (
          <div className="p-8 text-center bg-[#1f1f1f] rounded-2xl border border-white/5">
            <p className="text-sm text-spotify-gray">
              Você ainda não pediu nenhuma música hoje. Explore as playlists e envie seu pedido aos músicos!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {userRequests.slice(0, 10).map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#202020] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-spotify-green/10 text-spotify-green">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate">{req.songTitle}</span>
                    <span className="text-xs text-spotify-gray truncate">
                      {req.artist} • por {req.userName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-spotify-gray flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(req.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
