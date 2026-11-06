import React, { useState, useEffect } from 'react';
import { Pencil, Music, Save, Trash2, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../context/AppContext';

/**
 * EditSongModal Component
 *
 * Permite a edição independente de uma música/cifra vinculada a uma playlist específica.
 * Como o sistema utiliza arquitetura de clonagem (cópias independentes),
 * qualquer alteração no tom, acordes ou letra afetará apenas a versão desta playlist,
 * mantendo a música original intacta.
 */
export function EditSongModal({ isOpen, onClose, song, playlistId, playlistName, onDeleted }) {
  const { updateSong, deleteSong, canEdit, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [duration, setDuration] = useState('3:30');
  const [lyrics, setLyrics] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (song && isOpen) {
      setTitle(song.title || '');
      setArtist(song.artist || '');
      setDuration(song.duration || '3:30');
      setLyrics(song.lyrics || '');
      setShowConfirmDelete(false);
    }
  }, [song, isOpen]);

  if (!song) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) {
      showToast('Preencha ao menos o título e o artista.', 'warning');
      return;
    }

    setIsSaving(true);
    const success = await updateSong(playlistId, song.id, {
      title: title.trim(),
      artist: artist.trim(),
      duration: duration.trim() || '3:30',
      lyrics: lyrics.trim(),
    });
    setIsSaving(false);

    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteSong(playlistId, song.id);
    setIsDeleting(false);
    if (success) {
      if (onDeleted) onDeleted();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Música & Cifra"
      subtitle={`Playlist: ${playlistName || 'Repertório'}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div className="bg-spotify-green/10 border border-spotify-green/20 rounded-xl p-3 text-xs text-spotify-gray flex items-center gap-2.5">
          <Pencil className="w-4 h-4 text-spotify-green flex-shrink-0" />
          <span>
            <strong className="text-white">Edição Independente:</strong> Alterações nesta música (tom, arranjo ou acordes) são exclusivas desta playlist e não afetam outras listas.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div>
          <label className="block text-xs font-bold text-spotify-gray uppercase tracking-wider mb-1.5">
            Duração Estimada
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ex: 3:45"
            className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-[#242424] border border-white/10 focus:border-spotify-green focus:outline-none text-sm text-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-spotify-gray uppercase tracking-wider">
              Cifra Completa & Letra
            </label>
            <span className="text-[11px] text-spotify-gray">
              Use fonte monoespaçada para manter o alinhamento
            </span>
          </div>
          <textarea
            rows={12}
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Ex:
[Intro: G D/F# Em C]
Tom: G

G              D/F#
Primeira linha da letra
Em             C
Segunda linha da letra..."
            className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-white/10 focus:border-spotify-green focus:outline-none text-xs sm:text-sm text-white font-mono leading-relaxed resize-y scrollbar-thin scrollbar-thumb-white/10"
          />
        </div>

        {/* Delete confirmation section */}
        {showConfirmDelete ? (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Tem certeza de que deseja remover esta música desta playlist?</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-spotify-gray hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md"
              >
                {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        ) : null}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            {!showConfirmDelete && (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                title="Remover música desta playlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Excluir Música</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-spotify-gray hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || !title.trim() || !artist.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-spotify-green hover:bg-spotify-green-light disabled:opacity-50 text-black font-extrabold text-sm transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default EditSongModal;
