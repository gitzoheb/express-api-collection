# URL Metadata API

A RESTful API service for extracting metadata (Open Graph tags, meta tags, images, descriptions) from URLs with optional screenshot capability.

## Features

- 🎯 Extract Open Graph tags (og:title, og:description, og:image, etc.)
- 🐦 Extract Twitter Card tags
- 📋 Extract Schema.org structured data (JSON-LD, Microdata, RDFa)
- 📸 Take screenshots of webpages using Puppeteer
- 🖼️ Extract images and descriptions
- 🌐 Support for all standard meta tags
- ⚡ Fast HTML parsing with Cheerio
- 🎨 Beautiful web interface for testing
- 🛡️ Security: Rate limiting, Helmet headers, input validation
- 🚀 Performance: Response compression, metadata caching
- 📊 Monitoring: Request logging, structured error logging
- ⚙️ Configurable: Environment variables for timeouts and limits

## Tech Stack

- **Express.js** - Web framework
- **Cheerio** - Fast HTML parsing
- **Axios** - HTTP client for fetching URLs
- **Puppeteer** - Browser automation for screenshots

## Installation

```bash
cd url-metadata-api
npm install
```

## Usage

### Start the server

```bash
npm start
# or for development
npm run dev
```

The server will run on `http://localhost:3000`

## API Versioning

This API uses versioning to ensure backward compatibility. The current version is v1.

## API Endpoints

### Get Metadata

Extract metadata from a URL without screenshot.

```http
GET /api/v1/metadata?url=<URL>
```

**Example:**
```bash
curl "http://localhost:3000/api/v1/metadata?url=https://github.com"
```

**Response:**
```json
{
  "success": true,
  "url": "https://github.com",
  "data": {
    "url": "https://github.com",
    "title": "GitHub",
    "description": "GitHub is where over ...",
    "image": "https://github.githubassets.com/...",
    "author": "",
    "type": "website",
    "siteName": "GitHub",
    "ogTags": { ... },
    "twitterTags": { ... },
    "metaTags": { ... },
    "structuredData": {
      "jsonLd": [ ... ],
      "microdata": [ ... ],
      "rdfa": [ ... ]
    }
  }
}
```

### Get Metadata with Screenshot

Extract metadata with a screenshot of the webpage.

```http
GET /api/v1/metadata/screenshot?url=<URL>&fullPage=false
```

**Parameters:**
- `url` (required) - The URL to scrape
- `fullPage` (optional) - Take full page screenshot (default: false)

**Example:**
```bash
curl "http://localhost:3000/api/v1/metadata/screenshot?url=https://github.com&fullPage=true"
```

**Response:**
```json
{
  "success": true,
  "url": "https://github.com",
  "data": {
    "url": "https://github.com",
    "title": "GitHub",
    "description": "GitHub is where over ...",
    "image": "https://github.githubassets.com/...",
    "screenshot": {
      "image": "data:image/png;base64,...",
      "format": "png",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "fullPage": true
    },
    "ogTags": { ... },
    "twitterTags": { ... },
    "metaTags": { ... }
  }
}
```

### Health Check

Check if the API is running.

```http
GET /api/v1/health
```

**Example:**
```bash
curl "http://localhost:3000/api/v1/health"
```

## Web Interface

Visit `http://localhost:3000` to use the built-in web interface for testing the API.

## Project Structure

```
url-metadata-api/
├── src/
│   ├── controllers/
│   │   └── scrapeController.js    # Route controllers
│   ├── routes/
│   │   └── scrapeRoutes.js        # API routes
│   ├── services/
│   │   └── scrapeService.js        # Business logic
│   ├── utils/
│   │   └── screenshot.js          # Puppeteer utilities
│   └── index.js                    # Server entry point
├── public/
│   ├── index.html                  # Web interface
│   ├── style.css                   # Styles
│   └── app.js                      # Frontend logic
├── package.json
└── README.md
```

## Error Handling

The API returns appropriate error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

Common error codes:
- `400` - Bad Request (invalid URL)
- `500` - Internal Server Error

## Environment Variables

Create a `.env` file to customize the server:

```env
PORT=3000
AXIOS_TIMEOUT=10000
PUPPETEER_TIMEOUT=30000
CACHE_TTL=600
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## Development

The project uses ES6 modules with the `type: "module"` configuration in `package.json`.

## License

ISC

