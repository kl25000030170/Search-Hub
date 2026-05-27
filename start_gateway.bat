@echo off
REM Start FastAPI Gateway
cd %~dp0\gateway
echo Starting FastAPI Gateway on port 8000...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)
python run.py
