# Performance Profiling — MSportFit

## 1. Overview

Мета: виміряти базові показники продуктивності REST API, виявити найповільніші endpoint-и та визначити наступні кроки оптимізації.

Профілювання виконувалося на локальному середовищі (Node.js 18+, PostgreSQL через Prisma).

---

## 2. Tools Used

| Інструмент | Роль |
|---|---|
| `winston` + `winston-daily-rotate-file` | Структуроване JSON-логування (файли `logs/app-*.log`) |
| `requestContext` middleware | Присвоює `requestId` кожному запиту, header `X-Request-Id` |
| `requestLogger` middleware | Логує `durationMs` та `heapMemDelta` після кожної відповіді |
| Prisma `$on('query')` | Логує тривалість кожного SQL-запиту (`duration` у мс) |
| `server/scripts/benchmark.js` | HTTP-бенчмарк: 10 ітерацій на сценарій, `performance.now()` |
| `server/scripts/run-prof.js` | Запуск сервера з `--cpu-prof` або `--heap-prof` (Node.js V8) |

---

## 3. Key Performance Metrics

Метрики, що збираються при кожному запиті:

- **`durationMs`** — час від отримання запиту до відправки відповіді (`Date.now()`)
- **`heapMemDelta`** — зміна `heapUsed` між початком і кінцем запиту (байти)
- **Prisma `duration`** — час виконання SQL-запиту, що логується на рівні `debug`

Формат лог-запису (`logs/app-YYYY-MM-DD.log`):
```json
{
  "level": "info",
  "message": "Response sent",
  "module": "http",
  "requestId": "uuid",
  "method": "GET",
  "url": "/api/products",
  "statusCode": 200,
  "durationMs": 12,
  "heapMemDelta": 4096,
  "timestamp": "2026-03-09T..."
}
```

---

## 4. Test Scenarios

Бенчмарк (`npm run benchmark`, 10 ітерацій кожен):

| Сценарій | Авторизація |
|---|---|
| `GET /api/health` | — |
| `GET /api/products` | — |
| `GET /api/exercises` | — |
| `POST /api/auth/register` | — (унікальний email на кожну ітерацію) |
| `GET /api/favorites/products` | Bearer JWT (токен отримується одноразово) |

---

## 5. Benchmark Results

Середній час відповіді (avg), 10 ітерацій, локальне середовище:

| Endpoint | Avg (ms) |
|---|---|
| `GET /api/health` | 2.56 |
| `GET /api/exercises` | 3.56 |
| `GET /api/favorites/products` | 5.28 |
| `GET /api/products` | 11.91 |
| `POST /api/auth/register` | 81.85 |

---

## 6. Identified Hot Spots

1. **`POST /api/auth/register`** (81.85 ms) — найповільніший endpoint. Включає валідацію, bcrypt-хешування пароля та INSERT до бази даних. bcrypt є основним споживачем часу за своєю природою.

2. **`GET /api/products`** (11.91 ms) — найважчий серед GET endpoint-ів. Виконує `findMany` без пагінації: повертає всі записи з таблиці `Product`.

3. **`GET /api/favorites/products`** (5.28 ms) — використовує `include: { product: true }`, що генерує JOIN-запит і завантажує повні записи продуктів через `include: { product: true }`, що може створювати зайве навантаження при зростанні кількості обраних записів.

---

## 7. Findings

- `GET /api/health` (2.56 ms) — найшвидший endpoint: немає Prisma-запитів, лише статична відповідь JSON.
- `POST /api/auth/register` (81.85 ms) — найповільніший: основний час займає bcrypt-хешування, що є очікуваною поведінкою для безпечного зберігання паролів.
- `GET /api/products` (11.91 ms) — найважчий серед досліджених GET endpoint-ів, що звертаються до бази даних, оскільки виконує повний `findMany` без ліміту.
- Логування `durationMs`, `heapMemDelta` (через `requestLogger`) та Prisma query duration (через `$on('query')`) працює та пише структуровані JSON-записи у `server/logs/`.

---

## 8. Next Optimization Targets

1. **Пагінація для `GET /api/products` та `GET /api/exercises`** — додати параметри `limit` / `offset` або `cursor`-пагінацію; уникнути повного сканування таблиці.
2. **Спрощення запиту в `GET /api/favorites/products`** — замінити `include: { product: true }` на `select` з потрібними полями або виконати окремий запит лише за наявності записів.
3. **`select` замість зайвих `include`** — переглянути інші маршрути на наявність надмірних JOIN-ів, де потрібна лише частина полів.
4. **Lazy loading на frontend** (окремий етап) — завантажувати продукти/вправи порціями замість повного списку при першому рендері.

---

## 9. Short Conclusion

Baseline-профілювання виявило, що всі GET endpoint-и мають прийнятний час відповіді (< 12 ms). Єдиний суттєвий bottleneck — `POST /api/auth/register` (81.85 ms), зумовлений bcrypt, а не запитами до бази. Найвищий пріоритет — введення пагінації для `products` та `exercises`, що зменшить навантаження при зростанні даних.
