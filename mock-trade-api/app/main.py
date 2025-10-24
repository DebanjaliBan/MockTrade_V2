from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import order,trade

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(order.router)
app.include_router(trade.router)

@app.get("/")
def root():
    return {"message": "Mock Trade API is running"}
