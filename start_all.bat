@echo off
echo =======================================================
echo Starting Adaptive Learning Platform Servers
echo =======================================================

echo.
echo Starting Spring Boot Backend (Port 5000)...
start "Backend Server" cmd /k "cd backend-java && mvnw.cmd spring-boot:run"

echo.
echo Starting Vite Frontend (Port 5173)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting up in separate windows!
echo Once they are ready, you can access the app at http://localhost:5173
echo =======================================================
pause
