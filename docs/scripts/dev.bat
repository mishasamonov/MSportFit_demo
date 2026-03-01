@echo off
REM Скрипт для запуску середовища розробки (Windows)
REM Відкриває два окремих вікна cmd для server і client

setlocal

REM Визначаємо кореневу директорію проєкту (два рівні вище docs\scripts)
pushd "%~dp0..\.."
set ROOT_DIR=%CD%
popd

set SERVER_DIR=%ROOT_DIR%\server
set CLIENT_DIR=%ROOT_DIR%\client

echo =^> Піднімаємо Docker Compose (PostgreSQL)...
docker compose -f "%ROOT_DIR%\docker-compose.yml" up -d
if errorlevel 1 (
    echo [ERROR] docker compose up завершився з помилкою.
    exit /b 1
)

echo =^> Встановлюємо залежності server...
call npm install --prefix "%SERVER_DIR%"

echo =^> Встановлюємо залежності client...
call npm install --prefix "%CLIENT_DIR%"

REM Перевірка наявності server\.env
if not exist "%SERVER_DIR%\.env" (
    echo   [!] Файл server\.env не знайдено — копіюємо з server\env.example
    copy "%SERVER_DIR%\env.example" "%SERVER_DIR%\.env" >nul
    echo   [!] УВАГА: замініть JWT_SECRET у server\.env на власне секретне значення!
)

echo =^> Генеруємо Prisma Client...
cd /d "%SERVER_DIR%"
call npx prisma generate --schema="%SERVER_DIR%\prisma\schema.prisma"

echo =^> Застосовуємо міграції Prisma...
call npx prisma migrate dev --schema="%SERVER_DIR%\prisma\schema.prisma"

echo =^> Відкриваємо вікно server (npm run dev)...
start "msportfit-server" cmd /k "cd /d "%SERVER_DIR%" && npm run dev"

echo =^> Відкриваємо вікно client (npm run dev)...
start "msportfit-client" cmd /k "cd /d "%CLIENT_DIR%" && npm run dev"

echo.
echo   Сервер і клієнт запущені у окремих вікнах cmd.
echo   Закрийте ці вікна щоб зупинити процеси.

endlocal
