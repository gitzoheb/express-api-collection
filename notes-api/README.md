# Notes API

A simple REST API for managing notes built with Node.js and Express.

## Table of Contents
- [Features](#features)
- [How It Works](#how-it-works)
  - [API Workflow](#api-workflow)
- [Code Implementation](#code-implementation)
  - [Application Entry Point (`src/index.js`)](#application-entry-point-srcindexjs)
  - [API Routes (`src/routes/note.routes.js`)](#api-routes-srcroutesnoteroutesjs)
  - [Note Controller (`src/controllers/note.controller.js`)](#note-controller-srccontrollersnotecontrollerjs)
  - [Get All Notes (`getAllNotes`)](#get-all-notes-getallnotes)
  - [Get Note By ID (`getNoteById`)](#get-note-by-id-getnotebyid)
  - [Create Note (`createNote`)](#create-note-createnote)
  - [Update Note (`updateNote`)](#update-note-updatenote)
  - [Delete Note (`deleteNote`)](#delete-note-deletenote)
- [API Endpoints](#api-endpoints)
- [Note Schema](#note-schema)
- [Response Format](#response-format)

## Features
- In-memory storage (no database required)
- CRUD operations for notes
- Basic validation
- JSON API responses

## How It Works

This API provides a straightforward way to manage notes. Since it uses in-memory storage, all data will be reset when the server restarts.

### API Workflow

Here’s a typical workflow for managing notes:

#### 1. Create a New Note

You can create a new note by sending a `POST` request with the note's title and content.

**Request:**
- `POST /notes`

**Example using `curl`:**
```bash
curl -X POST http://localhost:3000/notes \\
  -H "Content-Type: application/json" \\
  -d '{"title":"My First Note","content":"This is the content of my first note."}'
```

#### 2. Get All Notes

You can retrieve all the notes that have been created.

**Request:**
- `GET /notes`

**Example using `curl`:**
```bash
curl http://localhost:3000/notes
```

#### 3. Update a Note

You can update an existing note by its ID.

**Request:**
- `PUT /notes/:id`

**Example using `curl`:**
```bash
curl -X PUT http://localhost:3000/notes/1 \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Updated Note Title","content":"Updated content."}'
```

#### 4. Delete a Note

You can delete a note by its ID.

**Request:**
- `DELETE /notes/:id`

**Example using `curl`:**
```bash
curl -X DELETE http://localhost:3000/notes/1
```

## Code Implementation

### Application Entry Point (`src/index.js`)
This file sets up the Express application, defines the port, and integrates the note routes. It uses `express.json()` for parsing JSON request bodies and `express.static()` to serve static files from the `src/public` directory.
```D:/express-api-collection/notes-api/src/index.js#L1-13
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('src/public'));

import noteRoutes from './routes/note.routes.js';
app.use('/notes', noteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### API Routes (`src/routes/note.routes.js`)
This file defines the API endpoints for notes and maps them to their respective controller functions. The `express.Router()` is used to create modular, mountable route handlers.
```D:/express-api-collection/notes-api/src/routes/note.routes.js#L1-10
import express from 'express';
const router = express.Router();
import { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from '../controllers/note.controller.js';

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
```

### Note Controller (`src/controllers/note.controller.js`)
This file contains the core logic for handling CRUD operations on notes. Notes are stored in a simple in-memory array.

### Get All Notes (`getAllNotes`)
This function retrieves and returns all notes currently stored in the `notes` array.
```D:/express-api-collection/notes-api/src/controllers/note.controller.js#L3-5
export const getAllNotes = (req, res) => {
  res.json({ success: true, data: notes });
};
```

### Get Note By ID (`getNoteById`)
This function extracts the `id` from the request parameters and searches for a matching note in the `notes` array. If a note is not found, it responds with a 404 error.
```D:/express-api-collection/notes-api/src/controllers/note.controller.js#L7-14
export const getNoteById = (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find(n => n.id === id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json({ success: true, data: note });
};
```

### Create Note (`createNote`)
This function validates that both `title` and `content` are present in the request body. It then constructs a `newNote` object with a unique ID (based on the current highest ID or 1 if no notes exist) and adds it to the `notes` array.
```D:/express-api-collection/notes-api/src/controllers/note.controller.js#L16-28
export const createNote = (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const newNote = {
    id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
    title,
    content
  };
  notes.push(newNote);
  res.status(201).json({ success: true, data: newNote });
};
```

### Update Note (`updateNote`)
This function attempts to find an existing note by its `id`. If found, it updates the note's `title` and `content` with the provided values from the request body. Basic validation ensures that `title` and `content` are not empty.
```D:/express-api-collection/notes-api/src/controllers/note.controller.js#L30-43
export const updateNote = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const noteIndex = notes.findIndex(n => n.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  notes[noteIndex] = { id, title, content };
  res.json({ success: true, data: notes[noteIndex] });
};
```

### Delete Note (`deleteNote`)
This function finds a note by its `id` and removes it from the `notes` array using `splice`. If the note is not found, it returns a 404 error.
```D:/express-api-collection/notes-api/src/controllers/note.controller.js#L45-54
export const deleteNote = (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  notes.splice(noteIndex, 1);
  res.json({ success: true, message: "Note deleted" });
};
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/notes`   | Get all notes |
| GET    | `/notes/:id` | Get single note by ID |
| POST   | `/notes`   | Create a new note |
| PUT    | `/notes/:id` | Update an existing note by ID |
| DELETE | `/notes/:id` | Delete a note by ID |

## Note Schema
```json
{
  "id": 1,
  "title": "Note Title",
  "content": "Note content..."
}
```

## Response Format
**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "..."
}
```
