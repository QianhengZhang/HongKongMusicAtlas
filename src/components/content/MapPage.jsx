import React, { useState } from 'react';
import Map from './Map';
import DiscoverLyrics from './DiscoverLyrics';

function MapPage() {
  const [drawerOpen, setDrawerOpen] = useState(true);

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
        {drawerOpen ? '✕' : '⤢'}
      </button>
      
      {/* Collapsible Drawer */}
      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-content">
          <DiscoverLyrics />
        </div>
      </div>
    </div>
  );
}

export default MapPage;