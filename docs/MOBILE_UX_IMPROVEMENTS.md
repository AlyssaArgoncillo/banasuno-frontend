# Mobile UX Improvements – Heat Map & Dashboard

Summary of mobile-only (and related) changes made to the Home Page heat map section and the Dashboard “All Barangays” section.

---

## 1. Heat Map – Zone Info Card (Below Map)

### Scrollability & layout
- **Card below map:** Zone info card is positioned **below** the map on mobile (no overlay). Map and card are separate: map has fixed height, card flows underneath.
- **Page scroll:** Card height is not capped; users scroll the **page** to see full card content (no inner-card scroll).
- **No overlap:** Card uses `position: static !important` and map container has fixed height (e.g. `65vh` / `520px`) so the map stays fully visible and the card never covers it.
- **Spacing:** Flex sections (header, name row, chips, divider, body, facility list) use `flex-shrink: 0` and consistent margins so nothing overlaps or collides.

### Page scroll at 768px
- **MainInterface.css:** At `max-width: 768px`, `.main-interface-body` uses `overflow-y: auto` and `height: auto` so the page can scroll when the zone card is below the map.

### Files
- `src/styles/HeatMap.css` (mobile `@media (max-width: 768px)`): wrapper height auto, map container height, card static positioning and spacing.
- `src/styles/ZoneInfoCard.css`: mobile override so heatmap card section never uses absolute positioning.
- `src/styles/MainInterface.css`: body scroll at 768px.

---

## 2. Heat Map – Map Size (Mobile)

- Map container height on mobile increased so more map is visible: from `50vh` / `420px` to **`65vh`** / **`520px`**.
- Card remains below the map with clear separation.

**File:** `src/styles/HeatMap.css` (mobile block for `.heatmap-wrapper > .heatmap-container`).

---

## 3. Heat Map – “Start From” / “My location” Selection State

- **Issue:** Tapping “My location” did not show a clear selected state.
- **Fix:** Active state styling reinforced so the selected option is always visible:
  - **ZoneInfoCard.css:** `.zone-info-card-origin-btn--active` keeps the same look on `:hover`, `:focus`, and `:active`.
  - **HeatMap.css (mobile):** High-specificity rules with `!important` for `.zone-info-card-origin-btn--active` inside the heatmap card so the selected button always has dark background (`#0f172a`) and white text. When the other option (barangay) is selected, “My location” returns to default styling.

**Files:** `src/styles/ZoneInfoCard.css`, `src/styles/HeatMap.css`.

---

## 4. Heat Map – Heat Index (PAGASA) Panel (Mobile)

- **Issue:** Collapsible “Heat Index (PAGASA)” panel had too much padding and wasted space.
- **Fix:** Padding reduced on mobile only:
  - **Trigger row:** `8px 12px 10px` → `5px 8px 6px`; gap `8px` → `6px`.
  - **Expanded list:** `0 12px 10px` → `0 8px 6px`.
  - **Container** (per breakpoint): 768px `6px 10px 8px` → `4px 6px 5px`; 375px `5px 8px 6px` → `3px 6px 4px`; 320px `4px 6px 5px` → `3px 5px 4px`.
- Collapsible behavior and desktop styling unchanged.

**File:** `src/styles/HeatMap.css` (`.heatmap-mobile-ui .heatmap-bottom-legend*` and mobile media queries).

---

## 5. Dashboard – “Clear All Filters” on Mobile

- **Issue:** “Clear all filters” was visible on desktop but not on mobile.
- **Fix:**
  - **Toolbar:** A “Clear all filters” button added next to the Filters button in the All Barangays section; it shows only when filters are active and only on mobile (`max-width: 768px`) via class `.dashboard-clear-filters-mobile`.
  - **Modal:** Same button added in the “All Barangays” modal header (next to search) when filters are active, also mobile-only.
  - **CSS:** `.dashboard-clear-filters-mobile { display: none !important }` by default; `display: inline-flex !important` inside `@media (max-width: 768px)`.
