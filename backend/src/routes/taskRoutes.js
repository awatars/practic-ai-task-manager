const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

// GET    /tasks        — get all tasks
router.get('/', getAllTasks);

// POST   /tasks        — create task
router.post('/', createTask);

// PUT    /tasks/:id    — update task status
router.put('/:id', updateTaskStatus);

// DELETE /tasks/:id    — delete task
router.delete('/:id', deleteTask);

module.exports = router;
