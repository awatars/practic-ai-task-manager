import { updateTaskStatus, deleteTask } from '../api/tasks';
import './TaskTable.css';

// Маппинг статусов на русские названия и CSS-классы
const STATUS_CONFIG = {
  new: { label: 'Новая', cls: 'status-new' },
  in_progress: { label: 'В работе', cls: 'status-in-progress' },
  done: { label: 'Готово', cls: 'status-done' },
};

// Форматирование даты в читаемый вид
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TaskTable({ tasks, onTaskUpdated, onTaskDeleted }) {
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateTaskStatus(id, newStatus);
      onTaskUpdated(updated);
    } catch (err) {
      alert('Ошибка при обновлении статуса: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Удалить задачу "${title}"?`)) return;
    try {
      await deleteTask(id);
      onTaskDeleted(id);
    } catch (err) {
      alert('Ошибка при удалении: ' + err.message);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="tasks-empty">
        <p>Задач пока нет. Создайте первую!</p>
      </div>
    );
  }

  return (
    <div className="task-table-wrapper">
      <div className="task-table-header">
        <span className="task-count">{tasks.length} задач(а)</span>
      </div>
      <div className="task-table-scroll">
        <table className="task-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Статус</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const statusInfo = STATUS_CONFIG[task.status] || STATUS_CONFIG.new;
              return (
                <tr key={task.id} className="task-row">
                  <td className="task-id">{task.id}</td>
                  <td className="task-title">{task.title}</td>
                  <td className="task-description">
                    {task.description || <span className="no-desc">--</span>}
                  </td>
                  <td className="task-status-cell">
                    <span className={`status-badge ${statusInfo.cls}`}>
                      {statusInfo.label}
                    </span>
                    <select
                      id={`status-select-${task.id}`}
                      className="status-select"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="new">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="done">Готово</option>
                    </select>
                  </td>
                  <td className="task-date">{formatDate(task.created_at)}</td>
                  <td className="task-actions">
                    <button
                      id={`delete-btn-${task.id}`}
                      className="btn-delete"
                      onClick={() => handleDelete(task.id, task.title)}
                      title="Удалить задачу"
                    >
                      &#x2715;
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