- Button uses `clearBarangayFilters`, min-height 44px for touch, and matches existing styling. Desktop behavior unchanged.

**File:** `src/components/main-interface/Dashboard.jsx` (markup + inline `<style>` block).

---

## 6. Responsive Design – Home Page & About Us (Desktop-First)

Summary of the responsive implementation that prioritizes desktop (1024px+) while ensuring mobile usability (down to 320px).

### Approach
- **Primary target:** Desktop (1024px and above). Layouts, spacing, and typography tuned for standard desktop/laptop.
- **Secondary:** Mobile (up to 767px) – no horizontal scroll, touch-friendly tap targets (min 44×44px), body text min 16px.
- **Tablet:** 768px–1023px – smooth transition between desktop and mobile; no awkward breakpoints or overlapping.

### Breakpoints (used consistently)
| Range        | Use |
|-------------|-----|
| **≤767px**  | Mobile: hamburger menu, stacked layouts, 44px tap targets, 16px body text |
| **768–1023px** | Tablet: narrower sidebars or same layout, 2-column where kept |
| **≥1024px** | Desktop: full layout, balanced margins |

### Global (index.css)
- **CSS variables:** `--bp-mobile-max: 767px`, `--bp-tablet-min: 768px`, `--bp-tablet-max: 1023px`, `--bp-desktop: 1024px` (plus 320, 375, 412, 1280, 1920 for reference).
- **Body:** `font-size: 1rem`; mobile override keeps 1rem for readability.
- **Images:** `max-width: 100%; height: auto` so they scale and avoid horizontal scroll.

### Home Page (MainInterface – `/home`)
- **Desktop (≥1024px):** Sidebar 260px; content padding 0.5rem 1rem (1.5rem at 1280px).
- **Tablet (768–1023px):** Sidebar 240px; map min-height 420px.
- **Mobile (≤767px):** Sidebar hidden; hamburger + overlay; **44×44px** tap targets for burger and nav items; content padding scales down to 0.5rem at 320px.

**File:** `src/styles/MainInterface.css`.

### About Us Page
- **AboutPage.css (new):** Desktop-first grid for bento (2fr 1fr), objectives (2 columns), SDG rows. Tablet (≤1023px): bento 1fr 1fr, SDG icon column 72px. Mobile (≤767px): single column; disclaimer button **min-height 44px**; body text **1rem**.
- **AboutPage.jsx:** Wrapper uses `about-detail-sections-wrap`; bento/objectives/SDG use CSS classes; `AboutPage.css` imported; inline media query removed.

**Files:** `src/styles/AboutPage.css`, `src/pages/AboutPage.jsx`.

### Header (shared: Landing + About)
- **Desktop (≥1024px):** Container padding 3rem.
- **Tablet (≤1023px):** Container padding 2rem.
- **Mobile (≤767px):** Hamburger **44×44px** hit area; nav links **min-height 44px**, **font-size 1rem**; CTA **min-height 44px**.

**File:** `src/styles/Header.css`.

### About section components
- **HeroAbout.css:** Tablet (≤1023px) and mobile (≤767px); body text 1rem; visuals `max-width: 100%`; 320px tweaks.
- **HowItWorks.css:** Tablet/mobile breakpoints; small mobile (≤480px) stacks steps; descriptions 1rem.
- **HeatSafety.css:** Tablet/mobile; card body 1rem; buttons **min 44×44px**; cards `height: auto` + min-height on small screens.
- **ContactSection.css:** Tablet/mobile; description 1rem; visuals `max-width: 100%`; `.team-btn` **min 44×44px**.

### Test viewports
- 375px (mobile), 768px (tablet), 1366px (desktop), 1920px (large desktop).

---

## Scope & Conventions

- **Mobile:** Changes apply at `max-width: 768px` (or 767px where already defined) unless noted.
- **Desktop:** Layout and styling left unchanged unless stated.
- **Accessibility:** Touch targets (e.g. 44px), contrast, and focus/active states preserved or improved.
