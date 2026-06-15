import uvicorn

if __name__ == "__main__":

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8001,
        reload=True
    )
    #cd gateway
#source venv_mac/bin/activate
#python -m uvicorn main:app --reload --port 8001