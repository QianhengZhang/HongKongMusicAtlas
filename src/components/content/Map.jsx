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
    // Keep a global reference in sync
    window.musicMarkers = [];
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
      // Update global reference for external triggering (e.g., Play Random)
      window.musicMarkers = newMarkers;
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

      // Use cached data if available, otherwise fetch
      let musicData;
      if (window.cachedMusicData) {
        musicData = window.cachedMusicData;
      } else {
        musicData = await fetchMusicData();
        window.cachedMusicData = musicData;
      }

      // Apply filters
      const filteredData = musicData.filter(item => {
        // Filter by artist (using appropriate language version)
        if (currentFilters.artist) {
          const artistField = languageContext.language === 'zh' ? item.Singer : (item.singer_en || item.Singer);
          if (artistField !== currentFilters.artist) {
            return false;
          }
        }

        // Filter by district (using appropriate language version)
        if (currentFilters.district) {
          const locationField = languageContext.language === 'zh' ? item.location_name : (item.location_name_en || item.location_name);
          if (locationField !== currentFilters.district) {
            return false;
          }
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

      console.log('Filtered data length:', filteredData.length);
      console.log('Applied filters:', currentFilters);

      // Create filtered markers
      const newMarkers = filteredData.map(data => {
        return MusicMarker.addToMap(data, mapInstanceRef.current, parseLocation, languageContext);
      }).filter(marker => marker !== null);

      setMusicMarkers(newMarkers);
      // Update global reference for external triggering (e.g., Play Random)
      window.musicMarkers = newMarkers;
      
      // Auto fly/fit behavior per requirements
      // Only run when at least one filter is active to avoid region-change recenter being overridden
      const hasActiveFilters = Boolean(currentFilters.artist || currentFilters.district || currentFilters.decade);
      if (mapInstanceRef.current && hasActiveFilters) {
        const validCoords = filteredData
          .map(item => parseLocation(item.location_x, item.location_y))
          .filter(lngLat => Array.isArray(lngLat) && lngLat.length === 2 && !isNaN(lngLat[0]) && !isNaN(lngLat[1]));

        if (validCoords.length === 0) {
          // No results: do nothing
        } else if (validCoords.length === 1) {
          // Single: flyTo center
          const center = validCoords[0];
          if (mapInstanceRef.current.isEasing()) {
            mapInstanceRef.current.stop();
          }
          mapInstanceRef.current.flyTo({
            center,
            zoom: 13.8,
            duration: 1200,
            essential: true,
            easing: t => 1 - Math.pow(1 - t, 3)
          });

          // Open popup briefly for feedback
          const singleMarker = newMarkers.find(m => {
            if (!m || typeof m.getLngLat !== 'function') return false;
            const pos = m.getLngLat();
            return Math.abs(pos.lng - center[0]) < 1e-6 && Math.abs(pos.lat - center[1]) < 1e-6;
          });
          if (singleMarker && typeof singleMarker.openPopup === 'function') {
            setTimeout(() => singleMarker.openPopup({ recenter: false }), 300);
          }
        } else {
          // Multiple: fit bounds
          const bounds = new mapboxgl.LngLatBounds();
          validCoords.forEach(lngLat => bounds.extend(lngLat));

          // If bounding area very small, keep zoom and only re-center
          const area = Math.abs((bounds.getEast() - bounds.getWest()) * (bounds.getNorth() - bounds.getSouth()));
          if (area < 0.001) {
            const centerLng = (bounds.getEast() + bounds.getWest()) / 2;
            const centerLat = (bounds.getNorth() + bounds.getSouth()) / 2;
            if (mapInstanceRef.current.isEasing()) {
              mapInstanceRef.current.stop();
            }
            mapInstanceRef.current.flyTo({
              center: [centerLng, centerLat],
              duration: 800,
              essential: true,
              easing: t => 1 - Math.pow(1 - t, 3)
            });
          } else {
            if (mapInstanceRef.current.isEasing()) {
              mapInstanceRef.current.stop();
            }
            mapInstanceRef.current.fitBounds(bounds, {
              padding: 100,
              maxZoom: 6,
              duration: 1200,
              easing: t => 1 - Math.pow(1 - t, 3)
            });
          }
        }
      }
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
  const setMapCenter = (lngLat, zoom = 14) => {
    console.log('setMapCenter called with:', { lngLat, zoom });
    if (mapInstanceRef.current) {
      console.log('Flying to:', { center: lngLat, zoom: zoom });
      mapInstanceRef.current.flyTo({ 
        center: lngLat, 
        zoom: zoom,
        duration: 1000,
        essential: true
      });
    } else {
      console.log('Map instance not available');
    }
  };

  // Expose setMapCenter to global scope for MusicMarker to use
  useEffect(() => {
    if (mapInstanceRef.current) {
      window.setMapCenter = setMapCenter;
    }
  }, [mapInstanceRef.current]);

  // Listen for filter and language changes with debouncing
  useEffect(() => {
    console.log('Filters or language changed:', filters, languageContext.language);
    if (mapInstanceRef.current) {
      // Clear any existing timeout
      if (window.updateMarkersTimeout) {
        clearTimeout(window.updateMarkersTimeout);
      }
      
      // Debounce the update to prevent rapid successive calls
      window.updateMarkersTimeout = setTimeout(() => {
        console.log('Updating markers with filters:', filters);
        updateMarkersWithFilters(filters);
      }, 300);
    }
  }, [filters, languageContext.language]);

  useEffect(() => {
    const initializeMap = async () => {
      // Get Mapbox token
      const token = await fetchMapboxToken();
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/essstherc/cmgj2ja1t001001sce03d5pf8',
        center: [114.160932, 22.334575], 
        zoom: 10.77,
      });

      mapInstanceRef.current = map;

      // Expose a helper to trigger a random marker click (opens popup and recenters)
      window.openRandomMarker = () => {
        const list = Array.isArray(window.musicMarkers) ? window.musicMarkers : [];
        if (!list.length) return;
        const randomMarker = list[Math.floor(Math.random() * list.length)];
        if (randomMarker && typeof randomMarker.getElement === 'function') {
          const el = randomMarker.getElement();
          if (el) {
            // Record a pseudo "click" time to avoid auto-fit race
            window.lastMarkerClickTime = Date.now();
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          }
        }
      };

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

  // Zoom control functions
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.zoomTo(currentZoom + 1, { duration: 300 });
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.zoomTo(currentZoom - 1, { duration: 300 });
    }
  };

  const handleReset = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [114.160932, 22.334575], // Hong Kong center
        zoom: 10.77,
        duration: 1000
      });
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button 
          className="zoom-btn zoom-in" 
          onClick={handleZoomIn}
          title="Zoom In"
        >
          +
        </button>
        <button 
          className="zoom-btn zoom-out" 
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          −
        </button>
        <button 
          className="zoom-btn reset-btn" 
          onClick={handleReset}
          title="Reset to Hong Kong"
        >
          ↺
        </button>
      </div>

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