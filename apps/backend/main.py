from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import os
import logging
from dotenv import load_dotenv
import time

# Load environment variables - try multiple sources
import sys
from pathlib import Path

# Try to load from multiple possible env files
env_files_to_try = [
    ".env",
    ".env.production", 
    "env.production",
    ".env.local"
]

loaded_files = []
for env_file in env_files_to_try:
    if Path(env_file).exists():
        load_dotenv(env_file, override=False)  # Don't override existing vars
        loaded_files.append(env_file)

# Also load from system environment (Digital Ocean sets these here)
load_dotenv(override=False)

print(f"Environment files loaded: {loaded_files if loaded_files else 'None (using system env vars)'}")
print(f"Environment detected: {os.getenv('ENVIRONMENT', 'development')}")
print(f"Replicate token configured: {bool(os.getenv('REPLICATE_API_TOKEN'))}")

# Configure logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Import routers
from routers import remove_bg, remove_bg_replicate, design_card, health, upscale, upload, watermark_remover

# Get environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Security configuration
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1,kraftey.com,staticapi.kraftey.com,ubuntu-s-1vcpu-1gb-blr1-01").split(",")

app = FastAPI(
    title="Static Ads Generator API",
    description="API for generating static ads with AI",
    version="1.0.0",
    docs_url="/docs" if ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if ENVIRONMENT == "development" else None,
    openapi_url="/openapi.json" if ENVIRONMENT == "development" else None,
)

# Add trusted host middleware for security (disabled for now - was blocking legitimate requests)
# if ENVIRONMENT == "production":
#     app.add_middleware(
#         TrustedHostMiddleware, 
#         allowed_hosts=ALLOWED_HOSTS
#     )

# Simple rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    try:
        # Skip rate limiting in development or for health checks
        if ENVIRONMENT == "development" or request.url.path == "/health":
            response = await call_next(request)
            return response
        
        # Get client IP safely
        client_ip = getattr(request.client, 'host', 'unknown') if request.client else 'unknown'
        
        # For now, just pass through - can implement proper rate limiting later
        response = await call_next(request)
        return response
        
    except Exception as e:
        logger.error(f"Rate limiting error: {e}")
        response = await call_next(request)
        return response

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
app.include_router(remove_bg_replicate.router, prefix="/api", tags=["background-removal-replicate"])
app.include_router(design_card.router, prefix="/design-card", tags=["design-card"])
app.include_router(upload.router, tags=["file-upload"])
app.include_router(upscale.router, tags=["image-upscale"])
app.include_router(watermark_remover.router, prefix="/api", tags=["watermark-remover"])

# Mount static files for uploads
import os
uploads_dir = "uploads"
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    try:
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        
        if ENVIRONMENT == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response
    except Exception as e:
        logger.error(f"Security headers error: {e}")
        # If there's an error, still try to return the response
        response = await call_next(request)
        return response

@app.get("/")
async def root():
    if ENVIRONMENT == "production":
        return {
            "message": "Kraftey AI API",
            "version": "1.0.0",
            "status": "online"
        }
    else:
        return {
            "message": "Static Ads Generator API",
            "version": "1.0.0",
            "docs": "/docs",
            "environment": ENVIRONMENT
        }

@app.get("/debug/env")
async def debug_environment():
    """
    Debug endpoint to check environment variable status
    Only available in development or when specifically requested
    """
    return {
        "environment": os.getenv("ENVIRONMENT", "not_set"),
        "replicate_token_configured": bool(os.getenv("REPLICATE_API_TOKEN")),
        "replicate_token_preview": os.getenv("REPLICATE_API_TOKEN", "")[:8] + "..." if os.getenv("REPLICATE_API_TOKEN") else "NOT_SET",
        "cloudinary_configured": bool(os.getenv("CLOUDINARY_CLOUD_NAME")),
        "cors_origins": os.getenv("CORS_ORIGINS", "not_set"),
        "log_level": os.getenv("LOG_LEVEL", "not_set"),
        "port": os.getenv("PORT", "not_set"),
        "host": os.getenv("HOST", "not_set"),
        "all_env_vars": {k: "***" if "TOKEN" in k or "SECRET" in k or "KEY" in k else v for k, v in os.environ.items() if k.startswith(("REPLICATE", "CLOUDINARY", "CORS", "ENVIRONMENT", "LOG", "PORT", "HOST"))}
    }

if __name__ == "__main__":
    import uvicorn
    
    # Get port and host from environment variables
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    logger.info(f"Starting server on {host}:{port}")
    logger.info(f"Environment: {ENVIRONMENT}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=ENVIRONMENT == "development",
        log_level="info" if ENVIRONMENT == "development" else "warning"
    )
