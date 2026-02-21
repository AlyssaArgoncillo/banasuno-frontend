# Backend repository – responsibilities

This doc describes logic and APIs that should live in the **backend** (separate repo) so the frontend only handles UI and calls your API.

---

## 1. Move to backend (API + logic)

### 1.1 Heat data (temperature, forecasts, pipeline reports)

**Lives in the backend repo.** The heat API and all temperature logic (sources of truth, business rules, and the path to a heuristic AI model) are implemented and documented in the backend.

**Core Heat Endpoints:**
- **`GET /api/heat/:cityId/barangays`** – Per-barangay temp + risk + lat/lng + area. Returns `{ barangays: [...], min, max, updatedAt? }`.
- **`GET /api/heat/:cityId/current`** – City center current weather (temp, feels-like, humidity, condition). WeatherAPI.
- **`GET /api/heat/:cityId/forecast`** – 7- or 14-day forecast (?days=7|14). Returns `{ forecastDays: [...], currentTemp? }`.
- **`GET /api/heat/:cityId/barangay-population`** – Population and density per barangay (PSA + GeoJSON). For AI pipeline.
- **`GET /api/heat/:cityId/pipeline-report/meta`** – Pipeline report metadata (updatedAt, disclaimer).
- **`GET /api/heat/:cityId/pipeline-report`** – Download pipeline report CSV. 404 if none.
- **`POST /api/heat/:cityId/pipeline-report/generate`** – Generate pipeline report (heat + facilities, K-Means).
- **`POST /api/heat/:cityId/pipeline-report`** – Upload pipeline report CSV (body: text/csv; optional x-pipeline-report-key header).

**Docs:** See the backend repo → **`docs/HEAT-API.md`** for the full API contract, backend responsibilities, and the heuristic AI model direction.

The frontend only calls these endpoints and uses the responses; it keeps a **simulation fallback** in `src/utils/heatMap.js` when the backend is unavailable.

### 1.2 Health facilities

**Lives in the backend repo.**

**Facility Endpoints:**
- **`GET /api/facilities`** – List Davao health facilities. Query params: type, source, ownership, name, limit, offset.
- **`GET /api/facilities/:id`** – Get one facility by id.
- **`GET /api/facilities/by-barangay/:barangayId`** – Facilities assigned to barangay by nearest barangay lat/lon only.
- **`POST /api/facilities/counts-by-barangays`** – Batch facility counts for many barangay IDs (body: { barangayIds: [] }). For AI pipeline.
- **`GET /api/types`** – Facility type summary (types and counts).

---

## 2. Keep in frontend

| Location | Responsibility |
|----------|----------------|
| **`src/utils/geo.js`** | Pure geometry: `getPolygonRing`, `ringCentroid`. No I/O. |
| **`src/utils/heatMap.js`** | Normalize temp → intensity, build heat points from features + `tempByBarangayId`; **simulate** only when API is unavailable. |
| **`src/services/boundariesService.js`** | Fetch GeoJSON (city/barangay boundaries). Can later switch to your backend if you proxy or store boundaries. |
| **`src/services/heatService.js`** | Call backend heat endpoints (`GET /api/heat/:cityId/barangays`, `/current`, `/forecast`); fetch population and pipeline data; fallback to simulated temps for demo. |
| **`src/services/healthFacilitiesService.js`** | Call backend facility endpoints (`GET /api/facilities`, `/by-barangay/:id`, `/types`); batch counts (`POST /counts-by-barangays`). |
| **`src/components/HeatMap.jsx`** | Leaflet map, layers, zoom, loading/error state; uses services and utils only. |

---

## 3. Optional: boundaries from backend

Right now boundaries come from [philippines-json-maps](https://github.com/faeldon/philippines-json-maps) (GitHub raw URLs) in `boundariesService.js`. You can later:

- Serve the same GeoJSON from your backend (e.g. cached or transformed).
- Add endpoints such as:
  - `GET /api/boundaries/city/:cityId`
  - `GET /api/boundaries/barangays/:cityId`
- Point `boundariesService.js` at `VITE_API_URL` instead of the static URLs.

---

## 4. Env and deployment

- Frontend expects backend base URL via **`VITE_API_URL`** (see `src/services/apiConfig.js`). Example: `VITE_API_URL=http://localhost:3000`.
- The backend heat endpoints are implemented and use [WeatherAPI.com](https://www.weatherapi.com/). In the backend repo, set **`WEATHER_API_KEY`** in `.env` (get a key at https://www.weatherapi.com/my/). Then start the backend and set `VITE_API_URL` in the frontend so the heat map uses real current weather instead of simulated data.
- Facility data should be sourced from Davao health facility registries or databases (e.g. Department of Health, local health offices).
- Pipeline reports require heat and facility data integration with K-Means clustering for heat risk zones.

