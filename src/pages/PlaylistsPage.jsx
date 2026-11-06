import React, { useState, useMemo } from 'react';
import { Plus, Search, Music, Disc } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PlaylistCard from '../components/PlaylistCard';
import Modal from '../components/Modal';
import EditPlaylistModal from '../components/EditPlaylistModal';

// Preset gradient/image options for creating new playlists
const PRESET_COVERS = [
  {
    name: 'Neon Violet',
    gradient: 'from-purple-900 via-indigo-900 to-black',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Acoustic Amber',
    gradient: 'from-amber-800 via-orange-950 to-black',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Samba Emerald',
    gradient: 'from-emerald-900 via-teal-950 to-black',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Midnight Electric',
    gradient: 'from-blue-900 via-cyan-950 to-black',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  },
];

/**
 * PlaylistsPage Component
 * Displays a gallery of all event playlists with the dynamic "Mix Geral" leading the grid,
 * plus search filtering and a modal to create new custom playlists.
 */
export function PlaylistsPage() {
  const { playlists, mixGeralPlaylist, addPlaylist, canEdit, openAuthModal, showToast } = useApp();

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // New Playlist Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Edit Playlist state
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(PRESET_COVERS[0]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const handleOpenCreateModal = () => {
    if (!canEdit) {
      showToast(
        'Apenas colaboradores aprovados pelo administrador podem criar playlists.',
        'info'
      );
      openAuthModal();
      return;
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pl) => {
    if (!canEdit) {
      showToast(
        'Apenas colaboradores aprovados pelo administrador podem editar playlists.',
        'info'
      );
      openAuthModal();
      return;
    }
    setEditingPlaylist(pl);
  };

  // Filtered playlists
  const displayPlaylists = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return [mixGeralPlaylist, ...playlists];
    }

    const matchesMix =
      mixGeralPlaylist.name.toLowerCase().includes(q) ||
      mixGeralPlaylist.description.toLowerCase().includes(q);

    const filtered = playlists.filter(
      (pl) =>
        pl.name.toLowerCase().includes(q) ||
        (pl.description && pl.description.toLowerCase().includes(q))
    );

    return matchesMix ? [mixGeralPlaylist, ...filtered] : filtered;
  }, [playlists, mixGeralPlaylist, searchQuery]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const created = await addPlaylist({
      name: name.trim(),
      description: description.trim(),
      imageUrl: customImageUrl.trim() || selectedCover.imageUrl,
      gradient: selectedCover.gradient,
    });

    // Só limpa e fecha se o Supabase confirmou a criação
    if (created) {
      setName('');
      setDescription('');
      setCustomImageUrl('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Music className="w-8 h-8 text-spotify-green" />
            Playlists do Evento
          </h1>
          <p className="text-sm text-spotify-gray mt-1">
            Escolha um repertório para explorar as faixas ou vote no Mix Geral com as mais pedidas.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleOpenCreateModal}
          className="self-start md:self-auto px-5 py-2.5 rounded-full bg-spotify-green hover:bg-spotify-green-light text-black font-extrabold text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-spotify-green/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Playlist</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-spotify-gray absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar playlists ou repertórios..."
          className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#181818] border border-[#282828] focus:border-spotify-green focus:outline-none text-sm text-white placeholder-spotify-gray transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-spotify-gray hover:text-white"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Grid of Playlists */}
      {displayPlaylists.length === 0 ? (
        <div className="text-center py-16 bg-[#181818] rounded-3xl border border-white/5 p-8">
          <Disc className="w-12 h-12 text-spotify-gray mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-1">Nenhuma playlist encontrada</h3>
          <p className="text-sm text-spotify-gray">
            Tente buscar com outro termo ou crie uma nova playlist para a festa!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

      {/* Modal: Nova Playlist */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Criar Nova Playlist"
        subtitle="Adicione um repertório exclusivo para o show de hoje."
      >
        <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-spotify-gray uppercase tracking-wider mb-1.5">
              Nome da Playlist *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Forró & Piseiro ao Vivo"
              className="w-full px-4 py-2.5 rounded-xl bg-[#242424] border border-white/10 focus:border-spotify-green focus:outline-none text-sm text-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-spotify-gray uppercase tracking-wider mb-1.5">
              Descrição
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Músicas dançantes para animar a galera no segundo tempo do show..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#242424] border border-white/10 focus:border-spotify-green focus:outline-none text-sm text-white transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-spotify-gray uppercase tracking-wider mb-1.5">
              Escolha uma Imagem de Capa
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {PRESET_COVERS.map((preset) => {
                const isSelected = selectedCover.name === preset.name && !customImageUrl;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSelectedCover(preset);
                      setCustomImageUrl('');
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                      isSelected
                        ? 'border-spotify-green scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.imageUrl}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[10px] text-white py-0.5 px-1 truncate text-center font-medium">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="block text-xs text-spotify-gray mb-1">
              Ou cole uma URL de imagem externa:
            </label>
            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="https://exemplo.com/minha-foto.jpg"
              className="w-full px-4 py-2 rounded-xl bg-[#242424] border border-white/10 focus:border-spotify-green focus:outline-none text-xs text-white transition-colors"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-bold text-spotify-gray hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-full bg-spotify-green hover:bg-spotify-green-light disabled:opacity-50 disabled:hover:bg-spotify-green text-black font-extrabold text-sm transition-all shadow-md"
            >
              Salvar Playlist
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Editar Playlist */}
      <EditPlaylistModal
        isOpen={!!editingPlaylist}
        onClose={() => setEditingPlaylist(null)}
        playlist={editingPlaylist}
      />
    </div>
  );
}

export default PlaylistsPage;
