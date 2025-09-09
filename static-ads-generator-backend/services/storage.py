import os
import base64
import uuid
from typing import Optional
from PIL import Image
import io

class StorageService:
    """Service for file storage operations"""
    
    def __init__(self, storage_dir: str = "./uploads"):
        self.storage_dir = storage_dir
        self.exports_dir = os.path.join(storage_dir, "exports")
        
        # Create directories if they don't exist
        os.makedirs(storage_dir, exist_ok=True)
        os.makedirs(self.exports_dir, exist_ok=True)
    
    def save_base64_image(self, base64_data: str, filename: Optional[str] = None) -> str:
        """Save base64 image data to file and return the file path"""
        if not filename:
            filename = f"{uuid.uuid4()}.png"
        
        filepath = os.path.join(self.storage_dir, filename)
        
        # Decode and save
        img_data = base64.b64decode(base64_data)
        with open(filepath, 'wb') as f:
            f.write(img_data)
        
        return f"/uploads/{filename}"
    
    def save_pil_image(self, image: Image.Image, filename: Optional[str] = None, format: str = "PNG") -> str:
        """Save PIL image to file and return the file path"""
        if not filename:
            filename = f"{uuid.uuid4()}.{format.lower()}"
        
        filepath = os.path.join(self.storage_dir, filename)
        image.save(filepath, format=format)
        
        return f"/uploads/{filename}"
    
    def save_export(self, image: Image.Image, size_name: str, creative_id: str) -> str:
        """Save export image with specific naming convention"""
        filename = f"export_{creative_id}_{size_name}_{uuid.uuid4()}.png"
        filepath = os.path.join(self.exports_dir, filename)
        image.save(filepath, format="PNG")
        
        return f"/uploads/exports/{filename}"
    
    def delete_file(self, filepath: str) -> bool:
        """Delete a file from storage"""
        try:
            # Remove /uploads prefix if present
            if filepath.startswith("/uploads/"):
                filepath = filepath[8:]  # Remove "/uploads/"
            
            full_path = os.path.join(self.storage_dir, filepath)
            if os.path.exists(full_path):
                os.remove(full_path)
                return True
            return False
        except Exception:
            return False
    
    def file_exists(self, filepath: str) -> bool:
        """Check if a file exists in storage"""
        try:
            if filepath.startswith("/uploads/"):
                filepath = filepath[8:]
            
            full_path = os.path.join(self.storage_dir, filepath)
            return os.path.exists(full_path)
        except Exception:
            return False
    
    def get_file_size(self, filepath: str) -> Optional[int]:
        """Get file size in bytes"""
        try:
            if filepath.startswith("/uploads/"):
                filepath = filepath[8:]
            
            full_path = os.path.join(self.storage_dir, filepath)
            if os.path.exists(full_path):
                return os.path.getsize(full_path)
            return None
        except Exception:
            return None
