import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import EmailConfirmModal from './components/EmailConfirmModal';

import HomePage from './pages/HomePage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import SongDetailPage from './pages/SongDetailPage';
import ProfilePage from './pages/ProfilePage';
import { useApp } from './context/AppContext';

/**
 * ScrollToTop helper component to reset window scroll position
 * whenever the route pathname changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * Main Application Shell Component.
 * Oferece acesso público irrestrito e imediato: visitantes chegam diretamente
 * na página principal com todas as playlists e músicas visíveis sem telas bloqueantes.
 */
export function App() {
  const { currentUser, isAuthModalOpen, closeAuthModal } = useApp();

  const [pendingConfirmation, setPendingConfirmation] = useState(null);

  // Once currentUser is set, clear pending state
  useEffect(() => {
    if (currentUser && pendingConfirmation) {
      setPendingConfirmation(null);
    }
  }, [currentUser, pendingConfirmation]);

  return (
    <div className="min-h-screen bg-spotify-black text-white flex flex-col font-sans selection:bg-spotify-green selection:text-black">
      <ScrollToTop />

      {/* ── Authentication Modals (Apenas sob demanda, sem bloquear visitantes) ── */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSignUpSuccess={(data) => setPendingConfirmation(data)}
      />

      <EmailConfirmModal
        isOpen={!!pendingConfirmation}
        onClose={() => setPendingConfirmation(null)}
        userId={pendingConfirmation?.userId}
        token={pendingConfirmation?.token}
        email={pendingConfirmation?.email}
        name={pendingConfirmation?.name}
      />

      {/* ── Fixed Header Navigation ───────────────────────────────────────── */}
      <Navbar />

      {/* ── Main Layout: Sidebar + Dynamic Routes (Acesso Público Imediato) ── */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Route Pages Viewport — Renderizado Imediatamente */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
            <Route path="/playlists/:playlistId/songs/:songId" element={<SongDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Notification Toast */}
      <Toast />
    </div>
  );
}

export default App;
