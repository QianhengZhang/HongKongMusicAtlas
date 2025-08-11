import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, Outlet, useLocation } from 'react-router';

function SingingLayout() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="app-layout">
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="app-header"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="nav-brand">
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
              <span role="img" aria-label="Music note">🎵</span> Hong Kong Music Atlas
            </h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto nav-links">
              <Nav.Link
                as={Link}
                to="/"
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                style={{ color: 'white' }}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/map"
                className={`nav-link ${isActive('/map') ? 'active' : ''}`}
                style={{ color: 'white' }}
              >
                Explore
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                style={{ color: 'white' }}
              >
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Hong Kong Music Atlas. Exploring Hong Kong's musical geography.</p>
      </footer>
    </div>
  );
}

export default SingingLayout;