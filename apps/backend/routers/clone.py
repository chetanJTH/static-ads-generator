from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import uuid
from models.recipe import CloneRequest, CreativeRecipe

router = APIRouter()

class CloneResponse(BaseModel):
    recipe: CreativeRecipe

@router.post("/")
async def clone_creative(request: CloneRequest):
    """
    Clone existing creative or load shared creative
    For demo purposes, this returns a mock recipe
    """
    try:
        if request.share_slug:
            # Load shared creative by slug
            # In a real implementation, you would:
            # 1. Look up the share record by slug
            # 2. Check if it's expired
            # 3. Load the creative and return its recipe
            
            # Mock implementation - return a sample recipe
            mock_recipe = CreativeRecipe(
                cutoutBase64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",  # 1x1 transparent PNG
                size=[1080, 1080],
                textBlocks=[],
                layout={
                    "preset": "text_left",
                    "productScale": 0.7,
                    "productOffsetX": 0.6,
                    "productOffsetY": 0.5
                },
                palette={
                    "fg": "#000000",
                    "bg": "#FFFFFF",
                    "accent": "#3B82F6"
                },
                fontFamily="Inter"
            )
            
            return CloneResponse(recipe=mock_recipe)
            
        elif request.creative_id:
            # Clone existing creative by ID
            # In a real implementation, you would:
            # 1. Load the creative from database
            # 2. Return its recipe
            
            # Mock implementation
            raise HTTPException(status_code=404, detail="Creative not found")
            
        else:
            raise HTTPException(status_code=400, detail="Either creative_id or share_slug must be provided")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error cloning creative: {str(e)}")
