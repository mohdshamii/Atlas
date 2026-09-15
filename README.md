# India Data Atlas

An interactive, civic/geographic data visualization platform for India — starting
with **Uttar Pradesh, district-level, 2015–2024** — built to expand to every state
without rewriting the application.

---

##  Read this first: data status

**No verified government statistics are included in this build.** Every number
you see is clearly labeled:

| Badge | Meaning |
|---|---|
| **Verified** | Sourced from a cited, official dataset with a recorded update date. *(Not used anywhere yet in this build.)* |
| **Demo data** | Deterministically generated for illustration only — stable across reloads, but not a real observation. This is what you'll see everywhere in V1. |
| **No data** | Neither verified nor demo data exists for that district/metric/year — shown deliberately, to exercise the app's empty-data states. |

See [Data Sources](#data-sources--provenance) below and the in-app **Data
Sources** page for the full policy, and `public/geojson/README.md` for a note
on the map boundary data specifically.

---

## Features

- **Hierarchical navigation**: India → State → District → Year → Indicator,
  reflected in shareable URLs (e.g. `/india/uttar-pradesh/moradabad/2020/education`)
- **Real interactive maps** (Leaflet): a national map with state markers on the
  home page, and a full choropleth map of all 75 Uttar Pradesh districts with
  hover, click, zoom, pan, and reset
- **11 locked top-level indicators**: Demographics, Education, Healthcare,
  Employment, Crime, Roads, Agriculture, Water, Electricity, Government
  Schemes, Environment — each with 4–6 defined metrics
- **Reusable year selector** (2015–2024) that works identically across every
  indicator page — no per-year hardcoded pages
- **KPI cards** with year-over-year change and trend direction
- **Trend charts, district comparison charts, and full data tables** per
  indicator (Recharts)
- **Global search** across states, districts, indicators, and metrics
- **District comparison tool** (`/compare`) with per-metric differences
- **Dedicated Data Sources page** explaining provenance for every indicator
- **Dark-first, responsive UI** with a distinct mobile navigation (not just a
  squeezed desktop layout), keyboard-accessible controls, and reduced-motion support
- **Honest empty/error states** for invalid districts, years, indicators, missing
  map data, and empty search

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript, built with Vite |
| Styling | Tailwind CSS (dark-first custom palette) |
| Routing | React Router v6 |
| Maps | Leaflet + React-Leaflet, GeoJSON |
| Charts | Recharts |
| Icons | lucide-react |
| Data (V1) | Local, deterministic demo generator (see below) — designed to be swapped for a real API/DB |

No paid APIs are required to run this project.

---

## Project structure

```
india-data-atlas/
├── public/
│   ├── favicon.svg
│   └── geojson/
│       ├── up_districts.geojson   # generated district polygons (see below)
│       ├── up_state.geojson       # generated state outline
│       └── README.md              # boundary-data disclaimer
├── scripts/
│   ├── districts.json             # flat district list consumed by the generator
│   └── generate-geojson.mjs       # regenerates the two GeoJSON files above
├── src/
│   ├── charts/                    # TrendChart, ComparisonBarChart, DataTable
│   ├── components/
│   │   ├── common/                # SearchBar, YearSelector, KpiCard, etc.
│   │   └── layout/                # Header, Footer
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

## Installation

Requires **Node.js 18+** and npm.

```bash
cd india-data-atlas
npm install
cp .env.example .env   # optional — defaults work out of the box
```

> **Note on this delivery:** the sandbox this project was built in has no
> outbound network access, so `npm install` and `npm run build` could not be
> executed here to produce a verified build artifact. Every file was written
> by hand and passed a best-effort standalone TypeScript/JSX syntax check, but
> **you should run the install and build yourself** as the first real
> compilation. If anything surfaces, it's most likely a version mismatch in
> `package.json` (see Troubleshooting below) rather than a structural issue.

## Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173`.

## Build

```bash
npm run build      # type-checks with tsc, then builds with Vite into dist/
npm run preview    # serve the production build locally
```

## Troubleshooting a first build

- **Peer dependency or version resolution errors**: the `package.json`
  versions were current as of early/mid-2025 knowledge; if npm resolves a
  breaking newer major version of `react-router-dom`, `recharts`, or
  `react-leaflet`, pin to the versions listed in `package.json` (`npm install
  react-router-dom@6.26.2` etc.) or run `npm install --legacy-peer-deps`.
- **Leaflet marker/CSS issues**: make sure `leaflet/dist/leaflet.css` is
  imported once, in `src/main.tsx` (it already is) — do not import it again
  inside components.
- **Blank map / 404 on GeoJSON**: confirm `public/geojson/up_districts.geojson`
  and `up_state.geojson` exist; regenerate with `node scripts/generate-geojson.mjs`
  if needed (plain Node, no dependencies required).

---

## Data architecture

The data flow is layered so the demo data can be replaced without touching UI code:

```
src/config/indicators.ts   ← the 11 locked indicators + metric definitions (never edited by pages)
src/data/districts.ts      ← district reference list (id, name, centroid, division)
src/data/demoData.ts       ← THE ONLY FILE THAT GENERATES VALUES — swap this for a real API/DB call
src/data/sources.ts        ← source/provenance metadata
        ↓
src/services/dataService.ts ← KPIs, trends, rankings, comparisons, search — pages only call this
        ↓
src/pages/*.tsx             ← call dataService, never demoData or districts.ts directly
```

Every value conforms to the `MetricValue` schema (see `src/types/index.ts`):

```ts
{
  state: "Uttar Pradesh",
  district: "Moradabad",
  year: 2020,
  indicator: "education",
  metric: "literacy_rate",
  value: 58.2,          // or null if unavailable
  unit: "%",
  status: "demo",        // "verified" | "demo" | "unavailable"
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

### How the demo data is generated

`src/data/demoData.ts` uses a **seeded PRNG** (`src/utils/prng.ts`) keyed on
`(district, indicator, metric, year)`, so the same URL always shows the same
numbers across reloads, without ever hardcoding a real statistic. About 4% of
cells are deterministically marked `unavailable` to exercise missing-data UI.

### Replacing demo data with verified data

1. Obtain a verified dataset (CSV/JSON/API) with the same dimensions
   (state, district, year, indicator, metric).
2. Reimplement the body of `getMetricValue` (and the other exported
   functions) in `src/data/demoData.ts` — or add a new module and point
   `src/services/dataService.ts` at it instead — to look up real values and
   return `status: 'verified'` with real `source` metadata.
3. No page or component needs to change, since they only import from
   `dataService`.

---

## Map implementation

- **Home page** (`src/maps/IndiaMap.tsx`): a real Leaflet map (dark CARTO
  basemap tiles) centered on India, with a marker per state. Uttar Pradesh is
  clickable; other states show a "coming soon" popup.
- **District map** (`src/maps/UPDistrictMap.tsx`): renders
  `public/geojson/up_districts.geojson` as a Leaflet `GeoJSON` layer with
  choropleth shading driven by whatever metric the page is showing, hover
  highlighting + tooltips, click-to-navigate, and a reset-view control.

### About the GeoJSON boundaries (important)

This sandbox had no internet access while building this project, so no
authoritative Survey-of-India-grade boundary file could be downloaded. Instead,
`scripts/generate-geojson.mjs` builds a **bounded Voronoi tessellation** from
each district's approximate centroid (a real computational-geometry technique:
convex hull + perpendicular-bisector half-plane clipping — no external GIS
library needed). This produces 75 real, non-overlapping polygons that tile the
state and support genuine choropleth/hover/click interaction — but the shapes
are a **simplified approximation, not an authoritative boundary dataset**. See
`public/geojson/README.md` for the full disclaimer, and regenerate anytime with:

```bash
node scripts/generate-geojson.mjs
```

**To upgrade to real boundaries later:** replace
`public/geojson/up_districts.geojson` with a properly sourced file (e.g. from
an official GIS provider) that has `properties.id` matching the district `id`
values in `src/data/districts.ts`, and `properties.name`. No map component code
needs to change.

---

## How to add a new state

1. Create `src/data/<state>-districts.ts` with a `District[]` array in the
   same shape as `src/data/districts.ts`.
2. Add centroid-based GeoJSON for the new state (adapt
   `scripts/generate-geojson.mjs`, or supply real boundaries) into
   `public/geojson/<state>_districts.geojson` and `<state>_state.geojson`.
3. Add an entry to `STATES` in `src/config/states.ts` with
   `status: 'available'` and the new district array.
4. Update `UPDistrictMap.tsx` (or generalize it into a `StateDistrictMap.tsx`
   that takes a `geojsonPath` prop) to load the right GeoJSON file for the
   active state.

No routing, page, or indicator code needs to change — the app already reads
states generically from the registry.

## How to add a new district

Add an entry to the relevant state's district array (e.g.
`src/data/districts.ts`) with a unique `id`, `name`, `stateId`, and
`centroid`. Regenerate GeoJSON if you're using the Voronoi generator, or add
the district's polygon to your authoritative boundary file with a matching
`properties.id`.

## How to add a new indicator metric

Add an entry to the relevant indicator's `metrics` array in
`src/config/indicators.ts` (key, label, unit, description, polarity,
precision), then add a plausible value range for it to `METRIC_RANGES` in
`src/data/demoData.ts`. KPI cards, trend charts, comparison charts, and the
data table all pick it up automatically — no other changes needed.

> Per the project's locked spec, **do not add new top-level indicators** —
> only new metrics within the existing 11.

---

## Data Sources & provenance

See the in-app **Data Sources** page (`/data-sources`) and
`src/data/sources.ts`. In short:

- Every value carries a `status` (`verified` / `demo` / `unavailable`) and a
  `source` object.
- This build ships **only** `demo` and `unavailable` values — no real
  statistic is presented as fact anywhere.
- `src/data/sources.ts` also lists, purely as integration guidance, the kind
  of official Indian government source each indicator would typically draw
  from once real data is connected (Census of India, UDISE+, NCRB, MoRTH,
  CEA, FSI/CPCB, etc.) — these are **not** currently powering any figure shown.

---

## Accessibility

- Skip-to-content link, semantic landmarks (`header`, `main`, `footer`, `nav`)
- All interactive controls are real `<button>`/`<a>`/`<select>`/`<input>`
  elements with visible focus rings and `aria-label`s where text isn't
  self-describing
- Color is never the only signal — status badges and trend arrows carry text/labels
- `prefers-reduced-motion` disables non-essential animation
- Map tooltips and popups are supplementary; the same data is always
  available in the data table below each map

---

## Responsive design

- Header collapses to a hamburger menu with its own search and nav on mobile
  — not a shrunk desktop bar
- Maps resize to full-width single-column layouts below `lg` breakpoints
- KPI grids reflow from 4 → 3 → 2 columns; comparison/data tables scroll
  horizontally on narrow screens
- Touch targets sized for mobile (44px+ tap areas on primary controls)

---

## Testing performed

Because this project was built in a sandboxed environment with no outbound
network access, the following was verified **without** a live `npm install`:

-  Every `@/...` import path resolved correctly against the actual file tree
  (checked with a standalone `tsc` pass using ambient stub type declarations
  for external packages — this catches typos, missing files, and structural
  mistakes, though not full third-party type compatibility)
-  Generated GeoJSON validated as well-formed JSON with 75 non-degenerate
  district polygons and no gaps
-  Manual review of every route, prop, and data-flow path described above

**Not yet verified** (requires the install/build you'll run locally):
`npm install` resolution, `npm run build` (Vite + `tsc -b`), the production
bundle, and interactive browser behavior (actual map rendering, chart
rendering, click-through navigation). Please run `npm run dev` first and
report anything that doesn't work as expected — the architecture is designed
so any such fix should be localized to one file.

---

## Contribution guide

1. Fork/branch from `main`.
2. Keep the 11 top-level indicators locked; add metrics, not categories.
3. Any new data source integration should update `status` to `'verified'`
   and fill in real `source` metadata — never silently mark demo data as verified.
4. Run `npm run lint` and `npm run build` before opening a PR.
5. Describe which section of this README (if any) needs updating alongside
   your change (e.g. "How to add a new state").

## License

This project is provided as-is for civic/educational use. No license for any
underlying government data is implied — verify licensing terms of any real
dataset you integrate (e.g. Census of India, NCRB, UDISE+) before
redistributing derived data.
