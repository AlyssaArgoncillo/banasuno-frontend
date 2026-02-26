import { useState } from 'react';
import {
  animated,
  config,
  useSpring,
  useSpringRef
} from '@react-spring/web';
import '../../styles/DataSourcesSection.css';

const dataSources = [
  {
    title: 'faeldon/philippines-json-maps',
    description: 'A GitHub repository providing Philippine administrative boundaries in GeoJSON and TopoJSON formats, useful for mapping and geographic visualization at different resolutions.',
    image: '/phjson.png'
  },
  {
    title: 'Philippine Standard Geographic Code - API',
    description: 'An API that serves official geographic codes and classifications for Philippine regions, provinces, cities, municipalities, and barangays, ensuring standardized location references.',
    image: '/psgc.png'
  },
  {
    title: 'WeatherAPI 1.0.2 - WeatherAPI.com Studio',
    description: 'A weather data service offering forecasts, current conditions, and historical weather information through a developer-friendly API.',
    image: '/wpai.png'
  },
  {
    title: 'Leaflet powered by OpenStreetMaps',
    description: 'A lightweight JavaScript library for interactive maps, commonly paired with OpenStreetMap data to build customizable web-based mapping applications.',
    image: '/leaflet.png'
  },
  {
    title: 'Healthsites.io',
    description: 'A global open data platform mapping healthcare facilities, providing information on hospitals, clinics, and health centers for public use and humanitarian purposes.',
    image: '/healthio.png'
  },
  {
    title: 'Philippine Statistics Authority (2025). 2024 Census of Population',
    description: 'The official census report from the PSA, presenting population counts by legislative district and other demographic details, serving as a key reference for planning and policy-making.',
    image: '/PSA.png'
  },
  {
    title: 'PAGASA (Heat Index Page)',
    description: 'The PAGASA Heat Index page provides real-time updates on how hot it actually feels outdoors by combining air temperature and humidity. It categorizes conditions into five levels: Not Hazardous (below 27°C), Caution (27–32°C), Extreme Caution (33–41°C), Danger (42–51°C), and Extreme Danger (52°C and above). This helps the public understand potential health risks from heat stress and guides safety measures during hot weather.',
    image: '/PAGASA.png'
  },
  {
    title: 'Open-Meteo',
    description: 'A free weather forecast API (https://open-meteo.com/en/pricing) that provides hourly, daily, and historical weather data (temperature, humidity, precipitation, wind, solar radiation, UV index, etc.). Supplies temperature and humidity values needed to compute the PAGASA heat index risk tiers. Provides short‑term forecasts (up to 16 days) and recent historical data (up to 92 days), which feed to the dashboard\'s 7/14‑day trend charts. Works with caching (10–30 minutes) to avoid exceeding the 10,000 calls/day limit while still delivering "live" updates.',
    image: '/meteo.png'
  },
  {
    title: 'OpenRoute Service',
    description: 'Provides accurate travel distances and times between barangays and healthcare facilities. Generates isochrones (areas reachable within X minutes), useful for accessibility analysis. Enhances the facility access feature by moving beyond simple counts to real proximity measures. Supports the clinic locator tool in your frontend, giving residents directions to the nearest facility.',
    image: '/openroute.png'
  }
];

function DataSourcesSection() {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const springApi = useSpringRef();
  const { size, ...rest } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { size: '220px', background: 'rgba(255, 255, 255, 0.65)' },
    to: {
      size: open ? '560px' : '220px',
      background: open ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.65)'
    }
  });

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) setSelectedIndex(0);
      return next;
    });
  };

  return (
    <section id="data-sources" className="data-sources-section">
      <div className={`data-sources-stage ${open ? 'is-dimmed' : ''}`}>
        <h2 className="data-sources-title">Trusted Data, Reliable Insights</h2>

        <div className="data-sources-visual-wrapper">
          <animated.div
            className="data-sources-visual"
            data-open={open ? 'true' : 'false'}
            data-hovered={isHovered ? 'true' : 'false'}
            style={{ ...rest, width: size, height: size }}
            onClick={handleToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img src="/folder.png" alt="" className="data-sources-folder" aria-hidden />
          </animated.div>
          <p className="data-sources-visual-caption">Click the folder to reveal the data stack</p>
        </div>
      </div>

      <div className={`data-sources-reveal ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="data-sources-panel">
          <div className="data-sources-panel-header">
            <div className="data-sources-window-dots" aria-hidden="true">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <button
              type="button"
              className="data-sources-close"
              onClick={() => setOpen(false)}
              aria-label="Close data sources"
            >
              ×
            </button>
          </div>
          <div className="data-sources-tabs">
            {dataSources.map((source, index) => (
              <button
                key={source.title}
                type="button"
                className={`data-source-tab${selectedIndex === index ? ' is-active' : ''}`}
                onClick={() => setSelectedIndex(index)}
              >
                <span>{source.title}</span>
              </button>
            ))}
          </div>
          <div className="data-source-detail">
            <h4>{dataSources[selectedIndex].title}</h4>
            <p>{dataSources[selectedIndex].description}</p>
            {dataSources[selectedIndex].image && (
              <img
                src={dataSources[selectedIndex].image}
                alt={dataSources[selectedIndex].title}
                className="data-source-image"
              />
            )}
          </div>
        </div>
      </div>
      
    </section>
  );
}

export default DataSourcesSection;
