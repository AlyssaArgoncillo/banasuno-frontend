export const STEP_ICONS = {
  welcome: "Wave",
  heatmap: "Map",
  colors: "Palette",
  nav: "Cursor",
  searchlegend: "Search",
  zonecard: "ClipboardList",
  routing: "Car",
  fullreport: "FileText",
  advisory: "AlertTriangle",
  advisoryft: "Thermometer",
  dashboard: "BarChart",
  table: "Table",
  facilities: "Hospital",
  done: "CheckCircle",
};

export const STEPS = [
  {
    id: 1, iconKey: "welcome", tag: "WELCOME", color: "#FF6B1A", visual: "overview",
    title: "Welcome to BanasUno",
    desc: "BanasUno helps you understand heat risk across Davao City's barangays. This 14-step guide walks you through every feature — from the Heat Map to the Dashboard. Let's get started!",
  },
  {
    id: 2, iconKey: "heatmap", tag: "HEAT MAP", color: "#E85A00", visual: "heatmap_intro",
    title: "The Heat Map — Your Bird's-Eye View",
    desc: "The Heat Map gives you a color-coded overview of heat risk across all barangays in Davao City. Darker colors signal higher PAGASA heat index levels — helping you identify hotspots at a glance.",
  },
  {
    id: 3, iconKey: "colors", tag: "HEAT MAP › COLORS", color: "#E85A00", visual: "colors",
    title: "Understanding the Color Levels",
    desc: "Each barangay is shaded using the official PAGASA heat index classification. Here's what each color means:",
    levels: [
      { temp: "< 27°C", label: "Not Hazardous", color: "#4CAF50", sub: "Normal conditions, minimal heat risk" },
      { temp: "27–32°C", label: "Caution", color: "#FFD600", sub: "Fatigue possible with prolonged exposure" },
      { temp: "33–41°C", label: "Extreme Caution", color: "#FF9800", sub: "Heat cramps and exhaustion possible" },
      { temp: "42–51°C", label: "Danger", color: "#F44336", sub: "Heat cramps and heat stroke likely" },
      { temp: "≥ 52°C", label: "Extreme Danger", color: "#B71C1C", sub: "Heat stroke imminent" },
    ],
  },
  {
    id: 4, iconKey: "nav", tag: "HEAT MAP › NAVIGATION", color: "#FF6B1A", visual: "nav",
    title: "Navigating the Map",
    desc: "Explore barangay-level heat data with intuitive controls. You can also tap 'Locate me' to center the map on your current position (browser permission required).",
    actions: [
      { iconName: "Mouse", label: "Pan", tip: "Click and drag to move around the map" },
      { iconName: "ZoomIn", label: "Zoom", tip: "Use +/– buttons, scroll wheel, or pinch gestures" },
      { iconName: "Cursor", label: "Select", tip: "Tap any barangay to view its heat details" },
      { iconName: "Locate", label: "Locate", tip: "'Locate me' centers the map on your position" },
    ],
  },
  {
    id: 5, iconKey: "searchlegend", tag: "HEAT MAP › SEARCH & LEGEND", color: "#C44F00", visual: "search_legend",
    title: "Search, Pin & the Legend Panel",
    desc: "Use the search bar to find any barangay or address — a pin will appear on the map. Tap 'Exit pinning location' to clear it. Toggle the PAGASA panel to show or hide the risk legend, and check the temperature gradient bar for the min–max °C range.",
    actions: [
      { iconName: "Search", label: "Search", tip: "Type a barangay name or address to pin it" },
      { iconName: "XCircle", label: "Exit Pin", tip: "Tap 'Exit pinning location' to clear the pin" },
      { iconName: "Layers", label: "Legend", tip: "Expand or collapse the PAGASA risk panel" },
      { iconName: "Thermometer", label: "Gradient", tip: "See the min–max °C bar and current zoom level" },
    ],
  },
  {
    id: 6, iconKey: "zonecard", tag: "BARANGAY SELECTION", color: "#C44F00", visual: "card",
    title: "The Zone Info Card",
    desc: "Tap any barangay on the Heat Map to open its Zone Info Card. You'll see the current PAGASA risk level, a quick stats strip, and a list of nearby health facilities — all in one place.",
    items: [
      "Risk header — current PAGASA level (e.g., Extreme Caution) + close button",
      "Barangay name and 'Barangay · Davao Region' label",
      "RISK score chip and current TEMP (°C) chip",
      "Nearby health facilities with straight-line or route-based distances",
    ],
  },
  {
    id: 7, iconKey: "routing", tag: "BARANGAY SELECTION › ROUTING", color: "#E85A00", visual: "routing",
    title: "Getting Directions to Facilities",
    desc: "Choose a travel mode and start point, then tap 'Route' on any facility to see the path on the map. If no road route exists, a warning appears but straight-line distance still shows.",
    routeItems: [
      { iconName: "Walk", label: "Walking", sub: "Pedestrian-friendly route to the facility" },
      { iconName: "Car", label: "Driving", sub: "Road-based driving directions" },
      { iconName: "Bike", label: "Cycling", sub: "Bicycle-friendly path when available" },
      { iconName: "Locate", label: "My Location", sub: "Uses your device GPS as the start point" },
    ],
  },
  {
    id: 8, iconKey: "fullreport", tag: "BARANGAY SELECTION › FULL REPORT", color: "#C44F00", visual: "full_report",
    title: "Opening the Full Report",
    desc: "Tap 'Full Report' at the bottom of the Zone Info Card to open the Dashboard with that barangay pre-selected. You'll jump straight to its KPIs, facility list, and historical trends.",
    reportItems: [
      "KPI strip — city-wide average temperature & risk zone counts",
      "All Barangays table — filter and search across the city",
      "Health Facility Directory — browse, map, and get routes",
      "Historical Trends — 7-day and 14-day charts and summaries",
    ],
  },
  {
    id: 9, iconKey: "advisory", tag: "HEAT ADVISORY", color: "#FF6B1A", visual: "advisory_intro",
    title: "Heat Advisory — AI Safety Guidance",
    desc: "The Heat Advisory page delivers personalized, AI-generated safety recommendations based on the current PAGASA heat index for your selected barangay. Know exactly what actions to take before conditions escalate.",
  },
  {
    id: 10, iconKey: "advisoryft", tag: "HEAT ADVISORY › FEATURES", color: "#E85A00", visual: "advisory",
    title: "Urgency Ticker & Risk Gauge",
    desc: "When a barangay is selected, you'll see two key tools. If no zone is selected, a friendly prompt guides you back to the Heat Map to choose one first.",
    advItems: [
      { iconName: "Bell", label: "Urgency Ticker", sub: "Displays the current risk level with a short, attention-grabbing tagline" },
      { iconName: "Gauge", label: "Risk Level Gauge", sub: "Tap any of the 5 PAGASA levels to preview advisories for that category" },
      { iconName: "Bot", label: "AI Advisory", sub: "Practical bulleted advice (e.g., 'Stay hydrated', 'Seek shade') with icons" },
      { iconName: "Sparkles", label: "'What If' Mode", sub: "Explore any risk level's recommendations without changing your map selection" },
    ],
  },
  {
    id: 11, iconKey: "dashboard", tag: "DASHBOARD", color: "#C44F00", visual: "dashboard_intro",
    title: "Dashboard — Your Command Center",
    desc: "The Dashboard is your all-in-one view of city-wide heat risk data. The top bar shows your currently selected barangay (or 'No area selected') along with the current date and time.",
  },
  {
    id: 12, iconKey: "table", tag: "DASHBOARD › BARANGAY TABLE", color: "#E85A00", visual: "table",
    title: "All Barangays Table",
    desc: "Row 2 of the Dashboard shows a searchable, filterable table of every barangay — with name, temperature, risk level, and nearby facilities count. By default only 3 rows show; tap 'View All' for the full list.",
    tableItems: [
      { iconName: "Search", label: "Search", tip: "Filter by barangay name" },
      { iconName: "Filter", label: "Filters", tip: "Narrow by risk level or facility count" },
      { iconName: "Table", label: "Compact View", tip: "3 rows default; 'View All' opens full-screen list" },
      { iconName: "Eye", label: "Quick Access", tip: "Tap 'View' on any row to open its facility list" },
    ],
  },
  {
    id: 13, iconKey: "facilities", tag: "DASHBOARD › FACILITIES & TRENDS", color: "#FF6B1A", visual: "facilities_trends",
    title: "Facilities, Trends & Data Export",
    desc: "Rows 3 and 4 of the Dashboard give you a full facility directory and historical temperature trends. You can also export data as CSV for offline use.",
    ftItems: [
      { iconName: "Hospital", label: "Facility Directory", sub: "Browse facilities with type icons, distances, and route summaries. Tap 'Map' to focus the Heat Map on that location." },
      { iconName: "TrendingUp", label: "Historical Trends", sub: "Line chart + day-by-day cards. Toggle 7-day or 14-day views. AI-generated trend insights included." },
      { iconName: "Download", label: "KPI Heat Risk CSV", sub: "Pick a date and download a CSV of barangay heat risk for that specific day." },
      { iconName: "Download", label: "Trends CSV", sub: "Select a date range and download a CSV of historical temperature data." },
    ],
  },
  {
    id: 14, iconKey: "done", tag: "ALL SET", color: "#FF6B1A", visual: "done",
    title: "You're All Set!",
    desc: "You now know every feature of BanasUno. Stay cool, stay aware, and keep safe! Reopen this tutorial anytime via **Open Tutorial** in the Help section of the sidebar.",
  },
];

export const TOTAL_STEPS = STEPS.length;
