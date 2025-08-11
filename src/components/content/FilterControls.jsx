import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Badge } from 'react-bootstrap';
import { useMap } from '../../contexts';
import { fetchMusicData } from '../../services/dataService';

const FilterControls = () => {
  const { filters, setFilters } = useMap();
  const [filterOptions, setFilterOptions] = useState({
    artists: [],
    districts: [],
    decades: []
  });

  // Fetch data and extract filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const data = await fetchMusicData();

        // Extract unique artists using Singer (Chinese names)
        const artists = [...new Set(data.map(item => item.Singer).filter(Boolean))].sort();

        // Extract unique districts (using location_name_en as district)
        const districts = [...new Set(data.map(item => item.location_name_en).filter(Boolean))].sort();

        // Extract decades from years
        const decades = [...new Set(data.map(item => {
          if (item.year) {
            const year = parseInt(item.year);
            if (!isNaN(year)) {
              return `${Math.floor(year / 10) * 10}s`;
            }
          }
          return null;
        }).filter(Boolean))].sort();

        setFilterOptions({
          artists,
          districts,
          decades
        });
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const clearAllFilters = () => {
    setFilters({
      artist: '',
      district: '',
      decade: ''
    });
  };

  const hasActiveFilters = filters.artist || filters.district || filters.decade;

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h2 className="mb-0">
          <span role="img" aria-label="Music note">🎵</span> Filter Songs
        </h2>
        {hasActiveFilters && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={clearAllFilters}
            title="Clear all filters"
          >
            ✕ Clear All
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="artist-select">
              <span role="img" aria-label="Microphone">🎤</span> Artist
            </Form.Label>
            <Form.Select
              id="artist-select"
              aria-label="Filter by artist"
              value={filters?.artist || ''}
              onChange={(e) => handleFilterChange('artist', e.target.value)}
              title="Filter by artist"
            >
              <option value="">All Artists</option>
              {filterOptions.artists.map(artist => (
                <option key={artist} value={artist}>{artist}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="location-select">
              <span role="img" aria-label="Map pin">📍</span> Location
            </Form.Label>
            <Form.Select
              id="location-select"
              aria-label="Filter by location"
              value={filters?.district || ''}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              title="Filter by location"
            >
              <option value="">All Locations</option>
              {filterOptions.districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="decade-select">
              <span role="img" aria-label="Calendar">📅</span> Decade
            </Form.Label>
            <Form.Select
              id="decade-select"
              aria-label="Filter by decade"
              value={filters?.decade || ''}
              onChange={(e) => handleFilterChange('decade', e.target.value)}
              title="Filter by decade"
            >
              <option value="">All Decades</option>
              {filterOptions.decades.map(decade => (
                <option key={decade} value={decade}>{decade}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>

        {hasActiveFilters && (
          <div className="mt-3">
            <h6>Active Filters:</h6>
            <div className="d-flex flex-wrap gap-2">
              {filters.artist && (
                <Badge bg="primary" className="d-flex align-items-center gap-1">
                  Artist: {filters.artist}
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-white"
                    onClick={() => handleFilterChange('artist', '')}
                  >
                    ×
                  </Button>
                </Badge>
              )}
              {filters.district && (
                <Badge bg="info" className="d-flex align-items-center gap-1">
                  Location: {filters.district}
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-white"
                    onClick={() => handleFilterChange('district', '')}
                  >
                    ×
                  </Button>
                </Badge>
              )}
              {filters.decade && (
                <Badge bg="success" className="d-flex align-items-center gap-1">
                  Decade: {filters.decade}
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-white"
                    onClick={() => handleFilterChange('decade', '')}
                  >
                    ×
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FilterControls;