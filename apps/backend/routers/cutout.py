from fastapi import APIRouter, UploadFile, File, HTTPException
from rembg import remove
from PIL import Image
import io
import base64
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

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
        
        # Remove background using rembg
        output_image = remove(input_image)
        
        # Convert to base64
        buffer = io.BytesIO()
        output_image.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return {"png_base64": img_str}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing background: {str(e)}")
