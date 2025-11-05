@echo off
echo 🔄 Restarting Zerodha Backend Server...
echo.

echo 🛑 Stopping existing server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo ⏳ Waiting for port to be free...
timeout /t 2 /nobreak >nul

echo 🚀 Starting server...
cd backend
npm start
