/**
 * India Data Atlas - 3D District Relief & Elevation Engine
 * Extrudes district coordinates into 3D isometric pillars with metric height
 * and earthy historical color gradients (Sage, Saffron, Terracotta).
 */

function initDistrict3DElevation(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth;
  const height = options.height || container.clientHeight || 540;
  const stateId = options.stateId || 'uttar-pradesh';
  const indicatorSlug = options.indicatorSlug || 'education';
  const metricKey = options.metricKey || 'literacy_rate';
  const year = options.year || 2024;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 18, 22);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xFDF6E2, 1.4);
  dirLight.position.set(10, 20, 15);
  scene.add(dirLight);

  const stageGroup = new THREE.Group();
  scene.add(stageGroup);

  // Base Grid Plane
  const gridHelper = new THREE.GridHelper(30, 20, 0xD4AF37, 0x222D42);
  gridHelper.position.y = -0.05;
  stageGroup.add(gridHelper);

  const pillars = [];
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.display = 'none';
  tooltip.style.background = 'rgba(14, 19, 30, 0.95)';
  tooltip.style.border = '1px solid #D4AF37';
  tooltip.style.borderRadius = '8px';
  tooltip.style.padding = '8px 12px';
  tooltip.style.color = '#F8FAFC';
  tooltip.style.fontSize = '12px';
  tooltip.style.fontFamily = 'JetBrains Mono, monospace';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.zIndex = '100';
  tooltip.style.boxShadow = '0 8px 24px rgba(0,0,0,0.8)';
  container.style.position = 'relative';
  container.appendChild(tooltip);

  // Fetch district data for this state
  fetch(`/api/ranking/${indicatorSlug}/${metricKey}/${year}?state=${stateId}`)
    .then((res) => res.json())
    .then((data) => {
      const rows = data.ranked || [];
      if (rows.length === 0) return;

      const values = rows.map((r) => r.value);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const span = maxVal - minVal || 1.0;

      // Calculate centroid bounding box for centering
      let minLat = 999, maxLat = -999, minLng = 999, maxLng = -999;
      rows.forEach((r) => {
        if (r.centroid) {
          minLat = Math.min(minLat, r.centroid[0]);
          maxLat = Math.max(maxLat, r.centroid[0]);
          minLng = Math.min(minLng, r.centroid[1]);
          maxLng = Math.max(maxLng, r.centroid[1]);
        }
      });

      const centerLat = (minLat + maxLat) / 2 || 26.85;
      const centerLng = (minLng + maxLng) / 2 || 80.90;

      rows.forEach((d) => {
        const val = d.value || minVal;
        const norm = (val - minVal) / span; // 0.0 to 1.0
        const pillarHeight = Math.max(0.5, norm * 7.5);

        // Coordinate projection relative to center
        const lat = d.centroid ? d.centroid[0] : centerLat;
        const lng = d.centroid ? d.centroid[1] : centerLng;
        const posX = (lng - centerLng) * 2.8;
        const posZ = -(lat - centerLat) * 2.8;

        // Earthy Historical Palette
        let colorHex = 0xC58A2B; // Saffron (mid)
        if (norm >= 0.65) colorHex = 0x5B7B5A; // Sage Green (high/best)
        else if (norm <= 0.35) colorHex = 0xC26743; // Terracotta (low/distress)

        const pillarGeo = new THREE.CylinderGeometry(0.35, 0.45, pillarHeight, 18);
        const pillarMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: 0.3,
          metalness: 0.1,
        });
        const mesh = new THREE.Mesh(pillarGeo, pillarMat);
        mesh.position.set(posX, pillarHeight / 2, posZ);
        mesh.userData = {
          id: d.districtId,
          name: d.districtName,
          value: val,
          metric: metricKey,
        };

        stageGroup.add(mesh);
        pillars.push(mesh);
      });
    });

  // Orbital Drag Controls
  let isDragging = false;
  let prevPos = { x: 0, y: 0 };

  renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevPos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  renderer.domElement.addEventListener('mousemove', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (isDragging) {
      const dx = e.clientX - prevPos.x;
      const dy = e.clientY - prevPos.y;
      stageGroup.rotation.y += dx * 0.008;
      prevPos = { x: e.clientX, y: e.clientY };
    }

    // Raycast hover detection
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
    const hits = raycaster.intersectObjects(pillars);

    if (hits.length > 0) {
      const item = hits[0].object.userData;
      tooltip.style.display = 'block';
      tooltip.style.left = `${e.clientX - rect.left + 15}px`;
      tooltip.style.top = `${e.clientY - rect.top - 20}px`;
      tooltip.innerHTML = `
        <div style="font-weight: bold; color: #D4AF37;">${item.name}</div>
        <div style="color: #94A3B8; margin-top: 2px;">Value: <span style="color: #F8FAFC; font-weight: bold;">${item.value}</span></div>
      `;
    } else {
      tooltip.style.display = 'none';
    }
  });

  // Click to navigate
  renderer.domElement.addEventListener('click', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(pillars);

    if (hits.length > 0) {
      const item = hits[0].object.userData;
      window.location.href = `/india/${stateId}/${item.id}`;
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = options.height || container.clientHeight || 540;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}
