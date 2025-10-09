import React, { useEffect } from 'react'
import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { useApp, useLanguage } from './contexts'
import { translations } from './translations'
import {
  Layout,
  LandingPage,
  Map,
  AboutPage,
  SongPopup,
  FilterControls,
  InformationCard,
  ExploreMusics
} from './components'
import LanguageSwitcher from './components/LanguageSwitcher'

function App() {
  const { setCurrentPage } = useApp()
  const { setTranslations, t } = useLanguage()

  // Initialize translations
  useEffect(() => {
    setTranslations(translations)
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      // Language will be set by the context
    }
  }, [setTranslations])

  const handleGetStarted = () => {
    setCurrentPage('map')
  }

  return (
    <HashRouter>
      <div className="app-layout">
        {/* Header */}
        <nav className="app-header">
          <div className="main-navigation">
            <div className="nav-brand">
                      <h1>{t('landing.title', 'Hong Kong Music Atlas')}</h1>
            </div>
            <ul className="nav-links">
              <li><a href="#/" className="nav-link">{t('nav.home', 'Home')}</a></li>
              <li><a href="#/map" className="nav-link">{t('nav.map', 'Map')}</a></li>
              <li><a href="#/explore" className="nav-link">{t('nav.explore', 'Explore Music')}</a></li>
              <li><a href="#/about" className="nav-link">{t('nav.about', 'About')}</a></li>
            </ul>
            <div className="nav-actions">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
            <Route path="/map" element={
              <Container fluid className="p-0">
                <Row className="g-0" style={{ height: 'calc(100vh - 120px)' }}>
                  <Col md={8} className="map-container p-0">
                    <Map />
                  </Col>
                  <Col md={4} className="sidebar-container p-3">
                    <div className="sidebar">
                      <FilterControls />
                      <InformationCard />
                    </div>
                  </Col>
                </Row>
              </Container>
            } />
            <Route path="/explore" element={<ExploreMusics />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>{t('footer.copyright', '© 2025 Hong Kong Music Atlas. Exploring Hong Kong\'s musical geography.')}</p>
        </footer>
      </div>
    </HashRouter>
  )
}

export default App
