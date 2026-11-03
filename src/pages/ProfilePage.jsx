import React, { useMemo } from 'react';
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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import PlaylistCard from '../components/PlaylistCard';

/**
 * ProfilePage
 *
 * Shows the currently logged-in user's profile, their playlists,
 * live song request history, and an option to switch between registered
 * accounts (for demo/multi-user events).
 *
 * Also exposes the Logout button to end the session.
 */
export function ProfilePage() {
  const {
    currentUser,
    registeredUsers,
    switchUser,
    logout,
    playlists,
    userRequests,
    resetToDefaults,
  } = useApp();

  // Playlists owned by the current user
  const userPlaylists = useMemo(() => {
    if (!currentUser) return [];
    return playlists.filter((pl) => pl.createdBy === currentUser.id);
  }, [playlists, currentUser]);

  // Other confirmed accounts (exclude current user)
  const otherUsers = useMemo(() => {
    if (!registeredUsers) return [];
    return registeredUsers.filter(
      (u) => u.confirmed && u.id !== currentUser?.id
    );
  }, [registeredUsers, currentUser]);

  return (
    <div className="flex flex-col gap-10 pb-20">

      {/* ── Profile Header Banner ──────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#181818] via-[#202020] to-[#181818] border border-white/5 p-6 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6">

        {/* Avatar */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-800 border-2 border-spotify-green flex items-center justify-center text-5xl shadow-xl flex-shrink-0">
          {currentUser?.avatar ?? '👤'}
        </div>

        {/* User Details */}
        <div className="flex flex-col text-center sm:text-left flex-1">
          <span className="text-xs font-black uppercase tracking-wider text-spotify-green mb-1">
            Perfil Ativo
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentUser?.name}
          </h1>

          {/* Email with confirmation badge */}
          <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
            <Mail className="w-3.5 h-3.5 text-spotify-gray" />
            <span className="text-sm text-spotify-gray">{currentUser?.email}</span>
            {currentUser?.confirmed && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-spotify-green bg-spotify-green/10 border border-spotify-green/30 rounded-full px-2 py-0.5">
                <ShieldCheck className="w-3 h-3" />
                Verificado
              </span>
            )}
          </div>

          <p className="text-sm text-spotify-gray mt-1">{currentUser?.role}</p>

          {currentUser?.bio && (
            <p className="text-xs sm:text-sm text-spotify-gray/80 mt-2 max-w-xl italic">
              "{currentUser.bio}"
            </p>
          )}

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
          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/40 hover:bg-red-950/70 text-red-400 hover:text-red-300 text-xs font-semibold border border-red-500/20 hover:border-red-500/40 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair da Conta
          </button>

          {/* Reset demo data */}
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-spotify-gray hover:text-white transition-colors border border-white/5"
            title="Restaurar dados originais de demonstração"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Demo</span>
          </button>
        </div>
      </div>

      {/* ── Switch Account Section ─────────────────────────────────────────── */}
      {otherUsers.length > 0 && (
        <section className="bg-[#181818] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-spotify-green" />
              Alternar Conta
            </h2>
            <p className="text-xs sm:text-sm text-spotify-gray mt-1">
              Outras contas registradas neste dispositivo:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-[#1e1e1e] hover:border-white/20 hover:bg-[#222222] text-left transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center text-2xl flex-shrink-0">
                  {u.avatar}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-bold text-sm text-white truncate group-hover:text-spotify-green transition-colors">
                    {u.name}
                  </span>
                  <span className="text-xs text-spotify-gray truncate">{u.email}</span>
                </div>
                <LogOut className="w-4 h-4 text-spotify-gray group-hover:text-white rotate-180 transition-all flex-shrink-0" />
              </button>
            ))}
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

          <Link
            to="/playlists"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242424] hover:bg-[#333333] text-xs font-bold text-white transition-all"
          >
            <Plus className="w-4 h-4 text-spotify-green" />
            <span>Criar Playlist</span>
          </Link>
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
              <span>Criar Nova Playlist</span>
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
