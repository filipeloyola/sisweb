import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Clock, Music, Flame, Sparkles, Search, User, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SongRow from '../components/SongRow';
import EditPlaylistModal from '../components/EditPlaylistModal';
import AddSongModal from '../components/AddSongModal';
import EditSongModal from '../components/EditSongModal';

/**
 * Helper to calculate total duration in "X min Y seg" format
 * @param {Array<{duration?: string}>} songs
 */
function calculateTotalDuration(songs) {
  if (!songs || songs.length === 0) return '0 min';

  let totalSeconds = 0;
  songs.forEach((s) => {
    if (!s.duration) return;
    const parts = s.duration.split(':').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      totalSeconds += parts[0] * 60 + parts[1];
    }
  });

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} seg`;
  }
  return remainingSeconds > 0 ? `${minutes} min ${remainingSeconds} s` : `${minutes} min`;
}

/**
 * PlaylistDetailPage Component
 * Detailed view of a playlist with songs list, header stats, search filter,
 * and a modal to append new songs to the playlist repertoire.
 */
export function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPlaylistById, users, canEdit, openAuthModal, showToast } = useApp();

  const playlist = getPlaylistById(id);

  // Search filter inside playlist
  const [songSearch, setSongSearch] = useState('');

  // Add / Search Song Modal state
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [addSongTab, setAddSongTab] = useState('search');

  // Edit Song Modal state (independent editing for this playlist's clone)
  const [isEditSongModalOpen, setIsEditSongModalOpen] = useState(false);
  const [songToEdit, setSongToEdit] = useState(null);

  // Edit Playlist Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    if (!canEdit) {
      showToast('Apenas colaboradores aprovados pelo administrador podem editar a playlist.', 'info');
      openAuthModal();
      return;
    }
    setIsEditModalOpen(true);
  };

  const handleOpenAddSongModal = (tab = 'search') => {
    if (!canEdit) {
      showToast('Apenas colaboradores aprovados pelo administrador podem adicionar músicas.', 'info');
      openAuthModal();
      return;
    }
    setAddSongTab(tab);
    setIsAddSongModalOpen(true);
  };

  const handleOpenEditSong = (song) => {
    if (!canEdit) {
      showToast('Apenas colaboradores aprovados podem editar músicas.', 'info');
      return;
    }
    setSongToEdit(song);
    setIsEditSongModalOpen(true);
  };

  // Compute creator info
  const creator = useMemo(() => {
    if (!playlist) return null;
    return (users || []).find((u) => u.id === playlist.createdBy);
  }, [playlist, users]);

  const totalDuration = useMemo(() => {
    return calculateTotalDuration(playlist?.songs);
  }, [playlist?.songs]);

  // Filtered songs
  const filteredSongs = useMemo(() => {
    if (!playlist || !playlist.songs) return [];
    const q = songSearch.toLowerCase().trim();
    if (!q) return playlist.songs;

    return playlist.songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.lyrics && s.lyrics.toLowerCase().includes(q))
    );
  }, [playlist, songSearch]);

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Playlist não encontrada</h2>
        <p className="text-spotify-gray mb-6">A playlist selecionada não existe ou foi removida.</p>
        <Link
          to="/playlists"
          className="px-6 py-2.5 rounded-full bg-spotify-green text-black font-bold text-sm"
        >
          Voltar para Playlists
        </Link>
      </div>
    );
  }

  const isMixGeral = playlist.id === 'mix-geral';

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/playlists')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-spotify-gray hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar às Playlists</span>
        </button>

        {/* Apenas usuários autorizados veem botões de edição de playlist e adição/busca de música */}
        {!isMixGeral && canEdit && (
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
            <button
              onClick={handleOpenEditModal}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#242424] hover:bg-[#323232] border border-white/10 text-white font-bold text-xs sm:text-sm transition-all hover:scale-105"
              title="Editar nome e capa da playlist"
            >
              <Pencil className="w-3.5 h-3.5 text-spotify-green" />
              <span>Editar Playlist</span>
            </button>

            <button
              onClick={() => handleOpenAddSongModal('search')}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#242424] hover:bg-[#323232] border border-spotify-green/40 hover:border-spotify-green text-white font-bold text-xs sm:text-sm transition-all hover:scale-105 shadow-sm"
              title="Buscar e clonar músicas já cadastradas no sistema"
            >
              <Search className="w-3.5 h-3.5 text-spotify-green" />
              <span>Buscar música do sistema</span>
            </button>

            <button
              onClick={() => handleOpenAddSongModal('create')}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-spotify-green hover:bg-spotify-green-light text-black font-extrabold text-xs sm:text-sm transition-all hover:scale-105 shadow-md shadow-spotify-green/20"
              title="Cadastrar uma nova música do zero nesta playlist"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Música</span>
            </button>
          </div>
        )}
      </div>

      {/* Playlist Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#282828] to-[#181818] border border-white/5 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute -top-16 -left-16 w-80 h-80 bg-spotify-green/10 rounded-full blur-3xl pointer-events-none" />

        {/* Cover Artwork (Interactive on hover if editable) */}
        <div
          onClick={() => !isMixGeral && canEdit && setIsEditModalOpen(true)}
          className={`relative group w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 bg-neutral-900 border border-white/10 ${
            !isMixGeral && canEdit ? 'cursor-pointer' : ''
          }`}
          title={!isMixGeral && canEdit ? 'Clique para alterar nome e capa da playlist' : ''}
        >
          {playlist.imageUrl && !isMixGeral ? (
            <img
              src={playlist.imageUrl}
              alt={playlist.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${
                playlist.gradient || 'from-emerald-600 via-green-700 to-teal-950'
              }`}
            >
              {isMixGeral ? (
                <>
                  <Flame className="w-16 h-16 text-white drop-shadow mb-2 animate-bounce" />
                  <span className="text-xs uppercase font-extrabold text-white/90 bg-black/40 px-2.5 py-1 rounded-full">
                    Mix Geral
                  </span>
                </>
              ) : (
                <Music className="w-16 h-16 text-white/80" />
              )}
            </div>
          )}

          {/* Spotify-style hover overlay to edit artwork (somente se puder editar) */}
          {!isMixGeral && canEdit && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 text-white">
              <div className="p-3 rounded-full bg-white/10 border border-white/20">
                <Pencil className="w-5 h-5 text-spotify-green" />
              </div>
              <span className="text-xs font-bold tracking-wide">Alterar Capa</span>
            </div>
          )}
        </div>

        {/* Metadata Details */}
        <div className="flex flex-col flex-1 text-center md:text-left z-10">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-spotify-green bg-spotify-green/10 px-3 py-1 rounded-full border border-spotify-green/20">
              {isMixGeral ? 'Repertório Geral do Evento' : 'Playlist ao Vivo'}
            </span>
            {isMixGeral && (
              <span className="text-[11px] font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/20">
                Mais Pedidas
              </span>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {playlist.name}
            </h1>
            {!isMixGeral && canEdit && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 text-spotify-gray hover:text-spotify-green transition-colors"
                title="Editar playlist"
              >
                <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm text-spotify-gray max-w-2xl mb-4 leading-relaxed">
            {playlist.description}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-xs font-semibold text-white/90">
            <div className="flex items-center gap-1.5 text-spotify-gray">
              <User className="w-3.5 h-3.5 text-spotify-green" />
              <span>
                Criado por <strong className="text-white">{isMixGeral ? 'Spiritfy Live' : creator ? creator.name : 'Músico Convidado'}</strong>
              </span>
            </div>
            <span>•</span>
            <span>{playlist.songs?.length || 0} músicas</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-spotify-gray">
              <Clock className="w-3.5 h-3.5" />
              {totalDuration}
            </span>
          </div>
        </div>
      </div>

      {/* Playlist Content & Search Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Music className="w-4 h-4 text-spotify-green" />
            Músicas Disponíveis ({filteredSongs.length})
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-spotify-gray absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={songSearch}
              onChange={(e) => setSongSearch(e.target.value)}
              placeholder="Buscar música, artista ou letra..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#1e1e1e] border border-white/10 focus:border-spotify-green focus:outline-none text-xs text-white placeholder-spotify-gray transition-colors"
            />
          </div>
        </div>

        {/* Songs List Table Header */}
        <div className="hidden sm:grid grid-cols-[40px_1fr_120px_90px_150px] gap-4 px-4 py-2 border-b border-white/10 text-xs font-bold text-spotify-gray uppercase tracking-wider">
          <span className="text-center">#</span>
          <span>Título / Artista</span>
          <span>Interações</span>
          <span className="text-right">Duração</span>
          <span className="text-right pr-3">Ação</span>
        </div>

        {/* Songs Rows */}
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12 bg-[#181818] rounded-2xl border border-white/5">
            <p className="text-sm text-spotify-gray">
              Nenhuma música encontrada com este critério de busca.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filteredSongs.map((song, index) => (
              <SongRow
                key={song.id}
                index={index}
                song={song}
                playlistId={playlist.id}
                isTopRank={index < 3}
                onEdit={canEdit && !isMixGeral ? handleOpenEditSong : null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal: Adicionar / Buscar Música do Sistema */}
      <AddSongModal
        isOpen={isAddSongModalOpen}
        onClose={() => setIsAddSongModalOpen(false)}
        playlist={playlist}
        initialTab={addSongTab}
      />

      {/* Modal: Editar Música & Cifra Independente */}
      <EditSongModal
        isOpen={isEditSongModalOpen}
        onClose={() => {
          setIsEditSongModalOpen(false);
          setSongToEdit(null);
        }}
        song={songToEdit}
        playlistId={playlist.id}
        playlistName={playlist.name}
      />

      {/* Modal: Editar Playlist */}
      <EditPlaylistModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        playlist={playlist}
      />
    </div>
  );
}

export default PlaylistDetailPage;
