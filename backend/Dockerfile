FROM node:22-alpine

WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

EXPOSE 3001

CMD ["node", "src/app.js"]
