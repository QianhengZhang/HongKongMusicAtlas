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
  MapPage,
  AboutPage,
  SongPopup,
  FilterControls,
  InformationCard,
  ExploreMusics
} from './components'
import LanguageSwitcher from './components/LanguageSwitcher'

function App() {
  const { setCurrentPage } = useApp()
  const { setTranslations, t, language } = useLanguage()

  // Initialize translations
  useEffect(() => {
    setTranslations(translations)
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      // Language will be set by the context
    }
  }, [setTranslations])

  // Apply language-specific body class
  useEffect(() => {
    document.body.className = `language-${language}`
  }, [language])

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
              <a href="#/map" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1>Lyriscape of Cantopop</h1>
              </a>
            </div>
            <ul className="nav-links">
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
            <Route path="/map" element={<MapPage />} />
            <Route path="/explore" element={<ExploreMusics />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
