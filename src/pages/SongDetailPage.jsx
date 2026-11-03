import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home, Heart, Flame, Clock, Radio, Music2, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * SongDetailPage Component
 * Immersive, full-screen view showcasing the song lyrics, live request counter,
 * and high-visibility action button for live audience interaction.
 */
export function SongDetailPage() {
  const { playlistId, songId } = useParams();
  const navigate = useNavigate();
  const { getSongById, requestSong, showToast } = useApp();

  // Retrieve song and its source playlist
  const data = useMemo(() => {
    return getSongById(playlistId, songId);
  }, [getSongById, playlistId, songId]);

  if (!data || !data.song) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Música não encontrada</h2>
        <p className="text-spotify-gray mb-6">Esta faixa pode ter sido removida ou o link é inválido.</p>
        <button
          onClick={() => navigate('/playlists')}
          className="px-6 py-2.5 rounded-full bg-spotify-green text-black font-bold text-sm"
        >
          Voltar às Playlists
        </button>
      </div>
    );
  }

  const { song, playlist } = data;

  const handleLiveRequest = () => {
    requestSong(song.id, song.title);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link da música copiado para compartilhar!', 'info');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)] -m-4 sm:-m-8 p-4 sm:p-8 overflow-hidden flex flex-col justify-between">
      {/* Immersive Atmospheric Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {playlist?.imageUrl ? (
          <img
            src={playlist.imageUrl}
            alt=""
            className="w-full h-full object-cover filter blur-3xl opacity-20 scale-125 transform"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-tr ${
              playlist?.gradient || 'from-emerald-950 via-neutral-900 to-black'
            } opacity-50 blur-2xl`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/70 via-[#121212]/90 to-[#121212]" />
      </div>

      {/* Main Foreground Content */}
      <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between py-2">
          <button
            onClick={() => navigate(`/playlists/${playlistId}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-semibold text-spotify-gray hover:text-white transition-all group border border-white/5"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar à Playlist</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-spotify-gray hover:text-white transition-colors"
              title="Compartilhar música"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-semibold text-spotify-gray hover:text-white transition-all border border-white/5"
            >
              <Home className="w-4 h-4" />
              <span>Início</span>
            </Link>
          </div>
        </div>

        {/* Hero Title & Artist Card */}
        <div className="bg-[#181818]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-spotify-green/10 border border-spotify-green/30 text-spotify-green text-xs font-bold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                No Palco Ao Vivo
              </span>
              <span className="text-xs text-spotify-gray flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {song.duration || '3:30'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {song.title}
            </h1>

            <p className="text-lg sm:text-xl font-bold text-spotify-green mt-1">
              {song.artist}
            </p>

            <p className="text-xs text-spotify-gray mt-2">
              Playlist de origem:{' '}
              <span className="text-white font-medium">{playlist?.name}</span>
            </p>
          </div>

          {/* Right Action: Requests Counter & Big Green Button */}
          <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/50 border border-amber-500/20 text-amber-400 text-sm font-bold shadow-inner">
              <Flame className="w-5 h-5 fill-amber-400 animate-pulse" />
              <span>{song.requests || 0} pedidos do público</span>
            </div>

            <button
              onClick={handleLiveRequest}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-spotify-green hover:bg-spotify-green-light text-black font-black text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl shadow-spotify-green/30 group"
            >
              <Heart className="w-6 h-6 fill-black group-hover:scale-125 transition-transform" />
              <span>♥ Pedir ao Vivo</span>
            </button>
          </div>
        </div>

        {/* Lyrics Section */}
        <div className="bg-[#181818]/70 backdrop-blur-lg border border-white/5 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
              <Music2 className="w-5 h-5 text-spotify-green" />
              Letra da Canção
            </h3>
            <span className="text-xs text-spotify-gray">
              Acompanhe e cante junto com o artista
            </span>
          </div>

          <div className="max-h-[50vh] overflow-y-auto pr-3 font-medium text-base sm:text-lg leading-relaxed text-spotify-gray/95 whitespace-pre-line selection:bg-spotify-green selection:text-black">
            {song.lyrics || 'Letra ainda não cadastrada para esta música.'}
          </div>
        </div>
      </div>

      {/* Bottom Sticky CTA (Mobile friendly) */}
      <div className="sticky bottom-4 z-20 mt-6 max-w-md mx-auto w-full md:hidden">
        <button
          onClick={handleLiveRequest}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-spotify-green text-black font-extrabold text-sm shadow-2xl active:scale-95 transition-transform"
        >
          <Heart className="w-4 h-4 fill-black" />
          <span>Pedir para tocar agora ({song.requests || 0})</span>
        </button>
      </div>
    </div>
  );
}

export default SongDetailPage;
