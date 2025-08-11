import React, { useState, useEffect } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { useMap } from '../../contexts';
import { fetchMusicData } from '../../services/dataService';

const InformationCard = () => {
  const { filters } = useMap();
  const [totalItems, setTotalItems] = useState(0);
  const [visibleItems, setVisibleItems] = useState(0);

  // Calculate visible items based on filters
  useEffect(() => {
    const calculateVisibleItems = async () => {
      try {
        const data = await fetchMusicData();
        setTotalItems(data.length);

        const filteredData = data.filter(item => {
          // Filter by artist
          if (filters.artist && item.Singer !== filters.artist) {
            return false;
          }

          // Filter by district/location
          if (filters.district && item.location_name_en !== filters.district) {
            return false;
          }

          // Filter by decade
          if (filters.decade && item.year) {
            const year = parseInt(item.year);
            if (!isNaN(year)) {
              const itemDecade = `${Math.floor(year / 10) * 10}s`;
              if (itemDecade !== filters.decade) {
                return false;
              }
            } else {
              return false;
            }
          }

          return true;
        });

        setVisibleItems(filteredData.length);
      } catch (error) {
        console.error('Error calculating visible items:', error);
      }
    };

    calculateVisibleItems();
  }, [filters]);

  const hasActiveFilters = filters.artist || filters.district || filters.decade;

  return (
    <Card>
      <Card.Header>
        <h2 className="mb-0">
          <span role="img" aria-label="Music note">🎵</span> Music Locations
        </h2>
      </Card.Header>
      <Card.Body>
        <p className="mb-2">
          {hasActiveFilters ? (
            <>
              Showing <strong>{visibleItems}</strong> of <strong>{totalItems}</strong> locations
            </>
          ) : (
            <>
              <strong>{totalItems}</strong> music locations in Hong Kong
            </>
          )}
        </p>
        <p className="mb-2">
          <span role="img" aria-label="Map pin">📍</span> Click on markers to explore songs and locations
        </p>
        <p className="mb-3">
          <span role="img" aria-label="Microphone">🎤</span> Use filters to discover songs by artist, location, or decade
        </p>

        {hasActiveFilters && (
          <Alert variant="info" className="mb-3">
            <em>💡 Use filters above to narrow down your search</em>
          </Alert>
        )}

        <Alert variant="primary">
          <strong>💡 Tip:</strong> Each marker shows lyrics preview and links to listen on YouTube
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default InformationCard;