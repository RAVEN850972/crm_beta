# 🚀 Инструкция по запуску и развертыванию Frontend CRM системы

## 📋 Содержание

1. [Требования к системе](#требования-к-системе)
2. [Локальная разработка](#локальная-разработка)
3. [Структура проекта](#структура-проекта)
4. [Настройка окружения](#настройка-окружения)
5. [Сборка для продакшена](#сборка-для-продакшена)
6. [Развертывание](#развертывание)
7. [Docker контейнеризация](#docker-контейнеризация)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Мониторинг и отладка](#мониторинг-и-отладка)
10. [Troubleshooting](#troubleshooting)

---

## 🔧 Требования к системе

### Минимальные требования:
- **Node.js** >= 16.14.0
- **npm** >= 8.0.0 или **yarn** >= 1.22.0
- **Git** >= 2.30.0
- **RAM** >= 4GB (для комфортной разработки)

### Рекомендуемые:
- **Node.js** >= 18.17.0
- **npm** >= 9.0.0
- **RAM** >= 8GB
- **SSD** диск

### Проверка версий:
```bash
node --version    # v18.17.0+
npm --version     # 9.0.0+
git --version     # 2.30.0+
```

---

## 💻 Локальная разработка

### 1. Клонирование репозитория
```bash
# Клонируем репозиторий
git clone https://github.com/your-org/crm-frontend.git
cd crm-frontend

# Или создаем новый проект
npx create-react-app crm-frontend --template typescript
cd crm-frontend
```

### 2. Установка зависимостей
```bash
# Устанавливаем все зависимости
npm install

# Или с yarn
yarn install

# Принудительная переустановка (если нужно)
rm -rf node_modules package-lock.json
npm install
```

### 3. Настройка переменных окружения
Создайте файл `.env.local` в корне проекта:

```bash
# .env.local
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
REACT_APP_SENTRY_DSN=your_sentry_dsn_here

# Для продакшена
REACT_APP_API_URL=https://your-api.com/api
REACT_APP_ENVIRONMENT=production
```

### 4. Запуск development сервера
```bash
# Запуск dev сервера
npm start

# Или с yarn
yarn start

# Сервер будет доступен по адресу: http://localhost:3000
```

### 5. Дополнительные команды разработки
```bash
# Запуск тестов
npm test

# Запуск тестов с coverage
npm run test:coverage

# Проверка линтера
npm run lint

# Автоисправление линтера
npm run lint:fix

# Проверка типов TypeScript
npm run type-check

# Анализ bundle размера
npm run analyze
```

---

## 📁 Структура проекта

```
crm-frontend/
├── public/                  # Статические файлы
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/                     # Исходный код
│   ├── components/          # React компоненты
│   │   ├── common/         # Общие компоненты
│   │   ├── layout/         # Layout компоненты
│   │   └── forms/          # Формы
│   ├── pages/              # Страницы приложения
│   │   ├── auth/          # Авторизация
│   │   ├── dashboard/     # Дашборд
│   │   ├── clients/       # Клиенты
│   │   ├── orders/        # Заказы
│   │   └── ...
│   ├── store/              # Redux store
│   │   ├── api/           # RTK Query API
│   │   └── slices/        # Redux slices
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Утилиты
│   ├── types/              # TypeScript типы
│   ├── styles/             # Глобальные стили
│   └── App.tsx             # Главный компонент
├── .env.example            # Пример переменных окружения
├── .gitignore
├── package.json
├── tailwind.config.js      # Конфигурация Tailwind
├── tsconfig.json           # Конфигурация TypeScript
└── README.md
```

---

## ⚙️ Настройка окружения

### Файлы конфигурации

#### `.env.example` (шаблон переменных окружения):
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws

# App Configuration
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
REACT_APP_APP_NAME=CRM Климат

# External Services
REACT_APP_SENTRY_DSN=
REACT_APP_GOOGLE_ANALYTICS_ID=
REACT_APP_YANDEX_MAPS_API_KEY=

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_PWA=false
REACT_APP_ENABLE_SENTRY=false

# Build Configuration
GENERATE_SOURCEMAP=true
REACT_APP_BUILD_TIME=
```

#### `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/pages/*": ["pages/*"],
      "@/hooks/*": ["hooks/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"],
      "@/store/*": ["store/*"]
    }
  },
  "include": [
    "src"
  ]
}
```

#### `tailwind.config.js` (расширенная конфигурация):
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Ваша кастомная конфигурация из предыдущего артефакта
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

---

## 🏗️ Сборка для продакшена

### 1. Production build
```bash
# Создание оптимизированной сборки
npm run build

# Проверка размера bundle
npm run analyze

# Локальный preview production сборки
npx serve -s build -l 3000
```

### 2. Оптимизация сборки

#### `.env.production`:
```bash
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
REACT_APP_ENABLE_SENTRY=true
```

#### Webpack оптимизации в `package.json`:
```json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false npm run build:prod",
    "build:prod": "react-scripts build",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    "build:stats": "npm run build -- --stats && npx webpack-bundle-analyzer build/static/js/bundle-stats.json"
  }
}
```

### 3. Pre-build оптимизации
```bash
# Очистка кэша
npm run clean

# Проверка кода
npm run lint
npm run type-check
npm test -- --coverage --passWithNoTests

# Сборка
npm run build
```

---

## 🚀 Развертывание

### Nginx конфигурация

#### `/etc/nginx/sites-available/crm-frontend`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Root directory
    root /var/www/crm-frontend/build;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket proxy
    location /ws/ {
        proxy_pass http://backend:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Ручное развертывание

#### Bash скрипт развертывания (`deploy.sh`):
```bash
#!/bin/bash

# Настройки
PROJECT_DIR="/var/www/crm-frontend"
BACKUP_DIR="/var/backups/crm-frontend"
NGINX_CONF="/etc/nginx/sites-available/crm-frontend"

echo "🚀 Начинаем развертывание CRM Frontend..."

# Создание backup
echo "📦 Создание backup..."
mkdir -p $BACKUP_DIR
if [ -d "$PROJECT_DIR" ]; then
    cp -r $PROJECT_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)
fi

# Обновление кода
echo "📥 Получение последней версии..."
cd $PROJECT_DIR
git fetch origin
git reset --hard origin/main

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm ci --production=false

# Сборка проекта
echo "🏗️ Сборка проекта..."
npm run build

# Настройка прав доступа
echo "🔐 Настройка прав доступа..."
chown -R www-data:www-data $PROJECT_DIR/build
chmod -R 755 $PROJECT_DIR/build

# Проверка и перезагрузка Nginx
echo "🔄 Перезагрузка Nginx..."
nginx -t && systemctl reload nginx

echo "✅ Развертывание завершено успешно!"
echo "🌐 Приложение доступно по адресу: https://your-domain.com"
```

Сделайте скрипт исполняемым:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🐳 Docker контейнеризация

### Multi-stage Dockerfile

#### `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false && npm cache clean --force

# Copy source code
COPY . .

# Build the application
ARG REACT_APP_API_URL
ARG REACT_APP_VERSION
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_VERSION=$REACT_APP_VERSION

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile        on;
    keepalive_timeout  65;
    
    # Gzip configuration
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    server {
        listen       80;
        server_name  localhost;
        
        root   /usr/share/nginx/html;
        index  index.html;
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
}
```

#### `docker-compose.yml`:
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        REACT_APP_API_URL: ${REACT_APP_API_URL}
        REACT_APP_VERSION: ${REACT_APP_VERSION}
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped
    depends_on:
      - backend
    networks:
      - crm-network

  backend:
    image: crm-backend:latest
    ports:
      - "8000:8000"
    networks:
      - crm-network

networks:
  crm-network:
    driver: bridge
```

### Команды Docker

```bash
# Сборка образа
docker build -t crm-frontend:latest .

# Запуск контейнера
docker run -d -p 3000:80 --name crm-frontend crm-frontend:latest

# Использование docker-compose
docker-compose up -d

# Обновление контейнера
docker-compose pull
docker-compose up -d --force-recreate

# Просмотр логов
docker-compose logs -f frontend

# Остановка
docker-compose down
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

#### `.github/workflows/deploy.yml`:
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linter
      run: npm run lint
      
    - name: Run type check
      run: npm run type-check
      
    - name: Run tests
      run: npm test -- --coverage --passWithNoTests
      
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      env:
        REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
        REACT_APP_VERSION: ${{ github.sha }}
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: build/

  docker:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha
          
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        build-args: |
          REACT_APP_API_URL=${{ secrets.REACT_APP_API_URL }}
          REACT_APP_VERSION=${{ github.sha }}

  deploy:
    needs: docker
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/crm-frontend
          docker-compose pull
          docker-compose up -d --force-recreate
          docker system prune -f
```

### GitLab CI/CD

#### `.gitlab-ci.yml`:
```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run lint
    - npm run type-check
    - npm test -- --coverage --passWithNoTests
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build/
    expire_in: 1 hour
  only:
    - main

docker:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $SERVER_HOST >> ~/.ssh/known_hosts
  script:
    - ssh $SERVER_USER@$SERVER_HOST "cd /var/www/crm-frontend && docker-compose pull && docker-compose up -d --force-recreate"
  only:
    - main
```

---

## 📊 Мониторинг и отладка

### 1. Логирование

#### Настройка Sentry:
```typescript
// src/utils/sentry.ts
import * as Sentry from "@sentry/react";

if (process.env.REACT_APP_ENABLE_SENTRY === 'true') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_ENVIRONMENT,
    tracesSampleRate: 1.0,
    beforeSend(event) {
      // Фильтрация ошибок в development
      if (process.env.NODE_ENV === 'development') {
        console.error('Sentry Error:', event);
        return null;
      }
      return event;
    },
  });
}
```

### 2. Performance мониторинг

#### Web Vitals:
```typescript
// src/utils/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const sendToAnalytics = (metric: any) => {
  if (process.env.REACT_APP_ENABLE_ANALYTICS === 'true') {
    // Отправка в Google Analytics или другую систему
    console.log('Performance metric:', metric);
  }
};

// Инициализация
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 3. Здоровье приложения

#### Health check endpoint:
```typescript
// src/utils/healthCheck.ts
export const performHealthCheck = async () => {
  const checks = {
    api: false,
    localStorage: false,
    performance: false,
  };

  try {
    // Проверка API
    const response = await fetch('/api/health/');
    checks.api = response.ok;

    // Проверка localStorage
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    checks.localStorage = true;

    // Проверка производительности
    checks.performance = window.performance.now() > 0;
  } catch (error) {
    console.error('Health check failed:', error);
  }

  return checks;
};
```

---

## 🔧 Troubleshooting

### Частые проблемы и решения

#### 1. **Ошибки установки зависимостей**
```bash
# Очистка кэша npm
npm cache clean --force

# Удаление node_modules и переустановка
rm -rf node_modules package-lock.json
npm install

# Использование точных версий
npm ci
```

#### 2. **Проблемы с TypeScript**
```bash
# Проверка конфигурации
npx tsc --noEmit

# Генерация типов
npm run type-check

# Очистка TypeScript кэша
rm -rf .tsbuildinfo
```

#### 3. **Ошибки сборки**
```bash
# Увеличение памяти для Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Анализ размера bundle
npm run analyze

# Debug сборки
npm run build -- --verbose
```

#### 4. **Проблемы с CORS**
Добавьте в `package.json`:
```json
{
  "proxy": "http://localhost:8000"
}
```

Или настройте в `src/setupProxy.js`:
```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );
};
```

#### 5. **Медленная сборка**
Оптимизация в `webpack.config.js`:
```javascript
module.exports = {
  resolve: {
    fallback: {
      "path": false,
      "fs": false
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

### Полезные команды диагностики

```bash
# Анализ производительности
npm run build -- --profile
npx webpack-bundle-analyzer build/static/js/*.js

# Проверка безопасности
npm audit
npm audit fix

# Обновление зависимостей
npx npm-check-updates -u
npm install

# Очистка всего
npm run clean
rm -rf node_modules package-lock.json .eslintcache
npm install
```

---

## 📚 Дополнительные ресурсы

### Документация
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Framer Motion](https://www.framer.com/motion/)

### Инструменты разработки
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Мониторинг
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay
- [New Relic](https://newrelic.com/) - Performance monitoring

---

## 🚀 Быстрый старт

```bash
# 1. Клонирование и установка
git clone <repository-url>
cd crm-frontend
npm install

# 2. Настройка окружения
cp .env.example .env.local
# Отредактируйте .env.local

# 3. Запуск development сервера
npm start

# 4. Сборка для продакшена
npm run build

# 5. Развертывание с Docker
docker-compose up -d
```

**🎉 Готово! Ваше приложение запущено и готово к работе.**