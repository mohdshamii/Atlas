# GeoJSON data notice

`up_districts.geojson` and `up_state.geojson` are **generated, simplified
boundary approximations**, not authoritative survey or GIS data.

They were produced by `scripts/generate-geojson.mjs`, which builds a bounded
Voronoi tessellation from approximate district centroids (see
`src/data/districts.ts`). This gives every district a real, non-overlapping
polygon that tiles the state — enough for choropleth shading, hover, and
click interactions — without depending on any external GIS file or paid API.

**Do not use these shapes for:**
- Legal, administrative, or survey purposes
- Precise area or distance calculations
- Any cartographic product that implies official accuracy

To replace with authoritative boundaries later (e.g. from the Survey of
India or a licensed GIS provider), drop in properly sourced GeoJSON files
with the same property keys (`id`, `name`, `stateId`) and the map components
will work unchanged — see `README.md` → "How to add a new state."
