import React, { useState } from 'react';
import Map from './Map';
import FilterControls from './FilterControls';
import InformationCard from './InformationCard';

function MapPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="map-page">
      <div className="map-container">
        <Map />
      </div>
      
      {/* Drawer Toggle Button */}
      <button 
        className={`drawer-toggle ${drawerOpen ? 'open' : ''}`}
        onClick={toggleDrawer}
        aria-label="Toggle filter panel"
      >
        {drawerOpen ? '✕' : '⚙️'}
      </button>
      
      {/* Collapsible Drawer */}
      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-content">
          <FilterControls />
          <InformationCard />
        </div>
      </div>
    </div>
  );
}

export default MapPage;