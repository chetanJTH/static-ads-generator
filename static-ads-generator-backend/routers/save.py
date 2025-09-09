from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import uuid
from datetime import datetime
from models.recipe import SaveRequest, CreativeRecipe

router = APIRouter()

class SaveResponse(BaseModel):
    creative_id: str
    version_id: str

@router.post("/")
async def save_creative(request: SaveRequest):
    """
    Save creative to database
    For demo purposes, this returns mock IDs since we don't have Prisma set up yet
    """
    try:
        # Generate mock IDs
        creative_id = str(uuid.uuid4())
        version_id = str(uuid.uuid4())
        
        # In a real implementation, you would:
        # 1. Save the creative to the database using Prisma
        # 2. Create a version record
        # 3. Generate and save thumbnail if provided
        # 4. Return the actual IDs
        
        # Mock implementation
        print(f"Saving creative: {creative_id}")
        print(f"Recipe: {json.dumps(request.recipe.dict(), indent=2)}")
        
        return SaveResponse(
            creative_id=creative_id,
            version_id=version_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving creative: {str(e)}")
