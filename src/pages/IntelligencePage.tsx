import React, { useState } from 'react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import PolicyAiCopilot from '@/components/intelligence/PolicyAiCopilot';
import VulnerabilityIndexMatrix from '@/components/intelligence/VulnerabilityIndexMatrix';
import AnomalyDetectionRadar from '@/components/intelligence/AnomalyDetectionRadar';
import DistrictBenchmarkRadar from '@/components/intelligence/DistrictBenchmarkRadar';
import {
  Brain,
  Activity,
  Radio,
  Scale,
  Sparkles,
  ShieldAlert,
  Download,
  Share2,
} from 'lucide-react';

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'copilot' | 'vpi' | 'anomaly' | 'benchmark'>('copilot');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 animate-fadeIn">
      <Breadcrumbs items={[{ label: 'India', to: '/' }, { label: 'Civic Intelligence & Policy Studio' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-gold-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs font-mono text-gold-300">
            <Brain size={13} />
            EXECUTIVE CIVIC INTELLIGENCE SUITE
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-base-100 sm:text-4xl">
            Civic Intelligence & Policy Studio
          </h1>
          <p className="mt-1 text-sm text-base-400 max-w-2xl leading-relaxed">
            Actionable civic intelligence designed to solve real-world development challenges. Diagnose bottlenecks, simulate budget allocations, identify distressed hotspots, and benchmark district performance.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap rounded-xl border border-gold-500/30 bg-base-950 p-1 shadow-panel">
          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === 'copilot'
                ? 'bg-gold-500 text-base-950 shadow-gold'
                : 'text-base-400 hover:text-base-100'
            }`}
          >
            <Brain size={14} />
            AI Policy Copilot
          </button>

          <button
            onClick={() => setActiveTab('vpi')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === 'vpi'
                ? 'bg-gold-500 text-base-950 shadow-gold'
                : 'text-base-400 hover:text-base-100'
            }`}
          >
            <Activity size={14} />
            Vulnerability Index (VPI)
          </button>

          <button
            onClick={() => setActiveTab('anomaly')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === 'anomaly'
                ? 'bg-gold-500 text-base-950 shadow-gold'
                : 'text-base-400 hover:text-base-100'
            }`}
          >
            <Radio size={14} />
            Distress Alerts & Radar
          </button>

          <button
            onClick={() => setActiveTab('benchmark')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === 'benchmark'
                ? 'bg-gold-500 text-base-950 shadow-gold'
                : 'text-base-400 hover:text-base-100'
            }`}
          >
            <Scale size={14} />
            Diagnostic Radar
          </button>
        </div>
      </div>

      {/* Dynamic Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'copilot' && <PolicyAiCopilot />}
        {activeTab === 'vpi' && <VulnerabilityIndexMatrix />}
        {activeTab === 'anomaly' && <AnomalyDetectionRadar />}
        {activeTab === 'benchmark' && <DistrictBenchmarkRadar />}
      </div>
    </div>
  );
}
