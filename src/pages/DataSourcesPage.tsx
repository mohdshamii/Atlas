import { ExternalLink, Info } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import StatusBadge from '@/components/common/StatusBadge';
import { INDICATORS } from '@/config/indicators';
import { REFERENCE_SOURCES } from '@/data/sources';

export default function DataSourcesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: 'India', to: '/' }, { label: 'Data Sources' }]} />
      <h1 className="mt-4 font-display text-2xl font-semibold text-base-100">Data sources & provenance</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-base-400">
        India Data Atlas is built so every number shown carries an honest status. This page explains
        what those statuses mean and lists the kind of official source each indicator would draw
        from once verified data is integrated.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-md border border-signal-amber/30 bg-signal-amber/10 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-signal-amber" />
        <div className="text-sm text-base-200">
          <p className="font-medium">This build uses demo/sample data</p>
          <p className="mt-1 text-base-300">
            No verified government statistics have been integrated yet. Every value you see is
            generated for illustration — clearly marked <StatusBadge status="demo" className="mx-1 align-middle" />
            — or marked <StatusBadge status="unavailable" className="mx-1 align-middle" /> where no
            value is shown at all. The data layer is built so verified data can replace demo data
            without any change to the UI — see the README's "Data architecture" section.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-base-100">Status definitions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-base-700 bg-base-900 p-4">
            <StatusBadge status="verified" />
            <p className="mt-2 text-xs leading-relaxed text-base-400">
              Sourced from a cited, verifiable official dataset with a recorded update date.
            </p>
          </div>
          <div className="rounded-md border border-base-700 bg-base-900 p-4">
            <StatusBadge status="demo" />
            <p className="mt-2 text-xs leading-relaxed text-base-400">
              Generated for demonstration only. Not from any official survey — do not cite.
            </p>
          </div>
          <div className="rounded-md border border-base-700 bg-base-900 p-4">
            <StatusBadge status="unavailable" />
            <p className="mt-2 text-xs leading-relaxed text-base-400">
              No data — verified or demo — exists for this district, metric, and year.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-base-100">Reference sources by indicator</h2>
        <p className="mt-1 text-xs text-base-500">
          These are the authoritative sources this platform is designed to integrate with — they are
          not currently powering the figures shown in the app.
        </p>
        <div className="mt-3 divide-y divide-base-800 rounded-md border border-base-700">
          {INDICATORS.map((indicator) => {
            const ref = REFERENCE_SOURCES.find((r) => r.indicatorSlug === indicator.slug);
            return (
              <div key={indicator.slug} className="flex flex-col gap-1 bg-base-900 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-base-100">{indicator.name}</p>
                  <p className="text-xs text-base-400">{ref?.sourceName}</p>
                </div>
                {ref?.sourceUrl && (
                  <a
                    href={ref.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-signal-amber hover:underline"
                  >
                    Visit source <ExternalLink size={11} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-md border border-base-700 bg-base-900 p-4 text-xs leading-relaxed text-base-400">
        <p className="font-medium text-base-200">Notes on GeoJSON boundaries</p>
        <p className="mt-1">
          District shapes on the map are a simplified, generated approximation (a bounded Voronoi
          tessellation built from approximate district centroids), not an authoritative survey
          dataset. See <code className="rounded bg-base-800 px-1 py-0.5">public/geojson/README.md</code> in
          the project source for details.
        </p>
      </div>
    </div>
  );
}
