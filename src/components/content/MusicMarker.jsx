import React from 'react';
import mapboxgl from 'mapbox-gl';



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
MusicMarker.addToMap = (data, map, parseLocation) => {
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

  // Create popup content with enhanced styling
  const popupContent = `
    <div class="marker-popup">
      <div class="popup-header">
        <div class="popup-title">
          <h2><a href="#/explore?search=${encodeURIComponent(data.song)}" class="song-link" title="Click to view full song details" style="color: white">${data.song || 'Unknown Song'}</a></h2>
          <span class="popup-subtitle">
            <a href="#/explore?search=${encodeURIComponent(data.Singer)}" class="artist-link" title="Click to search artist">
              ${data.Singer ? data.Singer.split(',').map(name => name.trim()).join(', ') : 'Unknown Artist'}
            </a>
            ${data.singer_en && data.singer_en !== data.Singer ?
              `<small class="text-muted d-block" style="color: white">${data.singer_en}</small>` : ''}
          </span>
        </div>
      </div>

      <div class="popup-content">
                <div class="info-row">
          <div class="info-text">
            <span class="info-label"><span role="img" aria-label="Map pin">📍</span> 地点/Location</span>
            <span class="info-value">${data.location_name || 'Unknown Location'}</span>
            ${data.location_name_en && data.location_name_en !== data.location_name ?
              `<small class="text-muted d-block">${data.location_name_en}</small>` : ''}
          </div>
        </div>

        <div class="info-row">
          <div class="info-text">
            <span class="info-label"><span role="img" aria-label="Calendar">📅</span> 年份/Year</span>
            <span class="info-value">${data.year || 'Unknown Year'}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-text">
            <span class="info-label"><span role="img" aria-label="Compact disc">💿</span> 专辑/Album</span>
            <span class="info-value">${data.album || 'Unknown Album'}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-text">
            <span class="info-label"><span role="img" aria-label="Scroll">📜</span> 歌词预览/Lyrics Preview</span>
            <span class="info-value">${data.lyrics ? data.lyrics.substring(0, 100) + '...' : 'No lyrics available'}</span>
          </div>
        </div>

        <div class="popup-actions">
          <a href="javascript:void(0)" 
             onclick="window.open('https://www.youtube.com/results?search_query=${encodeURIComponent(`${data.song} ${data.Singer}`)}', '_blank')" 
             class="youtube-btn" 
             title="Listen on YouTube"
             style="color: #000000; background-color: #ffffff; padding: 8px 16px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">
             🎵 Listen on YouTube
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