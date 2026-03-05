# Gemini Heat Advisory – UI Description & Backend Setup

This document describes the **Heat Advisory** UI and the backend setup so you can implement the Gemini-powered advisory API. The frontend calls **POST /api/heat-advisory** and displays the response; on error it falls back to static advisories by risk level.

**Single source of truth for the API:** [HEAT_ADVISORY_API_CONTRACT.md](HEAT_ADVISORY_API_CONTRACT.md) (if present in this repo).

---

## 1. Where the key lives (for backend)

The **Gemini API key must be stored and used on the backend only** (never in the frontend bundle).

| Variable | Example value (use your own in production) | Purpose |
|----------|-------------------------------------------|---------|
| `GEMINI_API_KEY` | `AIzaSy...` (see project `.env` lines 9–10) | Google AI (Gemini) API key |

**Backend .env example:**

```env
# Gemini API (Google AI) – used for heat advisory generation
GEMINI_API_KEY=AIzaSyCchSgnsRPm5EfR-RFIo-hlbA1jQwzjWlg
```

Use a dedicated key in production and keep it server-side only.

---

## 2. Heat Advisory UI (what the user sees)

### 2.1 Entry point

- User opens the **Heat Advisory** section (Safety Recommendations) from the main app.
- The page shows a risk-level gauge and AI-generated tagline + advice cards.
- If the user has selected a **barangay on the Heat Map**, the frontend sends that context to **POST /api/heat-advisory** (barangay name, risk level, temperature, etc.) and displays the returned tagline and advices.
- If no barangay is selected or the API fails, the UI falls back to **static** taglines and advices by risk level (Not Hazardous, Caution, Extreme Caution, Danger, Extreme Danger).

### 2.2 Request (frontend → backend)

- **Method:** `POST`
- **URL:** `/api/heat-advisory` (relative to backend base URL)
- **Headers:** `Content-Type: application/json`
- **Body (JSON):** All fields optional. Backend may default to e.g. “Caution” if omitted.

| Field | Type | Description |
|-------|------|-------------|
| `barangay_id` | string | Barangay identifier (e.g. PSGC) |
| `barangay_name` | string | Barangay name (e.g. "Calinan") |
| `risk_level` | number | 1–5 (PAGASA heat index level) |
| `risk_label` | string | e.g. "Extreme Caution" |
| `temperature_c` | number | Current temperature in °C |

### 2.3 Response (backend → frontend)

- **Success:** `200` with JSON body:
  - `tagline` (string): Short advisory headline.
  - `advices` (array): `[{ "title": string, "body": string }, ...]`
  - Optional: `risk_level`, `barangay_name`, `generated_at`.
- **Error:** Non-2xx or invalid shape → frontend uses static advisories.

### 2.4 Frontend behavior

- **Heat Advisory page:** Renders the gauge and the tagline + advice list. When `selectedZone` (from Heat Map) is available, it calls `fetchHeatAdvisory()` from `src/services/heatAdvisoryService.js` with barangay name, risk level, and temperature, then shows the API tagline and advices when the response is valid.
- **Fallback:** If the request fails or the response is invalid, the UI shows the built-in tagline and advices for the selected risk level.

---

## 3. Backend implementation checklist

- [ ] Add `GEMINI_API_KEY` to backend environment (e.g. `.env`); never expose it to the frontend.
- [ ] Implement `POST /api/heat-advisory` that accepts the JSON body above and calls the Gemini API to generate a tagline and list of advices.
- [ ] Return JSON in the shape expected by the frontend (`tagline`, `advices`).
- [ ] Use the API contract in `HEAT_ADVISORY_API_CONTRACT.md` for field names and error handling.

---

## 4. References

- Frontend service: `src/services/heatAdvisoryService.js`
- Heat Advisory page: `src/components/main-interface/HeatAdvisoryPage.jsx`
- Urgency ticker (displays tagline + advices): `src/components/main-interface/UrgencyTicker.jsx`
