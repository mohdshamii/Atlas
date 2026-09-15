import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import type { Layer, LeafletMouseEvent, GeoJSON as LeafletGeoJSON } from 'leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { scaleColor } from '@/utils/colorScale';

const TILE_URL =
  import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

interface Props {
  valueByDistrict: Record<string, number | null>;
  min: number;
  max: number;
  accentHigh?: string;
  selectedDistrictId?: string;
  onSelectDistrict?: (districtId: string, name: string) => void;
  onHoverDistrict?: (districtId: string | null, name?: string, value?: number | null) => void;
  height?: number;
}

function FitBounds({ data }: { data: FeatureCollection | null }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (data && !fitted.current) {
      import('leaflet').then((L) => {
        const layer = L.geoJSON(data as any);
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [16, 16] });
          fitted.current = true;
        }
      });
    }
  }, [data, map]);
  return null;
}

function ResetControl({ data }: { data: FeatureCollection | null }) {
  const map = useMap();
  return (
    <button
      onClick={() => {
        if (!data) return;
        import('leaflet').then((L) => {
          const bounds = L.geoJSON(data as any).getBounds();
          if (bounds.isValid()) map.fitBounds(bounds, { padding: [16, 16] });
        });
      }}
      aria-label="Reset map view"
      className="absolute bottom-4 right-4 z-[1000] flex items-center gap-1.5 rounded-md border border-base-700 bg-base-900/95 px-2.5 py-1.5 text-xs font-medium text-base-100 shadow-panel hover:bg-base-800"
    >
      <RotateCcw size={12} />
      Reset view
    </button>
  );
}

export default function UPDistrictMap({
  valueByDistrict,
  min,
  max,
  accentHigh = '#C58A2B',
  selectedDistrictId,
  onSelectDistrict,
  onHoverDistrict,
  height = 520,
}: Props) {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState(false);
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/geojson/up_districts.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load GeoJSON');
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const styleFor = useMemo(
    () =>
      (feature?: Feature) => {
        const id = feature?.properties?.id;
        const value = id ? valueByDistrict[id] : null;
        const isSelected = id === selectedDistrictId;
        const fill = value == null ? '#EAE4D5' : scaleColor(value, min, max, '#F4EFE3', accentHigh);
        return {
          fillColor: fill,
          fillOpacity: value == null ? 0.4 : 0.88,
          color: isSelected ? '#C58A2B' : '#DDD8CC',
          weight: isSelected ? 2.5 : 1,
        };
      },
    [valueByDistrict, min, max, accentHigh, selectedDistrictId]
  );

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-base-700 bg-base-900/50 text-center"
        style={{ height }}
      >
        <AlertTriangle size={24} className="text-base-500" />
        <p className="text-sm text-base-400">Map data failed to load. Check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-base-700 shadow-panel" style={{ height }}>
      <MapContainer center={[26.85, 80.9]} zoom={7} scrollWheelZoom className="h-full w-full" style={{ background: '#EFEADF' }}>
        <TileLayer
          url={TILE_URL}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {data && (
          <GeoJSON
            ref={geoJsonRef as any}
            data={data as any}
            style={styleFor as any}
            onEachFeature={(feature: Feature, layer: Layer) => {
              const id = feature.properties?.id;
              const name = feature.properties?.name;
              const value = id ? valueByDistrict[id] : null;
              layer.bindTooltip(
                `<strong>${name}</strong><br/>${value == null ? 'No data' : value.toLocaleString('en-IN')}`,
                { sticky: true, className: 'text-xs font-sans' }
              );
              layer.on({
                mouseover: (e: LeafletMouseEvent) => {
                  (e.target as any).setStyle({ weight: 2.5, color: '#C58A2B' });
                  onHoverDistrict?.(id, name, value);
                },
                mouseout: (e: LeafletMouseEvent) => {
                  const isSelected = id === selectedDistrictId;
                  (e.target as any).setStyle({ weight: isSelected ? 2.5 : 1, color: isSelected ? '#C58A2B' : '#DDD8CC' });
                  onHoverDistrict?.(null);
                },
                click: () => onSelectDistrict?.(id, name),
              });
            }}
          />
        )}
        <FitBounds data={data} />
        <ResetControl data={data} />
      </MapContainer>
    </div>
  );
}
