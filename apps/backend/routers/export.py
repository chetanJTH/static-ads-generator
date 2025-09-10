from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from PIL import Image
import base64
import io
import uuid
import os
from typing import Dict
from services.storage import StorageService
from services.layout import LayoutService
from services.color import ColorService
from models.recipe import CreativeRecipe, ExportPackRequest

router = APIRouter()

class ExportPackResponse(BaseModel):
    square_url: str
    story_url: str
    link_url: str

# Social media sizes
SIZES = {
    "square": (1080, 1080),
    "story": (1080, 1920),
    "link": (1200, 628)
}

@router.post("/pack")
async def export_pack(request: ExportPackRequest):
    """
    Export creative to multiple social media sizes
    """
    try:
        storage_service = StorageService()
        creative_id = str(uuid.uuid4())
        
        results = {}
        
        for size_name, (width, height) in SIZES.items():
            # Create recipe for this size
            size_recipe = CreativeRecipe(
                bgUrl=request.recipe.bgUrl,
                bgBase64=request.recipe.bgBase64,
                cutoutBase64=request.recipe.cutoutBase64,
                size=(width, height),
                textBlocks=request.recipe.textBlocks,
                layout=request.recipe.layout,
                palette=request.recipe.palette,
                fontFamily=request.recipe.fontFamily
            )
            
            # Compose image for this size
            image = await compose_for_size(size_recipe)
            
            # Save export
            export_url = storage_service.save_export(image, size_name, creative_id)
            results[f"{size_name}_url"] = export_url
        
        return ExportPackResponse(
            square_url=results["square_url"],
            story_url=results["story_url"],
            link_url=results["link_url"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting pack: {str(e)}")

async def compose_for_size(recipe: CreativeRecipe) -> Image.Image:
    """Compose image for specific size"""
    from routers.compose import load_background_image, load_base64_image, add_text_to_image
    
    # Load background image
    background_image = await load_background_image(recipe.bgUrl, recipe.bgBase64)
    
    # Resize background to target size
    target_width, target_height = recipe.size
    background_image = background_image.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Load product cutout
    cutout_image = load_base64_image(recipe.cutoutBase64)
    
    # Create composition
    composition = background_image.copy()
    
    # Calculate product position and size
    product_x, product_y, product_w, product_h = LayoutService.calculate_product_position(
        recipe.layout.preset,
        target_width,
        target_height,
        cutout_image.width,
        cutout_image.height
    )
    
    # Resize and paste product
    resized_cutout = cutout_image.resize((product_w, product_h), Image.Resampling.LANCZOS)
    composition.paste(resized_cutout, (product_x, product_y), resized_cutout)
    
    # Add text
    if recipe.textBlocks:
        # Convert text blocks to simple dict for add_text_to_image
        text_data = {}
        for block in recipe.textBlocks:
            text_data[block.kind] = block.text
        
        composition = add_text_to_image(
            composition,
            text_data,
            recipe.layout.preset,
            recipe.palette.dict() if recipe.palette else None
        )
    
    return composition
