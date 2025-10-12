const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// CSV file path
const CSV_PATH = path.join(__dirname, '../public/data/HKLyrics.csv');

// Helper function to append data to CSV
const appendToCSV = (data) => {
  try {
    // Read existing CSV
    const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = csvContent.trim().split('\n');
    
    // Get headers
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Create new row data in the correct order
    const newRow = [
      data.id || '',
      data.song || '',
      data.location_name || '',
      data.location_name_en || '',
      data.region || '',
      data.region_en || '',
      data.location_y || '',
      data.location_x || '',
      data.song_en || '',
      data.album || '',
      data.Singer || '',
      data.singer_en || '',
      data.songwriter || '',
      data.song_writer_en || '',
      data.year || '',
      data.lyrics || '',
      data.lyrics_en || ''
    ];
    
    // Escape CSV values (handle commas and quotes)
    const escapedRow = newRow.map(value => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    
    // Append new row
    const newLine = escapedRow.join(',');
    const updatedContent = csvContent.trim() + '\n' + newLine;
    
    // Write back to file
    fs.writeFileSync(CSV_PATH, updatedContent, 'utf8');
    
    return true;
  } catch (error) {
    console.error('Error appending to CSV:', error);
    throw error;
  }
};

// API endpoint to submit new lyric
app.post('/api/submit-lyric', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    const requiredFields = [
      'song', 'song_en', 'Singer', 'singer_en', 
      'location_name', 'location_name_en', 
      'region', 'region_en', 'location_y', 'location_x', 
      'year', 'lyrics'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }
    
    // Validate coordinates
    const lat = parseFloat(formData.location_y);
    const lng = parseFloat(formData.location_x);
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({
        error: 'Invalid latitude. Must be between -90 and 90.'
      });
    }
    
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({
        error: 'Invalid longitude. Must be between -180 and 180.'
      });
    }
    
    // Validate year
    const year = parseInt(formData.year);
    const currentYear = new Date().getFullYear();
    
    if (isNaN(year) || year < 1900 || year > currentYear) {
      return res.status(400).json({
        error: `Invalid year. Must be between 1900 and ${currentYear}.`
      });
    }
    
    // Validate lyrics length
    if (formData.lyrics && formData.lyrics.split('\n').length > 4) {
      return res.status(400).json({
        error: 'Lyrics must be 4 lines or less.'
      });
    }
    
    if (formData.lyrics_en && formData.lyrics_en.split('\n').length > 4) {
      return res.status(400).json({
        error: 'English lyrics must be 4 lines or less.'
      });
    }
    
    // Generate unique ID
    const id = uuidv4();
    
    // Prepare data for CSV
    const csvData = {
      id,
      song: formData.song.trim(),
      location_name: formData.location_name.trim(),
      location_name_en: formData.location_name_en.trim(),
      region: formData.region,
      region_en: formData.region_en,
      location_y: formData.location_y,
      location_x: formData.location_x,
      song_en: formData.song_en.trim(),
      album: formData.album ? formData.album.trim() : '',
      Singer: formData.Singer.trim(),
      singer_en: formData.singer_en.trim(),
      songwriter: formData.songwriter ? formData.songwriter.trim() : '',
      song_writer_en: formData.song_writer_en ? formData.song_writer_en.trim() : '',
      year: formData.year,
      lyrics: formData.lyrics.trim(),
      lyrics_en: formData.lyrics_en ? formData.lyrics_en.trim() : ''
    };
    
    // Append to CSV
    appendToCSV(csvData);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Lyric submitted successfully',
      data: csvData
    });
    
  } catch (error) {
    console.error('Error submitting lyric:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`CSV file path: ${CSV_PATH}`);
});
