# Backend ORS 400 Fix – Prompt for Developers

When the frontend or backend calls the **OpenRouteService (ORS)** API and receives a **400 Bad Request**, use this document to diagnose and fix the issue. ORS is often used for accessibility matrices, directions, or isochrones (e.g. facility reachability from barangays).

---

## 1. Common cause: coordinate format

ORS follows **GeoJSON**: coordinates are **[longitude, latitude]** (lon, lat), **not** [lat, lon].

- **Wrong:** `[7.1907, 125.4553]` (lat, lng)  
- **Correct:** `[125.4553, 7.1907]` (lng, lat)

Many 400 errors (including parameter 2002) come from sending coordinates in the wrong order or wrong structure.

---

## 2. What to check in your backend

1. **Order:** Before calling ORS, ensure every coordinate is `[longitude, latitude]`.
2. **Type:** Coordinates must be numbers (not strings). Convert if needed.
3. **Structure:** For directions, the body usually expects something like:
   - `coordinates: [[lng1, lat1], [lng2, lat2]]`
   For matrix/accessibility:
   - Sources/destinations as arrays of `[lng, lat]`.
4. **Bounds:** Coordinates must be valid (e.g. Davao area roughly lng 125.2–125.8, lat 6.9–7.5). Out-of-range or null can cause 400.

---

## 3. Example (directions-style request)

ORS directions API typically expects a body like:

```json
{
  "coordinates": [[125.4553, 7.1907], [125.46, 7.20]]
}
```

So:

- First pair: origin `[lng, lat]`
- Second pair: destination `[lng, lat]`

If you are building this from barangay “center” (lat, lng) and facility (lat, lng), convert to:

- Origin: `[barangayLng, barangayLat]`
- Destination: `[facilityLng, facilityLat]`

---

## 4. Example (matrix / accessibility)

For a matrix or accessibility call, sources and destinations must again be arrays of `[lng, lat]`. Double-check:

- No (lat, lng) pairs.
- No string coordinates.
- No extra nesting beyond what the API expects (see ORS API reference for the exact schema).

---

## 5. Fix prompt (copy-paste for backend)

Use the following as a prompt or checklist when fixing ORS 400s:

---

**Prompt: We are getting 400 Bad Request from the OpenRouteService API. Please:**

1. **Coordinate order:** Ensure every coordinate sent to ORS is in [longitude, latitude] order (GeoJSON). We use Leaflet/frontend in [lat, lng]; convert to [lng, lat] before calling ORS.
2. **Types:** Ensure all coordinates are numbers, not strings.
3. **Request body:** Check the exact schema expected by the ORS endpoint we use (directions vs matrix vs isochrones) and ensure our payload matches (e.g. `coordinates` array, correct key names).
4. **Logging:** Log the request URL and body (with coordinates redacted if needed) so we can confirm the format. Compare with ORS API docs: https://openrouteservice.org/dev/#/api-docs
5. **Validation:** Add a small validation layer that rejects or converts [lat, lng] to [lng, lat] before calling ORS, so we never send lat-first by mistake.

After applying these, retry the request and capture the exact ORS error message (and error code, e.g. 2002) from the response body to confirm the fix.

---

## 6. Frontend note

The BanasUno frontend may call an internal backend endpoint that in turn calls ORS (e.g. accessibility from barangay to facilities). If the frontend receives an error that originates from ORS (e.g. 400 or 502), the backend should:

- Map ORS error codes to clear messages where possible.
- Ensure the backend never forwards raw ORS coordinates in error responses if they might be sensitive.
- Apply the same [lng, lat] and schema checks before calling ORS.

---

## 7. References

- ORS API reference: https://giscience.github.io/openrouteservice/api-reference/
- ORS Directions: https://openrouteservice.org/dev/#/api-docs/directions
- GeoJSON: coordinates are [x, y] = [longitude, latitude].
