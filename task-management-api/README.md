# Task Management API

A simple Task Management API built with Node.js and Express, using in-memory storage with a static HTML/CSS/JS frontend.

## Features

- **In-memory task storage** (no database required)
- **Full CRUD operations**: Create, Read, Update, Delete tasks
- **Task fields**: id (auto-generated), title, description, status (pending/in-progress/completed), dueDate (optional)
- **Input validation**: Title required, status must be valid option
- **JSON API responses** with success/error messages
- **Static frontend** for task management UI
- **Responsive design** for mobile and desktop

## How It Works

- **Backend**: Express server serves API endpoints and static files from the `public` folder
- **Frontend**: HTML form for adding tasks, JavaScript uses Fetch API for CRUD operations
- **Data Storage**: Tasks stored in an in-memory array, persists only during server runtime

## Code Implementation

The application follows a clean MVC-like structure with separation between backend API and frontend UI.

### Backend Structure

- **`src/index.js`**: Initializes the Express app, sets up middleware for JSON parsing and static file serving, mounts task routes, and starts the server on port 3000
- **`src/routes/task.routes.js`**: Defines all task-related API endpoints using Express Router, delegating logic to controller functions
- **`src/controllers/task.controller.js`**: Contains all business logic including in-memory data storage, input validation, and CRUD operations with consistent JSON responses

### Frontend Structure

- **`public/index.html`**: Provides the basic HTML structure with a form for adding tasks and a container for displaying the task list
- **`public/styles.css`**: Contains responsive CSS styles for a clean, mobile-friendly interface with proper spacing and button styling
- **`public/app.js`**: Handles all frontend logic including loading tasks on page load, form submission, API calls for CRUD operations, and dynamic DOM updates

### Key Components

- **In-memory storage**: Array for tasks with auto-incrementing IDs
- **Validation functions**: Input checking for title and status
- **Consistent responses**: All endpoints return JSON with success/error format
- **Frontend integration**: Fetch API calls connect UI to backend

### Code Snippets

#### Server Setup (`src/index.js`)
```javascript
import express from 'express';
import taskRoutes from './routes/task.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Routes
app.use('/tasks', taskRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Task Management API running on port ${PORT}`);
});
```

#### Task Controller (`src/controllers/task.controller.js`)
```javascript
// In-memory storage
let tasks = [];
let nextId = 1;

// Helper functions
const generateId = () => nextId++;
const findTaskById = (id) => tasks.find(task => task.id === parseInt(id));

const validateTask = (task) => {
  if (!task.title || typeof task.title !== 'string' || task.title.trim() === '') {
    return { valid: false, error: 'Title is required and must be a non-empty string' };
  }
  if (task.status && !['pending', 'in-progress', 'completed'].includes(task.status)) {
    return { valid: false, error: 'Status must be pending, in-progress, or completed' };
  }
  return { valid: true };
};

// Example: Create task
const createTask = (req, res) => {
  const { title, description, status = 'pending', dueDate } = req.body;
  const validation = validateTask({ title, status });
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.error });
  }
  const newTask = {
    id: generateId(),
    title: title.trim(),
    description: description || '',
    status,
    dueDate
  };
  tasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
};
```

#### Routes (`src/routes/task.routes.js`)
```javascript
import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller.js';

const router = express.Router();

// Routes
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
```

#### Frontend API Calls (`public/app.js`)
```javascript
// Load tasks
async function loadTasks() {
  try {
    const response = await fetch('/tasks');
    const result = await response.json();
    if (result.success) {
      displayTasks(result.data);
    } else {
      showError('Failed to load tasks');
    }
  } catch (error) {
    showError('Error loading tasks');
  }
}

// Create task
async function handleFormSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  // ... validation
  const response = await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  // ... handle response
}
```

## Installation & Usage

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start` (runs on port 3000)
4. Open http://localhost:3000 in your browser to access the frontend
5. Use the form to add tasks, and buttons to edit/delete

## API Endpoints

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get single task by ID
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update existing task
- `DELETE /tasks/:id` - Delete task

## Technologies Used

- Node.js
- Express.js
- HTML/CSS/JavaScript (Vanilla)