const pool = require('../config/db');

// Получение всех задач
const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении задач:', error.message);
    res.status(500).json({ error: 'Не удалось получить задачи' });
  }
};

// Создание новой задачи
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Название задачи обязательно' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status)
       VALUES ($1, $2, 'new')
       RETURNING *`,
      [title.trim(), description?.trim() || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании задачи:', error.message);
    res.status(500).json({ error: 'Не удалось создать задачу' });
  }
};

// Обновление статуса задачи
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'in_progress', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Некорректный статус. Допустимые: ${validStatuses.join(', ')}`,
      });
    }

    const result = await pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении задачи:', error.message);
    res.status(500).json({ error: 'Не удалось обновить задачу' });
  }
};

// Удаление задачи
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    res.status(200).json({ message: 'Задача удалена', task: result.rows[0] });
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error.message);
    res.status(500).json({ error: 'Не удалось удалить задачу' });
  }
};

module.exports = { getAllTasks, createTask, updateTaskStatus, deleteTask };
