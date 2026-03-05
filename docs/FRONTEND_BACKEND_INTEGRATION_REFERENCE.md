# Frontend & Backend Integration – Complete Reference (single doc)

**This document is self-contained.** The frontend does not need access to the backend repo. All contract details, backend implementation notes, and troubleshooting that were in separate backend docs are included below.

- **Backend base URL:** Use your actual backend (e.g. `http://localhost:3000` in dev, or your deployed URL). All paths are relative to that base.
- **Alignment:** Use the sections **"Dashboard & heat map – backend implementation details"** and **"Backend implementation details (for alignment)"** for exact request/response/error shapes so the frontend matches the backend.

---

## All implemented changes (every successful change)

This list is the full set of what was implemented. When we say "all that is implemented," we mean exactly these:

1. **Heat (Risk) Advisory AI** – Backend: `POST/GET /api/heat-advisory` (Gemini or fallback). Returns `tagline` + `advices` (title/body). Frontend: wire Heat Advisory page (UrgencyTicker / Safety Recommendations) to this API; replace static copy. Full contract: **Heat Advisory AI – full contract** below.
2. **Export CSV – KPI strip** – Backend: `GET /api/heat/export/city`. Frontend: call with date, trigger download. Full contract: **Export CSV – full contract** below.
3. **Export CSV – Historical Trends** – Backend: `GET /api/historical-trends/export`. Frontend: call with city_id, days, date; trigger download. Full contract: **Export CSV – full contract** below.
4. **Route visualization (Show Route)** – Backend: `POST /api/ors/directions` (proxies OpenRouteService). Frontend: "Show Route" on facility card, profile dropdown, polyline #FF9559, markers, distance/time, fit bounds, card highlight, clear previous route. Full contract: **Show Route (ORS Directions) – full contract** below.
5. **Dashboard overview / API mapping** – Which API powers which dashboard section (KPI strip, facility directory, historical trends, All Barangays, heat map, Heat Advisory page, Export CSV, Show Route). See dashboard table and **Dashboard API contract – full** below.
6. **Data sync clarification** – When Supabase is updated: historical trends via API sync; heat risk counts & city temps via job. No new endpoints. See **Data sync** section below.
7. **Barangay geo resilience** – Backend only: timeout + retries for barangay GeoJSON fetch on flaky networks. No frontend change. See **Barangay geo** section below.

---

## Dashboard overview – which API powers which section

| Dashboard section | API to use | Do not use |
|-------------------|------------|------------|
| **KPI strip** (heat risk zone counts) | `GET /api/heat/counts` or `GET /api/heat/summary?city_id=davao` | Counts from `/api/heat/davao/barangays` |
| **KPI strip – Export CSV** | `GET /api/heat/export/city?date=...&city_id=davao` | — |
| **Health facility directory** (chosen place only) | `GET /api/facilities/by-barangay/:barangayId` | `GET /api/facilities` (all facilities) |
| **Facility card – Show Route** | `POST /api/ors/directions` (start = barangay center, end = facility) | Calling OpenRouteService directly |
| **Historical trends** (past data) | `GET /api/historical-trends?city_id=davao&days=7` or `&days=14` | `GET /api/heat/davao/forecast` (forecast = future) |
| **Historical trends – Export CSV** | `GET /api/historical-trends/export?city_id=...&days=...&date=...` | — |
| **All Barangays table** | Barangay list: `GET /api/heat/davao/barangays`; counts: `POST /api/facilities/counts-by-barangays`; View: `GET /api/facilities/by-barangay/:barangayId` | — |
| **Heat map** | `GET /api/heat/davao/barangays` (and GeoJSON for boundaries) | — |
| **Heat Advisory page** | `POST /api/heat-advisory` or `GET /api/heat-advisory` | — |

---

## Dashboard & heat map – backend implementation details (for alignment)

### KPI strip – heat risk counts

**GET /api/heat/counts** – Response (200): JSON array of `{ "risk_level": number (1–5), "risk_label": string, "total": number }`. Error (500): `{ "error": "Failed to load heat risk counts" }`.

