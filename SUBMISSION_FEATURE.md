# "Marker Your Fav Lyrics" Submission Feature

## Overview
This feature allows users to submit new Cantonese pop lyrics with their corresponding locations directly through the map interface. Submissions are immediately added to the CSV database and displayed on the map.

## Features

### 🎯 **Map Integration**
- **Floating Button**: Located at bottom-left of the map
- **Bilingual Interface**: English/Chinese language support
- **Map Click Selection**: Users can click on the map to get coordinates
- **Instant Rendering**: New markers appear immediately after submission

### 📝 **Comprehensive Form**
- **Song Information**: Chinese and English song names, artists, albums
- **Location Details**: Bilingual location names and region selection
- **Coordinates**: Manual input or map click selection
- **Lyrics**: Chinese and English lyrics (max 4 lines each)
- **Metadata**: Year, songwriter information

### ✅ **Validation & Quality Control**
- **Required Fields**: Song name, artist, location, region, coordinates, year, lyrics
- **Data Validation**: Coordinate ranges, year limits, lyrics length
- **Duplicate Detection**: Warns about potential duplicates
- **Region Mapping**: Automatic Chinese/English region pairing

### 🚀 **Backend Integration**
- **CSV Append**: New entries added to existing CSV file
- **Data Integrity**: Maintains exact column order and format
- **Error Handling**: Comprehensive validation and error messages
- **UUID Generation**: Unique identifiers for each submission

## Technical Implementation

### Frontend Components
- `LyricSubmissionForm.jsx`: Main submission form with validation
- `Map.jsx`: Enhanced with submission button and coordinate handling
- Translation files: Added form-related translations

### Backend API
- `backend/server.js`: Express server with CSV append functionality
- `backend/package.json`: Node.js dependencies
- Endpoint: `POST /api/submit-lyric`

### Data Flow
1. User clicks "Add a lyric" button
2. Form opens with bilingual interface
3. User fills required information
4. Optional: Click map to get coordinates
5. Form validation ensures data quality
6. Submission sent to backend API
7. Backend appends to CSV file
8. New marker rendered on map
9. Fly-to animation shows new location

## Usage Instructions

### For Development
```bash
# Install backend dependencies
cd backend
npm install

# Start both frontend and backend
./start-dev.sh
```

### For Users
1. **Open the Map**: Navigate to the map view
2. **Click "Add a lyric"**: Bottom-left floating button
3. **Fill the Form**: Complete required fields
4. **Optional Map Selection**: Click "Select on Map" to choose coordinates
5. **Submit**: Click submit to add to the database
6. **View Result**: New marker appears with fly-to animation

## Form Fields

### Required Fields
- **Song Name** (Chinese/English)
- **Artist** (Chinese/English) 
- **Location** (Chinese/English)
- **Region** (Chinese/English)
- **Coordinates** (Latitude/Longitude)
- **Year** (1900-current year)
- **Lyrics** (Chinese, 1-4 lines)

### Optional Fields
- **Album**
- **Songwriter** (Chinese/English)

## Validation Rules

### Data Validation
- **Coordinates**: Latitude (-90 to 90), Longitude (-180 to 180)
- **Year**: 1900 to current year
- **Lyrics**: Maximum 4 lines
- **Required Fields**: All marked with * must be filled

### Region Options
- 香港 / Hong Kong
- 日本 / Japan
- 亞洲其他地區 / Asia (Others)
- 歐洲 / Europe
- 北美洲 / North America
- 非洲 / Africa
- 南極 / Antarctica
- 北極 / Arctic
- 澳洲 / Australia

## CSV Schema
The submission follows the exact CSV column order:
```
id, song, location_name, location_name_en, region, region_en, 
location_y, location_x, song_en, album, Singer, singer_en, 
songwriter, song_writer_en, year, lyrics, lyrics_en
```

## Error Handling
- **Network Errors**: Connection issues with backend
- **Validation Errors**: Invalid data format or missing fields
- **Duplicate Warnings**: Similar entries detected
- **Success Messages**: Confirmation of successful submission

## Future Enhancements
- **Admin Panel**: Review and moderate submissions
- **User Accounts**: Track submission history
- **Advanced Validation**: More sophisticated duplicate detection
- **Bulk Import**: CSV file upload functionality
- **Analytics**: Submission statistics and trends

## Troubleshooting

### Common Issues
1. **Backend Not Running**: Ensure backend server is started on port 3001
2. **CORS Errors**: Check backend CORS configuration
3. **CSV Write Errors**: Verify file permissions and path
4. **Map Click Not Working**: Ensure map is fully loaded

### Development Tips
- Use browser dev tools to monitor API calls
- Check backend console for error messages
- Verify CSV file is writable
- Test with different coordinate ranges

## Security Considerations
- **Input Sanitization**: All user inputs are validated and sanitized
- **File Permissions**: CSV file should have appropriate write permissions
- **Rate Limiting**: Consider implementing submission rate limits
- **Data Backup**: Regular CSV file backups recommended

This feature significantly enhances the Hong Kong Music Atlas by allowing community contributions while maintaining data quality and consistency.
