import { useSearchParams, Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import SearchBar from '@/components/common/SearchBar';
import EmptyState from '@/components/common/EmptyState';
import { search } from '@/services/dataService';

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const results = search(q);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: 'India', to: '/' }, { label: 'Search' }]} />
      <h1 className="mt-4 font-display text-2xl font-semibold text-base-100">Search results</h1>
      <div className="mt-4 max-w-md">
        <SearchBar />
      </div>

      <p className="mt-6 text-sm text-base-400">
        {results.length} result{results.length === 1 ? '' : 's'} for “{q}”
      </p>

      {results.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={SearchX}
            title="No matches found"
            description="Try a different district, state, indicator, or metric name."
            actionLabel="Browse Uttar Pradesh"
            actionTo="/india/uttar-pradesh"
          />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-base-800 rounded-md border border-base-700">
          {results.map((r, i) => (
            <li key={i}>
              <Link to={r.path} className="flex items-center justify-between gap-3 bg-base-900 px-4 py-3 hover:bg-base-800/70">
                <span className="text-sm text-base-100">{r.label}</span>
                <span className="text-xs text-base-400">{r.sublabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
