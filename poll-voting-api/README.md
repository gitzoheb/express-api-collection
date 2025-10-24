# Poll Voting API

A simple poll voting application built with Node.js, Express, and a static frontend using HTML, CSS, and JavaScript. Polls are stored in-memory (data resets on server restart).

## Features

- **Create Polls**: Add a question with at least 2 options.
- **View Polls**: Display all polls with current vote counts.
- **Vote on Polls**: Select an option to increment its vote count.
- **Delete Polls**: Remove polls by ID.
- **RESTful API**: JSON-based endpoints for backend integration.

## How It Works

### Backend (API)
- **Data Storage**: Polls are stored in an in-memory array in `poll.controllers.js`. Each poll has an auto-generated UUID, question, options array, and votes array.
- **Endpoints**: Handled by Express routes in `poll.routes.js`, calling controller functions.
- **Validation**: Ensures required fields and minimum options on creation; checks poll existence and valid indices for voting/deletion.
- **Error Handling**: Returns structured JSON responses for success/errors.

### Frontend
- **Interface**: Static HTML page served from `public/index.html`, styled with CSS, interactive via JavaScript.
- **Interactions**: Uses fetch API to call backend endpoints. Loads polls on page load, handles form submissions for creation, button clicks for voting/deletion.
- **Dynamic UI**: Polls displayed as cards; options show vote counts; form allows adding/removing options dynamically.

The app runs on a single server, serving both API and static files. Data is ephemeral.

## Code Implementation

### Backend

- **src/index.js**: Initializes Express app, enables JSON parsing and static file serving, mounts poll routes, and adds error handling middleware.
  ```javascript
  import express from 'express';
  import path from 'path';
  import pollRoutes from './routes/poll.routes.js';

  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use('/polls', pollRoutes);
  // Error handling middleware for 404 and 500
  app.listen(3000, () => console.log('Server running'));
  ```

- **src/controllers/poll.controllers.js**: Holds in-memory `polls` array. Exports functions for poll operations: creation (validates input, generates UUID), retrieval, voting (checks index validity), and deletion.
  ```javascript
  import { randomUUID } from 'crypto';
  const polls = [];

  export const createPoll = (req, res) => {
    const { question, options } = req.body;
    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ success: false, error: 'Question and at least 2 options required' });
    }
    const newPoll = {
      id: randomUUID(),
      question,
      options,
      votes: new Array(options.length).fill(0)
    };
    polls.push(newPoll);
    res.status(201).json({ success: true, data: newPoll });
  };
  // Similar exports for getAllPolls, getPollById, voteOnPoll, deletePoll
  ```

- **src/routes/poll.routes.js**: Creates Express router, defines HTTP methods and paths, imports and assigns controller functions.
  ```javascript
  import express from 'express';
  import { getAllPolls, getPollById, createPoll, voteOnPoll, deletePoll } from '../controllers/poll.controllers.js';

  const router = express.Router();
  router.get('/', getAllPolls);
  router.get('/:id', getPollById);
  router.post('/', createPoll);
  router.post('/:id/vote', voteOnPoll);
  router.delete('/:id', deletePoll);

  export default router;
  ```

### Frontend

- **public/index.html**: Contains form for poll creation (question + dynamic options), button to add options, and div to list polls.

- **public/js/app.js**: Manages UI interactions: loads polls on DOM load, handles form submit for creation, adds option inputs, votes/deletes via fetch, updates display.
  ```javascript
  async function loadPolls() {
    const response = await fetch('/polls');
    const data = await response.json();
    if (data.success) displayPolls(data.data);
  }

  async function createPoll(event) {
    event.preventDefault();
    // Collect form data, validate, POST to /polls, reload polls
  }
  // Similar for voteOnPoll, deletePoll
  ```

- **public/css/styles.css**: Styles the page with centered layout, form styling, poll cards, buttons, and responsive elements.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Data Storage**: In-memory array (no database)

## Installation

1. Clone or download the repository.
2. Navigate to the project directory.
3. Run `npm install` to install dependencies (Express).

## Usage

1. Start the server: `npm start` (runs on http://localhost:3000).
2. Open http://localhost:3000 in your browser to access the frontend.
3. Use the form to create polls, view the list, vote, or delete polls.

### API Endpoints

- `GET /polls` - Retrieve all polls.
- `GET /polls/:id` - Retrieve a specific poll by ID.
- `POST /polls` - Create a new poll (body: `{ "question": "string", "options": ["opt1", "opt2"] }`).
- `POST /polls/:id/vote` - Vote on a poll (body: `{ "optionIndex": number }`).
- `DELETE /polls/:id` - Delete a poll by ID.

All responses are JSON with `{ "success": boolean, "data": ... }` or `{ "success": false, "error": "message" }`.

## Project Structure

```
public/
├── index.html          # Frontend HTML
├── css/
│   └── styles.css      # Styles
└── js/
    └── app.js          # Frontend JavaScript
src/
├── controllers/
│   └── poll.controllers.js  # Poll logic and data handling
├── routes/
│   └── poll.routes.js      # API route definitions
└── index.js                # Server entry point
```

## Notes

- Data is not persisted; polls are lost on server restart.
- Validation ensures questions and at least 2 options for creation.
- Frontend uses fetch API to interact with the backend.