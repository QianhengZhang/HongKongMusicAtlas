// Data service for fetching Hong Kong music locations
export const fetchMusicData = async () => {
  try {
    console.log('Fetching music data from local CSV file');
    const response = await fetch('./data/HKLyrics.csv');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    console.log('CSV data loaded, length:', csvText.length);

    // Parse CSV with proper handling of quoted fields
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const data = lines.slice(1).map((line, index) => {
      const row = {};
      let currentField = '';
      let inQuotes = false;
      let fieldIndex = 0;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          // End of field
          const header = headers[fieldIndex];
          if (header) {
            row[header] = currentField.trim();
          }
          currentField = '';
          fieldIndex++;
        } else {
          currentField += char;
        }
      }

      // Add the last field
      if (fieldIndex < headers.length) {
        const header = headers[fieldIndex];
        if (header) {
          row[header] = currentField.trim();
        }
      }

      return row;
    }).filter(row => {
      // Filter out rows with empty coordinates
      const hasLocationX = row.location_x && row.location_x.trim() !== '';
      const hasLocationY = row.location_y && row.location_y.trim() !== '';

      if (!hasLocationX || !hasLocationY) {
        console.log(`Skipping row ${row.id || 'unknown'}: missing coordinates`);
        return false;
      }

      // Validate coordinates are numbers
      const x = parseFloat(row.location_x);
      const y = parseFloat(row.location_y);
      if (isNaN(x) || isNaN(y)) {
        console.log(`Skipping row ${row.id || 'unknown'}: invalid coordinates`);
        return false;
      }

      return true;
    });

    console.log('Parsed data:', data.length, 'locations found');
    return data;
  } catch (error) {
    console.error('Error fetching music data:', error);
    // Return sample data for testing if fetch fails
    return [
      {
        id: '1',
        song: '芬梨道上',
        Singer: '楊千嬅',
        location_x: '114.15125516860337',
        location_y: '22.270467721624275',
        location_name_en: 'Findlay Rd',
        year: '2006',
        lyrics: '這山頂如何高貴 似叫人踏上天梯'
      },
      {
        id: '2',
        song: '下一站天后',
        Singer: 'Twins',
        location_x: '114.19171506798394',
        location_y: '22.282391696681128',
        location_name_en: 'Tin Hau Station',
        year: '2003',
        lyrics: '到天后 當然最好 但華麗的星途 途中'
      }
    ];
  }
};

// Parse location coordinates from x and y values
export const parseLocation = (locationX, locationY) => {
  if (!locationX || !locationY) {
    console.log('Missing location coordinates');
    return null;
  }

  try {
    const x = parseFloat(locationX);
    const y = parseFloat(locationY);

    if (isNaN(x) || isNaN(y)) {
      console.log(`Invalid coordinates: x=${locationX}, y=${locationY}`);
      return null;
    }

    // Mapbox expects [lng, lat] format
    return [x, y];
  } catch (error) {
    console.error('Error parsing location coordinates:', locationX, locationY, error);
    return null;
  }
};