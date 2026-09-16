import uvicorn
import os
import sys

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if __name__ == "__main__":
    print("=========================================================")
    print("  HDIMS Clinician Intelligence Engine — Python Backend  ")
    print("  Database: SQLite (database/hdims.db)                   ")
    print("  API Server: http://127.0.0.1:8000                     ")
    print("  Swagger Docs: http://127.0.0.1:8000/docs              ")
    print("=========================================================")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
