import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { search } from '@/services/dataService';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 150);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const results = debounced ? search(debounced) : [];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submit = () => {
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center gap-2 rounded-md border border-base-700 bg-base-900 px-3 ${
          variant === 'hero' ? 'py-3' : 'py-2'
        } focus-within:border-signal-amber/60`}
      >
        <Search size={16} className="shrink-0 text-base-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Search a state, district, indicator, or metric…"
          aria-label="Search India Data Atlas"
          className="w-full bg-transparent text-sm text-base-100 placeholder:text-base-500 focus:outline-none"
        />
        {query && (
          <button aria-label="Clear search" onClick={() => setQuery('')} className="text-base-400 hover:text-base-100">
            <X size={14} />
          </button>
        )}
      </div>

      {open && debounced && (
        <div className="absolute z-30 mt-1 max-h-80 w-full overflow-y-auto rounded-md border border-base-700 bg-base-900 shadow-panel animate-fadeIn">
          {results.length === 0 ? (
            <div className="px-3 py-4 text-sm text-base-400">No matches for “{debounced}”.</div>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={`${r.path}-${i}`}>
                  <button
                    onClick={() => {
                      navigate(r.path);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-base-800"
                  >
                    <span className="text-base-100">{r.label}</span>
                    <span className="shrink-0 text-xs text-base-400">{r.sublabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
