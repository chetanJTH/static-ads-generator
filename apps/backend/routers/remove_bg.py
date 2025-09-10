from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image

router = APIRouter()

class RemoveBgResponse(BaseModel):
    png_base64: str

# Try to import rembg, fall back to mock if not available
try:
    from rembg import remove
    REMBG_AVAILABLE = True
except ImportError:
    REMBG_AVAILABLE = False
    print("Warning: rembg not available, using mock background removal")

def mock_remove_background(input_image: Image.Image) -> Image.Image:
    """Mock background removal that returns the original image with transparency"""
    # Convert to RGBA if not already
    if input_image.mode != 'RGBA':
        input_image = input_image.convert('RGBA')
    
    # Create a simple mock by making white/light pixels transparent
    data = input_image.getdata()
    new_data = []
    
    for item in data:
        # If pixel is close to white/light, make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((item[0], item[1], item[2], 0))
        else:
            new_data.append(item)
    
    output_image = Image.new('RGBA', input_image.size)
    output_image.putdata(new_data)
    return output_image

@router.post("/", response_model=RemoveBgResponse)
async def remove_background(file: UploadFile = File(...)):
    """
    Remove background from uploaded image
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=422, detail="File must be an image")
        
        # Read image
        image_data = await file.read()
        input_image = Image.open(BytesIO(image_data))
        
        # Remove background
        if REMBG_AVAILABLE:
            output_image = remove(input_image)
        else:
            output_image = mock_remove_background(input_image)
        
        # Convert to base64
        buffer = BytesIO()
        output_image.save(buffer, format='PNG')
        png_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return RemoveBgResponse(png_base64=png_base64)
        
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to remove background: {str(e)}")
