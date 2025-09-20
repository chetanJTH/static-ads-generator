from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, HttpUrl
import replicate
import requests
import os
import logging
from typing import Optional
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

class RemoveBgRequest(BaseModel):
    image_url: HttpUrl
    
class RemoveBgResponse(BaseModel):
    task_id: str
    status: str
    message: str
    processed_url: Optional[str] = None
    original_url: str
    created_at: str
    processing_time: Optional[float] = None
    replicate_model_info: Optional[dict] = None

# In-memory storage for task status (in production, use Redis or database)
bg_removal_tasks = {}

@router.post("/remove-bg", response_model=RemoveBgResponse)
async def remove_background(request: RemoveBgRequest, background_tasks: BackgroundTasks):
    """
    Remove background from an image using Replicate's background removal model
    """
    try:
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Initialize task status
        bg_removal_tasks[task_id] = {
            "status": "processing",
            "original_url": str(request.image_url),
            "created_at": datetime.now().isoformat(),
            "processed_url": None,
            "error": None
        }
        
        # Start background processing
        background_tasks.add_task(
            process_background_removal, 
            task_id, 
            str(request.image_url)
        )
        
        logger.info(f"Started background removal task {task_id} for image: {request.image_url}")
        
        return RemoveBgResponse(
            task_id=task_id,
            status="processing",
            message="Background removal started. Use /remove-bg/status/{task_id} to check progress.",
            original_url=str(request.image_url),
            created_at=bg_removal_tasks[task_id]["created_at"]
        )
        
    except Exception as e:
        logger.error(f"Error starting background removal task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start background removal task: {str(e)}")

@router.get("/remove-bg/status/{task_id}", response_model=RemoveBgResponse)
async def get_bg_removal_status(task_id: str):
    """
    Get the status of a background removal task
    """
    if task_id not in bg_removal_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = bg_removal_tasks[task_id]
    
    return RemoveBgResponse(
        task_id=task_id,
        status=task["status"],
        message=get_status_message(task["status"], task.get("error")),
        processed_url=task.get("processed_url"),
        original_url=task["original_url"],
        created_at=task["created_at"],
        replicate_model_info={
            "model": "851-labs/background-remover",
            "version": "a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc",
            "description": "AI-powered background removal with high accuracy",
            "output_format": "PNG with transparency"
        }
    )

@router.post("/remove-bg/sync", response_model=RemoveBgResponse)
async def remove_background_sync(request: RemoveBgRequest):
    """
    Remove background from image synchronously (blocking request)
    Use this for immediate results
    """
    try:
        task_id = str(uuid.uuid4())
        
        logger.info(f"Starting synchronous background removal for image: {request.image_url}")
        
        # Process background removal synchronously
        result = await run_bg_removal_sync(str(request.image_url))
        
        return RemoveBgResponse(
            task_id=task_id,
            status="completed",
            message="Background removal completed successfully",
            processed_url=result["processed_url"],
            original_url=str(request.image_url),
            created_at=datetime.now().isoformat(),
            processing_time=result.get("processing_time"),
            replicate_model_info={
                "model": "851-labs/background-remover",
                "version": "a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc",
                "description": "AI-powered background removal with high accuracy",
                "output_format": "PNG with transparency",
                "suitable_for": ["Product photos", "Portraits", "eCommerce", "Social media"]
            }
        )
        
    except Exception as e:
        logger.error(f"Error in sync background removal: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Background removal failed: {str(e)}")

async def process_background_removal(task_id: str, image_url: str):
    """
    Background task to process background removal
    """
    try:
        logger.info(f"Processing background removal task {task_id}")
        
        # Update status to processing
        bg_removal_tasks[task_id]["status"] = "processing"
        
        # Run Replicate background removal
        result = await run_bg_removal_sync(image_url)
        
        # Update task with results
        bg_removal_tasks[task_id].update({
            "status": "completed",
            "processed_url": result["processed_url"],
            "completed_at": datetime.now().isoformat()
        })
        
        logger.info(f"Completed background removal task {task_id}")
        
    except Exception as e:
        logger.error(f"Error processing background removal task {task_id}: {str(e)}")
        bg_removal_tasks[task_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.now().isoformat()
        })

async def run_bg_removal_sync(image_url: str):
    """
    Run the actual background removal using Replicate
    """
    try:
        # Prepare input for Replicate
        input_data = {
            "image": image_url
        }
        
        logger.info(f"Running Replicate background removal with input: {input_data}")
        
        # Set Replicate API token from environment
        api_token = os.getenv("REPLICATE_API_TOKEN")
        if not api_token:
            raise Exception("REPLICATE_API_TOKEN environment variable not configured")
        
        replicate.api_token = api_token
        logger.info(f"Replicate token configured: {api_token[:8]}...")
        
        # Run the background removal model
        output = replicate.run(
            "851-labs/background-remover:a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc",
            input=input_data
        )
        logger.info(f"Replicate API call completed successfully")
        
        # Extract the URL from the output
        if hasattr(output, 'url'):
            processed_url = output.url()
        elif isinstance(output, str):
            processed_url = output
        elif isinstance(output, list) and len(output) > 0:
            processed_url = output[0] if isinstance(output[0], str) else output[0].url()
        else:
            raise ValueError(f"Unexpected output format from Replicate: {type(output)}")
        
        logger.info(f"Background removal completed. Result URL: {processed_url}")
        
        return {
            "processed_url": processed_url,
            "original_url": image_url
        }
        
    except Exception as e:
        logger.error(f"Replicate background removal error: {str(e)}")
        raise Exception(f"Background removal failed: {str(e)}")

