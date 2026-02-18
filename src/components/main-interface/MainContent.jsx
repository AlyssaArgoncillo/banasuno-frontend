import HeatMap from '../HeatMap';
import Dashboard from './Dashboard';

function MainContent({ view }) {
  if (view === 'dashboard') {
    return <Dashboard />;
  }
  return (
    <div className="main-interface-map-area">
      <HeatMap />
    </div>
  );
}

export default MainContent;
