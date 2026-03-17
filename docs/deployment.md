# Документування розгортання — MSportFit

> Лабораторна робота 3 · Процедура повного розгортання застосунку

---

## Зміст

1. [Вимоги до середовища](#1-вимоги-до-середовища)
2. [Необхідне програмне забезпечення](#2-необхідне-програмне-забезпечення)
3. [Мережева топологія](#3-мережева-топологія)
4. [Налаштування PostgreSQL](#4-налаштування-postgresql)
5. [Розгортання коду](#5-розгортання-коду)
6. [Налаштування змінних середовища](#6-налаштування-змінних-середовища)
7. [Міграція бази даних та seed](#7-міграція-бази-даних-та-seed)
8. [Збірка клієнта](#8-збірка-клієнта)
9. [Налаштування Nginx](#9-налаштування-nginx)
10. [Запуск сервера через PM2](#10-запуск-сервера-через-pm2)
11. [Перевірка розгортання](#11-перевірка-розгортання)

---

## 1. Вимоги до середовища

| Параметр | Мінімум | Рекомендовано |
|----------|---------|---------------|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 1 ГБ | 2 ГБ |
| Диск | 10 ГБ | 20 ГБ (SSD) |
| ОС | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| Відкриті порти | 80, 443 | 80, 443 |

Внутрішні порти (не виставляються назовні):

- `3001` — Node.js API
- `5432` — PostgreSQL

---

## 2. Необхідне програмне забезпечення

### Node.js та npm

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # >= 20.x
npm -v    # >= 10.x
```

### PostgreSQL 15

```bash
sudo apt-get install -y postgresql-15 postgresql-client-15
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### Nginx

```bash
sudo apt-get install -y nginx
sudo systemctl enable nginx
```

### PM2 (менеджер процесів)

```bash
sudo npm install -g pm2
pm2 -v
```

### Git

```bash
sudo apt-get install -y git
```

---

## 3. Мережева топологія

```
Браузер
   │
   │  HTTPS :443 / HTTP :80
   ▼
┌─────────────────────────────────────┐
│              Nginx                  │
│                                     │
│  /          → /var/www/msportfit/   │  статичні файли client/dist
│              client/dist/           │
│                                     │
│  /api/*     → http://127.0.0.1:3001 │  reverse proxy → Node.js API
└─────────────────────────────────────┘
                    │
                    │ :3001
                    ▼
         ┌──────────────────┐
         │  Node.js/Express │
         │  (PM2)           │
         └──────────────────┘
                    │
                    │ DATABASE_URL
                    ▼
         ┌──────────────────┐
         │  PostgreSQL :5432│
         └──────────────────┘
```

---

## 4. Налаштування PostgreSQL

### 4.1. Створення користувача та бази даних

```bash
sudo -u postgres psql
```

```sql
CREATE USER msportfit WITH PASSWORD 'msportfit';
CREATE DATABASE msportfit OWNER msportfit;
GRANT ALL PRIVILEGES ON DATABASE msportfit TO msportfit;
\q
```

### 4.2. Перевірка підключення

```bash
psql -U msportfit -h 127.0.0.1 -d msportfit -c "SELECT version();"
```

Очікуваний результат — рядок з версією PostgreSQL без помилок.

---

## 5. Розгортання коду

### 5.1. Клонування репозиторію

```bash
sudo mkdir -p /var/www/msportfit
sudo chown $USER:$USER /var/www/msportfit
git clone https://github.com/<org>/msportfit_demo.git /var/www/msportfit
cd /var/www/msportfit
```

> Замініть `<org>` на реальний обліковий запис GitHub / GitLab.

### 5.2. Встановлення залежностей

```bash
# Кореневий рівень (husky, lint-staged тощо)
npm install

# Сервер
npm install --prefix server

# Клієнт
npm install --prefix client
```

---

## 6. Налаштування змінних середовища

Файл `server/env.example` містить шаблон усіх змінних:

```
PORT=3001
DATABASE_URL=postgresql://msportfit:msportfit@localhost:5432/msportfit?schema=public
JWT_SECRET=super_long_random_string_123456789
JWT_EXPIRES_IN=7d
```

Створіть робочий файл `.env` у директорії `server/`:

```bash
cp server/env.example server/.env
nano server/.env
```

Відредагуйте значення:

| Змінна | Що вказати |
|--------|------------|
| `PORT` | Залишити `3001` |
| `DATABASE_URL` | Рядок підключення PostgreSQL з реальним паролем |
| `JWT_SECRET` | Мінімум 32 символи, псевдовипадковий рядок |
| `JWT_EXPIRES_IN` | Строк дії токена, наприклад `7d` або `24h` |

Генерація безпечного `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> **Увага:** Файл `server/.env` додано до `.gitignore` — він ніколи не потрапить до репозиторію.

---

## 7. Міграція бази даних та seed

### 7.1. Генерація Prisma-клієнта

```bash
cd /var/www/msportfit
npx prisma generate --schema=server/prisma/schema.prisma
```

### 7.2. Застосування міграцій (production)

```bash
cd /var/www/msportfit/server
npx prisma migrate deploy
```

Команда `migrate deploy` (на відміну від `migrate dev`) застосовує лише вже наявні міграції без інтерактивного режиму — безпечно для CI/CD та production.

### 7.3. Наповнення початковими даними (опціонально)

```bash
cd /var/www/msportfit/server
node scripts/seed.js
```

---

## 8. Збірка клієнта

```bash
cd /var/www/msportfit
npm run build --prefix client
```

Артефакти збірки розміщуються в `client/dist/`. Nginx обслуговуватиме їх напряму.

---

## 9. Налаштування Nginx

### 9.1. Конфігурація віртуального хоста

Створіть файл `/etc/nginx/sites-available/msportfit`:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;   # замініть на реальний домен

    # Статичний фронтенд (React SPA)
    root /var/www/msportfit/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy → Node.js API
    location /api/ {
        proxy_pass         http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }
}
```

### 9.2. Активація конфігурації

```bash
sudo ln -s /etc/nginx/sites-available/msportfit /etc/nginx/sites-enabled/msportfit
sudo nginx -t                 # перевірка синтаксису
sudo systemctl reload nginx
```

### 9.3. HTTPS через Certbot (рекомендовано)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
sudo systemctl reload nginx
```

---

## 10. Запуск сервера через PM2

### 10.1. Запуск застосунку

```bash
cd /var/www/msportfit/server
pm2 start src/index.js --name msportfit-api --cwd /var/www/msportfit/server
```

### 10.2. Автозапуск після перезавантаження

```bash
pm2 save
pm2 startup
# Виконати команду, яку виведе PM2 (з sudo)
```

### 10.3. Корисні команди PM2

```bash
pm2 status                  # стан усіх процесів
pm2 logs msportfit-api      # переглянути логи
pm2 restart msportfit-api   # перезапустити
pm2 stop msportfit-api      # зупинити
```

---

## 11. Перевірка розгортання

### 11.1. Health-check API

```bash
curl -s http://localhost:3001/api/health
# Очікуваний результат: {"status":"ok"}
```

Через Nginx:

```bash
curl -s http://example.com/api/health
# Очікуваний результат: {"status":"ok"}
```

### 11.2. Перевірка статики

```bash
curl -s -o /dev/null -w "%{http_code}" http://example.com/
# Очікуваний код: 200
```

### 11.3. Перевірка реєстрації/входу

```bash
# Реєстрація
curl -s -X POST http://example.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}' | jq .

# Очікуваний результат: {"token":"<jwt>"}
```

### 11.4. Перевірка авторизованого запиту

```bash
TOKEN=$(curl -s -X POST http://example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}' | jq -r .token)

curl -s http://example.com/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .
# Очікуваний результат: {"id":"...","email":"test@example.com"}
```

### 11.5. Чеклист розгортання

- [ ] PostgreSQL запущено, база даних `msportfit` існує
- [ ] `server/.env` заповнено реальними значеннями
- [ ] Prisma-міграції застосовано (`prisma migrate deploy`)
- [ ] `client/dist/` містить зібраний фронтенд
- [ ] Nginx запущено, `nginx -t` не видає помилок
- [ ] PM2 процес `msportfit-api` у стані `online`
- [ ] `GET /api/health` повертає `{"status":"ok"}`
- [ ] SPA відкривається в браузері без 404
