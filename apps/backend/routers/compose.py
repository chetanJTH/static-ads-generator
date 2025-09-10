from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from PIL import Image, ImageDraw, ImageFont
import base64
import io
import requests
import os
from typing import Optional, Dict
from services.layout import LayoutService
from services.color import ColorService
from services.storage import StorageService
from models.recipe import ComposeRequest

router = APIRouter()

class ComposeResponse(BaseModel):
    png_base64: str

@router.post("/")
async def compose_image(request: ComposeRequest):
    """
    Compose final ad image with background, product cutout, and text
    """
    try:
        # Initialize services
        storage_service = StorageService()
        
        # Load background image
        background_image = await load_background_image(request.bg_url, request.bg_base64)
        
        # Load product cutout
        cutout_image = load_base64_image(request.cutout_base64)
        
        # Get canvas dimensions from background
        canvas_width, canvas_height = background_image.size
        
        # Create composition
        composition = background_image.copy()
        
        # Calculate product position and size
        product_x, product_y, product_w, product_h = LayoutService.calculate_product_position(
            request.layout_preset,
            canvas_width,
            canvas_height,
            cutout_image.width,
            cutout_image.height
        )
        
        # Resize and paste product
        resized_cutout = cutout_image.resize((product_w, product_h), Image.Resampling.LANCZOS)
        composition.paste(resized_cutout, (product_x, product_y), resized_cutout)
        
        # Add text
        if request.text:
            composition = add_text_to_image(
                composition,
                request.text,
                request.layout_preset,
                request.palette
            )
        
        # Convert to base64
        buffer = io.BytesIO()
        composition.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return ComposeResponse(png_base64=img_str)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error composing image: {str(e)}")

async def load_background_image(bg_url: Optional[str], bg_base64: Optional[str]) -> Image.Image:
    """Load background image from URL or base64"""
    if bg_base64:
        return load_base64_image(bg_base64)
    elif bg_url:
        return await load_url_image(bg_url)
    else:
        # Create default white background
        return Image.new('RGB', (1080, 1080), (255, 255, 255))

def load_base64_image(base64_data: str) -> Image.Image:
    """Load image from base64 string"""
    img_data = base64.b64decode(base64_data)
    return Image.open(io.BytesIO(img_data))

async def load_url_image(url: str) -> Image.Image:
    """Load image from URL"""
    response = requests.get(url)
    response.raise_for_status()
    return Image.open(io.BytesIO(response.content))

def add_text_to_image(image: Image.Image, text_data: Dict, layout_preset: str, palette: Optional[Dict]) -> Image.Image:
    """Add text to image based on layout preset"""
    draw = ImageDraw.Draw(image)
    canvas_width, canvas_height = image.size
    
    # Get text blocks from layout service
    text_blocks = LayoutService.create_text_blocks(layout_preset, text_data)
    
    # Set up colors
    if palette:
        fg_color = ColorService.hex_to_rgb(palette.get("fg", "#000000"))
        bg_color = ColorService.hex_to_rgb(palette.get("bg", "#FFFFFF"))
    else:
        fg_color = (0, 0, 0)  # Default black
        bg_color = (255, 255, 255)  # Default white
    
    # Try to load font, fall back to default
    try:
        # You might need to adjust font path based on your system
        font_path = "arial.ttf"  # Default fallback
        if os.path.exists("/System/Library/Fonts/Arial.ttf"):  # macOS
            font_path = "/System/Library/Fonts/Arial.ttf"
        elif os.path.exists("C:/Windows/Fonts/arial.ttf"):  # Windows
            font_path = "C:/Windows/Fonts/arial.ttf"
        
        base_font = ImageFont.truetype(font_path, 40)
        large_font = ImageFont.truetype(font_path, 60)
        small_font = ImageFont.truetype(font_path, 30)
    except:
        base_font = ImageFont.load_default()
        large_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    for block in text_blocks:
        # Calculate position
        x = int(block.x * canvas_width)
        y = int(block.y * canvas_height)
        max_width = int(block.maxWidth * canvas_width)
        
        # Choose font based on text kind
        if block.kind == "headline":
            font = large_font
        elif block.kind == "cta":
            font = base_font
        else:
            font = small_font
        
        # Get text dimensions
        bbox = draw.textbbox((0, 0), block.text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Adjust position based on alignment
        if block.align == "center":
            x = x + (max_width - text_width) // 2
        elif block.align == "right":
            x = x + max_width - text_width
        
        # Add text shadow for better contrast
        shadow_offset = 2
        draw.text((x + shadow_offset, y + shadow_offset), block.text, font=font, fill=(128, 128, 128))
        
        # Draw main text
        draw.text((x, y), block.text, font=font, fill=fg_color)
    
    return image
