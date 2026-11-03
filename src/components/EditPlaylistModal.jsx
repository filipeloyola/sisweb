import React, { useState, useEffect } from 'react';
import { Pencil, Image, Check, Sparkles, X } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../context/AppContext';

export const COVER_PRESETS = [
  {
    id: 'acoustic',
    name: 'Acústico & Voz',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-amber-800 via-orange-900 to-stone-900',
  },
  {
    id: 'vocal',
    name: 'Grupo Vocal / Coral',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-sky-900 via-indigo-900 to-slate-900',
  },
  {
    id: 'spiritual',
    name: 'Espiritual & Luz',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-emerald-800 via-teal-900 to-slate-900',
  },
  {
    id: 'stage',
    name: 'Palco & Show',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-purple-900 via-indigo-900 to-black',
  },
  {
    id: 'guitar',
    name: 'Violão & Melodia',
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-yellow-900 via-amber-950 to-black',
  },
  {
    id: 'harmony',
    name: 'Harmonia & Paz',
    imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-cyan-900 via-blue-950 to-neutral-900',
  },
];

/**
 * EditPlaylistModal Component
 * Allows editing a playlist's name, cover artwork (custom URL or curated presets),
 * and description. Saves updates directly to AppContext/localStorage.
 */
export function EditPlaylistModal({ isOpen, onClose, playlist }) {
  const { updatePlaylist } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [gradient, setGradient] = useState('');

  // Sync state when modal opens or playlist changes
  useEffect(() => {
    if (playlist) {
      setName(playlist.name || '');
      setDescription(playlist.description || '');
      setImageUrl(playlist.imageUrl || '');
      setGradient(playlist.gradient || 'from-neutral-800 via-neutral-900 to-black');

      // Check if current imageUrl matches a preset
      const match = COVER_PRESETS.find((p) => p.imageUrl === playlist.imageUrl);
      if (match) {
        setSelectedPresetId(match.id);
      } else {
        setSelectedPresetId(null);
      }
    }
  }, [playlist, isOpen]);

  if (!playlist) return null;

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setImageUrl(preset.imageUrl);
    setGradient(preset.gradient);
  };

  const handleCustomUrlChange = (e) => {
    const val = e.target.value;
    setImageUrl(val);
    setSelectedPresetId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    updatePlaylist(playlist.id, {
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      gradient,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Playlist"
      subtitle="Altere o nome e a imagem de capa da playlist."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Live Artwork Preview */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#121212] border border-white/5">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-xl bg-neutral-900 border border-white/10 flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview da capa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
                  gradient || 'from-neutral-800 to-neutral-950'
                }`}
              >
                <Image className="w-8 h-8 text-white/50" />
              </div>
            )}
            <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-black/60 px-1.5 py-0.5 rounded text-white/90">
              Prévia
            </span>
          </div>

          <div className="flex flex-col justify-center text-center sm:text-left flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-spotify-green mb-1">
              Visualização da Capa
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white truncate">
              {name || 'Nome da Playlist'}
            </h4>
            <p className="text-xs text-spotify-gray line-clamp-2 mt-0.5">
              {description || 'Sem descrição.'}
            </p>
          </div>
        </div>

        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-spotify-gray uppercase tracking-wider">
            Nome da Playlist *
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bianca e Jorge, Músicas do Filipe..."
              className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors"
              required
            />
          </div>
        </div>

        {/* Cover image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-spotify-gray uppercase tracking-wider flex items-center justify-between">
            <span>URL da Imagem de Capa</span>
            <span className="text-[10px] text-spotify-gray font-normal lowercase">
              (ou escolha um tema abaixo)
            </span>
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={handleCustomUrlChange}
            placeholder="https://exemplo.com/imagem.jpg"
            className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555] outline-none transition-colors"
          />
        </div>

        {/* Curated Preset Covers Grid */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-spotify-gray uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-spotify-green" />
            <span>Capas Predefinidas</span>
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {COVER_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id || imageUrl === preset.imageUrl;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  title={preset.name}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-spotify-green ring-2 ring-spotify-green/40 scale-105'
                      : 'border-white/10 hover:border-white/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-spotify-green/30 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-spotify-green flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-black stroke-[3]" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/75 px-1 py-0.5 text-[9px] text-white font-medium truncate text-center">
                    {preset.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description textarea */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-spotify-gray uppercase tracking-wider">
            Descrição da Playlist
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Descrição ou informações sobre o repertório..."
            className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl p-3 text-sm text-white placeholder-[#555] outline-none transition-colors resize-none"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#282828] mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-spotify-gray hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-spotify-green hover:bg-[#1ed760] text-black font-extrabold text-xs sm:text-sm transition-all hover:scale-105 shadow-md shadow-spotify-green/20"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditPlaylistModal;
