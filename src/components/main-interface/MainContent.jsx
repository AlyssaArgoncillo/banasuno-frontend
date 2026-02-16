import HeatMap from '../HeatMap';

function MainContent({ view }) {
  if (view === 'dashboard') {
    return (
      <div className="main-interface-dashboard-placeholder">
        <h2>Dashboard</h2>
        <p>Charts and analytics will go here.</p>
      </div>
    );
  }
  return (
    <div className="main-interface-map-area">
      <HeatMap />
    </div>
  );
}

export default MainContent;
