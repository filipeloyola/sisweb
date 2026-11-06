import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, LogOut, UserCheck, Shield, Crown, Music2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Navbar Component
 * Barra superior fixa com identidade Spiritfy, indicador do palco ao vivo,
 * botão discreto de "Login / Colaborador" para visitantes e status do usuário logado.
 */
export function Navbar() {
  const { currentUser, logout, openAuthModal, isAdmin, isApprovedCollaborator } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[#121212]/95 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 flex items-center justify-between transition-all">
      {/* Brand Logo & Live Badge */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-spotify-dark border border-white/10 flex items-center justify-center p-0.5 group-hover:border-spotify-green transition-colors">
            <img
              src="/logo.jpeg"
              alt="Spiritfy Logo"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-spotify-green transition-colors flex items-center gap-1">
            Spiritfy
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spotify-green" />
          </span>
        </Link>

        {/* Live Event Stage Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <Radio className="w-3.5 h-3.5" />
          <span>PALCO AO VIVO</span>
        </div>
      </div>

      {/* Right side: Public Visitor Login CTA or Authenticated User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {!currentUser ? (
          /* Botão discreto para visitantes / colaboradores */
          <button
            onClick={openAuthModal}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#181818] hover:bg-[#252525] border border-white/10 hover:border-spotify-green/50 text-white font-semibold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-sm group"
          >
            <UserCheck className="w-4 h-4 text-spotify-green group-hover:scale-110 transition-transform" />
            <span>Login / Colaborador</span>
          </button>
        ) : (
          /* Usuário Autenticado */
          <>
            <Link
              to="/profile"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#181818] hover:bg-[#282828] border border-white/10 hover:border-spotify-green/50 transition-all text-sm font-medium group"
              title="Ver meu perfil e permissões"
            >
              <span className="text-lg leading-none" role="img" aria-label="avatar">
                {currentUser?.avatar ?? '👤'}
              </span>
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-spotify-green transition-colors truncate max-w-[120px] sm:max-w-none">
                  {currentUser?.name ?? 'Perfil'}
                </span>
                <span className="text-[10px] text-spotify-gray flex items-center gap-1">
                  {isAdmin ? (
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      <Crown className="w-2.5 h-2.5 inline" /> Admin
                    </span>
                  ) : isApprovedCollaborator ? (
                    <span className="text-spotify-green font-bold flex items-center gap-0.5">
                      <Music2 className="w-2.5 h-2.5 inline" /> Colaborador
                    </span>
                  ) : (
                    <span className="text-yellow-500">Pendente</span>
                  )}
                </span>
              </div>
            </Link>

            {/* Logout button */}
            <button
              onClick={logout}
              title="Sair da conta"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181818] hover:bg-red-950/60 border border-white/10 hover:border-red-500/40 text-[#B3B3B3] hover:text-red-400 transition-all text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
