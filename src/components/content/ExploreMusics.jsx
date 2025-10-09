import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Card, Badge } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts';
import { fetchMusicData } from '../../services/dataService';

// Helper function to format artist/songwriter names with proper line breaks
const formatNames = (names, isEnglish = false) => {
  if (!names) return null;

  // Remove quotes and clean up
  let cleanNames = names.replace(/^["']|["']$/g, ''); // Remove surrounding quotes

    // Split by comma and clean up
  const nameList = cleanNames.split(',').map(name => name.trim()).filter(name => name);

  if (nameList.length === 0) return null;

  return (
    <div className="names-list">
      {nameList.map((name, index) => (
        <div key={index} className="name-item">
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
};



const ExploreMusics = () => {
  const location = useLocation();
  const { t, language } = useLanguage();
  const [allSongs, setAllSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [groupBySong, setGroupBySong] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMusicData();

        // Group songs by title and artist, and add version indicators
        const groupedData = data.map((song, index) => {
          const songKey = `${song.song}-${song.Singer}`;
          const sameSongCount = data.filter(s =>
            s.song === song.song && s.Singer === song.Singer
          ).length;

          return {
            ...song,
            songKey,
            versionNumber: sameSongCount > 1 ?
              data.filter(s =>
                s.song === song.song &&
                s.Singer === song.Singer &&
                data.indexOf(s) <= index
              ).length : null,
            totalVersions: sameSongCount > 1 ? sameSongCount : null
          };
        });

        setAllSongs(groupedData);
        setFilteredSongs(groupedData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading music data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle URL search parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(decodeURIComponent(urlSearch));
    }
  }, [location.search]);

    useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSongs(allSongs);
    } else {
      const filtered = allSongs.filter(song => {
        const searchLower = searchTerm.toLowerCase();

        // Check if any part of the search term matches any field
        const matchesSong = song.song?.toLowerCase().includes(searchLower);
        const matchesLyrics = song.lyrics?.toLowerCase().includes(searchLower);
        const matchesAlbum = song.album?.toLowerCase().includes(searchLower);

        // Check artist names (handle comma-separated values)
        const matchesArtist = song.Singer?.toLowerCase().includes(searchLower) ||
                             song.singer_en?.toLowerCase().includes(searchLower);

        // Check songwriter names (handle comma-separated values)
        const matchesSongwriter = song.songwriter?.toLowerCase().includes(searchLower);

        // Check location names (both Chinese and English)
        const matchesLocation = song.location_name?.toLowerCase().includes(searchLower) ||
                               song.location_name_en?.toLowerCase().includes(searchLower);

        return matchesSong || matchesArtist || matchesLocation ||
               matchesLyrics || matchesAlbum || matchesSongwriter;
      });
      setFilteredSongs(filtered);
    }
  }, [searchTerm, allSongs]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">{t('explore.loading', 'Loading...')}</span>
          </div>
          <p className="mt-2">{t('explore.loading', 'Loading music data...')}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="explore-header mb-4">
            <h1 className="display-4">{t('explore.title', 'Explore Hong Kong Music')}</h1>
            <p className="lead">{t('explore.subtitle', 'Discover the complete information about songs and their connections to Hong Kong locations')}</p>
          </div>

          {/* Search Section */}
          <div className="search-section mb-4">
            <Form onSubmit={handleSearch} >
              <InputGroup size="lg">
                <Form.Control
                  type="text"
                  aria-label={t('explore.search', 'Search songs')}
                  placeholder={t('explore.searchPlaceholder', 'Search by song title, artist, location, lyrics, album, or songwriter...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  🔍 {t('explore.search', 'Search')}
                </Button>
              </InputGroup>
            </Form>

            {/* View Options */}
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <div className="view-options">
                <Button
                  variant={groupBySong ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => setGroupBySong(!groupBySong)}
                  className="me-2"
                >
                  {groupBySong ? t('explore.listView', 'List View') : t('explore.groupView', 'Group View')}
                </Button>
                {filteredSongs.some(song => song.totalVersions > 1) && (
                  <small className="text-muted">
                    {t('explore.tip', 'Tip: Use Group View to better view multi-version songs')}
                  </small>
                )}
              </div>
            </div>
            <div className="mt-2">
              <small className="text-muted">
                {t('explore.found', 'Found {count} song{s}', { count: filteredSongs.length, s: filteredSongs.length !== 1 ? 's' : '' })}
                {searchTerm && ` ${t('explore.matching', 'matching "{term}"', { term: searchTerm })}`}
                {filteredSongs.some(song => song.totalVersions > 1) && (
                  <span className="ms-2">
                    • {filteredSongs.filter(song => song.totalVersions > 1).length} {t('explore.multiLocation', 'song{s} with multiple locations', { s: filteredSongs.filter(song => song.totalVersions > 1).length !== 1 ? 's' : '' })}
                  </span>
                )}
              </small>
            </div>
          </div>

          {/* Results Section */}
          <div className="results-section">
            {filteredSongs.length === 0 && !loading && (
              <div className="text-center py-5">
                <h3>{t('explore.noSongs', 'No songs found')}</h3>
                <p className="text-muted">{t('explore.noSongsDesc', 'Try adjusting your search terms or filters')}</p>
              </div>
            )}
            {groupBySong ? (
              // Grouped View
              <div className="grouped-results">
                {(() => {
                  const groupedSongs = {};
                  filteredSongs.forEach(song => {
                    const key = song.songKey;
                    if (!groupedSongs[key]) {
                      groupedSongs[key] = [];
                    }
                    groupedSongs[key].push(song);
                  });

                  return Object.entries(groupedSongs).map(([songKey, songs]) => {
                    const firstSong = songs[0];
                    const hasMultipleVersions = songs.length > 1;

                    return (
                      <div key={songKey} className="song-group mb-4">
                        {hasMultipleVersions && (
                          <div className="group-header mb-3">
                            <h4 className="group-title">
Multi-location Version
                              <Badge bg="info" className="ms-2">{songs.length} versions</Badge>
                            </h4>
                          </div>
                        )}
                        <Row>
                          {songs.map((song, index) => (
                            <Col key={`${song.id || index}-${song.location_name}`} lg={6} xl={4} className="mb-4">
                              <Card className="h-100 song-card">
                                <Card.Header className="song-card-header">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                      <h2 className="mb-1">{song.song || 'Unknown Song'}</h2>
                                      <p className="mb-0 text-muted">{song.Singer || 'Unknown Artist'}</p>
                                                                  {hasMultipleVersions && (
                              <div className="version-indicator">
                                <Badge bg="info" className="version-badge">
                                  Version {song.versionNumber} / {song.totalVersions}
                                </Badge>
                              </div>
                            )}
                                    </div>
                                    <div className="d-flex flex-column align-items-end gap-1">
                                      <Badge bg="primary">{song.year || 'Unknown Year'}</Badge>
                                      {hasMultipleVersions && (
                                        <Badge bg="warning" text="dark" className="multi-version-badge">
Multi-location Version
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </Card.Header>

                                <Card.Body className="song-card-body">
                                  <div className="song-info-simplified">
                                    <div className="main-info">
                                      <div className="info-row">
                                        <strong>{t('song.artist', 'Artist')}:</strong>
                                        <span>{language === 'zh' ? (song.Singer || t('song.unknown', 'Unknown')) : (song.singer_en || song.Singer || t('song.unknown', 'Unknown'))}</span>
                                      </div>
                                      <div className="info-row">
                                        <strong>{t('song.year', 'Year')}:</strong>
                                        <span>{song.year || t('song.unknown', 'Unknown')}</span>
                                      </div>
                                      <div className="info-row">
                                        <strong>{t('song.location', 'Location')}:</strong>
                                        <span>{language === 'zh' ? (song.location_name || t('song.unknown', 'Unknown')) : (song.location_name_en || song.location_name || t('song.unknown', 'Unknown'))}</span>
                                      </div>
                                    </div>
                                    
                                    <details className="more-details">
                                      <summary className="details-toggle">
                                        {t('song.moreDetails', 'More Details')}
                                      </summary>
                                      <div className="details-content">
                                        <div className="info-row">
                                          <strong>{t('song.album', 'Album')}:</strong>
                                          <span>{song.album || t('song.unknown', 'Unknown')}</span>
                                        </div>
                                        <div className="info-row">
                                          <strong>{t('song.songwriter', 'Songwriter')}:</strong>
                                          <span>{language === 'zh' ? (song.songwriter || t('song.unknown', 'Unknown')) : (song.song_writer_en || song.songwriter || t('song.unknown', 'Unknown'))}</span>
                                        </div>
                                        <div className="info-row">
                                          <strong>{t('song.coordinates', 'Coordinates')}:</strong>
                                          <span>{song.location_x}, {song.location_y}</span>
                                        </div>
                                      </div>
                                    </details>
                                  </div>

                                  {/* Lyrics Section - Moved to prominent position */}
                                  {(song.lyrics || song.lyrics_en) && (
                                    <div className="lyrics-section mt-3">
                                      <div className="lyrics-header">
                                        <strong>{t('song.lyrics', 'Lyrics')}</strong>
                                      </div>
                                      <div className="lyrics-content">
                                        {(() => {
                                          const lyricsText = language === 'zh' ? (song.lyrics || song.lyrics_en) : (song.lyrics_en || song.lyrics);
                                          return lyricsText && lyricsText.length > 200
                                            ? `${lyricsText.substring(0, 200)}...`
                                            : lyricsText;
                                        })()}
                                      </div>
                                      {(() => {
                                        const lyricsText = language === 'zh' ? (song.lyrics || song.lyrics_en) : (song.lyrics_en || song.lyrics);
                                        return lyricsText && lyricsText.length > 200 && (
                                          <div className="lyrics-expand">
                                            <small className="text-primary">{t('song.expandLyrics', 'Click to expand full lyrics')}</small>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  )}
                                </Card.Body>

                                <Card.Footer className="song-card-footer">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => {
                                        const searchQuery = encodeURIComponent(`${language === 'zh' ? song.song : (song.song_en || song.song)} ${language === 'zh' ? song.Singer : (song.singer_en || song.Singer)}`);
                                        window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
                                      }}
                                    >
{t('song.listenYouTube', 'Listen on YouTube')}
                                    </Button>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() => {
                                        // Navigate to map with this song's coordinates
                                        window.location.hash = `/map?lat=${song.location_y}&lng=${song.location_x}`;
                                      }}
                                    >
{t('song.viewMap', 'View on Map')}
                                    </Button>
                                  </div>
                                </Card.Footer>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              // Regular List View
              <Row>
                {filteredSongs.map((song, index) => (
                  <Col key={song.id || index} lg={6} xl={4} className="mb-4">
                    <Card className="h-100 song-card">
                      <Card.Header className="song-card-header">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h2 className="mb-1">{language === 'zh' ? (song.song || t('song.unknown', 'Unknown Song')) : (song.song_en || song.song || t('song.unknown', 'Unknown Song'))}</h2>
                            <p className="mb-0 text-muted">{language === 'zh' ? (song.Singer || t('song.unknown', 'Unknown Artist')) : (song.singer_en || song.Singer || t('song.unknown', 'Unknown Artist'))}</p>
                            {song.totalVersions && song.totalVersions > 1 && (
                              <div className="version-indicator">
                                <Badge bg="info" className="version-badge">
                                  Lyrics Version {song.versionNumber} / {song.totalVersions}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="d-flex flex-column align-items-end gap-1">
                            <Badge bg="primary">{song.year || t('song.unknown', 'Unknown')}</Badge>
                            {song.totalVersions && song.totalVersions > 1 && (
                              <Badge bg="warning" text="dark" className="multi-version-badge">
{t('song.multiLocation', 'Multi-location Version')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card.Header>

                      <Card.Body className="song-card-body">
                        <div className="song-info-simplified">
                          <div className="main-info">
                            <div className="info-row">
                              <strong>{t('song.artist', 'Artist')}:</strong>
                              <span>{language === 'zh' ? (song.Singer || t('song.unknown', 'Unknown')) : (song.singer_en || song.Singer || t('song.unknown', 'Unknown'))}</span>
                            </div>
                            <div className="info-row">
                              <strong>{t('song.year', 'Year')}:</strong>
                              <span>{song.year || t('song.unknown', 'Unknown')}</span>
                            </div>
                            <div className="info-row">
                              <strong>{t('song.location', 'Location')}:</strong>
                              <span>{language === 'zh' ? (song.location_name || t('song.unknown', 'Unknown')) : (song.location_name_en || song.location_name || t('song.unknown', 'Unknown'))}</span>
                            </div>
                          </div>
                          
                          <details className="more-details">
                            <summary className="details-toggle">
                              {t('song.moreDetails', 'More Details')}
                            </summary>
                            <div className="details-content">
                              <div className="info-row">
                                <strong>{t('song.album', 'Album')}:</strong>
                                <span>{song.album || t('song.unknown', 'Unknown')}</span>
                              </div>
                              <div className="info-row">
                                <strong>{t('song.songwriter', 'Songwriter')}:</strong>
                                <span>{language === 'zh' ? (song.songwriter || t('song.unknown', 'Unknown')) : (song.song_writer_en || song.songwriter || t('song.unknown', 'Unknown'))}</span>
                              </div>
                              <div className="info-row">
                                <strong>{t('song.coordinates', 'Coordinates')}:</strong>
                                <span>{song.location_x}, {song.location_y}</span>
                              </div>
                            </div>
                          </details>
                        </div>

                        {/* Lyrics Section - Moved to prominent position */}
                        {(song.lyrics || song.lyrics_en) && (
                          <div className="lyrics-section mt-3">
                            <div className="lyrics-header">
                              <strong>{t('song.lyrics', 'Lyrics')}</strong>
                            </div>
                            <div className="lyrics-content">
                              {(() => {
                                const lyricsText = language === 'zh' ? (song.lyrics || song.lyrics_en) : (song.lyrics_en || song.lyrics);
                                return lyricsText && lyricsText.length > 200
                                  ? `${lyricsText.substring(0, 200)}...`
                                  : lyricsText;
                              })()}
                            </div>
                            {(() => {
                              const lyricsText = language === 'zh' ? (song.lyrics || song.lyrics_en) : (song.lyrics_en || song.lyrics);
                              return lyricsText && lyricsText.length > 200 && (
                                <div className="lyrics-expand">
                                  <small className="text-primary">{t('song.expandLyrics', 'Click to expand full lyrics')}</small>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </Card.Body>

                      <Card.Footer className="song-card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              const searchQuery = encodeURIComponent(`${language === 'zh' ? song.song : (song.song_en || song.song)} ${language === 'zh' ? song.Singer : (song.singer_en || song.Singer)}`);
                              window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
                            }}
                          >
{t('song.listenYouTube', 'Listen on YouTube')}
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                              // Navigate to map with this song's coordinates
                              window.location.hash = `/map?lat=${song.location_y}&lng=${song.location_x}`;
                            }}
                          >
{t('song.viewMap', 'View on Map')}
                          </Button>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ExploreMusics;