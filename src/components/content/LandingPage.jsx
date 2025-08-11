import React from 'react';
import { Container, Row, Col, Button, Card, Image} from 'react-bootstrap';
import { useNavigate } from 'react-router';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/map');
  };

  return (
    <Container className="py-5" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="text-center mb-5">
            <h1 className="display-4 mb-3" style={{ color: '#333' }}>Hong Kong Music Atlas</h1>
            <p className="lead mb-4" style={{ color: '#666' }}>
              Explore Hong Kong's cultural geography through Cantonese pop music
            </p>
            <p className="mb-4" style={{ color: '#555' }}>
              Discover how Canto-pop songs reference specific neighborhoods, landmarks,
              and streets across Hong Kong. Each pin on the map represents a lyrical
              reference, creating a dynamic storytelling experience of the city's
              musical landscape.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetStarted}
              className="px-4 py-2"
            >
              Start Exploring
            </Button>
          </div>
          <Image src="/p7/images/hongkongNight.jpg" style={{borderRadius: '10px'}} alt="HongKong View" className="img-fluid" />
          <div className="mt-5">
            <h2 className="text-center mb-4" style={{ color: '#333' }}>What You'll Discover</h2>
            <Row>
              <Col md={4} className="mb-3">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <h3 className="h3">
                      <span role="img" aria-label="Music note">🎵</span> Song Stories
                    </h3>
                    <p className="text-muted">Lyrics in Chinese with song details</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <h3 className="h3">
                      <span role="img" aria-label="World map">🗺️</span> Interactive Map
                    </h3>
                    <p className="text-muted">Click pins to explore Hong Kong's musical geography</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <h3 className="h3">
                      <span role="img" aria-label="Book">📖</span> Cultural Context
                    </h3>
                    <p className="text-muted">Historical notes about each location's significance</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;