from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import os
from services.bg_gen import generate_background
from services.prompt_parse import parse_prompt
from services.compose import compose_card

router = APIRouter()

class DesignCardRequest(BaseModel):
    cutout_base64: str
    prompt: str
    size: dict

class DesignCardResponse(BaseModel):
    image_base64: str

@router.post("/", response_model=DesignCardResponse)
async def design_card(request: DesignCardRequest):
    """
    Generate a complete ad design from cutout and prompt
    """
    try:
        # Check if we should use end-to-end poster mode
        use_end_to_end = os.getenv("USE_END_TO_END_POSTER", "false").lower() == "true"
        
        if use_end_to_end:
            # Mode B: Generate full poster with model
            return await generate_end_to_end_poster(request)
        else:
            # Mode A: AI-assisted composition
            return await generate_ai_composition(request)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate design: {str(e)}")

async def generate_ai_composition(request: DesignCardRequest):
    """Mode A: Generate background + compose with product and text"""
    try:
        # Parse prompt to extract text and colors
        parsed = parse_prompt(request.prompt)
        
        # Generate background
        bg_image = generate_background(request.prompt, request.size["w"], request.size["h"])
        
        # Compose final card
        final_image = compose_card(
            bg_image=bg_image,
            cutout_base64=request.cutout_base64,
            parsed=parsed,
            size=(request.size["w"], request.size["h"])
        )
        
        # Convert to base64
        buffer = BytesIO()
        final_image.save(buffer, format='PNG')
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return DesignCardResponse(image_base64=image_base64)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Composition failed: {str(e)}")

async def generate_end_to_end_poster(request: DesignCardRequest):
    """Mode B: Generate full poster with model (placeholder)"""
    # For demo purposes, fall back to composition mode
    # In production, this would call the AI model directly
    return await generate_ai_composition(request)
