import { Link } from 'react-router-dom';
import { Box, Brain, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gold-500/25 bg-base-950/95">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold-500/40 bg-gold-500/10">
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                  <path d="M8 22 L16 8 L24 22 Z" stroke="#C58A2B" strokeWidth="2.5" fill="none" />
                  <circle cx="16" cy="17" r="2" fill="#5B7B5A" />
                </svg>
              </span>
              <span className="font-display text-base font-bold gold-gradient-text">
                India Data Atlas
              </span>
            </div>
            <p className="text-xs leading-relaxed text-base-400">
              An advanced civic intelligence and 3D geospatial platform visualizing multi-year district development, policy interventions, and socioeconomic data across India.
            </p>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs font-semibold text-gold-600 uppercase tracking-wider">
              3D & Civic AI Suite
            </p>
            <ul className="space-y-2 text-xs text-base-300">
              <li>
                <Link to="/3d-visualizer" className="hover:text-gold-600 transition-colors flex items-center gap-1.5">
                  <Box size={13} className="text-gold-600" />
                  3D State Relief Maps
                </Link>
              </li>
              <li>
                <Link to="/intelligence" className="hover:text-gold-600 transition-colors flex items-center gap-1.5">
                  <Brain size={13} className="text-gold-600" />
                  AI Policy Copilot
                </Link>
              </li>
              <li>
                <Link to="/intelligence" className="hover:text-gold-600 transition-colors flex items-center gap-1.5">
                  <Sparkles size={13} className="text-gold-600" />
                  Vulnerability Index (VPI)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs font-semibold text-gold-600 uppercase tracking-wider">
              Geographic Atlas
            </p>
            <ul className="space-y-2 text-xs text-base-300">
              <li><Link to="/india/uttar-pradesh" className="hover:text-gold-600 transition-colors">Uttar Pradesh (75 Districts)</Link></li>
              <li><Link to="/india/maharashtra" className="hover:text-gold-600 transition-colors">Maharashtra Hub</Link></li>
              <li><Link to="/india/karnataka" className="hover:text-gold-600 transition-colors">Karnataka Hub</Link></li>
              <li><Link to="/compare" className="hover:text-gold-600 transition-colors">District Benchmarking</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs font-semibold text-gold-600 uppercase tracking-wider">
              Data Governance
            </p>
            <ul className="space-y-2 text-xs text-base-400">
              <li><Link to="/data-sources" className="hover:text-gold-600 transition-colors">Official Data Provenance</Link></li>
              <li>Census of India, NFHS, MoRTH, CGWB, UDISE+</li>
              <li>Deterministic Civic Modeling Engine</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-base-700/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-base-500 font-mono">
            © {new Date().getFullYear()} India Data Atlas · Civic Intelligence Project.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-base-800/50 px-3 py-1 text-[11px] font-mono text-gold-600">
            <span className="h-1.5 w-1.5 rounded-full bg-historical-sage animate-pulse" />
            750+ Districts Telemetry Online
          </div>
        </div>
      </div>
    </footer>
  );
}