**GET /api/heat/summary** – Query: `city_id` (optional, default `"davao"`), `format` (optional). Response (200): `{ "city_id", "city_avg_temp_c", "recorded_at", "risk_counts": Array<{ risk_level, risk_label, total }>, ... }`. Error (500): `{ "error": "Failed to load heat summary" }`.

### Heat map & All Barangays table

**GET /api/heat/:cityId/barangays** – Path `GET /api/heat/davao/barangays`. Response (200): `barangays[]` with `barangay_id`, `temp_c`/`temperature_c`, `risk_level`, `risk_label`, `risk`, `lat`, `lng`, `area_km2?`; `updatedAt`; `meta`; `min`, `max` (use for legend). Errors: 404 (city not supported), 503, 500 with `{ "error", "details"?, "stack"? }`.

### Health facility directory & View

**GET /api/facilities/by-barangay/:barangayId** – Response (200): `barangayId`, `total`, `total_label` (e.g. "5 facilities"), `facilities[]` (id, name, latitude, longitude; may have distance_meters, travel_time_seconds), `fallback_nearest?`, `message?`. Prefer `total_label` for display. Errors: 400, 404, 500.

### All Barangays table – batch facility counts

**POST /api/facilities/counts-by-barangays** – Body: `{ "barangayIds": string[] }`. Response (200): `{ "counts": { [barangayId]: number } }`. Errors: 400, 500.

### Historical trends (past data only)

**GET /api/historical-trends** – Query: `city_id`, `days` (7 or 14), `limit`, `sync`. Response (200): `city_id`, `rows[]` (recorded_at, city_avg_temp_c, ...), `trend_7d_avg_c`, `trend_14d_avg_c`, `summary`. Do not use forecast endpoint for this section.

---

## Heat Advisory AI – full contract

- **Endpoints:** POST `/api/heat-advisory` (preferred) or GET with query params. All fields optional; backend defaults risk to level 2 / "Caution".
- **Request:** `barangay_id`, `barangay_name`, `risk_level` (1–5), `risk_label`, `temperature_c`.
- **Response (200):** `{ "tagline": string, "advices": [ { "title", "body" }, ... ] (≥3), "risk_level"?, "barangay_name"?, "generated_at"? }`.
- **Error (4xx/5xx):** `{ "error": string, "details"?: string }`. Frontend: show fallback or error.
- **Caching:** Backend caches per (barangay_id or "default", risk_level) for 5 minutes.

---

## Export CSV – full contract

**KPI strip:** GET `/api/heat/export/city?date=YYYY-MM-DD&city_id=davao`. Response: CSV, filename `heat_risk_city_avg_YYYY-MM-DD.csv`. Columns: `city_id`, `recorded_at`, `risk_level`, `risk_label`, `total`, `avg_temp_c`. On error: JSON.

**Historical Trends:** GET `/api/historical-trends/export?city_id=davao&days=7|14&date=YYYY-MM-DD`. Response: CSV, filename `historical_trends_YYYY-MM-DD.csv`. Columns: `recorded_at`, `city_id`, `city_avg_temp_c`, `city_max_temp_c`, `city_min_temp_c`, `rolling_7d_avg_c`, `rolling_14d_avg_c`. On error: JSON.

---

## Show Route (ORS Directions) – full contract

- **Endpoint:** POST `/api/ors/directions`. Do not call OpenRouteService from the client.
- **Request:** Body `{ "start": [lng, lat] or { lng, lat }, "end": [lng, lat] or { lng, lat }, "profile"?: "driving-car" | "foot-walking" | "cycling-regular" }`. Default profile `driving-car`.
- **Response (200):** ORS GeoJSON: `features[0].geometry.coordinates` (LineString), `features[0].properties.summary`: `{ distance` (metres), `duration` (seconds) `}`. Draw polyline #FF9559, 4px; start/end markers; fit bounds; show distance (km) and time (min) in card; left-border highlight when route active.
- **Errors:** 400 (invalid/missing start/end), 502, 503 (OPEN_ROUTE_API_KEY not set). JSON `{ "error", "details"?: ... }`.

