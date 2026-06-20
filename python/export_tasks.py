#!/usr/bin/env python3
"""
export_tasks.py — Экспорт задач из PostgreSQL в CSV файл.
Использование: python3 export_tasks.py
"""

import csv
import os
from datetime import datetime

try:
    import psycopg2
except ImportError:
    print("Библиотека psycopg2 не установлена.")
    print("Выполните: pip3 install psycopg2-binary")
    exit(1)

# Настройки подключения к PostgreSQL
DB_CONFIG = {
    "host":     os.getenv("DB_HOST",     "localhost"),
    "port":     int(os.getenv("DB_PORT", "5432")),
    "user":     os.getenv("DB_USER",     "postgres"),
    "password": os.getenv("DB_PASSWORD", "VLAD.vlad2005%"),
    "dbname":   os.getenv("DB_NAME",     "practic"),
}

# Имя выходного файла с временной меткой
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
OUTPUT_FILE = f"tasks_export_{timestamp}.csv"


def main():
    print("Подключение к PostgreSQL...")

    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("Подключение успешно!")
    except psycopg2.OperationalError as e:
        print(f"Ошибка подключения: {e}")
        exit(1)

    try:
        # Получаем все задачи из таблицы
        cursor.execute("SELECT id, title, description, status, created_at FROM tasks ORDER BY id")
        rows = cursor.fetchall()
        total = len(rows)

        if total == 0:
            print("Задач в базе данных нет.")
            return

        print(f"Найдено задач: {total}")

        # Записываем данные в CSV файл
        with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)

            # Заголовок таблицы
            writer.writerow(["ID", "Название", "Описание", "Статус", "Дата создания"])

            # Построчная запись данных
            for row in rows:
                task_id, title, description, status, created_at = row
                writer.writerow([
                    task_id,
                    title,
                    description or "",
                    status,
                    created_at.strftime("%Y-%m-%d %H:%M:%S") if created_at else "",
                ])

        print(f"Экспорт завершен. Файл сохранен: {OUTPUT_FILE}")
        print(f"Всего записей: {total}")

    except psycopg2.Error as e:
        print(f"Ошибка при работе с БД: {e}")
    finally:
        cursor.close()
        conn.close()
        print("Соединение закрыто.")


if __name__ == "__main__":
    main()
