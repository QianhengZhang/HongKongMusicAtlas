import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '../../contexts';

const AboutPage = () => {
  const { t } = useLanguage();
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h1 className="text-center mb-5">{t('about.title', 'About Hong Kong Music Atlas')}</h1>

          <Row>
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h2 className="h4 mb-0">{t('about.overview.title', 'Project Overview')}</h2>
                </Card.Header>
                <Card.Body>
                  <p>
                    {t('about.overview.content', 'This interactive web map explores the cultural geography of Hong Kong through the lens of Cantonese pop music. Many Canto-pop songs reference specific neighborhoods, landmarks, and streets—this project visualizes those lyrical references as a dynamic, map-based storytelling experience.')}
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h2 className="h4 mb-0">{t('about.cultural.title', 'Cultural Significance')}</h2>
                </Card.Header>
                <Card.Body>
                  <p>
                    {t('about.cultural.content', 'Cantonese pop music has long been a reflection of Hong Kong\'s urban identity and social changes. Songs often reference specific locations that hold cultural, historical, or personal significance to both artists and listeners.')}
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h2 className="h4 mb-0">{t('about.technical.title', 'Technical Details')}</h2>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li><strong>{t('about.technical.frontend', 'Frontend:')}</strong> {t('about.technical.frontend.value', 'React with modern hooks and context')}</li>
                    <li><strong>{t('about.technical.mapping', 'Mapping:')}</strong> {t('about.technical.mapping.value', 'Mapbox GL JS for interactive maps')}</li>
                    <li><strong>{t('about.technical.styling', 'Styling:')}</strong> {t('about.technical.styling.value', 'Bootstrap 5 for responsive design')}</li>
                    <li><strong>{t('about.technical.data', 'Data:')}</strong> {t('about.technical.data.value', 'Curated database of 20+ songs (scalable)')}</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h2 className="h4 mb-0">{t('about.sources.title', 'Data Sources')}</h2>
                </Card.Header>
                <Card.Body>
                  <p>
                    {t('about.sources.content', 'Song data includes lyrics in both Chinese and will include English translation in the future. Other information includes artist information, album covers, YouTube links, and historical context for each referenced location. The database is designed to grow over time as more songs are discovered and added.')}
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={12}>
              <Card>
                <Card.Header>
                  <h2 className="h4 mb-0">{t('about.contributing.title', 'Contributing')}</h2>
                </Card.Header>
                <Card.Body>
                  <p>
                    {t('about.contributing.content', 'We welcome contributions and suggestions! If you know of a Canto-pop song that references a specific Hong Kong location, or if you\'d like to help improve the project, please get in touch.')} <br />
                    <strong>{t('about.contributing.email1', 'Email: qzhang533@wisc.edu')} </strong>
                    <br />
                    <strong>{t('about.contributing.email2', 'Email: yanbing.chen@wisc.edu')}</strong>
                    <br />
                    <strong>{t('about.contributing.github', 'Github: https://github.com/QianhengZhang/HongKongMusicAtlas')}</strong>
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