---

## Dashboard API contract – full

- **KPI strip:** Use `GET /api/heat/counts` or `GET /api/heat/summary?city_id=davao`. Do not derive counts from barangays endpoint.
- **Health facility directory:** `GET /api/facilities/by-barangay/:barangayId`. Do not use `GET /api/facilities` (all facilities).
- **Historical trends:** `GET /api/historical-trends?city_id=davao&days=7|14`. Do not use forecast.
- **All Barangays table:** Barangay list from `GET /api/heat/davao/barangays`; counts from `POST /api/facilities/counts-by-barangays`; View from `GET /api/facilities/by-barangay/:barangayId`. Use `total_label` from by-barangay response when available ("1 facility", "N facilities").
- **Heat map:** Use `response.min` and `response.max` from `GET /api/heat/davao/barangays` for temperature legend when present.

---

## All Barangays table – backend contract

Table columns: Barangay, Temperature, Risk Level, Nearby Facilities (count), View. Data: GeoJSON for names; `GET /api/heat/davao/barangays` for barangays; `POST /api/facilities/counts-by-barangays` for counts; `GET /api/facilities/by-barangay/:barangayId` for View. Both count and View use same backend logic; backend returns `total_label`.

---

## Troubleshooting – dashboard and frontend

- **OpenRoute 429:** Batch counts use straight-line only; no ORS for "Nearby Facilities" column. Single-barangay View cached 5 min. If ORS fails, backend falls back to straight-line.
- **"backend provided min/max":** Backend sends top-level `min` and `max` on `GET /api/heat/davao/barangays`. Frontend should use `response.min` and `response.max` for legend.
- **React duplicate key:** Use unique key per list item (e.g. `${barangay_id}` or `${risk_level}-${risk_label}-${index}`).
- **Count vs View mismatch:** Backend uses `skipOrs: true` for both; count = length of list. Prefer `response.total_label` for "1 facility" / "N facilities".

---

## Data sync

- **Historical trends:** Supabase updated via `POST /api/historical-trends/sync` or `GET /api/historical-trends?sync=1`. Frontend can trigger sync if needed.
- **Heat risk counts & city temperatures:** Updated by **heat risk job** (scheduler), not by dashboard load. GETs may return live or cached DB data.

---

## Supabase (for frontend)

**The frontend does not connect to Supabase.** All data goes through the backend API. No Supabase URL or keys on the frontend. KPI/heat/barangays may come from DB or live computation; Export CSV (KPI) reads from DB for the date; Historical trends depend on sync; Facilities are read-only from API.

---

## Barangay geo (backend only)

Backend uses 30s timeout and retries for barangay GeoJSON fetch. No frontend change.

---

## Backend implementation details (for alignment)

- **Heat Advisory:** POST/GET; all fields optional; response `tagline`, `advices` (≥3); errors JSON `{ "error", "details" }`; cache 5 min.
- **Export CSV – KPI:** GET `/api/heat/export/city`; query date, city_id; CSV filename heat_risk_city_avg_YYYY-MM-DD.csv; errors JSON.
- **Export CSV – Trends:** GET `/api/historical-trends/export`; query city_id, days, date; CSV filename historical_trends_YYYY-MM-DD.csv; errors JSON.
- **Directions:** POST only; start/end required; profile optional; response ORS GeoJSON; errors 400/502/503 JSON.

---

## Quick reference – endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/heat-advisory` | Heat Advisory AI. |
| GET | `/api/heat-advisory` | Same via query params. |
| GET | `/api/heat/export/city` | KPI Export CSV. |
| GET | `/api/historical-trends/export` | Historical Trends Export CSV. |
| POST | `/api/ors/directions` | Show Route. |

---

## Environment (backend)

- **Heat Advisory:** `GEMINI_API_KEY` (optional).
- **Export CSV:** No extra env.
- **Route:** `OPEN_ROUTE_API_KEY`.

---

Errors from any endpoint are JSON `{ "error": string, "details"?: string }`; frontend can handle generically.
