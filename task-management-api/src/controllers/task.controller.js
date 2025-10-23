// In-memory storage for tasks
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

// Controller functions
const getAllTasks = (req, res) => {
  res.json({ success: true, data: tasks });
};

const getTaskById = (req, res) => {
  const task = findTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }
  res.json({ success: true, data: task });
};

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

const updateTask = (req, res) => {
  const task = findTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }
  const { title, description, status, dueDate } = req.body;
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;
  if (dueDate !== undefined) updates.dueDate = dueDate;

  const validation = validateTask(updates);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.error });
  }

  Object.assign(task, updates);
  res.json({ success: true, data: task });
};

const deleteTask = (req, res) => {
  const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));
  if (taskIndex === -1) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }
  tasks.splice(taskIndex, 1);
  res.json({ success: true, message: 'Task deleted successfully' });
};

export {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};