# Mock Trade API

This folder contains a minimal FastAPI backend for the Mock Trade Booking project.

Quick start (development using SQLite):

1. Create a virtualenv and install requirements:

   python -m venv .venv; .\.venv\Scripts\activate; pip install -r app\requirements.txt

2. Run the API:

   set DATABASE_URL=sqlite:///./dev.db; uvicorn app.main:app --reload --port 8000

Using PostgreSQL locally with docker-compose:

1. Start services: docker compose up -d
2. Set DATABASE_URL env var to: postgresql+psycopg2://mockuser:mockpass@localhost:5432/mocktrade
3. Run API: uvicorn app.main:app --reload --port 8000

Notes:
- For production-grade DB migrations use Alembic; this project currently uses `Base.metadata.create_all` on startup for convenience.
- CORS allows common Vite dev ports (5173/3000). Adjust in `app/main.py` if different.
