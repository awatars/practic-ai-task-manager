-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS tasks;

-- Create tasks table
CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'new'
                           CHECK (status IN ('new', 'in_progress', 'done')),
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Insert sample data
INSERT INTO tasks (title, description, status) VALUES
  ('Изучить React', 'Пройти базовый курс по React и хукам', 'in_progress'),
  ('Настроить PostgreSQL', 'Установить и настроить базу данных', 'done'),
  ('Написать REST API', 'Реализовать CRUD методы на Node.js + Express', 'new');
