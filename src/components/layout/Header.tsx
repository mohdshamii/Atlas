import { Link, NavLink } from 'react-router-dom';
import { Box, Brain, Compass, Database, LayoutGrid, Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import SearchBar from '@/components/common/SearchBar';

const NAV_LINKS = [
  { to: '/3d-visualizer', label: '3D Geospatial', icon: Box, highlight: true },
  { to: '/intelligence', label: 'Civic AI Studio', icon: Brain, highlight: true },
  { to: '/india/uttar-pradesh', label: 'Explore Atlas', icon: LayoutGrid },
  { to: '/compare', label: 'Compare', icon: Compass },
  { to: '/data-sources', label: 'Sources', icon: Database },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold-500/25 bg-base-950/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gold-500/40 bg-gold-500/10 shadow-sm group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M8 22 L16 8 L24 22 Z" stroke="#C58A2B" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
              <circle cx="16" cy="17" r="2.2" fill="#5B7B5A" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-500"></span>
            </span>
          </span>
          <div>
            <span className="font-display text-base font-bold tracking-tight text-base-100 gold-gradient-text block leading-none">
              India Data Atlas
            </span>
            <span className="text-[10px] font-mono text-gold-600/80 tracking-widest uppercase block mt-0.5">
              Civic Intelligence Suite
            </span>
          </div>
        </Link>

        <div className="hidden flex-1 max-w-sm lg:block ml-4">
          <SearchBar />
        </div>

        <nav className="ml-auto hidden items-center gap-1.5 md:flex">
          {NAV_LINKS.map(({ to, label, icon: Icon, highlight }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'border border-gold-500/50 bg-gold-500/15 text-gold-600 shadow-sm'
                    : highlight
                    ? 'text-gold-600/90 hover:text-gold-700 hover:bg-gold-500/10'
                    : 'text-base-300 hover:text-base-100 hover:bg-base-800/60'
                }`
              }
            >
              <Icon size={14} className={highlight ? 'text-gold-600' : ''} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          className="ml-auto rounded-lg p-2 text-base-300 md:hidden hover:bg-base-800/60"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gold-500/20 bg-base-950/95 px-4 pb-4 pt-3 md:hidden space-y-3">
          <SearchBar />
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon, highlight }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'bg-gold-500/15 border border-gold-500/40 text-gold-600'
                      : 'text-base-300 hover:bg-base-800/60'
                  }`
                }
              >
                <Icon size={16} className={highlight ? 'text-gold-600' : ''} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
