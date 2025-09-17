from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import os
import logging
from dotenv import load_dotenv
import time

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

# Security configuration
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1,kraftey.com,staticapi.kraftey.com").split(",")

app = FastAPI(
    title="Static Ads Generator API",
    description="API for generating static ads with AI",
    version="1.0.0",
    docs_url="/docs" if ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if ENVIRONMENT == "development" else None,
    openapi_url="/openapi.json" if ENVIRONMENT == "development" else None,
)

# Add trusted host middleware for security
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=ALLOWED_HOSTS if ENVIRONMENT == "production" else ["*"]
)

# Rate limiting middleware
class RateLimitMiddleware:
    def __init__(self, calls: int = 100, period: int = 60):
        self.calls = calls
        self.period = period
        self.clients = {}
    
    async def __call__(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean old entries
        self.clients = {
            ip: (count, timestamp) for ip, (count, timestamp) in self.clients.items()
            if current_time - timestamp < self.period
        }
        
        # Check rate limit
        if client_ip in self.clients:
            count, timestamp = self.clients[client_ip]
            if count >= self.calls:
                return JSONResponse(
                    status_code=429,
                    content={"error": "Rate limit exceeded. Please try again later."}
                )
            self.clients[client_ip] = (count + 1, timestamp)
        else:
            self.clients[client_ip] = (1, current_time)
        
        response = await call_next(request)
        return response

# Add rate limiting
app.add_middleware(RateLimitMiddleware, calls=100, period=60)

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

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
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
