import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STATES } from '@/config/states';
import { useNavigate } from 'react-router-dom';
import { RotateCw, Sparkles } from 'lucide-react';

interface India3DGlobeProps {
  height?: number | string;
  onSelectState?: (stateId: string) => void;
  interactive?: boolean;
}

export default function India3DGlobe({ height = 450, onSelectState, interactive = true }: India3DGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState<{ name: string; capital: string; id: string } | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const heightPx = typeof height === 'number' ? height : mount.clientHeight || 450;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 3. Globe Core — Warm parchment antique globe
    const globeRadius = 2.0;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Warm parchment core sphere
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0xede6d6, // warm muted parchment
      emissive: 0xe5dec9,
      specular: 0xfffcf5,
      shininess: 20,
      transparent: true,
      opacity: 0.96,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // Wireframe Grid Ring (Antique Gold / Saffron)
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xc58a2b, // Antique Gold #C58A2B
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframeMesh = new THREE.Mesh(sphereGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    // Outer Atmospheric Glow (Warm antique gold halo)
    const haloGeo = new THREE.SphereGeometry(globeRadius * 1.15, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xc58a2b,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);

    // 4. Dot Particle Matrix on Globe Surface (Earthy Historical Constellation)
    const particleCount = 1800;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const saffronColor = new THREE.Color(0xc58a2b); // antique gold/saffron
    const terracottaColor = new THREE.Color(0xc26743); // terracotta
    const sageColor = new THREE.Color(0x5b7b5a); // sage green
    const slateColor = new THREE.Color(0x3a5668); // slate
    const beigeColor = new THREE.Color(0xddd8cc); // soft beige

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const r = globeRadius + 0.015;

      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Color variation using earthy historical palette
      const rand = Math.random();
      const c = rand > 0.8 ? saffronColor : rand > 0.6 ? terracottaColor : rand > 0.4 ? sageColor : rand > 0.2 ? slateColor : beigeColor;
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particles);

    // 5. Convert Lat/Lng to Vector3 on sphere
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 6. Interactive State Beacons
    const beaconMeshes: { mesh: THREE.Mesh; state: typeof STATES[0] }[] = [];
    const beaconGroup = new THREE.Group();
    globeGroup.add(beaconGroup);

    STATES.forEach((state) => {
      const pos = latLngToVector3(state.centroid[0], state.centroid[1], globeRadius + 0.03);
      const isAvailable = state.status === 'available';

      // Pin base ring
      const ringGeo = new THREE.RingGeometry(0.03, 0.065, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isAvailable ? 0xc58a2b : 0x8e8d85,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isAvailable ? 0.95 : 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      beaconGroup.add(ring);

      // Pin center glowing sphere
      const beaconGeo = new THREE.SphereGeometry(isAvailable ? 0.048 : 0.028, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: isAvailable ? 0xc58a2b : 0x6b6b63,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(pos);
      beacon.userData = { stateId: state.id, stateName: state.name, capital: state.capital };
      beaconGroup.add(beacon);

      beaconMeshes.push({ mesh: beacon, state });
    });

    // 7. Pulse Arcs connecting major capitals (Antique Gold / Saffron lines)
    const connections = [
      ['uttar-pradesh', 'maharashtra'],
      ['uttar-pradesh', 'karnataka'],
      ['maharashtra', 'karnataka'],
      ['maharashtra', 'gujarat'],
      ['uttar-pradesh', 'bihar'],
      ['karnataka', 'tamil-nadu'],
    ];

    connections.forEach(([s1, s2]) => {
      const state1 = STATES.find((s) => s.id === s1);
      const state2 = STATES.find((s) => s.id === s2);
      if (!state1 || !state2) return;

      const p1 = latLngToVector3(state1.centroid[0], state1.centroid[1], globeRadius + 0.02);
      const p2 = latLngToVector3(state2.centroid[0], state2.centroid[1], globeRadius + 0.02);

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.setLength(globeRadius + 0.02 + dist * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(30);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xc58a2b,
        transparent: true,
        opacity: 0.5,
      });
      const arc = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arc);
    });

    // Initial rotation oriented toward India
    globeGroup.rotation.y = -Math.PI / 2.2;
    globeGroup.rotation.x = 0.35;

    // 8. Lighting
    const ambientLight = new THREE.AmbientLight(0xfffcf5, 1.1);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xc58a2b, 2.2, 20);
    goldPointLight.position.set(5, 4, 6);
    scene.add(goldPointLight);

    const warmFillLight = new THREE.PointLight(0xc26743, 1.2, 20);
    warmFillLight.position.set(-5, -4, -4);
    scene.add(warmFillLight);

    // 9. Interaction / Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging && interactive) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;

        globeGroup.rotation.y += deltaX * 0.006;
        globeGroup.rotation.x = Math.max(-0.8, Math.min(0.8, globeGroup.rotation.x + deltaY * 0.006));

        previousMousePosition = { x: clientX, y: clientY };
      }

      // Hover Raycasting
      const rect = mount.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(beaconMeshes.map((b) => b.mesh));

      if (intersects.length > 0) {
        const item = intersects[0].object.userData;
        if (item && item.stateName) {
          setHoveredState({ name: item.stateName, capital: item.capital, id: item.stateId });
          mount.style.cursor = 'pointer';
        }
      } else {
        setHoveredState(null);
        mount.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleClick = () => {
      if (!hoveredState) return;
      if (onSelectState) {
        onSelectState(hoveredState.id);
      } else {
        navigate(`/india/${hoveredState.id}`);
      }
    };

    mount.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    mount.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    mount.addEventListener('click', handleClick);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        globeGroup.rotation.y += 0.003;
      }

      // Pulse beacons
      const elapsed = clock.getElapsedTime();
      const scale = 1 + Math.sin(elapsed * 3) * 0.15;
      beaconMeshes.forEach(({ mesh }) => {
        mesh.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 11. Handle Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = typeof height === 'number' ? height : mount.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
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
  }, [height, autoRotate, interactive, onSelectState, navigate]);

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-2 shadow-luxury group">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" style={{ height }} />

      {/* Floating Telemetry HUD */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1 z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/35 bg-base-900/90 px-3 py-1 text-[11px] font-mono text-gold-600 font-semibold shadow-sm">
          <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: '#5B7B5A' }} />
          3D GEOSPATIAL TELEMETRY
        </div>
        <p className="text-[11px] text-base-400 font-sans pl-1">
          Warm Parchment Globe · Pan-India State Beacons
        </p>
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-all ${
            autoRotate
              ? 'border-gold-500/50 bg-gold-500/15 text-gold-600'
              : 'border-base-700 bg-base-900/90 text-base-400 hover:text-base-100'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '8s' }} />
          <span>{autoRotate ? 'Orbit On' : 'Orbit Off'}</span>
        </button>
      </div>

      {/* Hover Information Tooltip Card */}
      {hoveredState && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-72 rounded-xl border border-gold-500/40 bg-base-900/95 p-3.5 shadow-luxury pointer-events-none animate-fadeIn z-20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gold-600 font-bold uppercase tracking-wider">State Beacon</span>
            <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: 'rgba(91,123,90,0.18)', color: '#5B7B5A' }}>
              Available
            </span>
          </div>
          <h4 className="mt-1 font-display text-base font-bold text-base-100">{hoveredState.name}</h4>
          <p className="text-xs text-base-400">Capital: <span className="text-base-200 font-semibold">{hoveredState.capital}</span></p>
          <p className="mt-2 text-[11px] text-gold-600 font-semibold">Click state beacon to drill into districts →</p>
        </div>
      )}

      {/* Bottom helper info */}
      <div className="absolute bottom-3 right-4 pointer-events-none hidden sm:flex items-center gap-2 text-[11px] text-base-400 font-mono">
        <Sparkles size={12} className="text-gold-600" />
        <span>Drag to rotate · Click beacon nodes</span>
      </div>
    </div>
  );
}
