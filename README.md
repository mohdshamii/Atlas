# 🗺️ Atlas — India Data Atlas

**An interactive civic & geographic data visualization platform for India.**
Launching with **Uttar Pradesh**, district-level, **2015–2024** — architected so every future state plugs in without rewriting the app.

[![Framework](https://img.shields.io/badge/framework-React%2018%20%2B%20TypeScript-61DAFB?logo=react&logoColor=white)](#tech-stack)
[![Build](https://img.shields.io/badge/build-Vite-646CFF?logo=vite&logoColor=white)](#tech-stack)
[![Styling](https://img.shields.io/badge/styling-Tailwind%20CSS-38BDF8?logo=tailwindcss&logoColor=white)](#tech-stack)
[![Maps](https://img.shields.io/badge/maps-Leaflet-199900?logo=leaflet&logoColor=white)](#tech-stack)
[![License](https://img.shields.io/badge/license-civic%2Feducational%20use-lightgrey)](#license)

---

## Table of contents

- [Data status — read this first](#data-status--read-this-first)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Data architecture](#data-architecture)
- [Map implementation](#map-implementation)
- [Extending the app](#extending-the-app)
- [Data sources & provenance](#data-sources--provenance)
- [Accessibility & responsiveness](#accessibility--responsiveness)
- [Testing status](#testing-status)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Data status — read this first

**No verified government statistics ship in this build.** Every number rendered by the UI is explicitly labeled with one of three states, so nothing can be mistaken for a real observation:

| Badge         | Meaning                                                                                          |
|---------------|----------------------------------------------------------------------------------------------------|
| **Verified**  | Sourced from a cited, official dataset with a recorded update date. *(Not used anywhere yet.)*    |
| **Demo data** | Deterministically generated for illustration — stable across reloads, never a real observation. This is what V1 shows everywhere. |
| **No data**   | Deliberately absent, to exercise the app's empty-state UI.                                        |

Full policy: the in-app **Data Sources** page (`/data-sources`), [`src/data/sources.ts`](./src/data/sources.ts), and [`public/geojson/README.md`](./public/geojson/README.md) for the map-boundary caveat specifically.

---

## Features

- **Hierarchical, URL-driven navigation** — India → State → District → Year → Indicator (e.g. `/india/uttar-pradesh/moradabad/2020/education`), so every view is a shareable, bookmarkable link.
- **Real interactive maps (Leaflet)** — a national map with per-state markers on the homepage, and a full choropleth of all 75 Uttar Pradesh districts with hover, click, zoom, pan, and reset-view.
- **11 locked top-level indicators** — Demographics, Education, Healthcare, Employment, Crime, Roads, Agriculture, Water, Electricity, Government Schemes, Environment — each with 4–6 defined metrics.
- **Reusable year selector (2015–2024)** shared identically across every indicator page — no per-year hardcoded pages.
- **KPI cards** with year-over-year change and trend direction.
- **Trend charts, district-comparison charts, and full data tables** per indicator, built with Recharts.
- **Global search** across states, districts, indicators, and metrics.
- **District comparison tool** (`/compare`) with per-metric deltas.
- **Dedicated Data Sources page** explaining provenance for every indicator.
- **Dark-first, fully responsive UI** with a purpose-built mobile navigation (not a squeezed desktop layout), keyboard-accessible controls, and `prefers-reduced-motion` support.
- **Honest empty/error states** for invalid districts, years, indicators, missing map data, and empty search results.

---

## Tech stack

| Layer      | Choice                                                             |
|------------|---------------------------------------------------------------------|
| Framework  | React 18 + TypeScript, bundled with Vite                          |
| Styling    | Tailwind CSS (custom dark-first palette)                           |
| Routing    | React Router v6                                                    |
| Maps       | Leaflet + React-Leaflet, GeoJSON                                   |
| Charts     | Recharts                                                            |
| Icons      | lucide-react                                                        |
| Data (V1)  | Local, deterministic demo generator — designed as a drop-in seam for a real API/DB |

> No paid APIs or external services are required to run this project.

---

## Project structure

```text
india-data-atlas/
├── public/
│   ├── favicon.svg
│   └── geojson/
│       ├── up_districts.geojson   # generated district polygons
│       ├── up_state.geojson       # generated state outline
│       └── README.md              # boundary-data disclaimer
├── scripts/
│   ├── districts.json             # flat district list fed to the generator
│   └── generate-geojson.mjs       # regenerates the two GeoJSON files above
├── src/
│   ├── charts/                    # TrendChart, ComparisonBarChart, DataTable
│   ├── components/
│   │   ├── common/                 # SearchBar, YearSelector, KpiCard, etc.
│   │   └── layout/                 # Header, Footer
│   ├── config/                    # indicators.ts, states.ts, years.ts — the "locked" config
│   ├── data/                      # districts.ts, demoData.ts, sources.ts
│   ├── hooks/                     # useDebounce
│   ├── layouts/                   # MainLayout
│   ├── maps/                      # IndiaMap, UPDistrictMap, MapLegend, colorScale
│   ├── pages/                     # one file per route
│   ├── services/                  # dataService.ts — the seam between UI and data
│   ├── types/                     # index.ts — the full data schema
│   ├── utils/                     # format.ts, prng.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig*.json
└── vite.config.ts
```

---

## Getting started

**Requirements:** Node.js 18+ and npm.

```bash
git clone https://github.com/mohdshamii/Atlas.git
cd Atlas
npm install
cp .env.example .env   # optional — defaults work out of the box
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173`.

### Production build

```bash
npm run build      # type-checks with tsc, then bundles with Vite into dist/
npm run preview    # serve the production build locally
```

> **Build provenance note:** this project was authored in a sandboxed environment with no outbound network access, so `npm install` / `npm run build` were never executed there to produce a verified artifact. Every file was hand-written and passed a standalone TypeScript/JSX syntax check, but treat your first local `npm install && npm run build` as the real compilation gate. Anything that surfaces is most likely a dependency version drift (see [Troubleshooting](#troubleshooting)) rather than a structural bug.

---

## Data architecture

The data flow is layered so demo data can be swapped for real data **without touching UI code**:

```text
src/config/indicators.ts    ← the 11 locked indicators + metric definitions (read-only to pages)
src/data/districts.ts       ← district reference list (id, name, centroid, division)
src/data/demoData.ts        ← THE ONLY FILE THAT GENERATES VALUES — swap this for a real API/DB call
src/data/sources.ts         ← source/provenance metadata
        ↓
src/services/dataService.ts ← KPIs, trends, rankings, comparisons, search — pages call only this
        ↓
src/pages/*.tsx              ← call dataService, never demoData or districts.ts directly
```

Every value conforms to the `MetricValue` schema (`src/types/index.ts`):

```ts
{
  state: "Uttar Pradesh",
  district: "Moradabad",
  year: 2020,
  indicator: "education",
  metric: "literacy_rate",
  value: 58.2,            // or null if unavailable
  unit: "%",
  status: "demo",         // "verified" | "demo" | "unavailable"
  source: {
    sourceName: "...",
    sourceUrl: "",
    datasetName: "...",
    year: 2020,
    coverage: "Uttar Pradesh, district-level",
    updateDate: "",
    notes: "..."
  }
}
```

### How demo data is generated

`src/data/demoData.ts` uses a **seeded PRNG** (`src/utils/prng.ts`) keyed on `(district, indicator, metric, year)` — the same URL always renders the same numbers across reloads, without ever hardcoding a real statistic. ~4% of cells are deterministically marked `unavailable` to exercise the missing-data UI paths.

### Replacing demo data with verified data

1. Obtain a verified dataset (CSV / JSON / API) sharing the same dimensions: state, district, year, indicator, metric.
2. Reimplement the body of `getMetricValue` (and the other exports) in `src/data/demoData.ts` — or add a new module and repoint `src/services/dataService.ts` at it — to return real values with `status: 'verified'` and populated `source` metadata.
3. No page or component needs to change, since everything consumes `dataService` exclusively.

---

## Map implementation

- **Home page** (`src/maps/IndiaMap.tsx`) — a real Leaflet map on dark CARTO basemap tiles, centered on India, with one marker per state. Uttar Pradesh is clickable; other states show a "coming soon" popup.
- **District map** (`src/maps/UPDistrictMap.tsx`) — renders `public/geojson/up_districts.geojson` as a Leaflet `GeoJSON` layer, with choropleth shading driven by whichever metric the page is displaying, hover highlighting + tooltips, click-to-navigate, and a reset-view control.

### About the GeoJSON boundaries

The sandbox this project was built in had no internet access, so no authoritative Survey-of-India-grade boundary file could be downloaded. Instead, `scripts/generate-geojson.mjs` builds a **bounded Voronoi tessellation** from each district's approximate centroid — a genuine computational-geometry technique (convex hull + perpendicular-bisector half-plane clipping, no external GIS library required). This yields 75 real, non-overlapping polygons that tile the state and support full choropleth/hover/click interaction — but the shapes are a **simplified approximation, not an authoritative boundary dataset**. See `public/geojson/README.md` for the complete disclaimer.

Regenerate anytime with:

```bash
node scripts/generate-geojson.mjs
```

**Upgrading to real boundaries:** replace `public/geojson/up_districts.geojson` with a properly sourced file (e.g. from an official GIS provider) whose `properties.id` matches the `id` values in `src/data/districts.ts`, plus `properties.name`. No map component code needs to change.

---

## Extending the app

### Add a new state

1. Create `src/data/<state>-districts.ts` with a `District[]` array shaped like `src/data/districts.ts`.
2. Generate centroid-based GeoJSON for the state (adapt `scripts/generate-geojson.mjs`, or supply real boundaries) into `public/geojson/<state>_districts.geojson` and `<state>_state.geojson`.
3. Register the state in `STATES` (`src/config/states.ts`) with `status: 'available'` and the new district array.
4. Update `UPDistrictMap.tsx` — or generalize it into a `StateDistrictMap.tsx` that accepts a `geojsonPath` prop — to load the correct GeoJSON for the active state.

No routing, page, or indicator code needs to change; the app already reads states generically from the registry.

### Add a new district

Add an entry to the relevant state's district array (e.g. `src/data/districts.ts`) with a unique `id`, `name`, `stateId`, and `centroid`. Regenerate GeoJSON via the Voronoi script, or add the district's polygon to your authoritative boundary file with a matching `properties.id`.

### Add a new indicator metric

Add an entry to the relevant indicator's `metrics` array in `src/config/indicators.ts` (key, label, unit, description, polarity, precision), then add a plausible value range to `METRIC_RANGES` in `src/data/demoData.ts`. KPI cards, trend charts, comparison charts, and the data table all pick it up automatically.

> ⚠️ Per the project's locked spec: **do not add new top-level indicators** — only new metrics within the existing 11.

---

## Data sources & provenance

See the in-app **Data Sources** page (`/data-sources`) and `src/data/sources.ts`:

- Every value carries a `status` (`verified` / `demo` / `unavailable`) and a `source` object.
- This build ships **only** `demo` and `unavailable` values — no statistic is ever presented as fact.
- `src/data/sources.ts` also documents, purely as integration guidance, which official Indian government source each indicator would typically draw from once real data is connected (Census of India, UDISE+, NCRB, MoRTH, CEA, FSI/CPCB, etc.). None of these currently power any figure shown.

---

## Accessibility & responsiveness

**Accessibility**
- Skip-to-content link and semantic landmarks (`header`, `main`, `footer`, `nav`).
- All interactive controls are real `<button>` / `<a>` / `<select>` / `<input>` elements with visible focus rings and `aria-label`s where text isn't self-describing.
- Color is never the sole signal — status badges and trend arrows always carry a text label.
- `prefers-reduced-motion` disables non-essential animation.
- Map tooltips/popups are supplementary; identical data is always available in the data table below each map.

**Responsive design**
- Header collapses to a hamburger menu with its own search and nav on mobile — not a shrunk desktop bar.
- Maps resize to full-width single-column layouts below the `lg` breakpoint.
- KPI grids reflow 4 → 3 → 2 columns; comparison and data tables scroll horizontally on narrow screens.
- Touch targets are sized for mobile (44px+ tap areas on primary controls).

---

## Testing status

Built without live network access, so the following was verified **without** an actual `npm install`:

- Every `@/...` import path resolves correctly against the real file tree (checked with a standalone `tsc` pass using ambient stub type declarations for external packages — catches typos, missing files, and structural mistakes, though not full third-party type compatibility).
- Generated GeoJSON validated as well-formed JSON with 75 non-degenerate district polygons and no gaps.
- Manual review of every route, prop, and data-flow path described above.

**Not yet verified locally:** `npm install` resolution, `npm run build` (Vite + `tsc -b`), the production bundle, and interactive browser behavior (map rendering, chart rendering, click-through navigation). Run `npm run dev` first and report anything unexpected — the architecture is designed so a fix should stay localized to a single file.

---

## Troubleshooting

- **Peer dependency / version resolution errors** — `package.json` pins versions current as of early/mid-2025. If npm resolves a breaking newer major of `react-router-dom`, `recharts`, or `react-leaflet`, pin explicitly (e.g. `npm install react-router-dom@6.26.2`) or run `npm install --legacy-peer-deps`.
- **Leaflet marker/CSS issues** — confirm `leaflet/dist/leaflet.css` is imported exactly once, in `src/main.tsx` (already wired) — don't re-import it inside components.
- **Blank map / 404 on GeoJSON** — confirm `public/geojson/up_districts.geojson` and `up_state.geojson` exist; regenerate with `node scripts/generate-geojson.mjs` (plain Node, no dependencies).

---

## Contributing

1. Fork/branch from `main`.
2. Keep the 11 top-level indicators locked — add metrics, never new categories.
3. Any real data source integration must set `status: 'verified'` and populate real `source` metadata — never silently mark demo data as verified.
4. Run `npm run lint` and `npm run build` before opening a PR.
5. In your PR description, note which section of this README (if any) needs updating (e.g. "How to add a new state").

---

## License

Provided as-is for civic/educational use. No license for any underlying government data is implied — verify the licensing terms of any real dataset you integrate (e.g. Census of India, NCRB, UDISE+) before redistributing derived data.
