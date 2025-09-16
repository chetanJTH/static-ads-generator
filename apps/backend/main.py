from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Import routers
from routers import remove_bg, design_card, health, upscale, upload

# Get environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

app = FastAPI(
    title="Static Ads Generator API",
    description="API for generating static ads with AI",
    version="1.0.0",
    docs_url="/docs" if ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if ENVIRONMENT == "development" else None,
)

# Configure CORS
if ENVIRONMENT == "production":
    cors_origins = os.getenv("CORS_ORIGINS", "https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com").split(",")
else:
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:3002,https://kraftey.com,https://staticapi.kraftey.com").split(",")

# Log CORS configuration for debugging
logger.info(f"CORS Origins: {cors_origins}")
logger.info(f"Environment: {ENVIRONMENT}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
        "DNT",
        "User-Agent",
        "Referer",
        "sec-ch-ua",
        "sec-ch-ua-mobile",
        "sec-ch-ua-platform",
        "Connection",
        "Sec-Fetch-Dest",
        "Sec-Fetch-Mode",
        "Sec-Fetch-Site",
    ],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(remove_bg.router, prefix="/remove-bg", tags=["remove-bg"])
app.include_router(design_card.router, prefix="/design-card", tags=["design-card"])
app.include_router(upload.router, tags=["file-upload"])
app.include_router(upscale.router, tags=["image-upscale"])

# Mount static files for uploads
import os
uploads_dir = "uploads"
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {
        "message": "Static Ads Generator API",
        "version": "1.0.0",
        "docs": "/docs"
    }
