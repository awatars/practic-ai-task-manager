# AI Task Manager

Веб-приложение для управления задачами. Fullstack проект на React + Node.js + PostgreSQL.

## Технологии

| Слой | Технология |
|------|-----------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express |
| База данных | PostgreSQL |
| Python | psycopg2 (экспорт в CSV) |

## Структура проекта

```
practic/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── app.js              # Точка входа сервера
│   │   ├── config/db.js        # Подключение к PostgreSQL
│   │   ├── controllers/        # Бизнес-логика обработки запросов
│   │   └── routes/             # Маршруты API
│   ├── sql/init.sql            # SQL-скрипт создания таблицы
│   ├── .env                    # Переменные окружения (не в Git)
│   └── package.json
│
├── frontend/          # React приложение
│   ├── src/
│   │   ├── api/tasks.js        # HTTP-запросы к API
│   │   ├── components/         # React компоненты
│   │   └── App.jsx             # Главный компонент
│   └── package.json
│
└── python/
    └── export_tasks.py         # Экспорт задач в CSV
```

## Инструкция по запуску

### Требования

- Node.js v18+
- PostgreSQL 14+
- Python 3.8+
- Git

### 1. Клонирование репозитория

```bash
git clone https://github.com/awatars/practic-ai-task-manager.git
cd practic-ai-task-manager
```

### 2. Настройка PostgreSQL

Добавить `psql` в PATH (для macOS с официальным установщиком):

```bash
export PATH="/Library/PostgreSQL/18/bin:$PATH"
```

Создать базу данных (если не существует):

```bash
psql -U postgres -c "CREATE DATABASE practic;"
```

Инициализировать таблицу:

```bash
psql -U postgres -d practic -f backend/sql/init.sql
```

### 3. Настройка Backend

Создать файл `backend/.env` на основе шаблона:

```bash
cp backend/.env.example backend/.env
```

Указать в `.env` свои данные подключения к PostgreSQL.

Установить зависимости и запустить:

```bash
cd backend
npm install
npm run dev
```

API будет доступен на http://localhost:3001

### 4. Запуск Frontend

В новом окне терминала:

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на http://localhost:5173

### 5. Python — экспорт задач в CSV

```bash
cd python
pip3 install psycopg2-binary
python3 export_tasks.py
```

Файл `tasks_export_YYYYMMDD_HHMMSS.csv` будет создан в папке `python/`.

## REST API

| Метод | URL | Описание |
|-------|-----|---------|
| `GET` | `/tasks` | Получить все задачи |
| `POST` | `/tasks` | Создать задачу |
| `PUT` | `/tasks/:id` | Изменить статус задачи |
| `DELETE` | `/tasks/:id` | Удалить задачу |

### Примеры запросов

Создать задачу:

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Изучить React", "description": "Пройти базовый курс"}'
```

Изменить статус:

```bash
curl -X PUT http://localhost:3001/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

Допустимые статусы: `new`, `in_progress`, `done`

## Схема базы данных

```sql
CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'new'
                           CHECK (status IN ('new', 'in_progress', 'done')),
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);
```
