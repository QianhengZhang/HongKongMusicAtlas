import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MusicMarker from './MusicMarker';
import { fetchMusicData, parseLocation } from '../../services/dataService';
import { useMap, useLanguage } from '../../contexts';

const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [musicMarkers, setMusicMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState(null);
  const { filters } = useMap();
  const languageContext = useLanguage();

  // Get Mapbox token
  const fetchMapboxToken = async () => {
    // Hardcoded Mapbox token
    const token = 'pk.eyJ1IjoiZXNzc3RoZXJjIiwiYSI6ImNsN2pka2tsMzA4c3c0Mm9iZGxrbmI1d2gifQ.STj4zgpL2uKJ1GH325OGCQ';
    setMapboxToken(token);
    return token;
  };

  //clear all music markers
  const clearAllMusicMarkers = () => {
    musicMarkers.forEach(marker => {
      if (marker && marker.cleanup) {
        marker.cleanup();
      } else if (marker && marker.remove) {
        marker.remove();
      }
    });

    // Force remove all markers from the map
    if (mapInstanceRef.current) {
      const mapMarkers = document.querySelectorAll('.mapboxgl-marker');
      mapMarkers.forEach(markerEl => {
        markerEl.remove();
      });
    }

    setMusicMarkers([]);
  };

  // load music data and create markers
  const loadMusicMarkers = async () => {
    try {
      setIsLoading(true);
      const musicData = await fetchMusicData();

      // Clear existing markers
      clearAllMusicMarkers();

      // Create a marker for each music data entry
      const newMarkers = musicData.map(data => {
        return MusicMarker.addToMap(data, mapInstanceRef.current, parseLocation, languageContext);
      }).filter(marker => marker !== null); // Filter out invalid markers

      setMusicMarkers(newMarkers);
    } catch (error) {
      console.error('Error loading music markers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ordinary function: update markers based on filters
  const updateMarkersWithFilters = async (currentFilters = {}) => {
    try {
      // First clear existing markers
      clearAllMusicMarkers();

      const musicData = await fetchMusicData();

      // Apply filters
      const filteredData = musicData.filter(item => {
        // Filter by artist (using Singer)
        if (currentFilters.artist && item.Singer !== currentFilters.artist) {
          return false;
        }

        // Filter by district
        if (currentFilters.district && item.location_name_en !== currentFilters.district) {
          return false;
        }

        // Filter by decade
        if (currentFilters.decade && item.year) {
          const year = parseInt(item.year);
          if (!isNaN(year)) {
            const itemDecade = `${Math.floor(year / 10) * 10}s`;
            if (itemDecade !== currentFilters.decade) {
              return false;
            }
          } else {
            return false;
          }
        }

        return true;
      });

      // Create filtered markers
      const newMarkers = filteredData.map(data => {
        return MusicMarker.addToMap(data, mapInstanceRef.current, parseLocation, languageContext);
      }).filter(marker => marker !== null);

      setMusicMarkers(newMarkers);
    } catch (error) {
      console.error('Error updating markers with filters:', error);
    }
  };

  // Ordinary function: get map center
  const getMapCenter = () => {
    if (mapInstanceRef.current) {
      return mapInstanceRef.current.getCenter();
    }
    return null;
  };

  // Ordinary function: set map center
  const setMapCenter = (lngLat) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: lngLat, zoom: 12 });
    }
  };

  // Listen for filter changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkersWithFilters(filters);
    }
  }, [filters]);

  // Listen for language changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkersWithFilters(filters);
    }
  }, [languageContext.language]);

  useEffect(() => {
    const initializeMap = async () => {
      // Get Mapbox token
      const token = await fetchMapboxToken();
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/essstherc/cmgj2ja1t001001sce03d5pf8',
        center: [114.1694, 22.3193], // Hong Kong center
        zoom: 10,
      });

      mapInstanceRef.current = map;

      // After the map loads, load music markers
      map.on('load', () => {
        loadMusicMarkers();
      });

      // Add map click event
      map.on('click', (e) => {
        console.log('Map clicked at:', e.lngLat);
      });

      return () => {
        clearAllMusicMarkers();
        map.remove();
      };
    };

    initializeMap();
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          <div>Loading music markers...</div>
        </div>
      )}
    </div>
  );
};

export default Map;