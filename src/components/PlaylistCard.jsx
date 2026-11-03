import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Music, Flame, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * PlaylistCard Component
 * Displays a playlist thumbnail with metadata, hover scale, and a Spotify-style green floating action button.
 *
 * @param {Object} props
 * @param {Object} props.playlist
 * @param {Function} [props.onEdit] - Optional callback to edit playlist
 */
export function PlaylistCard({ playlist, onEdit }) {
  const { users } = useApp();

  // Find creator name
  const creator = users.find((u) => u.id === playlist.createdBy);
  const creatorName = playlist.isMixGeral
    ? 'Spiritfy Live'
    : creator
    ? creator.name
    : 'Músico Convidado';

  const songCount = playlist.songs ? playlist.songs.length : 0;

  return (
    <Link
      to={`/playlists/${playlist.id}`}
      className="group relative flex flex-col bg-[#181818] hover:bg-[#282828] p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/60 border border-transparent hover:border-white/10"
    >
      {/* Cover Artwork Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 shadow-md bg-neutral-900 flex items-center justify-center">
        {playlist.imageUrl && !playlist.isMixGeral ? (
          <img
            src={playlist.imageUrl}
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // fallback to gradient if external image fails
              e.target.style.display = 'none';
            }}
          />
        ) : null}

        {/* Fallback gradient or Mix Geral artwork */}
        {(!playlist.imageUrl || playlist.isMixGeral) && (
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br ${
              playlist.gradient || 'from-emerald-700 via-teal-900 to-black'
            }`}
          >
            {playlist.isMixGeral ? (
              <div className="flex flex-col items-center">
                <Flame className="w-14 h-14 text-white drop-shadow-md animate-pulse mb-2" />
                <span className="text-xs uppercase tracking-widest font-extrabold text-white/90 bg-black/40 px-2 py-0.5 rounded-full">
                  Ao Vivo
                </span>
              </div>
            ) : (
              <Music className="w-12 h-12 text-white/70" />
            )}
          </div>
        )}

        {/* Floating Green Play Action Button */}
        <div className="absolute right-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out shadow-xl">
          <div className="w-12 h-12 rounded-full bg-spotify-green hover:bg-spotify-green-light flex items-center justify-center text-black font-bold transform hover:scale-105 transition-transform shadow-lg shadow-spotify-green/40">
            <Play className="w-6 h-6 fill-black ml-0.5" />
          </div>
        </div>

        {/* Badge for Mix Geral */}
        {playlist.isMixGeral && (
          <span className="absolute top-3 left-3 bg-spotify-green text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
            ★ Destaque
          </span>
        )}

        {/* Floating Edit Button (for non-mix playlists) */}
        {!playlist.isMixGeral && onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(playlist);
            }}
            title="Editar nome e capa"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-black border border-white/20 hover:border-spotify-green text-white hover:text-spotify-green flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl hover:scale-110 z-10"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Playlist Metadata */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-bold text-white text-base sm:text-lg truncate group-hover:text-spotify-green transition-colors">
            {playlist.name}
          </h4>
          <p className="text-xs sm:text-sm text-spotify-gray line-clamp-2 mt-1 leading-relaxed">
            {playlist.description || 'Playlist de músicas ao vivo.'}
          </p>
        </div>

        {/* Footer info: creator + song count */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs text-spotify-gray">
          <span className="truncate max-w-[65%] font-medium text-white/80">
            Por {creatorName}
          </span>
          <span className="font-semibold text-spotify-gray/90">
            {songCount} {songCount === 1 ? 'música' : 'músicas'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PlaylistCard;
