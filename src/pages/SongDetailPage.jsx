import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  Heart,
  Flame,
  Clock,
  Radio,
  Music2,
  Share2,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Sliders,
  AlignLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Regex para identificar acordes musicais (Ex: A, C#m, F#m7, Bb9, G/B, C7M, D4(6))
const CHORD_REGEX = /^[A-G](#|b)?(m|maj|dim|aug|sus|add|M|7M)?[0-9]*(\/[A-G](#|b)?)?(\+|-)?(\([0-9]+\))?$/;

/**
 * Verifica se uma linha é de cifra ou indicação estrutural
 */
function isChordLine(line) {
  if (!line || !line.trim()) return false;
  const lower = line.toLowerCase();
  if (
    lower.includes('intro:') ||
    lower.includes('introdução:') ||
    lower.includes('tom:') ||
    lower.includes('capo') ||
    lower.startsWith('[intro')
  ) {
    return true;
  }

  // Remove caracteres comuns de notação musical para testar tokens
  const tokens = line.split(/\s+/).map((t) => t.replace(/[()[\],:.]/g, '')).filter(Boolean);
  if (tokens.length === 0) return false;

  const chordCount = tokens.filter((t) => CHORD_REGEX.test(t)).length;
  // Se pelo menos metade das palavras forem acordes válidos, é linha de cifra
  return chordCount / tokens.length >= 0.5;
}

function isSectionHeading(line) {
  const trimmed = line.trim();
  return (
    (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
    trimmed.startsWith('Refrão') ||
    trimmed.startsWith('(Refrão)') ||
    trimmed.startsWith('[Refrão]') ||
    trimmed.startsWith('(2x)') ||
    trimmed.startsWith('(BIS)')
  );
}

/**
 * SongDetailPage Component
 *
 * Exibição completa de Cifra + Letra estilo Cifra Club com alinhamento monoespaçado,
 * destaque de acordes em verde Spotify (#1DB954), controle de tamanho da fonte (A+/A-),
 * alternância Cifra/Letra, rolagem automática para palco e botão de pedidos ao vivo.
 */
export function SongDetailPage() {
  const { playlistId, songId } = useParams();
  const navigate = useNavigate();
  const { getSongById, requestSong, showToast } = useApp();

  // Mode: 'chords' (Cifra + Letra) ou 'lyrics' (Apenas Letra)
  const [viewMode, setViewMode] = useState('chords');
  // Font size in pixels for the chord viewer (12px to 22px)
  const [fontSize, setFontSize] = useState(14);
  // Copied feedback
  const [copied, setCopied] = useState(false);
  // Auto-scroll for stage performance
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollContainerRef = useRef(null);

  // Retrieve song and its source playlist
  const data = useMemo(() => {
    return getSongById(playlistId, songId);
  }, [getSongById, playlistId, songId]);

  // Efeito de auto-scroll suave para o palco
  useEffect(() => {
    let interval = null;
    if (isAutoScrolling && scrollContainerRef.current) {
      interval = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += 1;
        }
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoScrolling]);

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
      showToast('Link da música copiado!', 'info');
    }
  };

  const handleCopyChords = () => {
    if (navigator.clipboard && song.lyrics) {
      navigator.clipboard.writeText(song.lyrics);
      setCopied(true);
      showToast('Cifra e letra copiadas para a área de transferência!', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const lines = useMemo(() => {
    return (song.lyrics || '').split('\n');
  }, [song.lyrics]);

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
        <div className="bg-[#181818]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
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

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {song.title}
            </h1>

            <p className="text-base sm:text-xl font-bold text-spotify-green mt-1">
              {song.artist}
            </p>

            <p className="text-xs text-spotify-gray mt-2">
              Playlist de origem:{' '}
              <span className="text-white font-medium">{playlist?.name}</span>
            </p>
          </div>

          {/* Right Action: Requests Counter & Big Green Button */}
          <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/60 border border-amber-500/30 text-amber-400 text-sm font-bold shadow-inner">
              <Flame className="w-5 h-5 fill-amber-400 animate-pulse" />
              <span>{song.requests || 0} pedidos do público</span>
            </div>

            <button
              onClick={handleLiveRequest}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-spotify-green hover:bg-spotify-green-light text-black font-black text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl shadow-spotify-green/30 group"
            >
              <Heart className="w-5 h-5 fill-black group-hover:scale-125 transition-transform" />
              <span>♥ Pedir ao Vivo</span>
            </button>
          </div>
        </div>

        {/* Chords & Lyrics Viewer Container */}
        <div className="bg-[#181818]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-4">
          {/* Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            {/* View Mode Toggle: Cifra + Letra vs Somente Letra */}
            <div className="flex items-center bg-[#121212] rounded-xl p-1 border border-white/5">
              <button
                type="button"
                onClick={() => setViewMode('chords')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'chords'
                    ? 'bg-spotify-green text-black shadow-sm'
                    : 'text-spotify-gray hover:text-white'
                }`}
              >
                <Music2 className="w-3.5 h-3.5" />
                <span>Cifra + Letra</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('lyrics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'lyrics'
                    ? 'bg-spotify-green text-black shadow-sm'
                    : 'text-spotify-gray hover:text-white'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Somente Letra</span>
              </button>
            </div>

            {/* Utility Buttons: Font Size, Auto-Scroll, Copy */}
            <div className="flex items-center gap-2">
              {/* Font Size controls */}
              <div className="flex items-center bg-[#121212] rounded-xl p-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.max(11, s - 1))}
                  className="p-1.5 text-spotify-gray hover:text-white rounded-lg transition-colors"
                  title="Diminuir tamanho da fonte (A-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-2 text-spotify-gray font-bold">
                  {fontSize}px
                </span>
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                  className="p-1.5 text-spotify-gray hover:text-white rounded-lg transition-colors"
                  title="Aumentar tamanho da fonte (A+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Auto Scroll Toggle */}
              <button
                type="button"
                onClick={() => setIsAutoScrolling((s) => !s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isAutoScrolling
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-[#121212] text-spotify-gray hover:text-white border-white/5'
                }`}
                title="Rolar suavemente a tela para tocar no palco"
              >
                {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Auto-Rolagem</span>
              </button>

              {/* Copy Chord Sheet */}
              <button
                type="button"
                onClick={handleCopyChords}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121212] text-spotify-gray hover:text-white border border-white/5 text-xs font-semibold transition-colors"
                title="Copiar cifra completa"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-spotify-green" />
                    <span className="text-spotify-green">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copiar Cifra</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Rendered Chord Sheet */}
          <div
            ref={scrollContainerRef}
            className="max-h-[60vh] overflow-y-auto overflow-x-auto pr-3 scrollbar-thin scrollbar-thumb-white/10"
            style={{ fontSize: `${fontSize}px` }}
          >
            <pre className="font-mono leading-relaxed select-text whitespace-pre">
              {lines.map((line, idx) => {
                const isChord = isChordLine(line);
                const isHeading = isSectionHeading(line);

                // Se o modo for "Somente Letra", oculta as linhas puras de cifra
                if (viewMode === 'lyrics' && isChord) {
                  return null;
                }

                if (isHeading) {
                  return (
                    <div
                      key={idx}
                      className="font-bold text-amber-400 py-1 tracking-wide"
                    >
                      {line}
                    </div>
                  );
                }

                if (isChord) {
                  return (
                    <div
                      key={idx}
                      className="font-bold text-[#1DB954] tracking-wide"
                    >
                      {line || ' '}
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="text-white/90"
                  >
                    {line || ' '}
                  </div>
                );
              })}
            </pre>
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
