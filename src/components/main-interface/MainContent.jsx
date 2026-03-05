import HeatMap from '../HeatMap';
import Dashboard from './Dashboard';
import HeatAdvisoryPage from './HeatAdvisoryPage';

function MainContent({ view, selectedZone, onZoneSelected, onGoToDashboard, onFocusFacilityOnMap, facilityToFocusOnMap, onClearFocusFacility }) {
  if (view === 'dashboard') {
    return <Dashboard selectedZone={selectedZone} onFocusFacilityOnMap={onFocusFacilityOnMap} />;
  }
  if (view === 'heat-advisory') {
    return <HeatAdvisoryPage selectedZone={selectedZone} />;
  }
  return (
    <div className="main-interface-map-area">
      <HeatMap
        selectedZone={selectedZone}
        onZoneSelected={onZoneSelected}
        onGoToDashboard={onGoToDashboard}
        facilityToFocusOnMap={facilityToFocusOnMap}
        onClearFocusFacility={onClearFocusFacility}
      />
    </div>
  );
}

export default MainContent;
