import React from 'react';
import Map from './Map';
import FilterControls from './FilterControls';
import InformationCard from './InformationCard';

function MapPage() {
  return (
    <div className="map-page">
      <div className="map-container">
        <Map />
      </div>
      <div className="sidebar">
        <FilterControls />
        <InformationCard />
      </div>
    </div>
  );
}

export default MapPage;