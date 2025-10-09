import React from 'react';
import mapboxgl from 'mapbox-gl';
import { useLanguage } from '../../contexts';



// Helper function to determine optimal popup anchor based on marker position
const getOptimalAnchor = (map, coordinates) => {
  const point = map.project(coordinates);
  const container = map.getContainer();
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  // Define popup dimensions (approximate)
  const popupWidth = 300;
  const popupHeight = 200;

  // Calculate available space in each direction
  const spaceRight = width - point.x;
  const spaceLeft = point.x;
  const spaceTop = point.y;
  const spaceBottom = height - point.y;

  // Determine best anchor based on available space
  if (spaceRight >= popupWidth && spaceBottom >= popupHeight) {
    return 'bottom-right'; // Prefer bottom-right if space available
  } else if (spaceLeft >= popupWidth && spaceBottom >= popupHeight) {
    return 'bottom-left';
  } else if (spaceRight >= popupWidth && spaceTop >= popupHeight) {
    return 'top-right';
  } else if (spaceLeft >= popupWidth && spaceTop >= popupHeight) {
    return 'top-left';
  } else if (spaceBottom >= popupHeight) {
    return spaceRight > spaceLeft ? 'bottom-right' : 'bottom-left';
  } else if (spaceTop >= popupHeight) {
    return spaceRight > spaceLeft ? 'top-right' : 'top-left';
  } else {
    // Fallback to center if no good option
    return 'center';
  }
};

// Global variable to track the currently open popup
let currentPopup = null;

const MusicMarker = ({ data, map }) => {
  return null; // This component doesn't render anything, it's just for organization
};

// Static method to add marker to map
MusicMarker.addToMap = (data, map, parseLocation, languageContext = null) => {
  if (!data || !map) return null;

  const coordinates = parseLocation(data.location_x, data.location_y);
  if (!coordinates) {
    console.log(`Skipping marker for ${data.song}: invalid coordinates`);
    return null;
  }

  // Create marker element
  const markerEl = document.createElement('div');
  markerEl.className = 'music-marker';
  markerEl.innerHTML = `
    <div class="marker-icon" role="img" aria-label="Music marker">🎵</div>
    <div class="marker-pulse"></div>
  `;
  markerEl.style.cursor = 'pointer';

  // Helper function to get translation
  const t = (key, fallback) => {
    if (languageContext && languageContext.t) {
      return languageContext.t(key, fallback);
    }
    return fallback || key;
  };

  // Get language-specific content
  const isChinese = languageContext && languageContext.language === 'zh';
  
  // Song title - use Chinese or English based on language
  const songTitle = isChinese ? (data.song || 'Unknown Song') : (data.song_en || data.song || 'Unknown Song');
  
  // Artist - use Chinese or English based on language
  const artistName = isChinese ? (data.Singer || 'Unknown Artist') : (data.singer_en || data.Singer || 'Unknown Artist');
  
  // Location - use Chinese or English based on language
  const locationName = isChinese ? (data.location_name || 'Unknown Location') : (data.location_name_en || data.location_name || 'Unknown Location');
  
  // Album - use appropriate language version
  const albumName = data.album || 'Unknown Album';
  
  // Lyrics - use Chinese or English based on language
  const lyricsText = isChinese ? (data.lyrics || 'No lyrics available') : (data.lyrics_en || data.lyrics || 'No lyrics available');
  const lyricsPreview = lyricsText.length > 100 ? lyricsText.substring(0, 100) + '...' : lyricsText;

  // Create popup content with enhanced styling
  const popupContent = `
    <div class="marker-popup">
      <div class="popup-header">
        <div class="popup-title">
          <h2><a href="#/explore?search=${encodeURIComponent(songTitle)}" class="song-link" title="Click to view full song details" style="color: white">${songTitle}</a></h2>
          <span class="popup-subtitle">
            <a href="#/explore?search=${encodeURIComponent(artistName)}" class="artist-link" title="Click to search artist">
              ${artistName}
            </a>
          </span>
        </div>
      </div>

      <div class="popup-content">
        <div class="info-row">
          <div class="info-text">
            <span class="info-label">${t('song.location', 'Location')}</span>
            <span class="info-value">${locationName}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-text">
            <span class="info-label">${t('song.year', 'Year')}</span>
            <span class="info-value">${data.year || t('song.unknown', 'Unknown')}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-text">
            <span class="info-label">${t('song.album', 'Album')}</span>
            <span class="info-value">${albumName}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-text">
            <span class="info-label">${t('song.lyrics', 'Lyrics')}</span>
            <span class="info-value">${lyricsPreview}</span>
          </div>
        </div>

        <div class="popup-actions">
          <a href="javascript:void(0)" 
             onclick="window.open('https://www.youtube.com/results?search_query=${encodeURIComponent(`${songTitle} ${artistName}`)}', '_blank')" 
             class="youtube-btn" 
             title="${t('song.listenYouTube', 'Listen on YouTube')}"
             style="color: #000000; background-color: #ffffff; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">
             ${t('song.listenYouTube', 'Listen on YouTube')}
          </a>
        </div>
      </div>
    </div>
  `;

  // Create popup with smart positioning
  const optimalAnchor = getOptimalAnchor(map, coordinates);
  const popup = new mapboxgl.Popup({
    offset: {
      'top': [0, -10],
      'top-left': [0, -10],
      'top-right': [0, -10],
      'bottom': [0, 10],
      'bottom-left': [0, 10],
      'bottom-right': [0, 10],
      'left': [10, 0],
      'right': [-10, 0]
    },
    anchor: optimalAnchor,
    closeButton: true,
    closeOnClick: false,
    className: 'music-popup'
  }).setHTML(popupContent);

  // Create Mapbox marker
  const marker = new mapboxgl.Marker(markerEl)
    .setLngLat(coordinates)
    .addTo(map);

  // Add click handler with popup management
  markerEl.addEventListener('click', () => {
    // If this popup is already open, close it
    if (currentPopup === popup && currentPopup.isOpen()) {
      currentPopup.remove();
      currentPopup = null;
      return;
    }

    // Close any existing popup
    if (currentPopup && currentPopup.isOpen()) {
      currentPopup.remove();
    }

    // Open new popup
    popup.setLngLat(coordinates).addTo(map);
    currentPopup = popup;

    // Set up popup close event to clear current popup reference
    popup.on('close', () => {
      if (currentPopup === popup) {
        currentPopup = null;
      }
    });
  });

  // Store cleanup function
  marker.cleanup = () => {
    // Close popup if it's the current one
    if (currentPopup && currentPopup.isOpen()) {
      currentPopup.remove();
      currentPopup = null;
    }

    // Remove the marker from the map
    if (marker && marker.remove) {
      marker.remove();
    }

    // Also remove the marker element from DOM if it still exists
    if (markerEl && markerEl.parentNode) {
      markerEl.parentNode.removeChild(markerEl);
    }
  };

  return marker;
};

export default MusicMarker;