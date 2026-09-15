import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { STATES, INDIA_CENTROID, INDIA_DEFAULT_ZOOM } from '@/config/states';
import { RotateCcw } from 'lucide-react';

const TILE_URL =
  import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

function stateIcon(available: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${available ? 15 : 11}px;height:${available ? 15 : 11}px;border-radius:9999px;
      background:${available ? '#C58A2B' : '#8E8D85'};
      border:2.5px solid #FFFCF5;
      box-shadow:0 2px 6px rgba(37,37,37,0.25), 0 0 0 3px rgba(197,138,43,${available ? 0.25 : 0});
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function ResetControl() {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView(INDIA_CENTROID, INDIA_DEFAULT_ZOOM)}
      aria-label="Reset map view"
      className="absolute bottom-4 right-4 z-[1000] flex items-center gap-1.5 rounded-md border border-base-700 bg-base-900/95 px-2.5 py-1.5 text-xs font-medium text-base-100 shadow-panel hover:bg-base-800"
    >
      <RotateCcw size={12} />
      Reset
    </button>
  );
}

export default function IndiaMap({ height = 440 }: { height?: number }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-xl border border-base-700 shadow-panel" style={{ height }}>
      <MapContainer
        center={INDIA_CENTROID}
        zoom={INDIA_DEFAULT_ZOOM}
        scrollWheelZoom
        className="h-full w-full"
        style={{ background: '#EFEADF' }}
      >
        <TileLayer
          url={TILE_URL}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {STATES.map((state) => (
          <Marker
            key={state.id}
            position={state.centroid}
            icon={stateIcon(state.status === 'available')}
            eventHandlers={{
              click: () => {
                if (state.status === 'available') navigate(`/india/${state.id}`);
              },
            }}
          >
            <Popup>
              <div className="text-sm p-1">
                <p className="font-semibold text-base-100 font-display text-base">{state.name}</p>
                <p className="text-xs text-base-400 mt-0.5">Capital: {state.capital}</p>
                {state.status === 'available' ? (
                  <button
                    onClick={() => navigate(`/india/${state.id}`)}
                    className="mt-2 rounded-lg bg-gold-500 hover:bg-gold-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors"
                  >
                    Explore state data →
                  </button>
                ) : (
                  <p className="mt-2 text-xs italic text-base-500">Coming soon</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        <ResetControl />
      </MapContainer>
    </div>
  );
}
