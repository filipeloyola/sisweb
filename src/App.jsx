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
 * Handles authentication gating: shows AuthModal when no user is logged in,
 * and EmailConfirmModal when a sign-up is pending e-mail confirmation.
 */
export function App() {
  const { currentUser, isLoadingPlaylists } = useApp();

  /**
   * pendingConfirmation holds the data needed for EmailConfirmModal
   * while waiting for the user to "click the link":
   * { userId, token, email, name }
   */
  const [pendingConfirmation, setPendingConfirmation] = useState(null);

  // Once currentUser is set (login/confirm success), clear pending state
  useEffect(() => {
    if (currentUser && pendingConfirmation) {
      setPendingConfirmation(null);
    }
  }, [currentUser, pendingConfirmation]);

  // Show AuthModal when there is no session AND no pending email step
  const showAuthModal = !currentUser && !pendingConfirmation;
  // Show EmailConfirmModal when sign-up just happened
  const showConfirmModal = !currentUser && !!pendingConfirmation;

  return (
    <div className="min-h-screen bg-spotify-black text-white flex flex-col font-sans selection:bg-spotify-green selection:text-black">
      <ScrollToTop />

      {/* ── Authentication gate modals ───────────────────────────────────── */}
      <AuthModal
        isOpen={showAuthModal}
        onSignUpSuccess={(data) => setPendingConfirmation(data)}
      />

      <EmailConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setPendingConfirmation(null)}
        userId={pendingConfirmation?.userId}
        token={pendingConfirmation?.token}
        email={pendingConfirmation?.email}
        name={pendingConfirmation?.name}
      />

      {/* ── Main app shell (visible once authenticated) ───────────────────── */}
      {currentUser && (
        <>
          {/* Fixed Header */}
          <Navbar />

          {/* Main Body Layout with Sidebar + Scrollable Content */}
          <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Dynamic Route Pages Viewport */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12">
              {isLoadingPlaylists ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4 text-spotify-gray">
                  <span className="w-10 h-10 border-4 border-white/10 border-t-spotify-green rounded-full animate-spin" />
                  <p className="text-sm font-medium">Carregando playlists do Supabase...</p>
                </div>
              ) : (
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/playlists" element={<PlaylistsPage />} />
                <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
                <Route path="/playlists/:playlistId/songs/:songId" element={<SongDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              )}
            </main>
          </div>

          {/* Global Notification Toast */}
          <Toast />
        </>
      )}
    </div>
  );
}

export default App;
