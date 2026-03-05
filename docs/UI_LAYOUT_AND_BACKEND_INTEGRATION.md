# UI Layout and Backend Integration

This document describes the main UI layout of the BanasUno frontend and how each area integrates with backend APIs. Use it for alignment between frontend and backend and for onboarding.

---

## 1. Application structure

- **Entry:** React app (Vite) with client-side routing.
- **Base URL for API:** Configured via `VITE_API_URL` (e.g. `http://localhost:3000`). The frontend proxies `/api` to this base in development (see `vite.config.js`).
- **Key screens:** Home (Heat Map + Heat Advisory), Dashboard, Data Sources, and related views.

---

## 2. Home / Heat Map

### 2.1 Layout

- Full-screen Leaflet map showing Davao City barangay boundaries.
- Barangays are colored by heat index (temperature from backend).
- Left/top: heat index legend (PAGASA levels), search, and related controls.
- When a barangay is clicked: **Zone info card** appears (e.g. right side) with:
  - Barangay name, risk score, temperature
  - List of nearby health facilities (from backend)
  - “Full Report” → navigates to Dashboard

### 2.2 Backend integration

| Data | Source | Notes |
|------|--------|--------|
| Barangay boundaries | `fetchDavaoBoundaries()` → GeoJSON | Used for polygon layer and barangay IDs |
| Barangay temperatures / heat data | `getBarangayHeatData()` → `/api/heat/davao/barangays` (or fallback) | Min/max and per-barangay temps for coloring |
| Nearby facilities | `getHealthFacilitiesNearBarangay(barangayId, center)` → `/api/facilities/by-barangay/:id` | Shown in zone info card; fallback by distance if none in barangay |
| Route line (barangay → facility) | Frontend only (straight line) | Uses zone center + facility lat/lng; tooltip shows distance (haversine or from facility data) |

### 2.3 Route visualization

- User clicks a facility in the zone info card → frontend draws a **straight line** on the map from barangay center to that facility.
- Line color: `#3B82F6`; tooltip: “From [Barangay] to [Facility] · X.X km”.
- Route is cleared when the user selects another barangay or closes the card.
- Optional: backend or separate service (e.g. OpenRouteService) can provide road-based routes; see BACKEND_ORS_400_FIX_PROMPT.md if using ORS.

---

## 3. Heat Advisory (Safety Recommendations)

### 3.1 Layout

- Section typically on Home or a dedicated Heat Advisory page.
- Risk-level gauge and **AI-generated** tagline + advice cards.
- When a barangay is selected on the map, the advisory uses that context (name, risk, temperature).

### 3.2 Backend integration

| Data | Source | Notes |
|------|--------|--------|
| AI advisory (tagline + advices) | `fetchHeatAdvisory(params)` → **POST /api/heat-advisory** | Body: `barangay_id`, `barangay_name`, `risk_level`, `risk_label`, `temperature_c`. Response: `tagline`, `advices[]`. |
| Fallback | Frontend static content | If API fails or returns invalid shape, show static taglines/advices by risk level. |

See **GEMINI_HEAT_ADVISORY_UI_AND_BACKEND_SETUP.md** and **HEAT_ADVISORY_API_CONTRACT.md** for the full contract.

---

## 4. Dashboard

### 4.1 Layout

- **KPI strip:** Selected barangay name, risk pill, city average temperature, risk-zone counts, Export CSV.
- **Row 2:** “Nearby Health Facilities” (for selected barangay) + “All Barangays” table (search, temperature, risk, facility count, View).
- **View All Barangays:** Opens a modal with full list; “View” per row shows facilities for that barangay (fetched on demand).
- **Health Facility Directory:** Filter by type, sort by distance from selected barangay; uses `listFacilities` + haversine from zone center.
- **Historical Trends:** 7/14-day forecast chart and “Export CSV” for trends.

### 4.2 Backend integration

| Data | Source | Notes |
|------|--------|--------|
| Barangay list (names, temps, risk, counts) | `fetchDavaoBoundaries()` + `fetchBarangayTemperatures('davao')` + `getFacilityCountsByBarangays(ids)` | Builds table rows; risk from backend or derived via `tempToHeatRiskLevel`. |
| Nearby facilities (left panel) | Same as Heat Map zone card | From `selectedZone.facilities` or `getHealthFacilitiesNearBarangay(selectedZone.barangayId, center)`. |
| Facility directory | `listFacilities({ limit, offset })` → `/api/facilities` | Sorted/filtered on frontend by type and distance from selected zone. |
| Facility count per barangay | `getFacilityCountsByBarangays(barangayIds)` → POST `/api/facilities/counts-by-barangays` | Shown in “All Barangays” table; should match count in “View” panel (see FACILITY_COUNT_VS_VIEW_ALIGNMENT.md). |
| Forecast / historical trends | `fetchCityForecast('davao', trendDays)` → `/api/heat/davao/forecast?days=7|14` | Drives chart and trend insights. |
| CSV exports | GET `/api/heat/davao/export/barangays.csv`, GET `/api/heat/davao/export/trends.csv` | See **EXPORT-CSV-API.md**; frontend uses Blob + `Content-Disposition` filename. |

---

## 5. Data Sources

- UI that explains where data comes from (e.g. heat, facilities, boundaries).
- May link to backend health or pipeline; no additional API contract in this doc.

---

## 6. Shared services and config

- **apiConfig / getApiBase():** Resolves backend base URL from `VITE_API_URL`.
- **heatService:** Barangay temperatures, forecast, city average, heat layer data.
- **healthFacilitiesService:** By-barangay facilities, list, counts-by-barangays.
- **boundariesService:** Davao GeoJSON (city + barangays).
- **heatAdvisoryService:** POST /api/heat-advisory for Gemini advisories.
- **geocodeService / location / ORS:** Search, user location, accessibility (if used).

---

## 7. Alignment checklist

- [ ] Backend exposes `/api/heat/davao/barangays` (or agreed fallback) with per-barangay temperatures and optional min/max.
- [ ] Backend exposes `/api/facilities/by-barangay/:id` and optionally `/api/facilities` and POST `/api/facilities/counts-by-barangays`.
- [ ] Facility count in “All Barangays” matches the list in “View” for the same barangay (same source or consistent logic).
- [ ] POST `/api/heat-advisory` returns `tagline` and `advices` as per HEAT_ADVISORY_API_CONTRACT.md.
- [ ] CSV export endpoints return CSV with `Content-Disposition` as in EXPORT-CSV-API.md.
- [ ] Forecast endpoint returns `forecastDays` (or equivalent) for 7 and 14 days for the Dashboard trends.

---

*This document is the single place for high-level UI layout and backend integration. For specific API shapes, see the referenced docs (HEAT_ADVISORY_API_CONTRACT, EXPORT-CSV-API, etc.).*
