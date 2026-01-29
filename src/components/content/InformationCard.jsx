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
          // If district is specified, use it; otherwise fall back to region filter
          if (filters.district) {
            const locationField = item.location_name_en || item.location_name;
            if (locationField !== filters.district) {
              return false;
            }
          } else if (filters.region) {
            // If no specific district is selected, filter by region
            const itemRegion = item.region_en || item.region;
            if (itemRegion !== filters.region) {
              return false;
            }
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

  const hasActiveFilters = filters.artist || filters.district || filters.decade || filters.region;

  return (
    <Card>
      <Card.Header>
        <h4 className="mb-0">
Music Locations
        </h4>
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
Click on markers to explore songs and locations
        </p>
        <p className="mb-3">
Use filters to discover songs by artist, location, or decade
        </p>

        {hasActiveFilters && (
          <Alert variant="info" className="mb-3">
            <em>Use filters above to narrow down your search</em>
          </Alert>
        )}

        <Alert variant="primary">
          <strong>Tip:</strong> Each marker shows lyrics preview and links to listen on YouTube
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default InformationCard;