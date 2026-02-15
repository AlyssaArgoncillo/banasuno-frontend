# Backend repository – responsibilities

This doc describes logic and APIs that should live in the **backend** (separate repo) so the frontend only handles UI and calls your API.

---

## 1. Move to backend (API + logic)

### 1.1 Barangay temperature / heat data

**Current frontend:** Simulated temperatures per barangay in `src/utils/heatMap.js` (`simulateBarangayTemperatures`) and `src/services/heatService.js`.

**Backend should:**

- Expose an API that returns **temperature per barangay** for a given city (e.g. Davao).
- Own all **sources of truth** for temperature (sensors, models, third‑party APIs, caching).
- Apply any **business rules** (aggregation, time window, min/max range).

**Suggested API contract:**

```http
GET /api/heat/:cityId/barangay-temperatures
```

**Query (optional):** `?date=YYYY-MM-DD` or `?timestamp=...` for point-in-time.

**Response:**

```json
{
  "temperatures": {
    "1130700001": 31.2,
    "1130700002": 33.1
  },
  "min": 26,
  "max": 39,
  "updatedAt": "2025-02-15T12:00:00Z"
}
```

- Keys in `temperatures`: barangay identifier (e.g. PSGC `adm4_psgc` or feature `id`) matching the GeoJSON used on the frontend.
- `min` / `max`: range for the legend and for normalizing to 0–1 intensity.
- Frontend already supports this shape in `src/services/heatService.js` (`fetchBarangayTemperatures`).

**Backend logic to implement:**

- Resolve `cityId` (e.g. `davao`) to the correct geographic/barangay set.
- Compute or fetch temperature per barangay (sensor aggregation, model, external API).
- Return the map above; frontend will use it in `getBarangayHeatData` and pass it to `buildHeatPointsFromBarangays`.

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

- Frontend expects backend base URL via **`VITE_API_URL`** (see `src/services/heatService.js`).
- When `VITE_API_URL` is set and the heat API is implemented, the app will use real data; otherwise it uses simulated barangay temperatures.
