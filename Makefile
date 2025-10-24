.PHONY: start-backend start-frontend start-all

# Start FastAPI backend
start-backend:
	cd mock-trade-api && uvicorn app.main:app --reload
# Start React frontend
start-frontend:
	cd mock-trade-ui && npm run dev

# Start both frontend and backend
start-all:
	@echo "Starting backend..."
	cd mock-trade-api && nohup uvicorn app.main:app --reload > backend.log 2>&1 &
	@echo "Starting frontend..."
	cd mock-trade-ui && npm run dev