# Image Compression API

A production-ready image compression API built with Node.js, Express, and Sharp.

## Features

- Compress, resize, and convert images
- Support for JPEG, PNG, WebP, and AVIF formats
- Batch processing for multiple images
- Rate limiting and file validation
- Optional storage upload with download URLs
- Health check endpoint

## Installation

1. Clone the repository
2. Navigate to the image-compression-api directory
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure as needed
5. Start the server: `npm start` or `npm run dev` for development

## Environment Variables

- `PORT`: Server port (default: 3000)
- `BASE_URL`: Base URL for generating download links (default: http://localhost:3000)
- `MAX_FILE_SIZE_BYTES`: Maximum file size in bytes (default: 10MB)
- `TEMP_DIR`: Directory for temporary compressed file storage
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window (default: 100)
- `BATCH_SIZE_LIMIT`: Maximum files in batch processing (default: 10)
- `FILE_RETENTION_HOURS`: Hours to keep compressed files before cleanup (default: 24)
- `CLEANUP_INTERVAL_MINUTES`: Minutes between automatic cleanup runs (default: 60)

## API Endpoints

### POST /api/images/compress

Compress a single image.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Fields:
  - `image`: Image file (required)
  - `width`: Target width (optional)
  - `height`: Target height (optional)
  - `format`: Output format (jpeg, png, webp, avif) (default: jpeg)
  - `quality`: Quality (1-100) (default: 80)
  - `fit`: Resize fit (cover, contain, fill, inside, outside) (default: cover)
  - `download`: Return as attachment (true/false) (default: false)
  - `uploadToStorage`: Save to storage and return URL (true/false) (default: false)

**Response:**
- If `uploadToStorage=false`: Streamed image with proper Content-Type
- If `uploadToStorage=true`: JSON `{success: true, message: "...", data: {downloadUrl: "..."}}`

### POST /api/images/compress/batch

Compress multiple images with memory optimization.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Fields: Same as single compress, but `images` field accepts multiple files (max 10)
- Note: uploadToStorage and download parameters are ignored; all results saved to temp storage

**Response:**
- JSON with array of download URLs for each compressed image
- Includes progress info (index/total) for each file

### GET /api/images/health

Health check endpoint.

**Response:** `{status: "ok"}`

### DELETE /api/images/admin/cleanup

Manual cleanup of old files (admin endpoint).

**Query Parameters:**
- `retention` (optional): Custom retention hours (overrides default)

**Response:**
```json
{
  "success": true,
  "message": "Cleanup completed",
  "data": {
    "totalFiles": 150,
    "deletedFiles": 45,
    "freedSpace": 52428800,
    "storageStats": {...}
  }
}
```

### GET /api/images/admin/stats

Get storage statistics (admin endpoint).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFiles": 105,
    "totalSize": 104857600,
    "oldestFile": {"name": "file.jpg", "mtime": "2024-01-01T00:00:00.000Z", "size": 1024000},
    "newestFile": {"name": "file2.jpg", "mtime": "2024-01-02T00:00:00.000Z", "size": 2048000}
  }
}
```

## Usage Examples

### Compress an image

```bash
curl -X POST http://localhost:3000/api/images/compress \
  -F "image=@image.jpg" \
  -F "width=800" \
  -F "height=600" \
  -F "format=webp" \
  -F "quality=90"
```

### Batch compress

```bash
curl -X POST http://localhost:3000/api/images/compress/batch \
  -F "images=@image1.jpg" \
  -F "images=@image2.png" \
  -F "format=webp"
```

## Error Handling

All errors return JSON in the format:
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "VALIDATION_ERROR",
  "requestId": "uuid-string",
  "statusCode": 400
}
```

### Error Codes
- `VALIDATION_ERROR` (400): Invalid input parameters or file format
- `PROCESSING_ERROR` (422): Image processing failed
- `STORAGE_FULL` (507): Insufficient disk space
- `FILE_TOO_LARGE` (413): File exceeds size limit
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

### Request Tracking
Each request includes a unique `X-Request-ID` header for debugging. This ID is also returned in error responses.

## Technologies Used

- Node.js
- Express.js
- Sharp (image processing)
- Multer (file uploads)
- Express Rate Limit
- Helmet (security)
- Morgan (logging)
- CORS

## License

MIT