const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Apply auth middleware to all task routes
router.use(auth);

// Create task
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.userId
    });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all tasks for user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).send();
    }
    
    res.send(task);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!task) {
      return res.status(404).send();
    }
    
    res.send(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;