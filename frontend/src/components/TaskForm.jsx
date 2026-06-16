import { useState } from 'react';
import { createTask } from '../api/tasks';

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Введите название задачи');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newTask = await createTask(title.trim(), description.trim());
      onTaskCreated(newTask);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-card">
      <h2>Новая задача</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task-title">Название</label>
          <input
            id="task-title"
            type="text"
            placeholder="Введите название задачи..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-description">Описание</label>
          <textarea
            id="task-description"
            placeholder="Подробное описание (необязательно)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={loading}
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="btn-create" disabled={loading}>
          {loading ? 'Создание...' : 'Создать задачу'}
        </button>
      </form>
    </div>
  );
}
