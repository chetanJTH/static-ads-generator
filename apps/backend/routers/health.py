from fastapi import APIRouter, HTTPException
import os
import psutil
import time
from datetime import datetime
import sys

router = APIRouter()

@router.get("/")
async def health_check():
    """Basic health check endpoint"""
    return {"ok": True, "timestamp": datetime.utcnow().isoformat()}

@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check with system information"""
    try:
        # System information
        system_info = {
            "ok": True,
            "timestamp": datetime.utcnow().isoformat(),
            "environment": os.getenv("ENVIRONMENT", "unknown"),
            "python_version": sys.version,
            "uptime_seconds": time.time() - psutil.boot_time(),
        }
        
        # Memory usage
        memory = psutil.virtual_memory()
        system_info["memory"] = {
            "total_gb": round(memory.total / (1024**3), 2),
            "available_gb": round(memory.available / (1024**3), 2),
            "used_percent": memory.percent
        }
        
        # Disk usage
        disk = psutil.disk_usage('/')
        system_info["disk"] = {
            "total_gb": round(disk.total / (1024**3), 2),
            "free_gb": round(disk.free / (1024**3), 2),
            "used_percent": round((disk.used / disk.total) * 100, 2)
        }
        
        # CPU usage
        system_info["cpu"] = {
            "count": psutil.cpu_count(),
            "usage_percent": psutil.cpu_percent(interval=1)
        }
        
        # Check if critical services are running
        system_info["services"] = {
            "rembg_available": check_rembg_availability(),
            "replicate_configured": bool(os.getenv("REPLICATE_API_TOKEN")),
        }
        
        return system_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@router.get("/ready")
async def readiness_check():
    """Kubernetes-style readiness check"""
    try:
        # Check if all required services are ready
        checks = {
            "rembg": check_rembg_availability(),
            "environment": bool(os.getenv("ENVIRONMENT")),
            "cors_origins": bool(os.getenv("CORS_ORIGINS")),
        }
        
        all_ready = all(checks.values())
        
        if all_ready:
            return {"ready": True, "checks": checks}
        else:
            raise HTTPException(status_code=503, detail={"ready": False, "checks": checks})
            
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Readiness check failed: {str(e)}")

def check_rembg_availability():
    """Check if rembg is available and working"""
    try:
        from rembg import remove
        return True
    except ImportError:
        return False
    except Exception:
        return False
