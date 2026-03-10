# Feature Tutorial — Heat Map, Barangay Selection, Heat Advisory & Dashboard

This document explains the purpose and functionalities of the four main tools in order of how a user typically interacts with them.

---

## 1. Heat Map

**Purpose:** Provides a visual overview of heat risk across all barangays in Davao City so users can quickly identify hotspots and explore temperature data on an interactive map.

**Functionalities:**

- View color-coded barangays based on PAGASA heat index levels (Not Hazardous, Caution, Extreme Caution, Danger, Extreme Danger)
- Pan and zoom to navigate the map
- Tap or click any barangay to select it and see detailed information in the zone info card
- Search for a specific location (barangay name or address in Davao City) via the search bar; results pin the location on the map
- Use device location to center the map on your current position (browser may prompt for permission)
- Pin a searched or device location on the map; use “Exit pinning location” to clear the pin
- Expand or collapse the **Heat Index (PAGASA)** panel (desktop dropdown) to view or hide the legend
- View the temperature gradient legend (min–max °C) and zoom percentage
- Use zoom controls: zoom in, zoom out, “Locate me,” and fullscreen
- On first visit, see the one-time disclaimer explaining how heat risk is estimated and aligned with PAGASA

---

## 2. Barangay Selection (from Heat Map)

**Purpose:** Lets users choose a single barangay on the map and immediately see its heat risk summary plus nearby health facilities and routing options.

**What happens when you click a barangay:**

- A **Zone Info Card** opens (desktop: overlay on the map; mobile: below or alongside the map) showing:
  - **Header:** Current PAGASA risk level (e.g. Extreme Caution, Danger) and a close (×) button
  - **Barangay name** and location label (“Barangay · Davao Region”)
  - **Chips:** Risk score and temperature (°C)
  - **Health facilities in the area:** List of nearby facilities with distance (straight-line or route-based when available)
- **Route options:**
  - **Profile:** Choose travel mode — Walking, Driving, or Cycling
  - **Start from:** Choose “My location” (uses device location) or the selected barangay center
  - **Route →** on a facility: Show the route on the map; **✕ Exit** to clear the route
- When a road route is not available, the facility row shows “No route found — straight-line only” with a warning; you can still view the straight-line distance
- **Full Report →** button: Opens the **Dashboard** with this barangay as the selected area so you can see the full KPI strip, All Barangays table, Health Facility Directory, and Historical Trends in context

Selecting a barangay also updates the **Heat Advisory** and **Dashboard** (when you switch to those views) to use this zone.

---

## 3. Heat Advisory

**Purpose:** Shows AI-generated safety recommendations based on the current PAGASA heat index for the selected area, so users know what to do at each risk level.

**Functionalities:**

- When **no zone is selected:**
  - A message explains that no data is available and asks you to select a zone first
  - A **“Choose location”** button takes you to the Heat Map to select a barangay
- When **a barangay is selected:**
  - **Urgency Ticker** shows the current risk level and a short tagline
  - **Risk level gauge:** Click or select a level (Not Hazardous, Caution, Extreme Caution, Danger, Extreme Danger) to preview advisories for that level
  - **AI-generated advisory:** Fetched for the selected barangay and risk level; shows a tagline and a list of advice items (e.g. stay hydrated, seek shade, limit exertion) with icons and short descriptions
  - Recommendations are aligned with PAGASA levels and temperature ranges (e.g. 27–32°C for Caution, 33–41°C for Extreme Caution)
- Use the gauge to explore “what if” recommendations at different risk levels without changing the map selection

---

## 4. Dashboard

**Purpose:** Gives a single-screen summary of heat risk for Davao City and the selected barangay: KPIs, barangay list, health facilities, historical trends, and CSV exports.

**Functionalities:**

- **Top bar:** Shows the currently selected barangay (or “No area selected”), date, and time
- **Row 1 — KPI strip:**
  - **Average temperature** card: City-wide or context average (°C) and “Davao City” label
  - **Heat-risk zone count:** Counts of barangays in each PAGASA level (Not Hazardous, Caution, Extreme Caution, Danger, Extreme Danger)
- **Row 2 — All Barangays table:**
  - Table of barangays with columns: Barangay name, Temperature, Risk Level, Nearby Facilities, and a “View” action
  - **Search** to filter by barangay name
  - **Filters** (e.g. by risk level or facility count) to narrow the list
  - By default only **3 barangays** are shown; **“View All”** opens a full-screen list/modal with the same columns and filters
  - “View” on a row opens the facility list for that barangay in the panel
- **Row 3 — Health Facility Directory:**
  - List of health facilities (with type icons) for the selected area; shows distance and optional route summary
  - **“Map”** on a facility: Switches to the Heat Map and focuses that facility (and route if available)
- **Row 4 — Historical Trends:**
  - Line chart and day-by-day cards for temperature over the last 7 or 14 days
  - Toggle 7 / 14 days; view trend summary and insights
- **Data Export section (e.g. “KPI Heat Risk” and “Historical Trends”):**
  - **KPI Heat Risk:** Pick a date and download a CSV of barangay heat risk for that day
  - **Historical Trends:** Pick date range/days and download a CSV of historical trend data
- When no barangay is selected, the dashboard still shows city-wide KPIs and the full barangay list, but the top bar and some context (e.g. facility directory) reflect “No area selected” until you pick a zone on the Heat Map

---

## Quick reference

| Feature            | Purpose in one line                                                                 |
|--------------------|--------------------------------------------------------------------------------------|
| **Heat Map**       | Visual heat risk by barangay; search, pin, zoom, and select a zone.                 |
| **Barangay selection** | Click a zone → see risk, temp, facilities, routes, and “Full Report” to Dashboard. |
| **Heat Advisory**  | Safety recommendations by PAGASA level; choose a location or use the gauge.         |
| **Dashboard**      | KPIs, barangay table, facility directory, trends, and CSV exports in one place.    |
