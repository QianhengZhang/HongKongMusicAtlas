import React from 'react';
import { useAudio } from '../contexts';

const SongPopup = ({ song, place, onClose }) => {
  const { playPreview, stopAudio } = useAudio();


  return (
    <div className="song-popup">
      <div className="popup-header">
        <h4>{song?.title || 'Song Title'}</h4>
        <button onClick={onClose} className="close-btn" aria-label="Close popup">×</button>
      </div>
      <div className="popup-content">
        <div className="song-info">
          <p><strong>Lyric:</strong> {song?.lyric || 'Lyric text here'}</p>
          <p><strong>Artist:</strong> {song?.artist || 'Artist name'}</p>
          <p><strong>Location:</strong> {place?.name || 'Location name'}</p>
          <p><strong>Year:</strong> {song?.year || 'Unknown'}</p>
        </div>


        {/* YouTube Link */}
        {song?.youtubeUrl && (
          <div className="youtube-link">
            <a
              href={song.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-btn"
              aria-label="Listen to song on YouTube"
            >
              <span role="img" aria-label="Music note">🎵</span> Listen on YouTube
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongPopup;