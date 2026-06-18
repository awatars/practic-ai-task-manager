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

  // Подсчёт задач по статусам для шапки
  const countByStatus = (status) => tasks.filter((t) => t.status === status).length;

  return (
    <div className="app">
      {/* Фоновые анимированные элементы */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="app-container">
        {/* Шапка с логотипом и статистикой */}
        <header className="app-header">
          <div className="header-logo">
            <span className="logo-icon">&#x2B21;</span>
            <span className="logo-text">AI Task Manager</span>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">{countByStatus('new')}</span>
              <span className="stat-label">Новые</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value stat-yellow">{countByStatus('in_progress')}</span>
              <span className="stat-label">В работе</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value stat-green">{countByStatus('done')}</span>
              <span className="stat-label">Готово</span>
            </div>
          </div>
        </header>

        {/* Основной контент */}
        <main className="app-main">
          <div className="content-grid">
            <aside className="sidebar">
              <TaskForm onTaskCreated={handleTaskCreated} />
            </aside>

            <section className="tasks-section">
              <div className="section-header">
                <h1 className="section-title">Список задач</h1>
                <button
                  id="refresh-btn"
                  className="btn-refresh"
                  onClick={loadTasks}
                  title="Обновить список"
                >
                  &#8635;
                </button>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner" />
                  <p>Загрузка задач...</p>
                </div>
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
    </div>
  );
}
