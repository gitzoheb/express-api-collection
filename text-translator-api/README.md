# Text Translator API

A simple web application for translating text between multiple languages using the Lingva.ml translation service.

## Features

- **Manual Language Selection**: Choose both source and target languages from a comprehensive list
- **Web Interface**: User-friendly HTML form for easy translation
- **REST API**: Backend API endpoint for programmatic access
- **Real-time Translation**: Instant translation results with error handling
- **Responsive Design**: Clean, mobile-friendly UI
- **Supported Languages**: English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Arabic, Russian, Korean, Hindi, Dutch, Swedish, Turkish, Polish

## How It Works

1. **Frontend**: Users select source language, target language, and enter text to translate via a web form
2. **Request**: Form data is sent as a POST request to the `/translate` endpoint
3. **Backend Processing**: Express server validates input and forwards to translation utility
4. **Translation Service**: Axios makes a request to Lingva.ml API with source/target languages
5. **Response**: Translated text is returned and displayed to the user

## Code Implementation

### Backend Structure
```
src/
├── index.js              # Main Express server setup
├── controllers/
│   └── translate.controller.js  # API endpoint logic
├── routes/
│   └── translate.routes.js      # Route definitions
├── utils/
│   └── translator.js            # Lingva.ml API integration
└── public/
    ├── index.html         # Frontend HTML
    ├── script.js          # Frontend JavaScript
    └── style.css          # Frontend styling
```

### Key Components

**Server Setup (index.js)**:
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import translateRoutes from './routes/translate.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('src/public'));

app.use('/translate', translateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**API Controller (translate.controller.js)**:
```javascript
import { translate } from '../utils/translator.js';

export const translateText = async (req, res) => {
  const { text, source, target } = req.body;

  if (!text || !source || !target) {
    return res.status(400).json({ error: 'Text, source language, and target language are required' });
  }

  try {
    const translatedText = await translate(text, source, target);
    res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed. Please try again later.' });
  }
};
```

**Translation Utility (translator.js)**:
```javascript
import axios from 'axios';

const LINGVA_URL = 'https://lingva.ml/api/v1';

export const translate = async (text, source, target) => {
  try {
    const response = await axios.get(`${LINGVA_URL}/${source}/${target}/${encodeURIComponent(text)}`);
    return response.data.translation;
  } catch (error) {
    throw new Error('Failed to translate text');
  }
};
```

**Route Definition (translate.routes.js)**:
```javascript
import express from 'express';
import { translateText } from '../controllers/translate.controller.js';

const router = express.Router();

router.post('/', translateText);

export default router;
```

**Frontend (index.html)**:
```html
<form id="translateForm">
    <textarea id="text" placeholder="Enter text to translate" required></textarea>
    <select id="source" required>
        <option value="">Select source language</option>
        <option value="en">English</option>
        <!-- More options... -->
    </select>
    <select id="target" required>
        <option value="">Select target language</option>
        <option value="es">Spanish</option>
        <!-- More options... -->
    </select>
    <button type="submit">Translate</button>
</form>
<div id="result"></div>
```

**Frontend JavaScript (script.js)**:
```javascript
document.getElementById('translateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('text').value;
    const source = document.getElementById('source').value;
    const target = document.getElementById('target').value;
    const resultDiv = document.getElementById('result');

    resultDiv.textContent = 'Translating...';

    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, source, target }),
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.textContent = data.translatedText;
        } else {
            resultDiv.textContent = data.error || 'Translation failed';
        }
    } catch (error) {
        resultDiv.textContent = 'Error: Could not connect to server';
    }
});
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

### Web Interface
1. Select the source language from the first dropdown
2. Select the target language from the second dropdown
3. Enter the text to translate in the textarea
4. Click "Translate" to get the result

### API Usage
Send a POST request to `/translate` with JSON body:

```json
{
  "text": "Hello world",
  "source": "en",
  "target": "es"
}
```

Response:
```json
{
  "translatedText": "Hola mundo"
}
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **HTTP Client**: Axios
- **Translation Service**: Lingva.ml API
- **Development**: Nodemon for auto-restart

## API Endpoints

### POST /translate
Translates text from source to target language.

**Request Body:**
- `text` (string, required): Text to translate
- `source` (string, required): Source language code (e.g., "en")
- `target` (string, required): Target language code (e.g., "es")

**Response:**
- `200`: `{"translatedText": "Translated text"}`
- `400`: `{"error": "Validation error message"}`
- `500`: `{"error": "Translation failed. Please try again later."}`

## Author

Zoheb Ansari

## License

MIT