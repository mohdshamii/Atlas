import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { INDICATORS } from '@/config/indicators';
import { getMetricAcrossDistricts } from '@/data/demoData';
import { findDistrict } from '@/data/districts';
import { STATES } from '@/config/states';
import { DEFAULT_YEAR } from '@/config/years';
import { formatMetricValue } from '@/utils/format';
import { useNavigate } from 'react-router-dom';
import { Box, Compass, Globe, Layers, MapPin, Maximize2, Sparkles } from 'lucide-react';

interface District3DElevationMapProps {
  height?: number | string;
  initialIndicator?: string;
  stateId?: string;
  year?: number;
  showStateSelector?: boolean;
}

export default function District3DElevationMap({
  height = 540,
  initialIndicator = 'education',
  stateId: propStateId = 'uttar-pradesh',
  year = DEFAULT_YEAR,
  showStateSelector = true,
}: District3DElevationMapProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [activeStateId, setActiveStateId] = useState(propStateId);
  const [indicatorSlug, setIndicatorSlug] = useState(initialIndicator);
  const [metricIndex, setMetricIndex] = useState(0);
  const [hoveredDistrict, setHoveredDistrict] = useState<{
    id: string;
    name: string;
    value: number | null;
    unit: string;
    label: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState<'spatial' | 'iso' | 'top'>('spatial');

  // Sync prop changes if parent updates stateId
  useEffect(() => {
    setActiveStateId(propStateId);
  }, [propStateId]);

  const availableStates = useMemo(() => STATES.filter((s) => s.status === 'available'), []);
  const currentState = useMemo(
    () => STATES.find((s) => s.id === activeStateId) || STATES[0],
    [activeStateId]
  );

  const indicator = useMemo(
    () => INDICATORS.find((i) => i.slug === indicatorSlug) || INDICATORS[0],
    [indicatorSlug]
  );
  const metric = indicator.metrics[metricIndex] || indicator.metrics[0];

  const districtData = useMemo(
    () => getMetricAcrossDistricts(indicator.slug, metric.key, year, activeStateId),
    [indicator.slug, metric.key, year, activeStateId]
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const heightPx = typeof height === 'number' ? height : mount.clientHeight || 540;

    // 1. Scene & Warm Parchment Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf7f3ea, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    if (viewMode === 'top') {
      camera.position.set(0, 26, 0.1);
      camera.lookAt(0, 0, 0);
    } else if (viewMode === 'spatial') {
      camera.position.set(14, 16, 17);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(13, 15, 16);
      camera.lookAt(0, 0, 0);
    }

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // 3. Warm Ivory Ground Platform & Soft Beige Grid
    const gridHelper = new THREE.GridHelper(26, 26, 0xc58a2b, 0xddd8cc);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Warm cream floor plane
    const floorGeo = new THREE.PlaneGeometry(34, 34);
    const floorMat = new THREE.MeshPhongMaterial({
      color: 0xf7f3ea,
      specular: 0xfffcf5,
      shininess: 15,
      transparent: true,
      opacity: 0.95,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    floor.receiveShadow = true;
    scene.add(floor);

    // 4. District Elevation Pillars
    const validValues = districtData.map((d) => d.value).filter((v): v is number => v != null);
    const minVal = validValues.length ? Math.min(...validValues) : 0;
    const maxVal = validValues.length ? Math.max(...validValues) : 1;
    const range = Math.max(maxVal - minVal, 0.001);

    const pillarGroup = new THREE.Group();
    scene.add(pillarGroup);

    const pillars: { mesh: THREE.Mesh; item: typeof districtData[0] }[] = [];

    // Calculate Spatial Bounds for Geographic Placement
    const districtCoords = districtData.map((d) => {
      const def = findDistrict(d.districtId);
      return {
        id: d.districtId,
        lat: def?.centroid ? def.centroid[0] : 0,
        lng: def?.centroid ? def.centroid[1] : 0,
      };
    });

    const lats = districtCoords.map((c) => c.lat).filter((l) => l !== 0);
    const lngs = districtCoords.map((c) => c.lng).filter((l) => l !== 0);
    const minLat = lats.length ? Math.min(...lats) : 24;
    const maxLat = lats.length ? Math.max(...lats) : 30;
    const minLng = lngs.length ? Math.min(...lngs) : 77;
    const maxLng = lngs.length ? Math.max(...lngs) : 84;
    const latSpan = Math.max(maxLat - minLat, 1);
    const lngSpan = Math.max(maxLng - minLng, 1);
    const spatialScale = 16.0;

    // Grid parameters for matrix view
    const cols = Math.ceil(Math.sqrt(districtData.length));
    const spacing = 1.35;
    const offset = ((cols - 1) * spacing) / 2;

    districtData.forEach((item, index) => {
      let x = 0;
      let z = 0;

      if (viewMode === 'spatial') {
        const coord = districtCoords[index];
        if (coord && coord.lat !== 0 && coord.lng !== 0) {
          x = ((coord.lng - (minLng + maxLng) / 2) / lngSpan) * spatialScale;
          z = -((coord.lat - (minLat + maxLat) / 2) / latSpan) * spatialScale;
        } else {
          const row = Math.floor(index / cols);
          const col = index % cols;
          x = col * spacing - offset;
          z = row * spacing - offset;
        }
      } else {
        const row = Math.floor(index / cols);
        const col = index % cols;
        x = col * spacing - offset;
        z = row * spacing - offset;
      }

      const norm = item.value != null ? (item.value - minVal) / range : 0.05;
      const pillarHeight = Math.max(0.4, norm * 5.5);
      const pillarWidth = viewMode === 'spatial' ? 0.65 : 0.75;

      const boxGeo = new THREE.BoxGeometry(pillarWidth, pillarHeight, pillarWidth);
      boxGeo.translate(0, pillarHeight / 2, 0);

      // Earthy Historical Colors:
      // Sage Green: #5B7B5A (0x5b7b5a)
      // Antique Saffron: #C58A2B (0xc58a2b)
      // Terracotta: #C26743 (0xc26743)
      // Deep Slate: #3A5668 (0x3a5668)
      let colorHex = 0xc58a2b;
      if (metric.polarity === 'positive') {
        colorHex = norm > 0.65 ? 0x5b7b5a : norm > 0.35 ? 0xc58a2b : 0xc26743;
      } else if (metric.polarity === 'negative') {
        colorHex = norm < 0.35 ? 0x5b7b5a : norm < 0.65 ? 0xc58a2b : 0xc26743;
      } else {
        colorHex = norm > 0.5 ? 0x3a5668 : 0xc58a2b;
      }

      const boxMat = new THREE.MeshPhongMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.18,
        specular: 0xfffcf5,
        shininess: 45,
        transparent: true,
        opacity: 0.94,
      });

      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.position.set(x, 0, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = {
        districtId: item.districtId,
        districtName: item.districtName,
        value: item.value,
      };

      // Top Cap Ring in Antique Gold / Warm Parchment
      const capGeo = new THREE.BoxGeometry(pillarWidth + 0.06, 0.06, pillarWidth + 0.06);
      capGeo.translate(0, pillarHeight + 0.03, 0);
      const capMat = new THREE.MeshBasicMaterial({ color: 0xfffcf5 });
      const cap = new THREE.Mesh(capGeo, capMat);
      mesh.add(cap);

      pillarGroup.add(mesh);
      pillars.push({ mesh, item });
    });

    // 5. Lighting — Warm sunlight & gold fill
    const ambientLight = new THREE.AmbientLight(0xfffcf5, 1.1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff6e5, 1.8);
    dirLight.position.set(16, 26, 16);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const goldPoint = new THREE.PointLight(0xc58a2b, 2.0, 30);
    goldPoint.position.set(-10, 16, -10);
    scene.add(goldPoint);

    // 6. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouse = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const dx = clientX - prevMouse.x;
        const dy = clientY - prevMouse.y;
        pillarGroup.rotation.y += dx * 0.008;
        if (viewMode !== 'top') {
          camera.position.y = Math.max(6, Math.min(26, camera.position.y - dy * 0.05));
        }
        prevMouse = { x: clientX, y: clientY };
      }

      const rect = mount.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pillars.map((p) => p.mesh));

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        const data = obj.userData;
        if (data && data.districtName) {
          setHoveredDistrict({
            id: data.districtId,
            name: data.districtName,
            value: data.value,
            unit: metric.unit,
            label: metric.label,
          });
          mount.style.cursor = 'pointer';
        }
      } else {
        setHoveredDistrict(null);
        mount.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleClick = () => {
      if (hoveredDistrict) {
        navigate(`/india/${activeStateId}/${hoveredDistrict.id}`);
      }
    };

    mount.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    mount.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    mount.addEventListener('click', handleClick);

    // 7. Render Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isDragging && viewMode !== 'top') {
        pillarGroup.rotation.y += 0.0015;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = typeof height === 'number' ? height : mount.clientHeight || 540;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      mount.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      mount.removeEventListener('click', handleClick);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [districtData, metric, height, viewMode, hoveredDistrict, navigate, activeStateId]);

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-3.5 shadow-luxury">
      {/* Top Header & State / Metric Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold-500/20 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-500 shadow-sm">
            <Box size={18} />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-base-100 flex items-center gap-2">
              3D State Elevation Matrix · {currentState.name}
              <span className="rounded-md bg-gold-500/15 px-2 py-0.5 text-[10px] font-mono text-gold-600 font-semibold">
                {districtData.length} Districts
              </span>
            </h3>
            <p className="text-xs text-base-400">
              Tower height extrudes <span className="text-gold-600 font-semibold">{metric.label}</span> ({metric.unit})
            </p>
          </div>
        </div>

        {/* View Mode & State/Indicator Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-base-700 bg-base-900 p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode('spatial')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === 'spatial' ? 'bg-gold-500 text-white shadow-sm' : 'text-base-400 hover:text-base-100'
              }`}
              title="Geographic 3D Relief"
            >
              <Compass size={13} />
              Geographic 3D
            </button>
            <button
              onClick={() => setViewMode('iso')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === 'iso' ? 'bg-gold-500 text-white shadow-sm' : 'text-base-400 hover:text-base-100'
              }`}
              title="Isometric Matrix Grid"
            >
              <Layers size={13} />
              Grid
            </button>
            <button
              onClick={() => setViewMode('top')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === 'top' ? 'bg-gold-500 text-white shadow-sm' : 'text-base-400 hover:text-base-100'
              }`}
              title="Top-down View"
            >
              <Maximize2 size={13} />
              Top
            </button>
          </div>

          {/* State Selector */}
          {showStateSelector && (
            <select
              value={activeStateId}
              onChange={(e) => setActiveStateId(e.target.value)}
              className="rounded-lg border border-gold-500/40 bg-base-900 px-3 py-1.5 text-xs font-bold text-gold-600 focus:border-gold-500 focus:outline-none shadow-sm cursor-pointer"
            >
              {availableStates.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.districts.length} Districts)
                </option>
              ))}
            </select>
          )}

          {/* Indicator Selector */}
          <select
            value={indicatorSlug}
            onChange={(e) => {
              setIndicatorSlug(e.target.value);
              setMetricIndex(0);
            }}
            className="rounded-lg border border-base-700 bg-base-900 px-3 py-1.5 text-xs font-medium text-base-200 focus:border-gold-500 focus:outline-none shadow-sm"
          >
            {INDICATORS.map((ind) => (
              <option key={ind.slug} value={ind.slug}>
                {ind.name}
              </option>
            ))}
          </select>

          {/* Metric Sub-selector */}
          {indicator.metrics.length > 1 && (
            <select
              value={metricIndex}
              onChange={(e) => setMetricIndex(Number(e.target.value))}
              className="rounded-lg border border-base-700 bg-base-900 px-2.5 py-1.5 text-xs text-base-300 focus:border-gold-500 focus:outline-none shadow-sm"
            >
              {indicator.metrics.map((m, idx) => (
                <option key={m.key} value={idx}>
                  {m.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div ref={mountRef} className="w-full relative cursor-grab active:cursor-grabbing" style={{ height }} />

      {/* Hover Info Tooltip */}
      {hoveredDistrict && (
        <div className="absolute bottom-5 left-5 rounded-xl border border-gold-500/40 bg-base-900/98 p-4 shadow-luxury pointer-events-none animate-fadeIn z-20 min-w-[240px]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gold-600 font-semibold">
            {currentState.name} · District Focus
          </span>
          <h4 className="mt-0.5 font-display text-base font-bold text-base-100">{hoveredDistrict.name}</h4>
          <div className="mt-2 flex items-baseline justify-between border-t border-base-700 pt-2">
            <span className="text-xs text-base-400">{hoveredDistrict.label}:</span>
            <span className="text-base font-bold text-gold-600 tabular-nums">
              {formatMetricValue(hoveredDistrict.value, hoveredDistrict.unit, metric.precision)}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-historical-sage font-semibold">Click district to open full state telemetry →</p>
        </div>
      )}

      {/* Legend & Historical Colors */}
      <div className="absolute bottom-3 right-4 flex items-center gap-3 text-[11px] text-base-400 font-mono bg-base-900/95 px-3 py-1.5 rounded-lg border border-base-700 shadow-sm backdrop-blur-md">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#5B7B5A]" /> Sage
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C58A2B]" /> Saffron
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C26743]" /> Terracotta
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3A5668]" /> Slate
        </span>
      </div>
    </div>
  );
}
