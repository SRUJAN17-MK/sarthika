@echo off
echo ========================================
echo   Sarathi AI - Startup Script
echo   Snapdragon AI Lab Challenge
echo ========================================
echo.

echo [1/2] Starting Backend (FastAPI)...
cd backend
start "Sarathi AI Backend" cmd /k "python -m uvicorn main:app --reload --port 8000"
cd ..

echo [2/2] Starting Frontend (React)...
cd frontend
start "Sarathi AI Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   Sarathi AI is starting!
echo   
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
pause
