// API base URL
const API_BASE = '/tasks';

// DOM elements
const taskForm = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Form submission
taskForm.addEventListener('submit', handleFormSubmit);

// Functions
async function loadTasks() {
  try {
    const response = await fetch(API_BASE);
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

function displayTasks(tasks) {
  tasksContainer.innerHTML = '';
  if (tasks.length === 0) {
    tasksContainer.innerHTML = '<p>No tasks found.</p>';
    return;
  }
  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    tasksContainer.appendChild(taskElement);
  });
}

function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = 'task-item';
  div.innerHTML = `
    <h3>${task.title}</h3>
    <p><strong>Description:</strong> ${task.description || 'N/A'}</p>
    <p><strong>Status:</strong> ${task.status}</p>
    <p><strong>Due Date:</strong> ${task.dueDate || 'N/A'}</p>
    <div class="task-actions">
      <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    </div>
  `;
  return div;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const status = document.getElementById('status').value;
  const dueDate = document.getElementById('dueDate').value;

  if (!title) {
    showError('Title is required');
    return;
  }

  const taskData = { title, description, status };
  if (dueDate) taskData.dueDate = dueDate;

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    const result = await response.json();
    if (result.success) {
      taskForm.reset();
      loadTasks();
    } else {
      showError(result.error);
    }
  } catch (error) {
    showError('Error creating task');
  }
}

async function editTask(id) {
  const newTitle = prompt('Enter new title:');
  if (!newTitle || !newTitle.trim()) return;

  const newDescription = prompt('Enter new description:');
  const newStatus = prompt('Enter new status (pending, in-progress, completed):');
  const newDueDate = prompt('Enter new due date (YYYY-MM-DD):');

  const updates = { title: newTitle.trim() };
  if (newDescription !== null) updates.description = newDescription.trim();
  if (newStatus && ['pending', 'in-progress', 'completed'].includes(newStatus)) {
    updates.status = newStatus;
  }
  if (newDueDate) updates.dueDate = newDueDate;

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const result = await response.json();
    if (result.success) {
      loadTasks();
    } else {
      showError(result.error);
    }
  } catch (error) {
    showError('Error updating task');
  }
}

async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (result.success) {
      loadTasks();
    } else {
      showError(result.error);
    }
  } catch (error) {
    showError('Error deleting task');
  }
}

function showError(message) {
  alert(`Error: ${message}`);
}