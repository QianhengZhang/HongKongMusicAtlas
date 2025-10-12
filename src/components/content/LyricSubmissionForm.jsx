import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useLanguage } from '../../contexts';

const LyricSubmissionForm = ({ show, onHide, onSubmit, onMapClick, clickedCoordinates }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    song: '',
    song_en: '',
    Singer: '',
    singer_en: '',
    album: '',
    region: '',
    region_en: '',
    location_name: '',
    location_name_en: '',
    location_y: '',
    location_x: '',
    year: '',
    lyrics: '',
    lyrics_en: '',
    songwriter: '',
    song_writer_en: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapClickMode, setIsMapClickMode] = useState(false);

  // Region mapping
  const regionOptions = [
    { zh: '香港', en: 'Hong Kong' },
    { zh: '日本', en: 'Japan' },
    { zh: '亞洲其他地區', en: 'Asia (Others)' },
    { zh: '歐洲', en: 'Europe' },
    { zh: '北美洲', en: 'North America' },
    { zh: '非洲', en: 'Africa' },
    { zh: '南極', en: 'Antarctica' },
    { zh: '北極', en: 'Arctic' },
    { zh: '澳洲', en: 'Australia' }
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (show) {
      setFormData({
        song: '',
        song_en: '',
        Singer: '',
        singer_en: '',
        album: '',
        region: '',
        region_en: '',
        location_name: '',
        location_name_en: '',
        location_y: '',
        location_x: '',
        year: '',
        lyrics: '',
        lyrics_en: '',
        songwriter: '',
        song_writer_en: ''
      });
      setErrors({});
      setIsSubmitting(false);
      setIsMapClickMode(false);
    }
  }, [show]);

  // Handle coordinates from map click
  useEffect(() => {
    if (clickedCoordinates && isMapClickMode) {
      setFormData(prev => ({
        ...prev,
        location_y: clickedCoordinates.lat.toString(),
        location_x: clickedCoordinates.lng.toString()
      }));
      setIsMapClickMode(false);
      if (onMapClick) {
        onMapClick(false);
      }
    }
  }, [clickedCoordinates, isMapClickMode, onMapClick]);

  // Handle region change and auto-fill region_en
  const handleRegionChange = (selectedRegion) => {
    const regionOption = regionOptions.find(r => r.zh === selectedRegion);
    setFormData(prev => ({
      ...prev,
      region: selectedRegion,
      region_en: regionOption ? regionOption.en : ''
    }));
  };

  // Handle region_en change and auto-fill region
  const handleRegionEnChange = (selectedRegionEn) => {
    const regionOption = regionOptions.find(r => r.en === selectedRegionEn);
    setFormData(prev => ({
      ...prev,
      region_en: selectedRegionEn,
      region: regionOption ? regionOption.zh : ''
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    // Required fields
    if (!formData.song.trim()) newErrors.song = t('form.errors.songRequired', 'Song name is required');
    if (!formData.song_en.trim()) newErrors.song_en = t('form.errors.songEnRequired', 'English song name is required');
    if (!formData.Singer.trim()) newErrors.Singer = t('form.errors.singerRequired', 'Singer is required');
    if (!formData.singer_en.trim()) newErrors.singer_en = t('form.errors.singerEnRequired', 'English singer name is required');
    if (!formData.location_name.trim()) newErrors.location_name = t('form.errors.locationRequired', 'Location name is required');
    if (!formData.location_name_en.trim()) newErrors.location_name_en = t('form.errors.locationEnRequired', 'English location name is required');
    if (!formData.region.trim()) newErrors.region = t('form.errors.regionRequired', 'Region is required');
    if (!formData.region_en.trim()) newErrors.region_en = t('form.errors.regionEnRequired', 'English region is required');
    if (!formData.year.trim()) newErrors.year = t('form.errors.yearRequired', 'Year is required');
    if (!formData.lyrics.trim()) newErrors.lyrics = t('form.errors.lyricsRequired', 'Lyrics are required');

    // Year validation
    if (formData.year) {
      const year = parseInt(formData.year);
      if (isNaN(year) || year < 1900 || year > currentYear) {
        newErrors.year = t('form.errors.yearInvalid', `Year must be between 1900 and ${currentYear}`);
      }
    }

    // Coordinate validation
    if (formData.location_y) {
      const lat = parseFloat(formData.location_y);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.location_y = t('form.errors.latInvalid', 'Latitude must be between -90 and 90');
      }
    }
    if (formData.location_x) {
      const lng = parseFloat(formData.location_x);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.location_x = t('form.errors.lngInvalid', 'Longitude must be between -180 and 180');
      }
    }

    // Lyrics length validation
    if (formData.lyrics && formData.lyrics.split('\n').length > 4) {
      newErrors.lyrics = t('form.errors.lyricsTooLong', 'Lyrics must be 4 lines or less');
    }
    if (formData.lyrics_en && formData.lyrics_en.split('\n').length > 4) {
      newErrors.lyrics_en = t('form.errors.lyricsEnTooLong', 'English lyrics must be 4 lines or less');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate UUID for id
      const id = 'uuid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      const submissionData = {
        id,
        song: formData.song.trim(),
        location_name: formData.location_name.trim(),
        location_name_en: formData.location_name_en.trim(),
        region: formData.region,
        region_en: formData.region_en,
        location_y: formData.location_y,
        location_x: formData.location_x,
        song_en: formData.song_en.trim(),
        album: formData.album.trim() || '',
        Singer: formData.Singer.trim(),
        singer_en: formData.singer_en.trim(),
        songwriter: formData.songwriter.trim() || '',
        song_writer_en: formData.song_writer_en.trim() || '',
        year: formData.year,
        lyrics: formData.lyrics.trim(),
        lyrics_en: formData.lyrics_en.trim() || ''
      };

      await onSubmit(submissionData);
      onHide();
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: t('form.errors.submitFailed', 'Submission failed. Please try again.') });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle map click for coordinates
  const handleMapClickToggle = () => {
    setIsMapClickMode(!isMapClickMode);
    if (onMapClick) {
      onMapClick(!isMapClickMode);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {language === 'zh' ? '添加歌词点' : 'Add a lyric'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Alert variant="info" className="mb-4">
          {t('form.description', language === 'zh' 
            ? '分享一首地圖上還沒出現的粵語歌，一起讓這張粵語流行地圖更完整。添加後地點會立即出現噢！'
            : 'Share your favorite Cantopop lyric that hasn\'t shown on the map yet, help us make the world of Cantonese pop more complete. Your mark will show up on the map right away!'
          )}
        </Alert>

        <Form onSubmit={handleSubmit} className="lyric-form">
          <div className="form-grid">
            {/* Song Information */}
            <div className="form-section">
              <div className="section-label">
                {language === 'zh' ? '歌曲信息' : 'Song Information'}
              </div>
              
              <div className="bilingual-group">
                <div className="bilingual-label">
                  {language === 'zh' ? '歌曲名 / Song name' : 'Song name / 歌曲名'} *
                </div>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={formData.song}
                        onChange={(e) => setFormData(prev => ({ ...prev, song: e.target.value }))}
                        isInvalid={!!errors.song}
                        placeholder={language === 'zh' ? '中文或原文' : 'Chinese or original'}
                      />
                      <Form.Control.Feedback type="invalid">{errors.song}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={formData.song_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, song_en: e.target.value }))}
                        isInvalid={!!errors.song_en}
                        placeholder={language === 'zh' ? '英文' : 'English'}
                      />
                      <Form.Control.Feedback type="invalid">{errors.song_en}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="bilingual-group">
                <div className="bilingual-label">
                  {language === 'zh' ? '歌手 / Singer' : 'Singer / 歌手'} *
                </div>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={formData.Singer}
                        onChange={(e) => setFormData(prev => ({ ...prev, Singer: e.target.value }))}
                        isInvalid={!!errors.Singer}
                        placeholder={language === 'zh' ? '中文' : 'Chinese'}
                      />
                      <Form.Control.Feedback type="invalid">{errors.Singer}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={formData.singer_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, singer_en: e.target.value }))}
                        isInvalid={!!errors.singer_en}
                        placeholder={language === 'zh' ? '英文' : 'English'}
                      />
                      <Form.Control.Feedback type="invalid">{errors.singer_en}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="bilingual-group">
                <div className="bilingual-label">
                  {language === 'zh' ? '专辑 / Album' : 'Album / 专辑'}
                </div>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="text"
                    value={formData.album}
                    onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                    placeholder={language === 'zh' ? '专辑名称' : 'Album name'}
                  />
                </Form.Group>
              </div>
            </div>

            {/* Location and Coordinates */}
            <div className="form-section">
              <div className="section-label">
                {language === 'zh' ? '地點與座標 / Location & Coordinates' : 'Location & Coordinates / 地點與座標'}
              </div>
              
              <div className="bilingual-group">
                <div className="bilingual-label">
                  {language === 'zh' ? '地區 / Region' : 'Region / 地區'} *
                </div>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Select
                        value={formData.region}
                        onChange={(e) => handleRegionChange(e.target.value)}
                        isInvalid={!!errors.region}
                      >
                        <option value="">{language === 'zh' ? '選擇地區' : 'Select region'}</option>
                        {regionOptions.map((region, index) => (
                          <option key={index} value={region.zh}>{region.zh}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.region}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Select
                        value={formData.region_en}
                        onChange={(e) => handleRegionEnChange(e.target.value)}
                        isInvalid={!!errors.region_en}
                      >
                        <option value="">{language === 'zh' ? 'Select region' : 'Select region'}</option>
                        {regionOptions.map((region, index) => (
                          <option key={index} value={region.en}>{region.en}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.region_en}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="bilingual-group">
                <div className="bilingual-label">
                  {language === 'zh' ? '地名 / Location' : 'Location / 地名'} *
                </div>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={formData.location_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                        isInvalid={!!errors.location_name}
                        placeholder={language === 'zh' ? '中文地名' : 'Chinese location'}
                      />
                      <Form.Control.Feedback type="invalid">{errors.location_name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={formData.location_name_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, location_name_en: e.target.value }))}
                        isInvalid={!!errors.location_name_en}
                        placeholder={language === 'zh' ? '英文地名' : 'English location'}
                      />
                      <Form.Control.Feedback type="invalid">{errors.location_name_en}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="coordinate-section">
                <div className="coordinate-header">
                  <div className="bilingual-label">
                    {language === 'zh' ? '座標 / Coordinates' : 'Coordinates / 座標'} *
                  </div>
                  <Button
                    variant={isMapClickMode ? "primary" : "outline-primary"}
                    onClick={handleMapClickToggle}
                    size="sm"
                    className="map-select-btn"
                  >
                    {language === 'zh' 
                      ? (isMapClickMode ? '取消選點' : '地圖選點')
                      : (isMapClickMode ? 'Cancel' : 'Select on Map')
                    }
                  </Button>
                </div>
                {isMapClickMode && (
                  <div className="map-hint">
                    <small className="text-muted">
                      {language === 'zh' ? '點擊地圖上的位置來獲取座標' : 'Click on the map to get coordinates'}
                    </small>
                  </div>
                )}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="number"
                        step="any"
                        value={formData.location_y}
                        onChange={(e) => setFormData(prev => ({ ...prev, location_y: e.target.value }))}
                        isInvalid={!!errors.location_y}
                        placeholder="Latitude (-90 to 90)"
                      />
                      <Form.Control.Feedback type="invalid">{errors.location_y}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="number"
                        step="any"
                        value={formData.location_x}
                        onChange={(e) => setFormData(prev => ({ ...prev, location_x: e.target.value }))}
                        isInvalid={!!errors.location_x}
                        placeholder="Longitude (-180 to 180)"
                      />
                      <Form.Control.Feedback type="invalid">{errors.location_x}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>

            {/* Year and Lyrics - Full Width */}
            <div className="form-section form-section-fullwidth">
              <div className="section-label">
                {language === 'zh' ? '年份與歌詞 / Year & Lyrics' : 'Year & Lyrics / 年份與歌詞'}
              </div>
              
              {/* Row 1: Year + Songwriter (Chinese) + Songwriter (English) */}
              <div className="year-lyrics-row">
                <div className="year-field">
                  <Form.Group className="mb-2">
                    <Form.Label className="field-label">
                      {language === 'zh' ? '年份 / Year' : 'Year / 年份'} *
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                      isInvalid={!!errors.year}
                      placeholder="YYYY"
                    />
                    <Form.Control.Feedback type="invalid">{errors.year}</Form.Control.Feedback>
                  </Form.Group>
                </div>
                
                <div className="songwriter-field">
                  <Form.Group className="mb-2">
                    <Form.Label className="field-label">
                      {language === 'zh' ? '作詞人（中文）' : 'Songwriter (Chinese)'}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.songwriter}
                      onChange={(e) => setFormData(prev => ({ ...prev, songwriter: e.target.value }))}
                      placeholder={language === 'zh' ? '作詞人（中文）' : 'Songwriter (Chinese)'}
                    />
                  </Form.Group>
                </div>
                
                <div className="songwriter-en-field">
                  <Form.Group className="mb-2">
                    <Form.Label className="field-label">
                      {language === 'zh' ? '作詞人（英文）' : 'Songwriter (English)'}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.song_writer_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, song_writer_en: e.target.value }))}
                      placeholder={language === 'zh' ? '作詞人（英文）' : 'Songwriter (English)'}
                    />
                  </Form.Group>
                </div>
              </div>

              {/* Row 2: Lyrics (Chinese) and Lyrics (English) - Side by side on desktop */}
              <div className="lyrics-row">
                <div className="lyrics-chinese-field">
                  <Form.Group className="mb-2">
                    <Form.Label className="field-label">
                      {language === 'zh' ? '歌詞（中文）' : 'Lyrics (Chinese)'} *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={formData.lyrics}
                      onChange={(e) => setFormData(prev => ({ ...prev, lyrics: e.target.value }))}
                      isInvalid={!!errors.lyrics}
                      placeholder={language === 'zh' ? '中文歌詞（1-4行）' : 'Chinese lyrics (1-4 lines)'}
                      style={{ resize: 'vertical', minHeight: '60px' }}
                      aria-describedby="lyrics-help"
                    />
                    <Form.Control.Feedback type="invalid">{errors.lyrics}</Form.Control.Feedback>
                    <Form.Text id="lyrics-help" className="text-muted">
                      {language === 'zh' ? '最多4行' : 'Maximum 4 lines'}
                    </Form.Text>
                  </Form.Group>
                </div>
                
                <div className="lyrics-english-field">
                  <Form.Group className="mb-2">
                    <Form.Label className="field-label">
                      {language === 'zh' ? '歌詞（英文）' : 'Lyrics (English)'}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={formData.lyrics_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, lyrics_en: e.target.value }))}
                      isInvalid={!!errors.lyrics_en}
                      placeholder={language === 'zh' ? '英文歌詞' : 'English lyrics'}
                      style={{ resize: 'vertical', minHeight: '60px' }}
                      aria-describedby="lyrics-en-help"
                    />
                    <Form.Control.Feedback type="invalid">{errors.lyrics_en}</Form.Control.Feedback>
                    <Form.Text id="lyrics-en-help" className="text-muted">
                      {language === 'zh' ? '最多4行' : 'Maximum 4 lines'}
                    </Form.Text>
                  </Form.Group>
                </div>
              </div>
            </div>
          </div>

          {errors.submit && (
            <Alert variant="danger">{errors.submit}</Alert>
          )}
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {language === 'zh' ? '取消' : 'Cancel'}
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              {language === 'zh' ? '提交中...' : 'Submitting...'}
            </>
          ) : (
            language === 'zh' ? '提交' : 'Submit'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LyricSubmissionForm;
