import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Image, Check, Sparkles, X, Upload, Link2, Trash2, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../context/AppContext';
import { supabase } from '../supabaseClient';

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
 * Redimensiona e otimiza uma imagem em base64 via Canvas
 * para que possa ser armazenada diretamente no banco de forma leve e rápida
 */
function compressImage(file, maxWidth = 800, maxHeight = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/**
 * EditPlaylistModal Component
 *
 * Permite a edição completa de uma playlist:
 * - Título da Playlist
 * - Descrição detalhada
 * - Upload de imagem de capa do computador/celular ou inserção de URL externa
 * - Escolha de temas visuais
 * - Exclusão de playlist para o Administrador
 */
export function EditPlaylistModal({ isOpen, onClose, playlist }) {
  const { updatePlaylist, deletePlaylist, canEdit, isAdmin } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [gradient, setGradient] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploadedFile, setIsUploadedFile] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state when modal opens or playlist changes
  useEffect(() => {
    if (playlist) {
      setName(playlist.name || playlist.title || '');
      setDescription(playlist.description || '');
      setImageUrl(playlist.imageUrl || playlist.image_url || '');
      setGradient(playlist.gradient || 'from-neutral-800 via-neutral-900 to-black');
      setUploadError('');
      setIsUploadedFile(false);

      const match = COVER_PRESETS.find((p) => p.imageUrl === (playlist.imageUrl || playlist.image_url));
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
    setIsUploadedFile(false);
  };

  const handleCustomUrlChange = (e) => {
    const val = e.target.value;
    setImageUrl(val);
    setSelectedPresetId(null);
    setIsUploadedFile(false);
  };

  // Upload de arquivo local (do computador ou celular)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      // 1. Tenta fazer upload para o Supabase Storage se o bucket existir
      let storagePublicUrl = null;
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `playlist-${playlist.id}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('playlists')
          .upload(fileName, file, { upsert: true });

        if (!uploadErr && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('playlists')
            .getPublicUrl(fileName);
          storagePublicUrl = publicUrlData?.publicUrl;
        }
      } catch (storageErr) {
        // Silencioso se Storage não estiver configurado
        console.warn('Supabase storage fallback:', storageErr);
      }

      if (storagePublicUrl) {
        setImageUrl(storagePublicUrl);
      } else {
        // Fallback robusto: comprime e salva como Data URL otimizada direto no banco
        const compressedDataUrl = await compressImage(file, 800, 800);
        setImageUrl(compressedDataUrl);
      }

      setSelectedPresetId(null);
      setIsUploadedFile(true);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      setUploadError('Não foi possível processar esta imagem. Tente uma URL externa.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || saving) return;

    setSaving(true);
    const ok = await updatePlaylist(playlist.id, {
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      gradient,
    });
    setSaving(false);

    if (ok) onClose();
  };

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir a playlist "${playlist.name}"? As músicas vinculadas a ela também serão removidas.`)) {
      return;
    }

    setSaving(true);
    const ok = await deletePlaylist(playlist.id);
    setSaving(false);

    if (ok) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Playlist"
      subtitle="Edite o título, a descrição e altere a capa do repertório."
      maxWidth="max-w-2xl"
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
            <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-black/70 px-1.5 py-0.5 rounded text-white/90">
              {isUploadedFile ? 'Upload Local' : 'Prévia'}
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
              {description || 'Sem descrição cadastrada.'}
            </p>
          </div>
        </div>

        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-spotify-gray uppercase tracking-wider">
            Título da Playlist *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Bianca e Jorge, Grupo Vocal, Músicas ao Vivo..."
            className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555] outline-none transition-colors"
            required
          />
        </div>

        {/* Description textarea */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-spotify-gray uppercase tracking-wider">
            Descrição da Playlist
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o propósito deste repertório, ocasião ou artistas..."
            className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555] outline-none transition-colors resize-none"
          />
        </div>

        {/* Cover image alteration options */}
        <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
          <label className="text-xs font-bold text-spotify-gray uppercase tracking-wider">
            Imagem de Capa da Playlist
          </label>

          {/* Upload de Imagem do Dispositivo */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] border border-white/10 hover:border-spotify-green text-white text-xs font-bold transition-all"
            >
              <Upload className="w-4 h-4 text-spotify-green" />
              <span>{uploading ? 'Processando imagem...' : 'Fazer Upload do Dispositivo'}</span>
            </button>

            <span className="text-xs text-spotify-gray text-center sm:text-left self-center">
              ou informe uma URL:
            </span>

            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-spotify-gray" />
              <input
                type="url"
                value={imageUrl}
                onChange={handleCustomUrlChange}
                placeholder="https://exemplo.com/minha-capa.jpg"
                className="w-full bg-[#121212] border border-[#333333] focus:border-spotify-green rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#555] outline-none transition-colors"
              />
            </div>
          </div>

          {uploadError && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/40 border border-red-500/30 rounded-xl p-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Curated Preset Covers Grid */}
          <div className="flex flex-col gap-2 mt-1">
            <span className="text-[11px] font-semibold text-spotify-gray flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-spotify-green" />
              Ou escolha uma das capas sugeridas:
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COVER_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id || (!isUploadedFile && imageUrl === preset.imageUrl);
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
                        <div className="w-5 h-5 rounded-full bg-spotify-green flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
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
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#282828] mt-2">
          {/* Excluir Playlist (se admin ou colaborador) */}
          {canEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all"
              title="Excluir playlist do Supabase"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excluir</span>
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-spotify-gray hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-6 py-2.5 rounded-full bg-spotify-green hover:bg-[#1ed760] disabled:opacity-60 disabled:hover:scale-100 text-black font-extrabold text-xs sm:text-sm transition-all hover:scale-105 shadow-md shadow-spotify-green/20"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default EditPlaylistModal;
