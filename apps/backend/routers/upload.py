from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import uuid
import shutil
from pathlib import Path
import logging
from typing import Optional
from services.cloud_storage import CloudStorageService, TempFileService

logger = logging.getLogger(__name__)

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Initialize cloud storage service
cloud_storage = CloudStorageService()
temp_service = TempFileService()

# Allowed file types
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload an image file and return a URL for processing
    """
    try:
        # Validate file type
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file_extension} not allowed. Supported: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Check file size
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size ({len(file_content)} bytes) exceeds maximum allowed size ({MAX_FILE_SIZE} bytes)"
            )
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file locally first
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        
        # Try to upload to Cloudinary for public access (preferred for Replicate)
        file_url = None
        cloudinary_success = False
        
        try:
            if cloud_storage.use_cloudinary:
                # Upload to Cloudinary for better accessibility
                file_url = await cloud_storage.upload_image_to_public_url(file_content, unique_filename)
                cloudinary_success = True
                logger.info(f"File uploaded to Cloudinary: {file_url}")
            else:
                logger.info("Cloudinary not configured, using local storage")
        except Exception as cloud_error:
            logger.warning(f"Cloudinary upload failed, using local storage: {cloud_error}")
        
        # If Cloudinary failed or not configured, use local URL
        if not file_url:
            # Use the server's base URL for local files
            base_url = os.getenv("SERVER_BASE_URL", "https://staticapi.kraftey.com")
            file_url = f"{base_url}/uploads/{unique_filename}"
            logger.info(f"Using local file URL: {file_url}")
        
        logger.info(f"File uploaded successfully: {unique_filename}")
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "File uploaded successfully to Cloudinary" if cloudinary_success else "File uploaded successfully",
                "filename": unique_filename,
                "url": file_url,
                "size": len(file_content),
                "type": file.content_type,
                "cloud_storage": "cloudinary" if cloudinary_success else "local",
                "replicate_accessible": cloudinary_success
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/uploads/{filename}")
async def serve_uploaded_file(filename: str):
    """
    Serve uploaded files
    """
    try:
        file_path = UPLOAD_DIR / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Return file info (in production, you'd serve the actual file)
        return {
            "filename": filename,
            "exists": True,
            "size": file_path.stat().st_size,
            "url": f"/uploads/{filename}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error serving file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File access failed: {str(e)}")

@router.delete("/uploads/{filename}")
async def delete_uploaded_file(filename: str):
    """
    Delete an uploaded file
    """
    try:
        file_path = UPLOAD_DIR / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        file_path.unlink()
        
        logger.info(f"File deleted: {filename}")
        
        return {"message": f"File {filename} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@router.get("/upload/health")
async def upload_health_check():
    """
    Health check for upload service
    """
    try:
        # Check if upload directory is writable
        test_file = UPLOAD_DIR / "test.txt"
        test_file.write_text("test")
        test_file.unlink()
        
        return {
            "status": "healthy",
            "service": "file-upload",
            "upload_dir": str(UPLOAD_DIR),
            "max_file_size_mb": MAX_FILE_SIZE // 1024 // 1024,
            "allowed_extensions": list(ALLOWED_EXTENSIONS),
            "message": "Upload service is ready"
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "file-upload",
            "error": str(e)
        }

