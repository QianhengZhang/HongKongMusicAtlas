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
          <h1>{t('landing.title', 'Lyriscape of Cantopop')}</h1>
          <p className="subtitle">
            {t('landing.subtitle', 'Explore cultural geography through Cantonese pop music')}
          </p>
          <p className="description">
            {t('landing.description', 'Discover how Cantopop songs reference specific neighborhoods, landmarks, and streets across Hong Kong and far beyond. Each pin on the map represents a lyrical reference, creating a dynamic storytelling experience of the city\'s musical landscape.')}
          </p>
          <Button
            onClick={handleGetStarted}
            className="cta-button"
          >
            {t('landing.getStarted', 'Start Exploring')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;