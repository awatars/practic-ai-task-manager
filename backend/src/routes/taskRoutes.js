const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

// Получить все задачи
router.get('/', getAllTasks);

// Создать задачу
router.post('/', createTask);

// Обновить статус задачи
router.put('/:id', updateTaskStatus);

// Удалить задачу
router.delete('/:id', deleteTask);

module.exports = router;
