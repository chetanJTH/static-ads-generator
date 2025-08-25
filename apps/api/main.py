from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routers import remove_bg, design_card, health

app = FastAPI(
    title="Static Ads Generator API",
    description="API for generating static ads with AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGINS", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(remove_bg.router, prefix="/remove-bg", tags=["remove-bg"])
app.include_router(design_card.router, prefix="/design-card", tags=["design-card"])

@app.get("/")
async def root():
    return {
        "message": "Static Ads Generator API",
        "version": "1.0.0",
        "docs": "/docs"
    }
