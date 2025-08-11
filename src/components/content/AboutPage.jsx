import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h1 className="text-center mb-5">About Hong Kong Music Atlas</h1>

          <Row>
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h2 className="h4 mb-0">Project Overview</h2>
                </Card.Header>
                <Card.Body>
                  <p>
                    This interactive web map explores the cultural geography of Hong Kong
                    through the lens of Cantonese pop music. Many Canto-pop songs reference
                    specific neighborhoods, landmarks, and streets—this project visualizes
                    those lyrical references as a dynamic, map-based storytelling experience.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h2 className="h4 mb-0">Cultural Significance</h2>
                </Card.Header>
                <Card.Body>
                  <p>
                    Cantonese pop music has long been a reflection of Hong Kong's urban
                    identity and social changes. Songs often reference specific locations
                    that hold cultural, historical, or personal significance to both
                    artists and listeners.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h2 className="h4 mb-0">Technical Details</h2>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li><strong>Frontend:</strong> React with modern hooks and context</li>
                    <li><strong>Mapping:</strong> Mapbox GL JS for interactive maps</li>
                    <li><strong>Styling:</strong> Bootstrap 5 for responsive design</li>
                    <li><strong>Data:</strong> Curated database of 20+ songs (scalable)</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h2 className="h4 mb-0">Data Sources</h2>
                </Card.Header>
                <Card.Body>
                  <p>
                    Song data includes lyrics in both Chinese and will include English translation in the future.
                    Other information includes artist information,
                    album covers, YouTube links, and historical context for each referenced
                    location. The database is designed to grow over time as more songs
                    are discovered and added.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={12}>
              <Card>
                <Card.Header>
                  <h2 className="h4 mb-0">Contributing</h2>
                </Card.Header>
                <Card.Body>
                  <p>
                    We welcome contributions and suggestions! If you know of a Canto-pop
                    song that references a specific Hong Kong location, or if you'd like
                    to help improve the project, please get in touch. <br />
                    <strong>Email: qzhang533@wisc.edu </strong>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;