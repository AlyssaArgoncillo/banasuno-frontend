# Export CSV API – frontend/backend alignment

The dashboard calls the backend for two CSV downloads. Base URL: backend root (e.g. `VITE_API_URL`).

## 1. KPI strip – "Export Data" (city heat risk summary)

- **Method:** `GET`
- **Path:** `/api/heat/export/city`
- **Query:** `?date=YYYY-MM-DD` (optional; default today UTC), `&city_id=davao` (optional; default `davao`).
- **Response:** CSV file; `Content-Type: text/csv; charset=utf-8`; `Content-Disposition: attachment; filename="heat_risk_city_avg_YYYY-MM-DD.csv"`.
- **Columns:** `city_id`, `recorded_at`, `risk_level`, `risk_label`, `total`, `avg_temp_c`.
- **Frontend:** Calls this URL, reads response as `Blob`, triggers download using the filename from the header or fallback `heat_risk_city_avg_YYYY-MM-DD.csv`.

## 2. Historical Trends – "Download CSV"

- **Method:** `GET`
- **Path:** `/api/historical-trends/export`
- **Query:** `?city_id=davao`, `&days=7` or `&days=14`, `&date=YYYY-MM-DD` (optional; for filename; default today).
- **Response:** CSV file; `Content-Type: text/csv; charset=utf-8`; `Content-Disposition: attachment; filename="historical_trends_YYYY-MM-DD.csv"`.
- **Columns:** `recorded_at`, `city_id`, `city_avg_temp_c`, `city_max_temp_c`, `city_min_temp_c`, `rolling_7d_avg_c`, `rolling_14d_avg_c`.
- **Frontend:** Same pattern—fetch as Blob, derive filename from header or fallback `historical_trends_YYYY-MM-DD.csv`, trigger download.

## Frontend behavior

- **Loading:** While the request is in progress, the corresponding button shows "Exporting…" (or similar) and is disabled.
- **Errors:** On non-2xx or network error, the frontend does not download; optional message can be shown.
- **Filename:** Prefer `Content-Disposition` filename; otherwise use the defaults above.
