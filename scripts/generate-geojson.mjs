// Generates simplified, demo-quality GeoJSON boundaries for Uttar Pradesh
// districts from their approximate centroids, using a bounded Voronoi
// tessellation (convex hull + half-plane clipping). No external GIS data or
// libraries are used — this is intentionally a simplified visualization aid,
// NOT an authoritative boundary dataset. See public/geojson/README.md.
//
// Run with: node scripts/generate-geojson.mjs

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Keep this list in sync with src/data/districts.ts
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Minimal re-declaration to avoid importing TS directly from a plain node script.
const DISTRICTS = JSON.parse(require('fs').readFileSync(path.join(__dirname, 'districts.json'), 'utf-8'));

// ---- Geometry helpers (points as [lng, lat] for GeoJSON convention) ----

function toXY([lat, lng]) {
  return [lng, lat];
}

function cross(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

function convexHull(points) {
  const pts = [...points].sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
  const n = pts.length;
  const hull = [];
  for (let i = 0; i < n; i++) {
    while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], pts[i]) <= 0) {
      hull.pop();
    }
    hull.push(pts[i]);
  }
  const lower = hull.length;
  for (let i = n - 2; i >= 0; i--) {
    while (hull.length > lower && cross(hull[hull.length - 2], hull[hull.length - 1], pts[i]) <= 0) {
      hull.pop();
    }
    hull.push(pts[i]);
  }
  hull.pop();
  return hull;
}

function scalePolygonFromCentroid(poly, factor) {
  const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
  const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
  return poly.map(([x, y]) => [cx + (x - cx) * factor, cy + (y - cy) * factor]);
}

// Sutherland-Hodgman clip of convex polygon `subject` by the half-plane
// containing point `keep`, bounded by the line perpendicular to (a->b)
// through the midpoint of a,b (i.e. the Voronoi bisector), or by an
// arbitrary convex polygon edge when clipping against the hull.
function clipHalfPlane(subject, inside) {
  const output = [];
  const n = subject.length;
  for (let i = 0; i < n; i++) {
    const curr = subject[i];
    const prev = subject[(i - 1 + n) % n];
    const currIn = inside(curr);
    const prevIn = inside(prev);
    if (currIn) {
      if (!prevIn) output.push(intersect(prev, curr, inside));
      output.push(curr);
    } else if (prevIn) {
      output.push(intersect(prev, curr, inside));
    }
  }
  return output;
}

function intersect(p1, p2, inside) {
  // Binary search along the segment for the boundary crossing (robust for any inside() test)
  let lo = 0;
  let hi = 1;
  const at = (t) => [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
  const loIn = inside(p1);
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const pt = at(mid);
    if (inside(pt) === loIn) lo = mid;
    else hi = mid;
  }
  return at((lo + hi) / 2);
}

function bisectorInsideTest(site, other) {
  // Returns a function: point -> true if point is on the `site` side of the
  // perpendicular bisector between site and other.
  const mx = (site[0] + other[0]) / 2;
  const my = (site[1] + other[1]) / 2;
  const dx = other[0] - site[0];
  const dy = other[1] - site[1];
  return (p) => dx * (p[0] - mx) + dy * (p[1] - my) <= 0;
}

function polygonArea(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

// ---- Build ----

const sites = DISTRICTS.map((d) => toXY(d.centroid));
const hull = convexHull(sites);
const paddedHull = scalePolygonFromCentroid(hull, 1.08);

const districtFeatures = DISTRICTS.map((d, idx) => {
  const site = sites[idx];
  let cell = paddedHull;
  for (let j = 0; j < sites.length; j++) {
    if (j === idx) continue;
    const other = sites[j];
    // Skip clipping against very distant points to reduce over-clipping noise;
    // keep the nearest ~18 neighbors, which is sufficient for a stable cell.
    cell = clipHalfPlane(cell, bisectorInsideTest(site, other));
    if (cell.length === 0) break;
  }
  if (cell.length === 0) {
    // Degenerate fallback: a tiny square around the site so every district
    // always renders something on the map.
    const eps = 0.03;
    cell = [
      [site[0] - eps, site[1] - eps],
      [site[0] + eps, site[1] - eps],
      [site[0] + eps, site[1] + eps],
      [site[0] - eps, site[1] + eps],
    ];
  }
  const ring = [...cell, cell[0]];
  return {
    type: 'Feature',
    properties: {
      id: d.id,
      name: d.name,
      stateId: 'uttar-pradesh',
      division: d.division || null,
      areaUnits: Math.round(polygonArea(cell) * 111 * 111 * 100) / 100, // very rough sq-km-ish estimate
    },
    geometry: {
      type: 'Polygon',
      coordinates: [ring],
    },
  };
});

const districtCollection = {
  type: 'FeatureCollection',
  properties: {
    generated: true,
    method: 'bounded-voronoi-from-centroids',
    disclaimer:
      'Simplified, demo-quality district boundaries generated from approximate centroids for visualization purposes only. NOT an authoritative survey/GIS boundary dataset.',
  },
  features: districtFeatures,
};

const stateBoundary = {
  type: 'FeatureCollection',
  properties: {
    generated: true,
    disclaimer: 'Simplified convex-hull approximation of the Uttar Pradesh outline, for demo visualization only.',
  },
  features: [
    {
      type: 'Feature',
      properties: { id: 'uttar-pradesh', name: 'Uttar Pradesh' },
      geometry: {
        type: 'Polygon',
        coordinates: [[...paddedHull, paddedHull[0]]],
      },
    },
  ],
};

const outDir = path.join(__dirname, '..', 'public', 'geojson');
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, 'up_districts.geojson'), JSON.stringify(districtCollection));
writeFileSync(path.join(outDir, 'up_state.geojson'), JSON.stringify(stateBoundary));

console.log(`Generated ${districtFeatures.length} district polygons.`);
console.log('Wrote public/geojson/up_districts.geojson and public/geojson/up_state.geojson');
