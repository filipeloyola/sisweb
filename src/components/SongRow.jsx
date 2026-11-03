import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Play, Clock, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * SongRow Component
 * Renders a single song item in a playlist table view with interactive request button.
 *
 * @param {Object} props
 * @param {number} props.index - Row index (0-based)
 * @param {Object} props.song - Song data object
 * @param {string} props.playlistId - ID of the playlist containing the song
 * @param {boolean} [props.isTopRank] - Highlights top requested songs
 */
export function SongRow({ index, song, playlistId, isTopRank }) {
  const navigate = useNavigate();
  const { requestSong } = useApp();

  const handleRowClick = () => {
    navigate(`/playlists/${playlistId}/songs/${song.id}`);
  };

  const handleRequestClick = (e) => {
    e.stopPropagation();
    requestSong(song.id, song.title);
  };

  return (
    <div
      onClick={handleRowClick}
      className="group grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[40px_1fr_120px_90px_150px] items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-white/5"
    >
      {/* Col 1: Index Number or Play Icon on Hover */}
      <div className="w-8 flex items-center justify-center text-sm font-semibold text-spotify-gray group-hover:text-white">
        <span className="group-hover:hidden">{index + 1}</span>
        <Play className="w-4 h-4 text-spotify-green fill-spotify-green hidden group-hover:block" />
      </div>

      {/* Col 2: Title & Artist */}
      <div className="flex flex-col min-w-0 pr-2">
        <span className="font-semibold text-sm sm:text-base text-white group-hover:text-spotify-green transition-colors truncate">
          {song.title}
        </span>
        <span className="text-xs sm:text-sm text-spotify-gray truncate group-hover:text-white/80">
          {song.artist}
        </span>
      </div>

      {/* Col 3: Requests count (Visible on larger screens) */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-medium">
        <Flame
          className={`w-4 h-4 ${
            song.requests > 15
              ? 'text-amber-400 fill-amber-400 animate-pulse'
              : 'text-spotify-gray'
          }`}
        />
        <span className="text-white font-bold">{song.requests || 0}</span>
        <span className="text-spotify-gray text-xs">pedidos</span>
      </div>

      {/* Col 4: Duration */}
      <div className="hidden sm:flex items-center gap-1 text-xs sm:text-sm text-spotify-gray justify-end">
        <Clock className="w-3.5 h-3.5 opacity-60" />
        <span>{song.duration || '3:30'}</span>
      </div>

      {/* Col 5: Action Button - 'Pedir ao vivo' */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleRequestClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 bg-[#282828] hover:bg-spotify-green text-white hover:text-black border border-white/10 hover:border-spotify-green shadow-sm active:scale-95 group/btn"
          title="Pedir para a banda tocar agora"
        >
          <Heart className="w-3.5 h-3.5 text-spotify-green group-hover/btn:text-black group-hover/btn:fill-black transition-colors" />
          <span className="hidden xs:inline">Pedir ao vivo</span>
          <span className="xs:hidden">Pedir</span>
        </button>
      </div>
    </div>
  );
}

export default SongRow;