def get_status_message(status: str, error: Optional[str] = None) -> str:
    """
    Get human-readable status message
    """
    messages = {
        "processing": "Removing background from image. This may take 30-60 seconds...",
        "completed": "Background removal completed successfully!",
        "failed": f"Background removal failed: {error}" if error else "Background removal failed"
    }
    return messages.get(status, "Unknown status")

@router.get("/remove-bg/debug")
async def debug_bg_removal_config():
    """
    Debug endpoint to check background removal configuration
    """
    try:
        config = {
            "replicate_token_configured": bool(os.getenv("REPLICATE_API_TOKEN")),
            "replicate_token_prefix": os.getenv("REPLICATE_API_TOKEN", "")[:8] + "..." if os.getenv("REPLICATE_API_TOKEN") else "Not set",
            "environment": os.getenv("ENVIRONMENT", "unknown"),
            "bg_removal_tasks_count": len(bg_removal_tasks),
            "model": "851-labs/background-remover",
            "version": "a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc"
        }
        return config
    except Exception as e:
        return {"error": str(e)}

@router.get("/remove-bg/tasks")
async def list_bg_removal_tasks():
    """
    List all background removal tasks (for debugging/monitoring)
    """
    return {
        "total_tasks": len(bg_removal_tasks),
        "tasks": bg_removal_tasks
    }

@router.delete("/remove-bg/tasks/{task_id}")
async def delete_bg_removal_task(task_id: str):
    """
    Delete a completed background removal task
    """
    if task_id not in bg_removal_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    del bg_removal_tasks[task_id]
    return {"message": f"Task {task_id} deleted successfully"}

from fastapi.responses import StreamingResponse
import io

@router.get("/remove-bg/download/{task_id}")
async def download_processed_image(task_id: str):
    """
    Download the processed image with proper headers
    """
    try:
        if task_id not in bg_removal_tasks:
            raise HTTPException(status_code=404, detail="Task not found")
        
        task = bg_removal_tasks[task_id]
        if task["status"] != "completed" or not task.get("processed_url"):
            raise HTTPException(status_code=400, detail="Processed image not available")
        
        # Fetch the image
        response = requests.get(task["processed_url"])
        response.raise_for_status()
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"kraftey_bg_removed_{timestamp}.png"
        
        # Return as streaming response with download headers
        return StreamingResponse(
            io.BytesIO(response.content),
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Content-Length": str(len(response.content)),
                "Cache-Control": "no-cache"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading processed image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to download image: {str(e)}")

@router.get("/remove-bg/compare/{task_id}")
async def get_comparison_data(task_id: str):
    """
    Get comparison data for before/after display
    """
    try:
        if task_id not in bg_removal_tasks:
            raise HTTPException(status_code=404, detail="Task not found")
        
        task = bg_removal_tasks[task_id]
        if task["status"] != "completed":
            raise HTTPException(status_code=400, detail="Background removal not completed")
        
        # Get image info
        original_info = {"url": task["original_url"], "type": "original"}
        processed_info = {"url": task["processed_url"], "type": "background_removed"}
        
        return {
            "task_id": task_id,
            "original": original_info,
            "processed": processed_info,
            "comparison": {
                "enhancement": "Background removed with AI precision",
                "format": "PNG with transparency",
                "quality": "High-resolution output",
                "use_cases": ["Product photography", "Portrait editing", "eCommerce", "Social media"]
            },
            "created_at": task["created_at"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting comparison data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get comparison data: {str(e)}")

# Health check for background removal service
@router.get("/remove-bg/health")
async def bg_removal_health_check():
    """
    Health check for the background removal service
    """
    try:
        # Check if Replicate API token is available
        has_token = bool(os.getenv("REPLICATE_API_TOKEN"))
        
        return {
            "status": "healthy" if has_token else "warning",
            "service": "background-removal",
            "replicate_configured": has_token,
            "active_tasks": len([t for t in bg_removal_tasks.values() if t["status"] == "processing"]),
            "total_tasks": len(bg_removal_tasks),
            "message": "Background removal service is ready" if has_token else "REPLICATE_API_TOKEN not configured",
            "model": "851-labs/background-remover"
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "background-removal",
            "error": str(e)
        }
