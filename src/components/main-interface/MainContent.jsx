import HeatMap from '../HeatMap';
import Dashboard from './Dashboard';
import HeatAdvisoryPage from './HeatAdvisoryPage';

function MainContent({
  view,
  selectedZone,
  onZoneSelected,
  onGoToDashboard,
  onFocusFacilityOnMap,
  facilityToFocusOnMap,
  onClearFocusFacility,
  onGoToHeatMap,
  showTutorial,
  setShowTutorial,
  heatmapIotLayer,
  heatmapIotLayerKey,
}) {
  if (view === 'dashboard') {
    return (
      <Dashboard
        selectedZone={selectedZone}
        onFocusFacilityOnMap={onFocusFacilityOnMap}
        onGoToHeatMap={onGoToHeatMap}
      />
    );
  }
  if (view === 'heat-advisory') {
    return <HeatAdvisoryPage selectedZone={selectedZone} onGoToHeatMap={onGoToHeatMap} />;
  }
  return (
    <div className="main-interface-map-area">
      <HeatMap
        selectedZone={selectedZone}
        onZoneSelected={onZoneSelected}
        onGoToDashboard={onGoToDashboard}
        facilityToFocusOnMap={facilityToFocusOnMap}
        onClearFocusFacility={onClearFocusFacility}
        showTutorial={showTutorial}
        setShowTutorial={setShowTutorial}
        externalIotLayer={heatmapIotLayer}
        externalIotLayerKey={heatmapIotLayerKey}
      />
    </div>
  );
}

export default MainContent;
