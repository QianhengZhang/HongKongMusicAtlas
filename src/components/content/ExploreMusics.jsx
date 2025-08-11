import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Card, Badge } from 'react-bootstrap';
import { useLocation } from 'react-router';
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
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading music data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="explore-header mb-4">
            <h1 className="display-4">🎵 Explore Hong Kong Music</h1>
            <p className="lead">Discover the complete information about songs and their connections to Hong Kong locations</p>
          </div>

          {/* Search Section */}
          <div className="search-section mb-4">
            <Form onSubmit={handleSearch} >
              <InputGroup size="lg">
                <Form.Control
                  type="text"
                  aria-label="Search songs"
                  placeholder="Search by song title, artist, location, lyrics, album, or songwriter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  🔍 Search
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
                  {groupBySong ? "📋 List View" : "📋 Group View"}
                </Button>
                {filteredSongs.some(song => song.totalVersions > 1) && (
                  <small className="text-muted">
                    💡 Tip: Use Group View to better view multi-version songs
                  </small>
                )}
              </div>
            </div>
            <div className="mt-2">
              <small className="text-muted">
                Found {filteredSongs.length} song{filteredSongs.length !== 1 ? 's' : ''}
                {searchTerm && ` matching "${searchTerm}"`}
                {filteredSongs.some(song => song.totalVersions > 1) && (
                  <span className="ms-2">
                    • {filteredSongs.filter(song => song.totalVersions > 1).length} song{filteredSongs.filter(song => song.totalVersions > 1).length !== 1 ? 's' : ''} with multiple locations
                  </span>
                )}
              </small>
            </div>
          </div>

          {/* Results Section */}
          <div className="results-section">
            {filteredSongs.length === 0 && !loading && (
              <div className="text-center py-5">
                <h3>No songs found</h3>
                <p className="text-muted">Try adjusting your search terms or filters</p>
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
                              <span role="img" aria-label="Map pin">📍</span> Multi-location Version
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
                                          📍 Multi-location Version
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </Card.Header>

                                <Card.Body className="song-card-body">
                                  <div className="song-info-grid">
                                    <div className="info-item">
                                      <strong>
                                        <span role="img" aria-label="Microphone">🎤</span> 歌手/Artist:
                                      </strong>
                                      <div className="artist-names">
                                        {formatNames(song.Singer)}
                                        {song.singer_en && (
                                          <small className="text-muted d-block">
                                            {formatNames(song.singer_en, true)}
                                          </small>
                                        )}
                                      </div>
                                    </div>

                                    <div className="info-item">
                                      <strong>
                                        <span role="img" aria-label="Map pin">📍</span> 地点/Location:
                                      </strong>
                                      <div className="location-names">
                                        <span>{song.location_name || 'Unknown'}</span>
                                        {song.location_name_en && (
                                          <small className="text-muted d-block">
                                            {song.location_name_en}
                                          </small>
                                        )}
                                      </div>
                                    </div>

                                    <div className="info-item">
                                      <strong>
                                        <span role="img" aria-label="World map">🗺️</span> 坐标/Coordinates:
                                      </strong>
                                      <span>{song.location_x}, {song.location_y}</span>
                                    </div>

                                    <div className="info-item">
                                      <strong>
                                        <span role="img" aria-label="Compact disc">💿</span> 专辑/Album:
                                      </strong>
                                      <span>{song.album || 'Unknown'}</span>
                                    </div>

                                    <div className="info-item">
                                      <strong>✍️ 作词人/Songwriter:</strong>
                                      <div className="songwriter-names">
                                        {formatNames(song.songwriter) || <span>Unknown</span>}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Lyrics Section - Moved to prominent position */}
                                  {song.lyrics && (
                                    <div className="lyrics-section mt-3">
                                      <div className="lyrics-header">
                                        <strong>💭 歌词/Lyrics</strong>
                                      </div>
                                      <div className="lyrics-content">
                                        {song.lyrics.length > 200
                                          ? `${song.lyrics.substring(0, 200)}...`
                                          : song.lyrics}
                                      </div>
                                      {song.lyrics.length > 200 && (
                                        <div className="lyrics-expand">
                                          <small className="text-primary">点击展开完整歌词</small>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Card.Body>

                                <Card.Footer className="song-card-footer">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => {
                                        const searchQuery = encodeURIComponent(`${song.song} ${song.Singer}`);
                                        window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
                                      }}
                                    >
                                      🎵 Listen on YouTube
                                    </Button>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() => {
                                        // Navigate to map with this song's coordinates
                                        window.location.hash = `/map?lat=${song.location_y}&lng=${song.location_x}`;
                                      }}
                                    >
                                      🗺️ View on Map
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
                            <h2 className="mb-1">{song.song || 'Unknown Song'}</h2>
                            <p className="mb-0 text-muted">{song.Singer || 'Unknown Artist'}</p>
                            {song.totalVersions && song.totalVersions > 1 && (
                              <div className="version-indicator">
                                <Badge bg="info" className="version-badge">
                                  Lyrics Version {song.versionNumber} / {song.totalVersions}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="d-flex flex-column align-items-end gap-1">
                            <Badge bg="primary">{song.year || 'Unknown Year'}</Badge>
                            {song.totalVersions && song.totalVersions > 1 && (
                              <Badge bg="warning" text="dark" className="multi-version-badge">
                                📍 Multi-location Version
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card.Header>

                      <Card.Body className="song-card-body">
                        <div className="song-info-grid">
                          <div className="info-item">
                            <strong>
                              <span role="img" aria-label="Microphone">🎤</span> 歌手/Artist:
                            </strong>
                            <div className="artist-names">
                              {formatNames(song.Singer)}
                              {song.singer_en && (
                                <small className="text-muted d-block">
                                  {formatNames(song.singer_en, true)}
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="info-item">
                            <strong>
                              <span role="img" aria-label="Map pin">📍</span> 地点/Location:
                            </strong>
                            <div className="location-names">
                              <span>{song.location_name || 'Unknown'}</span>
                              {song.location_name_en && (
                                <small className="text-muted d-block">
                                  {song.location_name_en}
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="info-item">
                            <strong>
                              <span role="img" aria-label="World map">🗺️</span> 坐标/Coordinates:
                            </strong>
                            <span>{song.location_x}, {song.location_y}</span>
                          </div>

                          <div className="info-item">
                            <strong>
                              <span role="img" aria-label="Compact disc">💿</span> 专辑/Album:
                            </strong>
                            <span>{song.album || 'Unknown'}</span>
                          </div>

                          <div className="info-item">
                            <strong>✍️ 作词人/Songwriter:</strong>
                            <div className="songwriter-names">
                              {formatNames(song.songwriter) || <span>Unknown</span>}
                            </div>
                          </div>
                        </div>

                        {/* Lyrics Section - Moved to prominent position */}
                        {song.lyrics && (
                          <div className="lyrics-section mt-3">
                            <div className="lyrics-header">
                              <strong>💭 歌词/Lyrics</strong>
                            </div>
                            <div className="lyrics-content">
                              {song.lyrics.length > 200
                                ? `${song.lyrics.substring(0, 200)}...`
                                : song.lyrics}
                            </div>
                            {song.lyrics.length > 200 && (
                              <div className="lyrics-expand">
                                <small className="text-primary">Click to expand full lyrics</small>
                              </div>
                            )}
                          </div>
                        )}
                      </Card.Body>

                      <Card.Footer className="song-card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              const searchQuery = encodeURIComponent(`${song.song} ${song.Singer}`);
                              window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
                            }}
                          >
                            🎵 Listen on YouTube
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                              // Navigate to map with this song's coordinates
                              window.location.hash = `/map?lat=${song.location_y}&lng=${song.location_x}`;
                            }}
                          >
                            🗺️ View on Map
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