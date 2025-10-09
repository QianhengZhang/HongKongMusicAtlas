import React from 'react';
import { useAudio, useLanguage } from '../contexts';

const SongPopup = ({ song, place, onClose }) => {
  const { playPreview, stopAudio } = useAudio();
  const { t } = useLanguage();


  return (
    <div className="song-popup">
      <div className="popup-header">
        <h4>{song?.title || 'Song Title'}</h4>
        <button onClick={onClose} className="close-btn" aria-label="Close popup">×</button>
      </div>
      <div className="popup-content">
        <div className="song-info">
          <p><strong>{t('song.lyrics', 'Lyric')}:</strong> {song?.lyric || t('song.lyrics', 'Lyric text here')}</p>
          <p><strong>{t('song.artist', 'Artist')}:</strong> {song?.artist || t('song.artist', 'Artist name')}</p>
          <p><strong>{t('song.location', 'Location')}:</strong> {place?.name || t('song.location', 'Location name')}</p>
          <p><strong>Year:</strong> {song?.year || t('song.unknown', 'Unknown')}</p>
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
{t('song.listenYouTube', 'Listen on YouTube')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongPopup;