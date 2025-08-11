import React from 'react'
import './App.css'
import { HashRouter, Routes, Route } from 'react-router'
import { Container, Row, Col } from 'react-bootstrap'
import { useApp } from './contexts'
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

function App() {
  const { setCurrentPage } = useApp()

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
              <h1><span role="img" aria-label="Music note">🎵</span> Hong Kong Music Atlas</h1>
            </div>
            <ul className="nav-links">
              <li><a href="#/" className="nav-link">Home</a></li>
              <li><a href="#/map" className="nav-link">Map</a></li>
              <li><a href="#/explore" className="nav-link">Explore Music</a></li>
              <li><a href="#/about" className="nav-link">About</a></li>
            </ul>
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
          <p>&copy; 2025 Hong Kong Music Atlas. Exploring Hong Kong's musical geography.</p>
        </footer>
      </div>
    </HashRouter>
  )
}

export default App
