import HeatMap from '../HeatMap';
import Dashboard from './Dashboard';

function MainContent({ view, selectedZone, onZoneSelected, onGoToDashboard }) {
  if (view === 'dashboard') {
    return <Dashboard selectedZone={selectedZone} />;
  }
  return (
    <div className="main-interface-map-area">
      <HeatMap selectedZone={selectedZone} onZoneSelected={onZoneSelected} onGoToDashboard={onGoToDashboard} />
    </div>
  );
}

export default MainContent;
