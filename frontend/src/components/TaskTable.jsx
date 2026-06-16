import { updateTaskStatus, deleteTask } from '../api/tasks';

// Маппинг статусов на русские названия
const STATUS_LABELS = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Готово',
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
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td className="task-title">{task.title}</td>
              <td className="task-description">
                {task.description || '—'}
              </td>
              <td>
                <select
                  id={`status-select-${task.id}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="new">Новая</option>
                  <option value="in_progress">В работе</option>
                  <option value="done">Готово</option>
                </select>
              </td>
              <td>{formatDate(task.created_at)}</td>
              <td>
                <button
                  id={`delete-btn-${task.id}`}
                  className="btn-delete"
                  onClick={() => handleDelete(task.id, task.title)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
