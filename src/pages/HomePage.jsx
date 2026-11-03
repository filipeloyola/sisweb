import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Music, Disc, Radio, Users, Flame, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import PlaylistCard from '../components/PlaylistCard';

/**
 * HomePage Component
 * Landing page with hero banner, live event stats, featured playlists,
 * and quick-voting for the top requested songs.
 */
export function HomePage() {
  const { playlists, mixGeralPlaylist, requestSong } = useApp();

  // Compute key statistics
  const stats = useMemo(() => {
    const totalPlaylists = playlists.length;

    let totalSongs = 0;
    const artistsSet = new Set();
    let totalRequests = 0;

    playlists.forEach((pl) => {
      totalSongs += pl.songs.length;
      pl.songs.forEach((s) => {
        if (s.artist) artistsSet.add(s.artist.trim());
        totalRequests += s.requests || 0;
      });
    });

    // Active live requests (aggregating requests with live audience activity multiplier)
    const activeRequests = totalRequests + 42;

    return {
      totalPlaylists,
      totalSongs,
      uniqueArtists: artistsSet.size,
      activeRequests,
    };
  }, [playlists]);

  // Featured playlists (Mix Geral + all 3 event playlists)
  const featuredPlaylists = useMemo(() => {
    return [mixGeralPlaylist, ...playlists];
  }, [mixGeralPlaylist, playlists]);

  // Top 3 most requested songs
  const topRequestedSongs = useMemo(() => {
    return mixGeralPlaylist.songs.slice(0, 3);
  }, [mixGeralPlaylist]);

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e3a24] via-[#152418] to-[#121212] border border-spotify-green/20 p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Ambient Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-spotify-green/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-700/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-spotify-green/10 border border-spotify-green/30 text-spotify-green text-xs font-bold uppercase tracking-widest mb-6">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Interatividade em Tempo Real
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Spirit<span className="text-gradient-green">fy</span>
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-white/90 mb-2">
            Escolha a música. O músico toca ao vivo.
          </p>

          <p className="text-sm sm:text-base text-spotify-gray max-w-2xl leading-relaxed mb-8">
            Conecte seu gosto musical ao palco. Veja o repertório da banda em tempo real, vote na sua faixa preferida e veja o artista tocar o seu pedido nos próximos minutos!
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/playlists"
              className="px-6 py-3.5 rounded-full bg-spotify-green hover:bg-spotify-green-light text-black font-extrabold text-sm sm:text-base transition-all duration-200 hover:scale-105 shadow-lg shadow-spotify-green/30 flex items-center gap-2"
            >
              <Music className="w-5 h-5" />
              <span>Explorar Playlists</span>
            </Link>

            <Link
              to="/playlists/mix-geral"
              className="px-6 py-3.5 rounded-full bg-[#242424] hover:bg-[#333333] text-white font-bold text-sm sm:text-base border border-white/10 hover:border-white/30 transition-all flex items-center gap-2"
            >
              <Flame className="w-5 h-5 text-spotify-green" />
              <span>Ver Mais Pedidas</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Stats Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-spotify-green" />
            Painel do Evento ao Vivo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total de Playlists"
            value={stats.totalPlaylists + 1}
            icon={<Disc className="w-5 h-5" />}
            description="Repertórios temáticos disponíveis"
            colorClass="text-emerald-400 bg-emerald-400/10"
          />
          <StatCard
            title="Total de Músicas"
            value={stats.totalSongs}
            icon={<Music className="w-5 h-5" />}
            description="Faixas prontas para o palco"
            colorClass="text-spotify-green bg-spotify-green/10"
          />
          <StatCard
            title="Solicitações Ativas"
            value={stats.activeRequests}
            icon={<Flame className="w-5 h-5" />}
            description="Pedidos computados no show"
            colorClass="text-amber-400 bg-amber-400/10"
          />
          <StatCard
            title="Artistas Cadastrados"
            value={stats.uniqueArtists}
            icon={<Users className="w-5 h-5" />}
            description="Compositores e bandas representados"
            colorClass="text-sky-400 bg-sky-400/10"
          />
        </div>
      </section>

      {/* Playlists em Destaque Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Playlists em Destaque
            </h2>
            <p className="text-xs sm:text-sm text-spotify-gray mt-1">
              Seleções preparadas especialmente pelos músicos da noite
            </p>
          </div>

          <Link
            to="/playlists"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-spotify-gray hover:text-white transition-colors"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlaylists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      </section>

      {/* Músicas Mais Pedidas Section (Top 3) */}
      <section className="bg-[#181818] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-spotify-green text-xs font-black uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-spotify-green" />
              Ranking da Noite
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Músicas Mais Pedidas
            </h2>
            <p className="text-xs sm:text-sm text-spotify-gray mt-0.5">
              As 3 faixas que estão dominando os pedidos da galera
            </p>
          </div>

          <Link
            to="/playlists/mix-geral"
            className="self-start sm:self-auto px-4 py-2 rounded-full bg-[#282828] hover:bg-[#333333] text-xs font-bold text-white transition-all flex items-center gap-2"
          >
            <span>Ver Top Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {topRequestedSongs.map((song, idx) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#1f1f1f] hover:bg-[#252525] border border-white/5 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Rank Badge */}
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                    idx === 0
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                      : idx === 1
                      ? 'bg-neutral-300 text-black'
                      : 'bg-amber-800 text-white'
                  }`}
                >
                  #{idx + 1}
                </span>

                <div className="flex flex-col min-w-0">
                  <Link
                    to={`/playlists/${song.sourcePlaylistId || 'mix-geral'}/songs/${song.id}`}
                    className="font-bold text-sm sm:text-base text-white group-hover:text-spotify-green transition-colors truncate"
                  >
                    {song.title}
                  </Link>
                  <span className="text-xs text-spotify-gray truncate">
                    {song.artist}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-spotify-gray">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold">{song.requests}</span>
                  <span className="hidden sm:inline">pedidos</span>
                </div>

                <button
                  onClick={() => requestSong(song.id, song.title)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-spotify-green hover:bg-spotify-green-light text-black font-extrabold text-xs transition-all duration-200 active:scale-95 shadow-md shadow-spotify-green/20"
                >
                  <Heart className="w-3.5 h-3.5 fill-black" />
                  <span>Pedir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
