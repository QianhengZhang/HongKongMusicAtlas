import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { useMap, useLanguage } from '../../contexts';
import { fetchMusicData } from '../../services/dataService';

// i18n helper for bilingual field selection
const getBilingualField = (item, field, language) => {
  if (language === 'zh') {
    return item[field] || item[`${field}_en`] || '';
  } else {
    // Handle special cases for field names
    let enField = `${field}_en`;
    if (field === 'Singer') {
      enField = 'singer_en';
    } else if (field === 'location_name') {
      enField = 'location_name_en';
    }
    return item[enField] || item[field] || '';
  }
};

// Translation keys
const translations = {
  en: {
    title: 'Discover Lyrics Around the World',
    step1: 'Choose Region',
    step1Subtitle: 'Start by selecting where you want to listen from.',
    step2: 'Explore by place, artist, or time',
    step3: 'Songs Found',
    location: 'Choose a Location',
    artist: 'Choose an Artist',
    decade: 'Choose a Decade',
    reset: 'Clear',
    random: 'Surprise Me!',
    showMore: 'Show More',
    showLess: 'Show Less',
    noResults: 'No songs found. Try exploring a different place or time.',
    songsIn: 'songs found in',
    for: 'for',
    resultsSummary: (count, region, decade) => 
      `${count} songs found in ${region}${decade ? ` for ${decade}` : ''}`
  },
  zh: {
    title: '按地区探索歌词',
    step1: '选择地区',
    step1Subtitle: '从你想聆听的地区开始探索。',
    step2: '按地点、歌手或年代探索',
    step3: '找到的歌曲',
    location: '选择地点',
    artist: '选择歌手',
    decade: '选择年代',
    reset: '重置',
    random: '随机探索',
    showMore: '显示更多',
    showLess: '显示更少',
    noResults: '没有找到歌曲，试试探索其他地方或年代。',
    songsIn: '共找到',
    for: '的',
    resultsSummary: (count, region, decade) => 
      `在 ${region} 共找到 ${count} 首歌${decade ? `（${decade}）` : ''}`
  }
};

