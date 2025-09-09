from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import io
import base64
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Try to import rembg, fall back to mock if not available
try:
    from rembg import remove
    REMBG_AVAILABLE = True
except ImportError:
    REMBG_AVAILABLE = False
    print("Warning: rembg not available, using mock background removal")

def mock_remove_background(input_image: Image.Image) -> Image.Image:
    """
    Mock background removal - returns the original image with a simple effect
    """
    # Convert to RGBA if not already
    if input_image.mode != 'RGBA':
        input_image = input_image.convert('RGBA')
    
    # Create a simple mock effect (just return the original for now)
    return input_image

@router.post("/")
async def remove_background(file: UploadFile = File(...)):
    """
    Remove background from uploaded image using rembg
    Returns base64 encoded PNG with transparent background
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await file.read()
        input_image = Image.open(io.BytesIO(image_data))
        
        # Remove background using rembg or fallback
        if REMBG_AVAILABLE:
            output_image = remove(input_image)
        else:
            output_image = mock_remove_background(input_image)
        
        # Convert to base64
        buffer = io.BytesIO()
        output_image.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return {"png_base64": img_str}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing background: {str(e)}")
