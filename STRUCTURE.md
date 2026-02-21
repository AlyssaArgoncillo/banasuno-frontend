# Frontend structure – utils, services, backend

Quick reference for where logic lives after the HeatMap refactor.

## Utils (`src/utils/`)

Pure helpers, no I/O, no React.

| File | Exports | Purpose |
|------|--------|--------|
| **geo.js** | `getPolygonRing`, `ringCentroid` | GeoJSON geometry: get polygon ring, centroid from ring. |
| **heatMap.js** | `normalizeTempToIntensity`, `buildHeatPointsFromBarangays`, `simulateBarangayTemperatures`, `DEFAULT_TEMP_MIN/MAX` | Turn temperature + barangay features into heat points; normalize temp to 0–1; **simulate** temps when backend is absent. |

## Services (`src/services/`)

Data fetching and integration. Call backend or external URLs.

| File | Exports | Purpose |
|------|--------|--------|
| **boundariesService.js** | `fetchProvdistBoundaries`, `fetchBarangayBoundaries`, `fetchDavaoBoundaries`, `getDavaoCityFeature` | Fetch city/barangay GeoJSON (PSGC); extract Davao City feature from provdist. |
| **heatService.js** | `fetchBarangayTemperatures`, `getBarangayHeatData`, `fetchCityAverage`, `fetchCityForecast`, `fetchBarangayPopulation`, `getPipelineReportMeta`, `getPipelineReport`, `generatePipelineReport`, `uploadPipelineReport` | Fetch temps from backend (`GET /api/heat/:cityId/barangays`); fetch current weather (`GET /api/heat/:cityId/current`); forecast; population; pipeline reports; fallback to simulated temps for map. |

## Backend repository (separate repo)

See **[BACKEND.md](./BACKEND.md)** for:

- API contract: `GET /api/heat/:cityId/barangays` (per-barangay temp, risk, location, area); `GET /api/heat/:cityId/current` (current weather); `GET /api/heat/:cityId/forecast` (forecast); facility endpoints; pipeline reports.
- What to implement: resolve city, compute/fetch temperatures, return `{ barangays: [...], min, max }`.
- Optional: serve boundary GeoJSON from your API instead of GitHub.

## Components

- **HeatMap.jsx** – Only UI and Leaflet: create map, call `fetchDavaoBoundaries()` and `getBarangayHeatData()`, add layers, handle loading/error and zoom.

## Data flow

1. **HeatMap** → `boundariesService.fetchDavaoBoundaries()` → city + barangay GeoJSON.
2. **HeatMap** → `heatService.getBarangayHeatData(barangayFeatures)` → calls backend (or uses `heatMap.simulateBarangayTemperatures`) → `utils/heatMap.buildHeatPointsFromBarangays` → `{ intensityPoints, tempMin, tempMax }`.
3. **HeatMap** → draws boundary + barangay outlines + heat layer from `intensityPoints`, legend from `tempMin`/`tempMax`.
