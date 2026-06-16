const API_BASE = 'http://localhost:3001/tasks';

// Получить все задачи
export const fetchTasks = async () => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Не удалось загрузить задачи');
  return res.json();
};

// Создать новую задачу
export const createTask = async (title, description) => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Не удалось создать задачу');
  }
  return res.json();
};

// Обновить статус задачи
export const updateTaskStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Не удалось обновить статус');
  return res.json();
};

// Удалить задачу
export const deleteTask = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Не удалось удалить задачу');
  return res.json();
};
