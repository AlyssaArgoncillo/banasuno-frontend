# Backend repository – responsibilities

This doc describes logic and APIs that should live in the **backend** (separate repo) so the frontend only handles UI and calls your API.

---

## 1. Move to backend (API + logic)

### 1.1 Barangay temperature / heat data

**Lives in the backend repo.** The heat API and all temperature logic (sources of truth, business rules, and the path to a heuristic AI model) are implemented and documented in the backend.

- **API:** `GET /api/heat/:cityId/barangay-temperatures` – returns `{ temperatures, min, max }` keyed by barangay ID.
- **Docs:** See the backend repo → **`docs/HEAT-API.md`** for the full API contract, backend responsibilities, and the heuristic AI model direction.

The frontend only calls this endpoint and uses the response; it keeps a **simulation fallback** in `src/utils/heatMap.js` when the backend is unavailable.

---

## 2. Keep in frontend

| Location | Responsibility |
|----------|----------------|
| **`src/utils/geo.js`** | Pure geometry: `getPolygonRing`, `ringCentroid`. No I/O. |
| **`src/utils/heatMap.js`** | Normalize temp → intensity, build heat points from features + `tempByBarangayId`; **simulate** only when API is unavailable. |
| **`src/services/boundariesService.js`** | Fetch GeoJSON (city/barangay boundaries). Can later switch to your backend if you proxy or store boundaries. |
| **`src/services/heatService.js`** | Call backend `GET /api/heat/:cityId/barangay-temperatures`; fallback to simulated temps for demo. |
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

- Frontend expects backend base URL via **`VITE_API_URL`** (see `src/services/heatService.js`). Example: `VITE_API_URL=http://localhost:3000`.
- The backend heat endpoint is implemented and uses [WeatherAPI.com](https://www.weatherapi.com/). In the backend repo, set **`WEATHER_API_KEY`** in `.env` (get a key at https://www.weatherapi.com/my/). Then start the backend and set `VITE_API_URL` in the frontend so the heat map uses real current weather instead of simulated data.
