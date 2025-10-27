# QR Code Generator API

A RESTful API service for generating QR codes from text or URLs with customizable size, format, and error correction levels. Built with Express.js and includes a beautiful web interface for testing.

## Features

- 🎯 Generate QR codes from any text or URL
- 📏 Customizable size (128px to 512px)
- 🎨 Support for PNG and SVG formats
- 📥 Direct download functionality
- 🛡️ Security: Rate limiting, Helmet headers, input validation
- 🌐 CORS enabled for frontend integration
- ⚡ Fast generation with QRCode library
- 🎨 Responsive web interface with dark theme
- 📊 Error handling with consistent responses
- 🔧 Environment variable configuration

## Project Structure

```
qr-code-generator-api/
├── src/
│   ├── controllers/
│   │   └── qrController.js      # QR code generation logic
│   ├── routes/
│   │   └── qrRoutes.js          # API route definitions
│   ├── middleware/
│   │   └── errorHandler.js      # Error handling middleware
│   └── index.js                 # Server entry point
├── public/
│   ├── index.html               # Web interface
│   ├── style.css                # Stylesheets
│   └── script.js                # Frontend JavaScript
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Setup

1. Install dependencies: `npm install`
2. (Optional) Create `.env` file for custom port
3. Run: `npm run dev`
4. Open `http://localhost:3000` in your browser

## API Endpoints

### Generate QR Code

**GET** `/api/generate`

Generates a QR code and returns it as a base64 data URL (PNG) or inline SVG.

#### Parameters
- `text` (required): The text or URL to encode in the QR code (max 1000 characters)
- `size` (optional): Size in pixels (128, 256, 512; default: 256)
- `format` (optional): Output format - `png` or `svg` (default: png)

#### Examples

**Generate PNG QR Code:**
```bash
curl "http://localhost:3000/api/generate?text=https://github.com&size=256&format=png"
```

**Response:**
```json
{
  "success": true,
  "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "text": "https://github.com",
  "size": 256
}
```

**Generate SVG QR Code:**
```bash
curl "http://localhost:3000/api/generate?text=Hello World&format=svg"
```

**Response:** SVG XML content with `Content-Type: image/svg+xml` header

### Download QR Code

**GET** `/api/download`

Downloads the QR code as a PNG file directly to the browser.

#### Parameters
- `text` (required): The text or URL to encode
- `size` (optional): Size in pixels (default: 256)

#### Example
```bash
curl -O -J "http://localhost:3000/api/download?text=Hello&size=256"
```

This will download a file named `qrcode.png`.

### Health Check

**GET** `/health`

Returns the API status for monitoring.

#### Response
```json
{
  "status": "OK",
  "message": "QR Code Generator API is running"
}
```

## Web Interface

Visit `http://localhost:3000` to access the built-in web interface.

### Features
- **Text Input**: Enter any text or URL to encode
- **Size Selection**: Choose from 128px, 256px, or 512px
- **Format Options**: Generate PNG or SVG QR codes
- **Live Preview**: Instant QR code generation and display
- **Download**: Direct download buttons for generated codes
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern UI with dark gradient background

### Usage
1. Enter your text or URL in the input field
2. Select desired size and format
3. Click "Generate QR Code"
4. View the QR code preview
5. Click "Download PNG" or "Download SVG" to save

## Error Handling

The API provides consistent error responses across all endpoints.

### Error Response Format
```json
{
  "success": false,
  "error": "Error description"
}
```

### Common Error Codes
- **400 Bad Request**: Missing or invalid parameters (e.g., empty text, text too long)
- **429 Too Many Requests**: Rate limit exceeded (100 requests per 15 minutes per IP)
- **500 Internal Server Error**: Server-side generation error

### Validation Rules
- Text parameter is required and cannot exceed 1000 characters
- Size must be 128, 256, or 512 pixels
- Format must be 'png' or 'svg'

## Environment Variables

Create a `.env` file in the root directory to customize server settings:

```env
PORT=3000
```

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
cd qr-code-generator-api
npm install
```

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
curl http://localhost:3000/health

# Generate QR code
curl "http://localhost:3000/api/generate?text=Hello%20World"

# Download QR code
curl -O "http://localhost:3000/api/download?text=Hello"
```

### Building for Production
The application uses ES6 modules and is ready for production deployment on platforms like Heroku, Vercel, or Railway.

## Dependencies

### Runtime Dependencies
- **express** (^5.1.0) - Fast, unopinionated web framework
- **qrcode** (^1.5.3) - QR code generation library
- **cors** (^2.8.5) - Cross-origin resource sharing
- **helmet** (^7.1.0) - Security headers middleware
- **express-rate-limit** (^7.1.5) - Rate limiting middleware
- **dotenv** (^16.3.1) - Environment variable loading

### Development Dependencies
- **nodemon** (^3.1.10) - Auto-restart during development

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC