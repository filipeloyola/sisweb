import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Copy,
  Music,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Info,
  Layers,
  FileMusic,
} from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../context/AppContext';

/**
 * AddSongModal Component
 *
 * Suporta dois fluxos:
 * 1. "Buscar no Sistema (Clonar)": Consulta todas as músicas cadastradas em todas as playlists
 *    do sistema e permite cloná-las (cópia profunda com novo UUID exclusivo) para a playlist atual.
 * 2. "Cadastrar Nova Música": Cria uma nova música do zero.
 */
export function AddSongModal({ isOpen, onClose, playlist, initialTab = 'search' }) {
  const { playlists, mixGeralPlaylist, addSongToPlaylist, cloneSongToPlaylist, showToast } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab); // 'search' | 'create'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSongId, setExpandedSongId] = useState(null);
  const [cloningId, setCloningId] = useState(null);
  const [clonedSuccessIds, setClonedSuccessIds] = useState(new Set());

  // Form states for manual creation
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [duration, setDuration] = useState('3:30');
  const [lyrics, setLyrics] = useState('');
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  // Sync initialTab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery('');
      setClonedSuccessIds(new Set());
    }
  }, [isOpen, initialTab]);

  // Aggregate all unique songs across all playlists in the system for the search catalogue
  const systemSongs = useMemo(() => {
    const list = [];
    const seenMap = new Map(); // key: `${title.toLowerCase()}_${artist.toLowerCase()}_${playlistId}`

    const sourcePlaylists = (playlists && playlists.length > 0) ? playlists : (mixGeralPlaylist ? [mixGeralPlaylist] : []);

    sourcePlaylists.forEach((pl) => {
      (pl.songs || []).forEach((song) => {
        const key = `${(song.title || '').trim().toLowerCase()}:::${(song.artist || '').trim().toLowerCase()}:::${pl.id}`;
        if (!seenMap.has(key)) {
          seenMap.set(key, true);
          list.push({
            ...song,
            sourcePlaylistId: pl.id,
            sourcePlaylistName: pl.name,
          });
        }
      });
    });

    return list;
  }, [playlists, mixGeralPlaylist]);

  // Filter system songs based on search query
  const filteredSystemSongs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return systemSongs;

    return systemSongs.filter((s) => {
      const matchTitle = (s.title || '').toLowerCase().includes(q);
      const matchArtist = (s.artist || '').toLowerCase().includes(q);
      const matchLyrics = (s.lyrics || '').toLowerCase().includes(q);
      const matchPlaylist = (s.sourcePlaylistName || '').toLowerCase().includes(q);
      return matchTitle || matchArtist || matchLyrics || matchPlaylist;
    });
  }, [systemSongs, searchQuery]);

  // IDs of songs that already exist in the target playlist (by title + artist)
  const existingInCurrentPlaylist = useMemo(() => {
    const currentTitles = new Set(
      (playlist?.songs || []).map(
        (s) => `${(s.title || '').trim().toLowerCase()}:::${(s.artist || '').trim().toLowerCase()}`
      )
    );
    return currentTitles;
  }, [playlist?.songs]);

  // Action: Clone song to this playlist
  const handleCloneSong = async (sourceSong) => {
    if (!playlist?.id) return;
    setCloningId(sourceSong.id);

    try {
      const newSong = await cloneSongToPlaylist(playlist.id, sourceSong);
      if (newSong) {
        setClonedSuccessIds((prev) => new Set([...prev, sourceSong.id]));
        showToast(`Música "${sourceSong.title}" clonada com sucesso para ${playlist.name}!`, 'success');
      }
    } catch (err) {
      console.error('Erro ao clonar música:', err);
      showToast('Falha ao copiar música do sistema.', 'warning');
    } finally {
      setCloningId(null);
    }
  };

  // Action: Submit manual song
  const handleCreateManual = async (e) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    setIsSubmittingManual(true);
    const created = await addSongToPlaylist(playlist.id, {
      title: title.trim(),
      artist: artist.trim(),
      duration: duration.trim() || '3:30',
      lyrics: lyrics.trim() || 'Letra ainda não informada.',
    });
    setIsSubmittingManual(false);

    if (created) {
      setTitle('');
      setArtist('');
      setDuration('3:30');
      setLyrics('');
      onClose();
    }
  };

  const togglePreview = (id) => {
    setExpandedSongId((prev) => (prev === id ? null : id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar ao Repertório"
      subtitle={`Playlist de destino: ${playlist?.name || 'Repertório'}`}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-5">
        {/* Tab Selection */}
        <div className="flex p-1 bg-[#121212] rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'search'
                ? 'bg-spotify-green text-black shadow-md'
                : 'text-spotify-gray hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Buscar Música do Sistema</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-spotify-green text-black shadow-md'
                : 'text-spotify-gray hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Música</span>
          </button>
        </div>

        {/* TAB 1: Search & Clone */}
        {activeTab === 'search' && (
          <div className="flex flex-col gap-4">
            {/* Info Notice about Cloning architecture */}
            <div className="p-3 rounded-xl bg-spotify-green/10 border border-spotify-green/20 text-xs text-spotify-gray flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-spotify-green flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-white font-semibold">
                  Clonagem de Dados (Cópia Independente)
                </span>
                <span>
                  Ao reaproveitar uma música, o Spiritfy cria uma cópia nova e exclusiva para esta playlist.
                  Você poderá editar a cifra, o tom e a letra sem afetar a música original.
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-spotify-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, artista, playlist ou acorde..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#242424] border border-white/10 focus:border-spotify-green focus:outline-none text-sm text-white placeholder-spotify-gray transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-spotify-gray hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-spotify-gray px-1">
              <span>
                {filteredSystemSongs.length}{' '}
                {filteredSystemSongs.length === 1 ? 'música disponível' : 'músicas disponíveis no sistema'}
              </span>
              {searchQuery && (
                <span className="text-spotify-green font-medium">Filtrado por: "{searchQuery}"</span>
              )}
            </div>

            {/* Songs Results List */}
            <div className="max-h-[380px] overflow-y-auto flex flex-col gap-2 pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {filteredSystemSongs.length === 0 ? (
                <div className="py-10 text-center bg-[#1e1e1e] rounded-xl border border-white/5">
                  <Music className="w-8 h-8 text-spotify-gray mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-spotify-gray font-medium">
                    Nenhuma música encontrada no sistema para "{searchQuery}".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle(searchQuery);
                      setActiveTab('create');
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-spotify-green/20 hover:bg-spotify-green text-spotify-green hover:text-black text-xs font-bold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cadastrar "{searchQuery}" agora</span>
                  </button>
                </div>
              ) : (
                filteredSystemSongs.map((song) => {
                  const songKey = `${(song.title || '').trim().toLowerCase()}:::${(song.artist || '').trim().toLowerCase()}`;
                  const isAlreadyInPlaylist = existingInCurrentPlaylist.has(songKey);
                  const isJustCloned = clonedSuccessIds.has(song.id);
                  const isCloning = cloningId === song.id;
                  const isExpanded = expandedSongId === song.id;

                  return (
                    <div
                      key={`${song.id}-${song.sourcePlaylistId}`}
                      className="bg-[#242424] hover:bg-[#2a2a2a] border border-white/5 hover:border-white/10 rounded-xl p-3 sm:p-3.5 transition-all flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Song Info */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white truncate">
                              {song.title}
                            </span>
                            {isAlreadyInPlaylist && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-spotify-gray border border-white/10">
                                Já nesta playlist
                              </span>
                            )}
                            {isJustCloned && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-spotify-green/20 text-spotify-green border border-spotify-green/30 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Copiada!
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-spotify-gray mt-0.5 flex-wrap">
                            <span className="font-medium text-spotify-gray hover:text-white transition-colors">
                              {song.artist}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {song.duration || '3:30'}
                            </span>
                            <span>•</span>
                            <span className="text-[11px] text-spotify-green/90 bg-spotify-green/10 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                              {song.sourcePlaylistName || 'Repertório'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {song.lyrics && (
                            <button
                              type="button"
                              onClick={() => togglePreview(song.id)}
                              className="p-2 rounded-lg bg-[#181818] hover:bg-white/10 text-spotify-gray hover:text-white transition-colors text-xs flex items-center gap-1"
                              title="Visualizar trecho da cifra/letra"
                            >
                              <FileMusic className="w-3.5 h-3.5" />
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={isCloning}
                            onClick={() => handleCloneSong(song)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 ${
                              isJustCloned
                                ? 'bg-spotify-green/20 text-spotify-green border border-spotify-green/30'
                                : 'bg-spotify-green hover:bg-spotify-green-light text-black'
                            }`}
                            title="Clonar esta música para a playlist atual com ID independente"
                          >
                            {isCloning ? (
                              <span>Copiando...</span>
                            ) : isJustCloned ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copiada</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Chords Preview */}
                      {isExpanded && song.lyrics && (
                        <div className="mt-2 pt-2 border-t border-white/5 bg-[#181818] p-3 rounded-lg">
                          <div className="flex items-center justify-between text-[11px] text-spotify-gray mb-1">
                            <span className="font-semibold text-spotify-green">
                              Pré-visualização da Cifra / Letra:
                            </span>
                            <span>{song.lyrics.split('\n').length} linhas</span>
                          </div>
                          <pre className="font-mono text-xs text-white/90 whitespace-pre max-h-40 overflow-y-auto leading-relaxed select-text scrollbar-thin scrollbar-thumb-white/10">
                            {song.lyrics.slice(0, 500)}
                            {song.lyrics.length > 500 ? '\n[...]' : ''}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Modal Close */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-xs text-spotify-gray">
                Dica: Você pode copiar várias músicas sem fechar a busca.
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-[#242424] hover:bg-[#323232] text-xs font-bold text-white transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Create Manual Song */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateManual} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-spotify-gray uppercase tracking-wider mb-1.5">
                Título da Música *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Como Nossos Pais"
                className="w-full px-4 py-2.5 rounded-xl bg-[#242424] border border-white/10 focus:border-spotify-green focus:outline-none text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-spotify-gray uppercase tracking-wider mb-1.5">
                  Artista / Compositor *
                </label>
                <input
                  type="text"
                  required
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Ex: Elis Regina"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#242424] border border-white/10 focus:border-spotify-green focus:outline-none text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-spotify-gray uppercase tracking-wider mb-1.5">
                  Duração Estimada
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 4:15"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#242424] border border-white/10 focus:border-spotify-green focus:outline-none text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-spotify-gray uppercase tracking-wider mb-1.5">
                Cifra Completa e Letra (com acordes alinhados)
              </label>
              <textarea
                rows={6}
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Cole os acordes e a letra da música..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#242424] border border-white/10 focus:border-spotify-green focus:outline-none text-sm text-white resize-y font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-bold text-spotify-gray hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmittingManual || !title.trim() || !artist.trim()}
                className="px-6 py-2.5 rounded-full bg-spotify-green hover:bg-spotify-green-light disabled:opacity-50 text-black font-extrabold text-sm transition-all shadow-md"
              >
                {isSubmittingManual ? 'Salvando...' : 'Cadastrar Música'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default AddSongModal;
