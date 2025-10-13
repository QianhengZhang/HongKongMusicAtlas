import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts';
import Map from './Map';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    // Navigate directly to map page
    navigate('/map');
  };

  return (
    <div className="landing-page">
      <div className="landing-hero">
        {/* Map as background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <Map />
        </div>
        
        {/* Overlay content */}
        <div className="landing-overlay">
          <h1 className="title">
            {t('landing.title', 'From the harbor of Hong Kong to the skyline of New York, discover how Cantonese pop songs map emotions onto real places — from Hong Kong to beyond.')}
          </h1>
          <p className="subtitle">
            {t('landing.subtitle', 'Discover how Cantopop captures changing cityscape, where every lyric is a trace of place, memory, and emotion. Each pin on the map represents a song that turns geography into melody.')}
          </p>
          <Button
            onClick={handleGetStarted}
            className="cta-button"
          >
            {t('landing.getStarted', 'Start the lyrical journey')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;