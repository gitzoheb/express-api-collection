# File Converter API

A RESTful API service for converting files between different formats, built with Express.js. Supports PDF to image conversion and DOCX to HTML conversion with a beautiful dark-themed web interface.

## Features

- 🎯 Convert PDF files to high-quality PNG images
- 📄 Convert DOCX files to clean HTML (foundation for PDF conversion)
- 🖼️ Simple web interface with dark theme for easy testing
- 📤 File upload with size limits and format validation
- 🛡️ Security: CORS enabled, input validation, error handling
- ⚡ Fast conversions using optimized libraries
- 🎨 Responsive design that works on desktop and mobile
- 📊 Consistent JSON responses for API integration
- 🔧 Environment variable configuration

## Project Structure

```
file-converter-api/
├── src/
│   ├── controllers/
│   │   └── converterController.js    # Conversion logic
│   ├── routes/
│   │   └── converterRoutes.js        # API route definitions
│   └── index.js                      # Server entry point
├── public/
│   ├── index.html                    # Web interface
│   ├── style.css                     # Dark theme styles
│   └── script.js                     # Frontend JavaScript
├── uploads/                          # Temporary file storage
├── package.json
├── .gitignore
└── README.md
```

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Navigate to the project directory:
   ```bash
   cd file-converter-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) For full PDF to image conversion, install ImageMagick or GraphicsMagick on your system:
   - Windows: Download from https://imagemagick.org/script/download.php#windows
   - macOS: `brew install imagemagick`
   - Linux: `sudo apt-get install imagemagick`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3001`

## API Endpoints

### Convert PDF to Image

**POST** `/api/convert/pdf-to-image`

Converts the first page of an uploaded PDF file to a PNG image.

#### Request
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `file` field containing the PDF file

#### Example using curl
```bash
curl -X POST -F "file=@sample.pdf" http://localhost:3001/api/convert/pdf-to-image
```

#### Response
```json
{
  "success": true,
  "message": "PDF converted to image successfully",
  "downloadUrl": "/uploads/1703123456789_output.png"
}
```

### Convert DOCX to HTML

**POST** `/api/convert/docx-to-pdf`

Converts an uploaded DOCX file to HTML format (currently outputs HTML; PDF conversion can be added with additional libraries like Puppeteer).

#### Request
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `file` field containing the DOCX file

#### Example using curl
```bash
curl -X POST -F "file=@document.docx" http://localhost:3001/api/convert/docx-to-pdf
```

#### Response
```json
{
  "success": true,
  "message": "DOCX converted to HTML successfully (PDF conversion requires additional setup)",
  "downloadUrl": "/uploads/1703123456789_output.html"
}
```

### Health Check

**GET** `/health`

Returns the API status for monitoring.

#### Response
```json
{
  "status": "OK",
  "message": "File Converter API is running"
}
```

## Web Interface

Visit `http://localhost:3001` to access the built-in web interface.

### Features
- **Dark Theme**: Modern dark UI with subtle shadows
- **File Upload**: Drag-and-drop or click to select files
- **Format Selection**: Choose between PDF-to-Image and DOCX-to-HTML conversion
- **Live Feedback**: Real-time status updates during conversion
- **Download Links**: Direct download buttons for converted files
- **Responsive Design**: Works seamlessly on all device sizes
- **Error Display**: Clear error messages for failed conversions

### Usage
1. Select the conversion type (PDF to Image or DOCX to HTML)
2. Click "Choose File" or drag a file into the upload area
3. Click the convert button
4. Wait for the conversion to complete
5. Download the converted file using the provided link

## Supported Formats

| Input Format | Output Format | Library Used | Notes |
|--------------|---------------|--------------|-------|
| PDF (.pdf)   | PNG (.png)    | pdf2pic      | Converts first page only |
| DOCX (.docx) | HTML (.html)  | mammoth      | Clean HTML output |

### File Limits
- Maximum file size: 10MB
- Supported MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

## Error Handling

The API provides consistent error responses across all endpoints.

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes
- **400 Bad Request**: Invalid file format, file too large, or missing file
- **500 Internal Server Error**: Conversion failure or server error

### Validation Rules
- File must be present in the request
- File size must not exceed 10MB
- File type must be PDF or DOCX
- File must be readable and valid

## Environment Variables

Create a `.env` file in the root directory to customize server settings:

```env
PORT=3001
```

## Development

### Running the Application
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Testing the API
```bash
# Health check
curl http://localhost:3001/health

# Convert PDF (replace with actual file path)
curl -X POST -F "file=@/path/to/sample.pdf" http://localhost:3001/api/convert/pdf-to-image

# Convert DOCX (replace with actual file path)
curl -X POST -F "file=@/path/to/document.docx" http://localhost:3001/api/convert/docx-to-pdf
```

### Code Style
- ES6 modules with `type: "module"` in package.json
- Async/await for asynchronous operations
- Consistent error handling patterns
- Clean separation of concerns (routes, controllers, views)

## Dependencies

### Runtime Dependencies
- **express** (^4.18.2) - Web framework for Node.js
- **multer** (^1.4.5-lts.1) - Middleware for handling file uploads
- **pdf2pic** (^3.1.1) - Convert PDF pages to images
- **mammoth** (^1.6.0) - Convert DOCX files to HTML
- **cors** (^2.8.5) - Enable Cross-Origin Resource Sharing
- **helmet** (^7.1.0) - Security middleware

### Development Dependencies
- **nodemon** (^3.0.2) - Auto-restart during development

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC