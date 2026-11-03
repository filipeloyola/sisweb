import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Modal Component
 * Renders an accessible overlay modal with dark glass background and backdrop blur.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility
 * @param {() => void} props.onClose - Triggered to close modal
 * @param {string} [props.title] - Modal heading
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {React.ReactNode} props.children - Modal body content / form
 * @param {string} [props.maxWidth] - Custom max-width Tailwind class (defaults to max-w-lg)
 */
export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) {
  // Handle ESC key press to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`relative w-full ${maxWidth} bg-[#181818] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 text-white animate-slide-up my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#282828] mb-6">
          <div>
            {title && (
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-spotify-gray mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-spotify-gray hover:text-white rounded-full hover:bg-[#282828] transition-colors -mr-2 -mt-2"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
