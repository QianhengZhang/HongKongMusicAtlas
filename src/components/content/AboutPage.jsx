import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '../../contexts';

const AboutPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="about-page-container">
      <div className="about-background-overlay"></div>
      <Container className="py-5 about-content">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h1 className="text-center mb-5">Walk the City, Follow the Lyrics</h1>

          <Row>
            <Col md={6} className="mb-4">
              <div className="flip-card large-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <h2 className="h4 mb-0">Overview</h2>
                  </div>
                  <div className="flip-card-back">
                    <p>
                    This interactive web map explores the cultural geographies connected through Cantonese pop music. Many Canto-pop songs reference neighborhoods, landmarks, and cities not only across Hong Kong but around the world. This project visualizes those lyrical references as a dynamic, map-based storytelling experience of how place, memory, and music intertwine.
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} className="mb-4">
              <div className="flip-card large-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <h2 className="h4 mb-0">Background</h2>
                  </div>
                  <div className="flip-card-back">
                    <p>
                    Emerging in the 1970s, Cantopop blended melodies from the East and rhythms from the West. During its golden age in the 1980s and 1990s, Cantopop not only shaped Hong Kong's popular imagination but also mirrored its social transformations. Lyriscape of Cantopop draws on this intertwined geography of music and memory, mapping how Cantonese pop songs transform locations into lyrical spaces that continue to echo across generations and borders.
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} className="mb-4">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <h2 className="h4 mb-0">Tech</h2>
                  </div>
                  <div className="flip-card-back">
                    <ul className="list-unstyled">
                      <li><strong>Frontend:</strong> React with modern hooks and context</li>
                      <li><strong>Mapping:</strong> Mapbox GL JS for interactive maps</li>
                      <li><strong>Styling:</strong> Bootstrap 5 for responsive design</li>
                      <li><strong>Data:</strong> Curated database of 50+ songs (scalable)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} className="mb-4">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <h2 className="h4 mb-0">Data</h2>
                  </div>
                  <div className="flip-card-back">
                    <ul className="list-unstyled">
                      <li><strong>Lyrics:</strong> Original Chinese and English translation (by ChatGPT)</li>
                      <li><strong>Song Details:</strong> Album, Artists, Year, YouTube links</li>
                      <li><strong>Referenced Location:</strong> Google Maps</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={12}>
              <Card>
                <Card.Header>
                <h2 className="h4 mb-0">Contribution</h2>
                </Card.Header>
                <Card.Body>
                  <p>
                    {t('about.contributing.content', 'We welcome contributions and suggestions! If you know of a Canto-pop song that references a specific location, or if you\'d like to help improve the project, please get in touch.')} <br />
                    <strong>{t('about.contributing.email1', 'Email: qzhang533@wisc.edu')} </strong>
                    <br />
                    <strong>{t('about.contributing.email2', 'Email: yanbing.chen@wisc.edu')}</strong>
                    <br />
                    <strong>{t('about.contributing.github', 'Github: https://github.com/QianhengZhang/HongKongMusicAtlas')}</strong>
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={12} className="text-center mt-5">
              <p style={{ color: 'white', margin: 0 }}>
                © 2025 Lyriscape of Cantopop.
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default AboutPage;