const DiscoverLyrics = () => {
  const { filters, setFilters } = useMap();
  const { language } = useLanguage();
  const t = translations[language];
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMoreLocations, setShowMoreLocations] = useState(false);
  const [showMoreArtists, setShowMoreArtists] = useState(false);
  
  const [data, setData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Load data and extract regions
  useEffect(() => {
    const loadData = async () => {
      try {
        const musicData = await fetchMusicData();
        setData(musicData);
        
        // Extract unique regions
        const regionMap = new Map();
        musicData.forEach(item => {
          const regionZh = item.region;
          const regionEn = item.region_en;
          if (regionZh && regionEn) {
            const key = `${regionZh}|${regionEn}`;
            if (!regionMap.has(key)) {
              regionMap.set(key, {
                zh: regionZh,
                en: regionEn,
                count: 0
              });
            }
            regionMap.get(key).count++;
          }
        });
        
        const regionsList = Array.from(regionMap.values());
        
        // Custom sort order for regions
        const sortOrder = [
          '香港', 'Hong Kong',
          '日本', 'Japan', 
          '亚洲其他', 'Asia (Others)',
          '欧洲', 'Europe',
          '北美洲', 'North America',
          '大洋洲', 'Oceania',
          '非洲', 'Africa',
          '北极', 'Arctic',
          '南极洲', 'Antarctica'
        ];
        
        const sortedRegions = regionsList.sort((a, b) => {
          const aIndex = sortOrder.findIndex(item => item === a.zh || item === a.en);
          const bIndex = sortOrder.findIndex(item => item === b.zh || item === b.en);
          
          // If both found, sort by index
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          // If only one found, prioritize it
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          // If neither found, sort alphabetically
          return a.zh.localeCompare(b.zh);
        });
        
        setRegions(sortedRegions);
        
        // Set Hong Kong as default selected region
        const hongKongRegion = regionsList.find(region => 
          region.zh === '香港' || region.en === 'Hong Kong'
        );
        if (hongKongRegion) {
          setSelectedRegion(hongKongRegion);
          setCurrentStep(2);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  // Filter data based on selected region
  const regionFilteredData = useMemo(() => {
    if (!selectedRegion) return data;
    return data.filter(item => 
      item.region === selectedRegion.zh || item.region_en === selectedRegion.en
    );
  }, [data, selectedRegion]);

  // Get available options for step 2
  const availableOptions = useMemo(() => {
    const locations = [...new Set(regionFilteredData.map(item => 
      getBilingualField(item, 'location_name', language)
    ).filter(Boolean))].sort();
    
    const artists = [...new Set(regionFilteredData.map(item => 
      getBilingualField(item, 'Singer', language)
    ).filter(Boolean))].sort();
    
    const decades = [...new Set(regionFilteredData.map(item => {
      if (item.year) {
        const year = parseInt(item.year);
        if (!isNaN(year)) {
          return `${Math.floor(year / 10) * 10}s`;
        }
      }
      return null;
    }).filter(Boolean))].sort();
    
    return { locations, artists, decades };
  }, [regionFilteredData, language]);

  // Apply final filters
  const finalFilteredData = useMemo(() => {
    return regionFilteredData.filter(item => {
      // Location filter
      if (selectedLocations.length > 0) {
        const itemLocation = getBilingualField(item, 'location_name', language);
        if (!selectedLocations.includes(itemLocation)) return false;
      }
      
      // Artist filter
      if (selectedArtists.length > 0) {
        const itemArtist = getBilingualField(item, 'Singer', language);
        if (!selectedArtists.includes(itemArtist)) return false;
      }
      
      // Decade filter
      if (selectedDecades.length > 0 && item.year) {
        const year = parseInt(item.year);
        if (!isNaN(year)) {
          const itemDecade = `${Math.floor(year / 10) * 10}s`;
          if (!selectedDecades.includes(itemDecade)) return false;
        } else {
          return false;
        }
      }
      
      return true;
    });
  }, [regionFilteredData, selectedLocations, selectedArtists, selectedDecades, language]);

  // Update filtered data when selections change
  useEffect(() => {
    setFilteredData(finalFilteredData);
  }, [finalFilteredData]);

  // Auto-apply filters to map when selections change
  useEffect(() => {
    if (selectedRegion) {
      const newFilters = {
        artist: selectedArtists.length > 0 ? selectedArtists[0] : '',
        district: selectedLocations.length > 0 ? selectedLocations[0] : '',
        decade: selectedDecades.length > 0 ? selectedDecades[0] : ''
      };
      console.log('Auto-applying filters:', newFilters);
      console.log('Selected artists:', selectedArtists);
      console.log('Selected locations:', selectedLocations);
      console.log('Selected decades:', selectedDecades);
      setFilters(newFilters);
    }
  }, [selectedArtists, selectedLocations, selectedDecades]);

  // Handle region selection
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setCurrentStep(2);
    setSelectedLocations([]);
    setSelectedArtists([]);
    setSelectedDecades([]);
    setSearchTerm('');
    
    // Update map view based on selected region
    if (region) {
      const regionName = language === 'zh' ? region.zh : region.en;
      console.log('Region selected:', regionName);
      
      // Set map view based on selected region
      if (window.setMapCenter) {
        if (regionName === '香港' || regionName === 'Hong Kong') {
          console.log('Hong Kong selected, updating map view');
          window.setMapCenter([114.160932, 22.334575], 10.77);
        } else if (regionName === '日本' || regionName === 'Japan') {
          console.log('Japan selected, updating map view');
          window.setMapCenter([141.959456, 38.665890], 5.04);
        } else if (regionName === '亚洲其他' || regionName === 'Asia (Others)') {
          console.log('Asia (Others) selected, updating map view');
          window.setMapCenter([99.859452, 32.924926], 3.28);
        } else if (regionName === '欧洲' || regionName === 'Europe') {
          console.log('Europe selected, updating map view');
          window.setMapCenter([17.883928, 53.980905], 3.51);
        } else if (regionName === '北美洲' || regionName === 'North America') {
          console.log('North America selected, updating map view');
          window.setMapCenter([-98.623975, 38.801656], 4.05);
        } else if (regionName === '大洋洲' || regionName === 'Oceania') {
          console.log('Oceania selected, updating map view');
          window.setMapCenter([134.034144, -26.016501], 3.66);
        } else if (regionName === '非洲' || regionName === 'Africa') {
          console.log('Africa selected, updating map view');
          window.setMapCenter([21.273888, 22.348584], 3.56);
        } else if (regionName === '南极洲' || regionName === 'Antarctica') {
          console.log('Antarctica selected, updating map view');
          window.setMapCenter([141.408541, -83.628161], 3.01);
        } else if (regionName === '北极' || regionName === 'Arctic') {
          console.log('Arctic selected, updating map view');
          window.setMapCenter([-18.022112, 82.930569], 3.15);
        }
      }
    }
  };

  // Handle chip selection
  const toggleChip = (type, value) => {
    switch (type) {
      case 'location':
        setSelectedLocations(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'artist':
        setSelectedArtists(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'decade':
        setSelectedDecades(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
    }
  };

  // Apply filters to map
  const handleApply = () => {
    const newFilters = {
      artist: selectedArtists.length === 1 ? selectedArtists[0] : '',
      district: selectedLocations.length === 1 ? selectedLocations[0] : '',
      decade: selectedDecades.length === 1 ? selectedDecades[0] : ''
    };
    setFilters(newFilters);
  };

  // Reset to default (Hong Kong)
  const handleReset = () => {
    // Find Hong Kong region
    const hongKongRegion = regions.find(region => 
      region.zh === '香港' || region.en === 'Hong Kong'
    );
    
    if (hongKongRegion) {
      setSelectedRegion(hongKongRegion);
      setCurrentStep(2);
    }
    
    // Clear all other selections but keep region
    setSelectedLocations([]);
    setSelectedArtists([]);
    setSelectedDecades([]);
    setFilters({ artist: '', district: '', decade: '' });
    
    // Reset map view to Hong Kong
    if (window.setMapCenter) {
      console.log('Resetting map to Hong Kong');
      window.setMapCenter([114.160932, 22.334575], 10.77);
    }
  };

  // Random selection
  const handleRandom = () => {
    // If map exposes markers, trigger a random marker click to zoom & open popup
    if (window.openRandomMarker) {
      window.openRandomMarker();
      return;
    }

    // Fallback: log if not available
    console.log('openRandomMarker is not available');
  };

  // Filter options based on search
  const filteredLocations = availableOptions.locations.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredArtists = availableOptions.artists.filter(artist =>
    artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="mb-3 discover-lyrics-card">
      <Card.Body>
        {/* Step 1: Region Selection */}
        <div className="mb-4">
          <h6 className="mb-1">{t.step1}</h6>
          <p className="text-muted small mb-3">{t.step1Subtitle}</p>
          <Form.Select
            value={selectedRegion ? `${selectedRegion.zh}|${selectedRegion.en}` : ''}
            onChange={(e) => {
              const [zh, en] = e.target.value.split('|');
              const region = regions.find(r => r.zh === zh && r.en === en);
              if (region) {
                handleRegionSelect(region);
              }
            }}
            aria-label={t.step1}
          >
            <option value="">{language === 'zh' ? '选择地区' : 'Select Region'}</option>
            {regions.map((region, index) => (
              <option key={index} value={`${region.zh}|${region.en}`}>
                {language === 'zh' ? region.zh : region.en}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Step 2: Refine Filters */}
        {currentStep >= 2 && selectedRegion && (
          <div className="mb-4">
            <h6 className="mb-3">{t.step2}</h6>
            
            {/* Location Filter */}
            <div className="mb-3">
              <Form.Select
                value={selectedLocations.length > 0 ? selectedLocations[0] : ''}
                onChange={(e) => {
                  console.log('Location changed:', e.target.value);
                  if (e.target.value) {
                    setSelectedLocations([e.target.value]);
                  } else {
                    setSelectedLocations([]);
                  }
                }}
                aria-label={t.location}
              >
                <option value="">{t.location}</option>
                {availableOptions.locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </Form.Select>
            </div>

            {/* Artist Filter */}
            <div className="mb-3">
              <Form.Select
                value={selectedArtists.length > 0 ? selectedArtists[0] : ''}
                onChange={(e) => {
                  console.log('Artist changed:', e.target.value);
                  if (e.target.value) {
                    setSelectedArtists([e.target.value]);
                  } else {
                    setSelectedArtists([]);
                  }
                }}
                aria-label={t.artist}
              >
                <option value="">{t.artist}</option>
                {availableOptions.artists.map((artist, index) => (
                  <option key={index} value={artist}>
                    {artist}
                  </option>
                ))}
              </Form.Select>
            </div>

            {/* Decade Filter */}
            <div className="mb-3">
              <Form.Select
                value={selectedDecades.length > 0 ? selectedDecades[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDecades([e.target.value]);
                  } else {
                    setSelectedDecades([]);
                  }
                }}
                aria-label={t.decade}
              >
                <option value="">{t.decade}</option>
                {availableOptions.decades.map((decade, index) => (
                  <option key={index} value={decade}>
                    {decade}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
        )}

        {/* Step 3: Results Summary */}
        {currentStep >= 2 && (
          <div className="results-section">
            <div className="divider mb-3"></div>
            {finalFilteredData.length > 0 ? (
              <div className="results-summary" aria-live="polite">
                <p className="mb-3 results-text">
                  {t.resultsSummary(
                    finalFilteredData.length,
                    selectedRegion ? (language === 'zh' ? selectedRegion.zh : selectedRegion.en) : '',
                    selectedDecades.length === 1 ? selectedDecades[0] : ''
                  )}
                </p>
                <div className="results-actions">
                  <Button variant="outline-secondary" onClick={handleReset} className="rounded-pill btn-clear">
                    {t.reset}
                  </Button>
                  <Button variant="outline-info" onClick={handleRandom} className="rounded-pill btn-random">
                    {t.random}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p className="text-muted">{t.noResults}</p>
                <Button variant="outline-secondary" onClick={handleReset} className="rounded-pill">
                  {t.reset}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DiscoverLyrics;
