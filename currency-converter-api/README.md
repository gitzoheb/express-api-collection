# Currency Converter API

A simple Express.js API for converting currencies using real-time exchange rates from exchangerate-api.com.

## Features

- Get current exchange rates (base USD)
- Convert amounts between currencies
- Simple web interface for easy conversion
- CORS enabled for frontend integration

## Setup

1. Install dependencies: `npm install`
2. (Optional) Create `.env` file if you need to add API keys for premium services
3. Run: `npm run dev`
4. Open `http://localhost:3000` in your browser

## API Endpoints

### Get Exchange Rates
- **GET** `/api/rates`
- Returns all exchange rates with USD as base currency

**Response:**
```json
{
  "success": true,
  "rates": {
    "EUR": 0.85,
    "GBP": 0.73,
    ...
  }
}
```

### Convert Currency
- **GET** `/api/convert?from=USD&to=EUR&amount=100`
- Converts the specified amount from one currency to another

**Parameters:**
- `from` (string): Source currency code (e.g., USD)
- `to` (string): Target currency code (e.g., EUR)
- `amount` (number): Amount to convert

**Response:**
```json
{
  "success": true,
  "from": "USD",
  "to": "EUR",
  "amount": 100,
  "converted": 85,
  "rate": 0.85
}
```

## Supported Currencies

Common currencies include: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, etc.

## Error Handling

All endpoints return a consistent error response:
```json
{
  "success": false,
  "message": "Error description"
}
```