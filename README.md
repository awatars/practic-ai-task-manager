# AI Task Manager

Веб-приложение для управления задачами. Fullstack проект на React + Node.js + PostgreSQL с поддержкой Docker контейнеризации и экспорта данных с помощью Python.

## Технологии

| Слой | Технология |
|------|-----------|
| Frontend | React 19 + Vite + Nginx (в Docker) |
| Backend | Node.js + Express |
| База данных | PostgreSQL 16 |
| Python | psycopg2 (экспорт в CSV) |
| Контейнеризация | Docker + Docker Compose |

---

## Структура проекта и описание файлов

```text
practic/
├── Dockerfile.db          # Dockerfile для создания кастомного образа базы данных PostgreSQL с предустановленной схемой init.sql
├── docker-compose.yml     # Файл конфигурации Docker Compose для мультиконтейнерного запуска (БД, Backend, Frontend)
├── README.md              # Документация проекта (этот файл)
│
├── backend/               # Серверное приложение на Node.js + Express
│   ├── sql/
│   │   └── init.sql       # SQL-скрипт для инициализации структуры таблицы tasks в БД
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js      # Конфигурация пула подключений к PostgreSQL (pg)
│   │   ├── controllers/
│   │   │   └── tasks.js   # Контроллеры обработки запросов (бизнес-логика CRUD)
│   │   ├── routes/
│   │   │   └── tasks.js   # Описание маршрутов API (/tasks)
│   │   └── app.js         # Главная точка входа Express-приложения
│   ├── .dockerignore      # Файлы, игнорируемые при сборке Docker-образа Backend
│   ├── .env               # Переменные окружения для локального запуска (не для Git)
│   ├── .env.example       # Шаблон файла переменных окружения
│   ├── Dockerfile         # Dockerfile для сборки backend-контейнера на Node 22 Alpine
│   └── package.json       # Зависимости и скрипты запуска Backend
│
├── frontend/              # Клиентское приложение на React + Vite
│   ├── src/
│   │   ├── api/
│   │   │   └── tasks.js   # Функции для взаимодействия с REST API (axios)
│   │   ├── components/
│   │   │   ├── TaskForm.jsx   # Компонент формы добавления новой задачи
│   │   │   ├── TaskForm.css   # Стили для формы добавления
│   │   │   ├── TaskTable.jsx  # Таблица со списком задач, фильтрами, сменой статуса и удалением
│   │   │   └── TaskTable.css  # Стили для таблицы задач
│   │   ├── App.jsx        # Главный React-компонент, управляющий состоянием (тема оформления, список задач)
│   │   └── main.jsx       # Точка входа React (Vite-рендер)
│   ├── .dockerignore      # Файлы, игнорируемые при сборке Docker-образа Frontend
│   ├── .gitignore         # Игнорируемые файлы Git для фронтенда
│   ├── Dockerfile         # Multi-stage Dockerfile: сборка React-приложения и деплой в веб-сервер Nginx
│   ├── index.html         # HTML-шаблон приложения
│   ├── nginx.conf         # Конфигурация Nginx для корректной работы React SPA (маршрутизация)
│   ├── package.json       # Зависимости и скрипты сборки Frontend
│   └── vite.config.js     # Конфигурация сборщика Vite
│
└── python/                # Скрипт аналитики и экспорта
    └── export_tasks.py    # Python-скрипт для подключения к БД и экспорта задач в CSV-файл
```

---

## Способ 1. Запуск через Docker (Рекомендуемый)

Для этого способа вам нужны только **Docker** и **Docker Compose**. Устанавливать Node.js, PostgreSQL или настраивать переменные окружения вручную не требуется.

### Запуск проекта

1. Перейдите в корневую папку проекта:
   ```bash
   cd /Applications/practic
   ```

2. Запустите контейнеры в фоновом режиме:
   ```bash
   docker compose up --build -d
   ```
   *Команда скачает необходимые образы (PostgreSQL, Node, Nginx), соберет контейнеры и запустит их.*

3. Откройте приложение в браузере:
   - **Веб-интерфейс (Frontend):** [http://localhost](http://localhost)
   - **REST API (Backend):** [http://localhost:3001/tasks](http://localhost:3001/tasks)

### Полезные команды при работе с Docker

- **Просмотр статуса запущенных контейнеров:**
  ```bash
  docker ps
  ```
- **Просмотр логов backend:**
  ```bash
  docker logs task-manager-backend
  ```
- **Просмотр логов базы данных:**
  ```bash
  docker logs task-manager-db
  ```
- **Остановка всех контейнеров проекта:**
  ```bash
  docker compose down
  ```

---

## Способ 2. Локальный запуск (Без Docker)

### Требования
- Node.js v20+
- PostgreSQL v14+
- Python v3.8+

### 1. Настройка PostgreSQL
1. Убедитесь, что PostgreSQL запущен на вашем компьютере.
2. Создайте базу данных `practic`:
   ```bash
   psql -U postgres -c "CREATE DATABASE practic;"
   ```
3. Инициализируйте таблицы базы данных:
   ```bash
   psql -U postgres -d practic -f backend/sql/init.sql
   ```

### 2. Настройка и запуск Backend
1. Перейдите в директорию `backend`:
   ```bash
   cd backend
   ```
2. Создайте файл конфигурации `.env`:
   ```bash
   cp .env.example .env
   ```
3. Настройте параметры подключения к БД в файле `.env`.
4. Установите зависимости и запустите сервер в режиме разработки:
   ```bash
   npm install
   npm run dev
   ```
   *Backend будет запущен на [http://localhost:3001](http://localhost:3001)*

### 3. Настройка и запуск Frontend
1. В новом окне терминала перейдите в директорию `frontend`:
   ```bash
   cd ../frontend
   ```
2. Установите зависимости и запустите dev-сервер:
   ```bash
   npm install
   npm run dev
   ```
   *Frontend будет доступен на [http://localhost:5173](http://localhost:5173)*

### 4. Экспорт задач (Python)
Выгрузить текущие задачи из базы данных в файл CSV:
1. Перейдите в директорию `python`:
   ```bash
   cd ../python
   ```
2. Установите библиотеку для работы с PostgreSQL:
   ```bash
   pip install psycopg2-binary
   ```
3. Запустите скрипт экспорта:
   ```bash
   python export_tasks.py
   ```
   *В папке `python/` будет создан CSV файл вида `tasks_export_YYYYMMDD_HHMMSS.csv`.*

---

## REST API (Основные маршруты)

| Метод | URL | Описание |
|-------|-----|---------|
| `GET` | `/tasks` | Получить все задачи |
| `POST` | `/tasks` | Создать новую задачу |
| `PUT` | `/tasks/:id` | Обновить статус задачи (`new`, `in_progress`, `done`) |
| `DELETE` | `/tasks/:id` | Удалить задачу по ID |

---
