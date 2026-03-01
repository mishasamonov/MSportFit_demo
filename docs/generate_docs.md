# Генерація JSDoc-документації

## Вимоги

- Node.js 18+
- Встановлені залежності в корені репозиторію (`npm install`)

## Як згенерувати документацію

### 1. Перейдіть у корінь репозиторію

Всі команди мають виконуватись саме з кореня монорепозиторію (`msportfit_demo/`), а не з `client/` чи `server/`.

```bash
cd msportfit_demo
```

### 2. Запустіть генерацію

```bash
npm run docs:build
```

Команда виконує два кроки автоматично:
1. **`docs:clean`** — видаляє попередню збірку (`docs/site/`), якщо вона існує.
2. **`jsdoc -c jsdoc.json`** — генерує HTML-документацію за конфігурацією `jsdoc.json`.

### 3. Результат

Після успішного виконання HTML-документація буде доступна у директорії:

```
docs/site/
```

Відкрийте `docs/site/index.html` у будь-якому браузері для перегляду.

---

## Архівування документації (Windows PowerShell)

Для здачі лабораторної роботи або передачі замовнику заархівуйте згенеровану документацію у zip-архів:

```powershell
Compress-Archive -Path docs/site/* -DestinationPath docs-site.zip -Force
```

Архів `docs-site.zip` буде створено у корені репозиторію.

> **Примітка:** директорія `docs/site/` додана до `.gitignore` і не комітиться в репозиторій. Для здачі використовуйте архів.

---

## Правила документування

### Загальний принцип

Документувати слід усі **публічні та експортовані інтерфейси**: функції, компоненти, middleware, фабрики роутерів, React-хуки, контексти, константи.

### Обов'язкові теги JSDoc

| Тег | Призначення | Обов'язковість |
|-----|-------------|----------------|
| Опис (перший рядок блоку) | Стислий опис того, що робить функція/модуль | Завжди |
| `@param {type} name - опис` | Кожен вхідний параметр | Для всіх функцій з параметрами |
| `@returns {type} опис` | Тип і зміст поверненого значення | Для всіх функцій, що щось повертають |
| `@throws {ErrorType} опис` | Виключення, які може кинути функція | Якщо функція кидає помилки |
| `@example` | Приклад виклику | Для публічних утиліт та хуків |
| `@typedef` | Визначення власного типу | Для складних об'єктів/структур |

### Приклад для функції-утиліти

```js
/**
 * Виконує HTTP-запит до API з автоматичним JWT-заголовком.
 *
 * @param {string} path - Шлях запиту (наприклад, `/api/auth/me`).
 * @param {object} [options={}] - Опції запиту.
 * @param {string} [options.method='GET'] - HTTP-метод.
 * @param {unknown} [options.body] - Тіло запиту (буде серіалізовано у JSON).
 * @returns {Promise<Response>} Відповідь fetch.
 * @example
 * const res = await apiFetch('/api/products', { method: 'GET' });
 */
export async function apiFetch(path, options = {}) { ... }
```

### Приклад для middleware (CommonJS / Express)

```js
/**
 * Express-middleware перевірки JWT Bearer токена.
 *
 * @param {import('express').Request} req - Об'єкт запиту.
 * @param {import('express').Response} res - Об'єкт відповіді.
 * @param {import('express').NextFunction} next - Функція переходу до наступного middleware.
 * @returns {void}
 */
function authMiddleware(req, res, next) { ... }
```
