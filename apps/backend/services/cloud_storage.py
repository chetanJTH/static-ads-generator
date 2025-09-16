import requests
import base64
import os
import logging
from typing import Optional
import cloudinary
import cloudinary.uploader
import cloudinary.api
from io import BytesIO

logger = logging.getLogger(__name__)

class CloudStorageService:
    """Service for uploading images to public cloud storage for Replicate access"""
    
    def __init__(self):
        # Cloudinary configuration
        self.cloudinary_cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME", "")
        self.cloudinary_api_key = os.getenv("CLOUDINARY_API_KEY", "")
        self.cloudinary_api_secret = os.getenv("CLOUDINARY_API_SECRET", "")
        
        self.use_cloudinary = bool(self.cloudinary_cloud_name and self.cloudinary_api_key and self.cloudinary_api_secret)
        
        if self.use_cloudinary:
            # Configure Cloudinary
            cloudinary.config(
                cloud_name=self.cloudinary_cloud_name,
                api_key=self.cloudinary_api_key,
                api_secret=self.cloudinary_api_secret,
                secure=True
            )
            logger.info("Cloudinary configured successfully")
        else:
            logger.warning("Cloudinary not configured - file uploads will not work with Replicate")
        
    async def upload_image_to_public_url(self, image_data: bytes, filename: str) -> str:
        """
        Upload image to a public URL that Replicate can access
        """
        try:
            if self.use_cloudinary:
                return await self._upload_to_cloudinary(image_data, filename)
            else:
                # Fallback: suggest using a public URL
                raise Exception("Cloudinary not configured. Please use a public image URL instead.")
                
        except Exception as e:
            logger.error(f"Cloud upload failed: {str(e)}")
            raise Exception(f"Could not upload to public storage: {str(e)}")
    
    async def _upload_to_cloudinary(self, image_data: bytes, filename: str) -> str:
        """Upload to Cloudinary"""
        try:
            # Create a BytesIO object from image data
            image_buffer = BytesIO(image_data)
            
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                image_buffer,
                public_id=f"kraftey-upscaler/{filename.split('.')[0]}",
                folder="kraftey-upscaler",
                resource_type="image",
                quality="auto:best"
            )
            
            public_url = result.get('secure_url')
            if not public_url:
                raise Exception("No URL returned from Cloudinary")
            
            logger.info(f"Image uploaded to Cloudinary: {public_url}")
            return public_url
                
        except Exception as e:
            logger.error(f"Cloudinary upload error: {str(e)}")
            raise Exception(f"Cloudinary upload failed: {str(e)}")
    
    def get_service_status(self) -> dict:
        """Get cloud storage service status"""
        return {
            "cloudinary_configured": self.use_cloudinary,
            "cloud_name": self.cloudinary_cloud_name if self.use_cloudinary else None,
            "available_services": ["cloudinary"] if self.use_cloudinary else [],
            "recommendation": "Configure Cloudinary credentials for file uploads" if not self.use_cloudinary else "Cloudinary storage ready"
        }

# Alternative: Simple file hosting for development
class TempFileService:
    """Temporary solution for development - serves files locally but with public-like URLs"""
    
    def __init__(self, base_url: str = "http://127.0.0.1:8000"):
        self.base_url = base_url
    
    def create_public_url(self, filename: str) -> str:
        """Create a URL that looks public (for development only)"""
        return f"{self.base_url}/uploads/{filename}"
    
    def is_accessible_to_replicate(self, url: str) -> bool:
        """Check if URL is accessible to Replicate (external services)"""
        return not ("localhost" in url or "127.0.0.1" in url or "192.168." in url)
