# Heat Advisory API – Frontend/Backend Contract

**Endpoint:** `POST /api/heat-advisory`  
**Base URL:** Backend base (e.g. `VITE_API_URL` in frontend).

## Request

- **Headers:** `Content-Type: application/json`
- **Body (JSON):** All fields optional.

| Field | Type | Description |
|-------|------|-------------|
| `barangay_id` | string | Barangay ID (e.g. PSGC) |
| `barangay_name` | string | Barangay name |
| `risk_level` | number | 1–5 (PAGASA level) |
| `risk_label` | string | e.g. "Extreme Caution" |
| `temperature_c` | number | Temperature °C |

## Success response (200)

```json
{
  "tagline": "Short advisory headline.",
  "advices": [
    { "title": "Advice title", "body": "Advice body text." }
  ],
  "risk_level": 3,
  "barangay_name": "Calinan",
  "generated_at": "2025-02-27T12:00:00Z"
}
```

- `tagline` (string) and `advices` (array of `{ title, body }`) are required.
- Other fields are optional.

## Error response

- Non-2xx status or missing `tagline` / `advices` → frontend uses static advisories.

## PAGASA risk levels (reference)

| Level | Label |
|-------|--------|
| 1 | Not Hazardous |
| 2 | Caution |
| 3 | Extreme Caution |
| 4 | Danger |
| 5 | Extreme Danger |
