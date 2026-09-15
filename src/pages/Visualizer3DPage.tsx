import React, { useState } from 'react';
import India3DGlobe from '@/components/three/India3DGlobe';
import District3DElevationMap from '@/components/three/District3DElevationMap';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Box, Globe, Sparkles } from 'lucide-react';

export default function Visualizer3DPage() {
  const [activeTab, setActiveTab] = useState<'globe' | 'elevation'>('globe');
  const [selectedState, setSelectedState] = useState('uttar-pradesh');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 animate-fadeIn">
      <Breadcrumbs items={[{ label: 'India', to: '/' }, { label: '3D Geospatial Studio' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-gold-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs font-mono text-gold-600 font-semibold">
            <Sparkles size={13} />
            WEBGL 3D ACCELERATED GEOSPATIAL ENGINE
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-base-100 sm:text-4xl">
            3D Geospatial Studio
          </h1>
          <p className="mt-1 text-sm text-base-400 max-w-2xl leading-relaxed">
            Experience India's civic data through GPU-accelerated 3D globes, geographic relief maps with earthy historical colors, and extruded district elevation matrices.
          </p>
        </div>

        {/* Studio Mode Tabs */}
        <div className="flex rounded-xl border border-gold-500/30 bg-base-900 p-1 shadow-panel">
          <button
            onClick={() => setActiveTab('globe')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'globe'
                ? 'bg-gold-500 text-white shadow-gold'
                : 'text-base-400 hover:text-base-100'
            }`}
          >
            <Globe size={15} />
            3D Globe
          </button>
          <button
            onClick={() => setActiveTab('elevation')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'elevation'
                ? 'bg-gold-500 text-white shadow-gold'
                : 'text-base-400 hover:text-base-100'
            }`}
          >
            <Box size={15} />
            3D State Relief
          </button>
        </div>
      </div>

      {/* Main 3D Stage */}
      {activeTab === 'globe' ? (
        <div className="space-y-6">
          <India3DGlobe height={560} onSelectState={(stateId) => setSelectedState(stateId)} />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl glass-panel p-4">
              <span className="font-mono text-xs text-gold-600 font-bold uppercase">01 · Pan-India Nodes</span>
              <p className="mt-1 text-sm font-bold text-base-100">State Telemetry Beacons</p>
              <p className="mt-1 text-xs text-base-400 leading-relaxed">
                Click any antique-gold beacon on the parchment globe to inspect its capital and drill into district data.
              </p>
            </div>
            <div className="rounded-xl glass-panel p-4">
              <span className="font-mono text-xs font-bold uppercase" style={{ color: '#5B7B5A' }}>02 · Arc Highways</span>
              <p className="mt-1 text-sm font-bold text-base-100">Inter-State Economic Arcs</p>
              <p className="mt-1 text-xs text-base-400 leading-relaxed">
                Saffron arc lines connect key state capitals — Lucknow, Mumbai, Bengaluru, Chennai.
              </p>
            </div>
            <div className="rounded-xl glass-panel p-4">
              <span className="font-mono text-xs font-bold uppercase" style={{ color: '#3A5668' }}>03 · Orbital Camera</span>
              <p className="mt-1 text-sm font-bold text-base-100">Full Orbital Camera Freedom</p>
              <p className="mt-1 text-xs text-base-400 leading-relaxed">
                Drag to rotate in 360°, toggle auto-orbit, or hover to reveal state profiles.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <District3DElevationMap
            height={600}
            stateId={selectedState}
            showStateSelector={true}
          />
          <div className="rounded-xl glass-panel p-4">
            <p className="text-xs text-base-400 leading-relaxed">
              <span className="font-bold text-base-200">How to read this map:</span> Each pillar represents a district.
              Height = metric value. Colors use earthy historical palette —{' '}
              <span className="font-semibold" style={{ color: '#5B7B5A' }}>Sage</span> (high/good),{' '}
              <span className="font-semibold" style={{ color: '#C58A2B' }}>Saffron</span> (mid),{' '}
              <span className="font-semibold" style={{ color: '#C26743' }}>Terracotta</span> (low).
              Drag to rotate · click a pillar to open the district dashboard · use <strong>Geographic 3D</strong> view for true geographic layout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
