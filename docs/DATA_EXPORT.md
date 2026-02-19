# Data export and Supabase

**Data export format and Supabase schema live in the backend repo.**

- **CSV column definitions** (snapshot by barangay, snapshot summary, historical trends)
- **Supabase schema** (`heat_snapshots`, `heat_snapshot_barangays`) and SQL
- **Backend flow** (persist snapshots, export endpoints)

See the backend repo → **`docs/DATA_EXPORT.md`**:  
[https://github.com/.../banasuno-backend/blob/main/docs/DATA_EXPORT.md](https://github.com/.../banasuno-backend/blob/main/docs/DATA_EXPORT.md)

The frontend dashboard currently builds the “current snapshot by barangay” CSV **client-side** from the heat API response. When the backend implements export endpoints and Supabase persistence, the frontend can switch to calling e.g. `GET /api/heat/davao/export/barangays.csv` for the download.
