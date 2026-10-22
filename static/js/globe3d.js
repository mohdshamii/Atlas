/**
 * India Data Atlas - WebGL 3D Holographic Globe
 * Powered by Three.js. Renders state telemetry beacons, capital nodes,
 * and inter-state economic arcs on an antique parchment sphere.
 */

function initIndia3DGlobe(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth;
  const height = options.height || container.clientHeight || 480;

  // 1. Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 5.2);

  // 2. Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // 3. Globe Group
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const globeRadius = 2.0;

  // Parchment / Antique Gold Core Sphere
  const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
  const sphereMat = new THREE.MeshPhongMaterial({
    color: 0x1A2234, // deep cosmic navy
    emissive: 0x0E1422,
    specular: 0xD4AF37,
    shininess: 25,
    transparent: true,
    opacity: 0.95,
  });
  const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
  globeGroup.add(globeMesh);

  // Golden Lat/Long Grid Rings
  const wireGeo = new THREE.SphereGeometry(globeRadius * 1.002, 32, 16);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xD4AF37,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  globeGroup.add(wireMesh);

  // Outer Atmosphere Glow
  const glowGeo = new THREE.SphereGeometry(globeRadius * 1.04, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x6366F1,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
  });
  globeGroup.add(new THREE.Mesh(glowGeo, glowMat));

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xFDF6E2, 1.6);
  dirLight.position.set(5, 4, 3);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xD4AF37, 2, 20);
  pointLight.position.set(0, 2, 4);
  scene.add(pointLight);

  // Geographic Coordinate Helper (lat, lng -> 3D position)
  function latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  // Key State Nodes & Beacons
  const STATE_NODES = [
    { id: 'uttar-pradesh', name: 'Uttar Pradesh', capital: 'Lucknow', lat: 26.85, lng: 80.90, color: 0xD4AF37 },
    { id: 'maharashtra', name: 'Maharashtra', capital: 'Mumbai', lat: 18.93, lng: 72.83, color: 0x10B981 },
    { id: 'karnataka', name: 'Karnataka', capital: 'Bengaluru', lat: 12.97, lng: 77.59, color: 0x6366F1 },
    { id: 'gujarat', name: 'Gujarat', capital: 'Gandhinagar', lat: 23.21, lng: 72.63, color: 0xF59E0B },
    { id: 'tamil-nadu', name: 'Tamil Nadu', capital: 'Chennai', lat: 13.08, lng: 80.27, color: 0x06B6D4 },
    { id: 'bihar', name: 'Bihar', capital: 'Patna', lat: 25.59, lng: 85.13, color: 0xEC4899 },
  ];

  const beacons = [];

  STATE_NODES.forEach((st) => {
    const pos = latLngToVector3(st.lat, st.lng, globeRadius);

    // Node Pin
    const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const pinMat = new THREE.MeshStandardMaterial({
      color: st.color,
      emissive: st.color,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.copy(pos);
    pin.userData = st;
    globeGroup.add(pin);
    beacons.push(pin);

    // Pulse Ring
    const ringGeo = new THREE.RingGeometry(0.05, 0.08, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: st.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos.clone().multiplyScalar(1.002));
    ring.lookAt(pos.clone().multiplyScalar(2));
    globeGroup.add(ring);
  });

  // Economic Connecting Arcs between Lucknow, Mumbai, Bengaluru, Chennai
  const ARC_PAIRS = [
    [STATE_NODES[0], STATE_NODES[1]], // Lucknow -> Mumbai
    [STATE_NODES[0], STATE_NODES[2]], // Lucknow -> Bengaluru
    [STATE_NODES[1], STATE_NODES[2]], // Mumbai -> Bengaluru
    [STATE_NODES[2], STATE_NODES[4]], // Bengaluru -> Chennai
    [STATE_NODES[0], STATE_NODES[5]], // Lucknow -> Patna
  ];

  ARC_PAIRS.forEach(([n1, n2]) => {
    const p1 = latLngToVector3(n1.lat, n1.lng, globeRadius);
    const p2 = latLngToVector3(n2.lat, n2.lng, globeRadius);

    // Midpoint elevated
    const mid = p1.clone().add(p2).multiplyScalar(0.5);
    const dist = p1.distanceTo(p2);
    mid.normalize().multiplyScalar(globeRadius + dist * 0.25);

    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const points = curve.getPoints(40);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
    const arcMat = new THREE.LineBasicMaterial({
      color: 0xD4AF37,
      transparent: true,
      opacity: 0.45,
    });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    globeGroup.add(arcLine);
  });

  // Center Globe rotation around India (~23°N, 79°E)
  globeGroup.rotation.x = 0.35;
  globeGroup.rotation.y = -1.35;

  // Interaction: Drag Orbit & Raycaster
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let autoRotate = true;

  renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  renderer.domElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y,
    };

    globeGroup.rotation.y += deltaMove.x * 0.005;
    globeGroup.rotation.x += deltaMove.y * 0.005;

    previousMousePosition = { x: e.clientX, y: e.clientY };
    autoRotate = false;
  });

  // Beacon Click Navigation
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener('click', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(beacons);

    if (intersects.length > 0) {
      const stateData = intersects[0].object.userData;
      if (options.onSelectState) {
        options.onSelectState(stateData.id);
      } else {
        window.location.href = `/india/${stateData.id}`;
      }
    }
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    if (autoRotate) {
      globeGroup.rotation.y += 0.002;
    }
    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = options.height || container.clientHeight || 480;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}
