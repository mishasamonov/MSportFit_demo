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

### Запуск з кореня монорепо

```bash
npm run lint            # ESLint для client + server
npm run lint:fix        # автовиправлення в обох частинах
npm run typecheck       # перевірка типів в обох частинах
npm run check           # lint + typecheck разом
npm run build           # check + збірка client (Vite)
```

## 4. Git hooks

Для автоматичної перевірки коду перед кожним комітом використовується зв'язка **husky + lint-staged**.

- **husky** — менеджер Git-хуків, що дозволяє визначати скрипти для `pre-commit`, `pre-push` тощо.
- **lint-staged** — запускає лінтер лише на файлах, що потрапили до `git add` (staged), що значно пришвидшує перевірку.

### Як це працює

1. Розробник виконує `git commit`.
2. Husky перехоплює подію `pre-commit` і запускає `npx lint-staged`.
3. lint-staged знаходить staged-файли та застосовує правила з кореневого `package.json`:
   - `client/**/*.{js,jsx}` → `eslint --fix` з конфігурацією клієнта
   - `server/**/*.{js}` → `eslint --fix` з конфігурацією сервера
4. Якщо ESLint виявляє помилки, які неможливо автовиправити — коміт блокується.

### Налаштування

Залежності встановлюються в кореневому `package.json`:

```json
{
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^15.5.1"
  },
  "lint-staged": {
    "client/**/*.{js,jsx}": "npm --prefix client exec -- eslint --fix",
    "server/**/*.{js}": "npm --prefix server exec -- eslint --fix"
  }
}
```

Хук знаходиться у `.husky/pre-commit`:

```bash
npx lint-staged
```

## 5. Інтеграція з процесом збірки

Перед збіркою продакшн-бандлу автоматично виконуються всі перевірки якості коду. Це гарантує, що в білд не потраплять файли з помилками лінтера або типів.

Послідовність команд у скрипті `npm run build` (кореневий `package.json`):

```
npm run build
  └─ npm run check
  │    ├─ npm run lint       → ESLint (client + server)
  │    └─ npm run typecheck  → tsc --noEmit (client + server)
  └─ npm --prefix client run build  → Vite production build
```

| Скрипт | Опис |
|---|---|
| `npm run check` | Послідовно запускає `lint` + `typecheck` для обох частин |
| `npm run build` | Виконує `check`, і лише після успіху — збірку Vite |

Якщо будь-який крок завершується з помилкою (exit code ≠ 0), збірка зупиняється.

## 6. Статична типізація

Проєкт написаний на JavaScript, але використовує **TypeScript compiler (`tsc`)** у режимі `checkJs` для статичної перевірки типів без міграції на `.ts`/`.tsx`.

### Як це працює

У кожній частині проєкту (client, server) є файл `tsconfig.json` з налаштуванням:

```jsonc
{
  "compilerOptions": {
    "checkJs": true,       // перевіряти .js-файли
    "allowJs": true,       // дозволити .js
    "noEmit": true,        // не генерувати вихідних файлів
    "strict": false        // поступовий перехід — strict вимкнено
  }
}
```

Це дозволяє отримати базові перевірки типів (невірні аргументи, відсутні властивості, невідповідність типів) без переписування коду.

### Запуск

```bash
npm run typecheck              # з кореня — обидві частини
npm --prefix client run typecheck  # тільки client
npm --prefix server run typecheck  # тільки server
```

Скрипт `typecheck` у кожному під-проєкті виконує `tsc -p tsconfig.json`, що запускає компілятор у режимі перевірки (`--noEmit`).

У майбутньому планується поступова міграція на `.ts`/`.tsx` з увімкненням `strict: true`.
