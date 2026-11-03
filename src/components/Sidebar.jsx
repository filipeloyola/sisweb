import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Music, User, Flame, PlusCircle, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Sidebar Component
 * Fixed left navigation bar with active route highlighting, Spotify-inspired aesthetics,
 * and quick access to live event playlists.
 */
export function Sidebar() {
  const { playlists, mixGeralPlaylist } = useApp();

  const navLinks = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/playlists', label: 'Playlists', icon: Music },
    { to: '/profile', label: 'Perfil', icon: User },
  ];

  return (
    <>
      {/* Desktop / Tablet Sidebar (Fixed Left) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#121212] border-r border-[#242424] h-[calc(100vh-4rem)] sticky top-16 p-4 gap-6 select-none">
        {/* Main Navigation Links */}
        <nav className="flex flex-col gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#282828] text-spotify-green shadow-sm'
                      : 'text-spotify-gray hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Live Mix Quick Access */}
        <div className="pt-2">
          <Link
            to="/playlists/mix-geral"
            className="group flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-black/80 border border-emerald-500/20 hover:border-spotify-green transition-all shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-spotify-green text-black">
                <Flame className="w-4 h-4 fill-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white group-hover:text-spotify-green transition-colors">
                  Mix Geral
                </span>
                <span className="text-[11px] text-spotify-gray">
                  Mais Pedidas ao Vivo
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-spotify-green bg-spotify-green/10 px-2 py-0.5 rounded-full">
              HOT
            </span>
          </Link>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#282828]" />

        {/* Playlists Quick List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-bold tracking-wider text-spotify-gray uppercase">
              Repertório do Evento
            </span>
            <Link
              to="/playlists"
              className="text-[11px] text-spotify-green hover:underline font-semibold"
            >
              Ver todas
            </Link>
          </div>

          {playlists.map((pl) => (
            <NavLink
              key={pl.id}
              to={`/playlists/${pl.id}`}
              className={({ isActive }) =>
                `text-xs py-2 px-3 rounded-lg truncate transition-colors ${
                  isActive
                    ? 'text-spotify-green font-bold bg-white/5'
                    : 'text-spotify-gray hover:text-white'
                }`
              }
              title={pl.name}
            >
              {pl.name}
            </NavLink>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 rounded-xl bg-[#181818] border border-white/5 text-[11px] text-spotify-gray flex items-center gap-2">
          <Radio className="w-4 h-4 text-spotify-green animate-pulse" />
          <span>Interatividade ao vivo com a banda no palco.</span>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-lg border-t border-white/10 px-6 py-2 flex items-center justify-around">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                  isActive ? 'text-spotify-green' : 'text-spotify-gray hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </NavLink>
          );
        })}
        <NavLink
          to="/playlists/mix-geral"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
              isActive ? 'text-spotify-green' : 'text-spotify-gray hover:text-white'
            }`
          }
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Mix Geral</span>
        </NavLink>
      </nav>
    </>
  );
}

export default Sidebar;
