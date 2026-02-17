import '../../styles/DataSourcesSection.css';

function DataSourcesSection() {
  return (
    <section className="data-sources-section">
      <h2 className="data-sources-title">Trusted Data, Reliable Insights</h2>
      
      <div className="view-switcher">
        <input type="radio" name="view-switcher" id="list-view" value="list" defaultChecked />
        <label htmlFor="list-view" className="switcher-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>      
        </label>

        <input type="radio" name="view-switcher" id="grid-view" value="grid" />
        <label htmlFor="grid-view" className="switcher-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>      
        </label>
      </div>

      <div className="data-sources-container">
        <ul className="source-list">
          <li className="source-card">
            <h3>Source #1</h3>
            <p>NASA satellite imagery and temperature data</p>
          </li>
          <li className="source-card">
            <h3>Source #2</h3>
            <p>Local government environmental monitoring stations</p>
          </li>
          <li className="source-card">
            <h3>Source #3</h3>
            <p>Public health databases and heat-related incident reports</p>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default DataSourcesSection;
