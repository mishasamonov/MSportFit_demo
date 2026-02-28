# Linting та форматування коду — ЛР4

## 1. Обраний лінтер та причини вибору

Проєкт використовує зв'язку **ESLint + Prettier**:

| Інструмент | Призначення |
|---|---|
| **ESLint** | Статичний аналіз коду: пошук помилок, антипатернів, невикористаних змінних |
| **Prettier** | Автоматичне форматування: відступи, лапки, крапки з комою, довжина рядка |

### Плагіни по частинах проєкту

**Client (React SPA):**
- `eslint-plugin-react` / `eslint-plugin-react-hooks` — правила специфічні для React та хуків
- `eslint-plugin-import` — контроль імпортів (порядок, відсутні модулі)
- `eslint-plugin-jsx-a11y` — accessibility-перевірки JSX-елементів
- `eslint-plugin-prettier` — запуск Prettier як правила ESLint

**Server (Express + Prisma):**
- `eslint-plugin-n` — Node.js-специфічні правила (коректні API, шляхи)
- `eslint-plugin-security` — виявлення типових вразливостей (eval, regex DoS тощо). У форматі `.eslintrc` використовується конфігурація `recommended-legacy` (flat config використовує `recommended`)
- `eslint-plugin-prettier` — єдиний стиль форматування

## 2. Базові правила та пояснення

| Правило | Значення | Пояснення |
|---|---|---|
| `no-unused-vars` | `warn` (ігнорує `_`-префікс) | Попереджає про невикористані змінні, дозволяє `_req`, `_next` |
| `no-console` (client) | `warn` (дозволено `warn`, `error`) | Консольні логи не потрапляють у продакшн |
| `no-console` (server) | `off` | На сервері логування через console — норма |
| `react/prop-types` | `off` | Prop-types не потрібні — планується TypeScript |
| `react/react-in-jsx-scope` | `off` | React 18+ не вимагає імпорту React для JSX |
| `react-hooks/*` | `recommended` | Контроль правил хуків (залежності useEffect тощо) |
| `prettier/prettier` | `error` (через extend) | Невідформатований код = помилка лінтера |
| `security/detect-object-injection` | `off` | Занадто багато false-positives для Express-контролерів |
| `n/no-missing-require` | `off` | Prisma client генерується динамічно |

## 3. Інструкція запуску

### Client

```bash
cd client
npm run lint            # перевірка (0 warnings дозволено)
npm run lint:fix        # автовиправлення
npm run lint:report     # JSON-звіт → docs/eslint-client.json
npm run format          # форматування Prettier
npm run format:check    # перевірка форматування
npm run typecheck       # перевірка типів (tsc)
```

### Server

```bash
cd server
npm run lint            # перевірка (0 warnings дозволено)
npm run lint:fix        # автовиправлення
npm run lint:report     # JSON-звіт → docs/eslint-server.json
npm run format          # форматування Prettier
npm run format:check    # перевірка форматування
npm run typecheck       # перевірка типів (tsc)
```

## 4. Git hooks

> Планується інтеграція з husky + lint-staged для автоматичного запуску лінтера перед комітом.

## 5. Інтеграція з build

> Планується додавання ESLint-перевірки у CI/CD pipeline та в pre-build етап.

## 6. Статична типізація

> Наразі використовується `checkJs` через TypeScript compiler (`tsc`) для базової перевірки типів у `.js`-файлах. У майбутньому планується міграція на `.ts`/`.tsx`.
