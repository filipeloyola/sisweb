import React from 'react';

/**
 * StatCard Component
 * Displays key metrics on the dashboard with smooth hover and Spotify-green accents.
 *
 * @param {Object} props
 * @param {string} props.title - Metric title
 * @param {string | number} props.value - Metric value
 * @param {React.ReactNode} props.icon - Lucide icon component
 * @param {string} [props.description] - Supplementary context / trend
 * @param {string} [props.colorClass] - Optional icon background color accent
 */
export function StatCard({ title, value, icon, description, colorClass = 'text-spotify-green bg-spotify-green/10' }) {
  return (
    <div className="group relative bg-[#181818] hover:bg-[#202020] border border-[#282828] hover:border-spotify-green/60 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-lg hover:shadow-spotify-green/5 hover:-translate-y-1">
      {/* Top row: Icon and label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-spotify-gray group-hover:text-white transition-colors">
          {title}
        </span>
        <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${colorClass}`}>
          {icon}
        </div>
      </div>

      {/* Main value display */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-spotify-green-light transition-colors">
          {value}
        </span>
      </div>

      {/* Optional description footer */}
      {description && (
        <p className="mt-2 text-xs sm:text-sm text-spotify-gray/80 line-clamp-1">
          {description}
        </p>
      )}

      {/* Subtle bottom green glow indicator */}
      <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-spotify-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
    </div>
  );
}

export default StatCard;
