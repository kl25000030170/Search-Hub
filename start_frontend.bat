@echo off
REM Start React Frontend
cd %~dp0\frontend
echo Starting React Frontend on http://localhost:5173...
npm run dev
