#!/bin/bash
# Start FastAPI Gateway
cd "$(dirname "$0")/gateway"
echo "Starting FastAPI Gateway on port 8000..."

# Try to activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d "venv_mac" ]; then
    source venv_mac/bin/activate
fi

python run.py
