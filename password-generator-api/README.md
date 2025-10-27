# Password Generator API

A secure Express.js API for generating random passwords with customizable options and strength validation.

## Features

- Generate secure passwords with customizable length and character sets
- Validate password strength using zxcvbn library
- Simple web interface for easy use
- CORS enabled for frontend integration
- Helmet for security headers

## Setup

1. Install dependencies: `npm install`
2. (Optional) Create `.env` file to set custom port
3. Run: `npm run dev`
4. Open `http://localhost:3000` in your browser

## API Endpoints

### Generate Password
- **POST** `/api/generate`
- Generates a random password based on provided options

**Request Body:**
```json
{
  "length": 12,
  "uppercase": true,
  "lowercase": true,
  "numbers": true,
  "symbols": true
}
```

**Response:**
```json
{
  "success": true,
  "password": "Abc123!@#def"
}
```

### Validate Password Strength
- **POST** `/api/validate`
- Analyzes password strength and provides feedback

**Request Body:**
```json
{
  "password": "mypassword123"
}
```

**Response:**
```json
{
  "success": true,
  "score": 2,
  "feedback": {
    "warning": "This is a very common password",
    "suggestions": ["Add more words that are less common"]
  },
  "crackTime": "2 minutes"
}
```

## Password Options

- **length**: Password length (4-128, default: 12)
- **uppercase**: Include uppercase letters (default: true)
- **lowercase**: Include lowercase letters (default: true)
- **numbers**: Include numbers (default: true)
- **symbols**: Include symbols (default: true)

## Strength Scores

- 0: Very Weak
- 1: Weak
- 2: Fair
- 3: Good
- 4: Strong

## Error Handling

All endpoints return a consistent error response:
```json
{
  "success": false,
  "message": "Error description"
}
```