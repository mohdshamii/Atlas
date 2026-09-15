import { Fragment, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { MetricValue } from '@/types';
import { formatMetricValue } from '@/utils/format';
import StatusBadge from '@/components/common/StatusBadge';

export default function DataTable({ rows }: { rows: MetricValue[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-md border border-base-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-base-700 bg-base-900 text-left text-xs text-base-400">
            <th className="px-4 py-2.5 font-medium">Metric</th>
            <th className="px-4 py-2.5 font-medium">Value</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="w-8 px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isOpen = expanded === row.metric;
            return (
              <Fragment key={row.metric}>
                <tr
                  className="cursor-pointer border-b border-base-800 hover:bg-base-900/60"
                  onClick={() => setExpanded(isOpen ? null : row.metric)}
                >
                  <td className="px-4 py-2.5 text-base-200">{row.metric.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-2.5 tabular-nums text-base-100">
                    {formatMetricValue(row.value, row.unit)}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-2.5 text-base-400">
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </td>
                </tr>
                {isOpen && (
                  <tr className="border-b border-base-800 bg-base-900/40">
                    <td colSpan={4} className="px-4 py-3 text-xs text-base-400">
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-4">
                        <div>
                          <dt className="text-base-500">Source</dt>
                          <dd className="text-base-200">{row.source.sourceName}</dd>
                        </div>
                        <div>
                          <dt className="text-base-500">Dataset</dt>
                          <dd className="text-base-200">{row.source.datasetName}</dd>
                        </div>
                        <div>
                          <dt className="text-base-500">Coverage</dt>
                          <dd className="text-base-200">{row.source.coverage}</dd>
                        </div>
                        <div>
                          <dt className="text-base-500">Year</dt>
                          <dd className="text-base-200">{row.source.year}</dd>
                        </div>
                        {row.source.notes && (
                          <div className="col-span-2 sm:col-span-4">
                            <dt className="text-base-500">Notes</dt>
                            <dd className="text-base-300">{row.source.notes}</dd>
                          </div>
                        )}
                      </dl>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
