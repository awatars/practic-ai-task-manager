import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import { fetchTasks } from './api/tasks';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загрузка задач с сервера
  const loadTasks = async () => {
    try {
      setError('');
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError('Не удалось загрузить задачи. Убедитесь, что backend запущен.');
    } finally {
      setLoading(false);
    }
  };

  // Загружаем задачи при первом рендере
  useEffect(() => {
    loadTasks();
  }, []);

  // Обработчик создания задачи — добавляем в начало списка
  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  // Обработчик обновления — заменяем задачу в массиве
  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  // Обработчик удаления — убираем задачу из массива
  const handleTaskDeleted = (deletedId) => {
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Task Manager</h1>
      </header>

      <main className="app-main">
        <div className="content-grid">
          <aside className="sidebar">
            <TaskForm onTaskCreated={handleTaskCreated} />
          </aside>

          <section className="tasks-section">
            <div className="section-header">
              <h2>Список задач</h2>
              <button
                id="refresh-btn"
                className="btn-refresh"
                onClick={loadTasks}
              >
                Обновить
              </button>
            </div>

            {loading ? (
              <p>Загрузка задач...</p>
            ) : error ? (
              <div className="error-state">
                <span>{error}</span>
                <button onClick={loadTasks} className="btn-retry">Повторить</button>
              </div>
            ) : (
              <TaskTable
                tasks={tasks}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
