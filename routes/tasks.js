const express = require('express');
const router = express.Router();

let tasks = [];
let idCounter = 1;

// Get all tasks
router.get('/', (req, res) => {
  res.json(tasks);
});

// Create a new task
router.post('/', (req, res) => {
  const task = { id: idCounter++, ...req.body };
  tasks.push(task);
  res.status(201).json(task);
});

// Get a task by ID
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  task ? res.json(task) : res.status(404).json({ error: 'Task not found' });
});

// Update a task
router.put('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id == req.params.id);
  if (index !== -1) {
    tasks[index] = { id: parseInt(req.params.id), ...req.body };
    res.json(tasks[index]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Delete a task
router.delete('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id == req.params.id);
  if (index !== -1) {
    const deleted = tasks.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

module.exports = router;
