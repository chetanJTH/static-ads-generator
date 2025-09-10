from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import replicate
import requests
from PIL import Image, ImageDraw
import io
import base64
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

router = APIRouter()

class GenBgRequest(BaseModel):
    prompt: str
    width: int = 1080
    height: int = 1080

class MockGenerator:
    """Mock background generator that creates gradients when no API key is available"""
    
    @staticmethod
    def generate_gradient(width: int, height: int, prompt: str) -> str:
        """Generate a simple gradient based on the prompt"""
        # Create a gradient image
        image = Image.new('RGB', (width, height))
        draw = ImageDraw.Draw(image)
        
        # Simple gradient based on prompt length
        colors = [
            (255, 100, 100),  # Red
            (100, 255, 100),  # Green
            (100, 100, 255),  # Blue
            (255, 255, 100),  # Yellow
            (255, 100, 255),  # Magenta
            (100, 255, 255),  # Cyan
        ]
        
        color_index = len(prompt) % len(colors)
        color1 = colors[color_index]
        color2 = colors[(color_index + 1) % len(colors)]
        
        # Create gradient
        for y in range(height):
            ratio = y / height
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # Save to base64
        buffer = io.BytesIO()
        image.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return img_str

@router.post("/")
async def generate_background(request: GenBgRequest):
    """
    Generate background image from text prompt
    Uses Replicate FLUX if API token is available, otherwise returns mock gradient
    """
    try:
        replicate_token = os.getenv("REPLICATE_API_TOKEN")
        
        if replicate_token:
            # Use Replicate FLUX for real background generation
            try:
                output = replicate.run(
                    "stability-ai/flux:7c0f25c4c6c8e0b0c0c0c0c0c0c0c0c0c0c0c0c0",
                    input={
                        "prompt": request.prompt,
                        "width": request.width,
                        "height": request.height,
                        "num_outputs": 1
                    }
                )
                
                if output and len(output) > 0:
                    # Download the generated image
                    response = requests.get(output[0])
                    if response.status_code == 200:
                        # Convert to base64
                        img_str = base64.b64encode(response.content).decode()
                        return {"image_url": output[0], "image_base64": img_str}
                
            except Exception as e:
                print(f"Replicate API error: {e}")
                # Fall back to mock generator
        
        # Use mock generator (fallback or no API key)
        mock_gen = MockGenerator()
        img_base64 = mock_gen.generate_gradient(request.width, request.height, request.prompt)
        
        # Save mock image to storage for consistency
        storage_dir = os.getenv("STORAGE_DIR", "./uploads")
        filename = f"mock_bg_{uuid.uuid4()}.png"
        filepath = os.path.join(storage_dir, filename)
        
        # Decode and save
        img_data = base64.b64decode(img_base64)
        with open(filepath, 'wb') as f:
            f.write(img_data)
        
        image_url = f"/uploads/{filename}"
        
        return {"image_url": image_url, "image_base64": img_base64}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating background: {str(e)}")
