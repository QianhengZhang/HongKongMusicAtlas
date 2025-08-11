import React from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';

import SingingLayout from './SingingLayout';
import LandingPage from '../content/LandingPage';
import Map from '../content/Map';
import FilterControls from '../content/FilterControls';
import InformationCard from '../content/InformationCard';
import AboutPage from '../content/AboutPage';

function SingingApp() {
  return (
    <HashRouter basename="">
      <Routes>
        <Route path="/" element={<SingingLayout />}>
          <Route index element={<LandingPage />} />
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
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default SingingApp;