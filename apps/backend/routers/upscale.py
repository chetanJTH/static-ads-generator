from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, HttpUrl
import replicate
import requests
import os
import logging
from typing import Optional
import tempfile
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

class UpscaleRequest(BaseModel):
    image_url: HttpUrl
    scale_factor: Optional[int] = 4  # Default 4x upscale
    
class UpscaleResponse(BaseModel):
    task_id: str
    status: str
    message: str
    upscaled_url: Optional[str] = None
    original_url: str
    scale_factor: int
    created_at: str

# In-memory storage for task status (in production, use Redis or database)
upscale_tasks = {}

@router.post("/upscale", response_model=UpscaleResponse)
async def upscale_image(request: UpscaleRequest, background_tasks: BackgroundTasks):
    """
    Upscale an image using Replicate's Recraft AI upscaling model
    """
    try:
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Initialize task status
        upscale_tasks[task_id] = {
            "status": "processing",
            "original_url": str(request.image_url),
            "scale_factor": request.scale_factor,
            "created_at": datetime.now().isoformat(),
            "upscaled_url": None,
            "error": None
        }
        
        # Start background processing
        background_tasks.add_task(
            process_upscale, 
            task_id, 
            str(request.image_url), 
            request.scale_factor
        )
        
        logger.info(f"Started upscale task {task_id} for image: {request.image_url}")
        
        return UpscaleResponse(
            task_id=task_id,
            status="processing",
            message="Image upscaling started. Use /upscale/status/{task_id} to check progress.",
            original_url=str(request.image_url),
            scale_factor=request.scale_factor,
            created_at=upscale_tasks[task_id]["created_at"]
        )
        
    except Exception as e:
        logger.error(f"Error starting upscale task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start upscale task: {str(e)}")

@router.get("/upscale/status/{task_id}", response_model=UpscaleResponse)
async def get_upscale_status(task_id: str):
    """
    Get the status of an upscale task
    """
    if task_id not in upscale_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = upscale_tasks[task_id]
    
    return UpscaleResponse(
        task_id=task_id,
        status=task["status"],
        message=get_status_message(task["status"], task.get("error")),
        upscaled_url=task.get("upscaled_url"),
        original_url=task["original_url"],
        scale_factor=task["scale_factor"],
        created_at=task["created_at"]
    )

@router.post("/upscale/sync", response_model=UpscaleResponse)
async def upscale_image_sync(request: UpscaleRequest):
    """
    Upscale an image synchronously (blocking request)
    Use this for smaller images or when you need immediate results
    """
    try:
        task_id = str(uuid.uuid4())
        
        logger.info(f"Starting synchronous upscale for image: {request.image_url}")
        
        # Process upscale synchronously
        result = await run_upscale_sync(str(request.image_url), request.scale_factor)
        
        return UpscaleResponse(
            task_id=task_id,
            status="completed",
            message="Image upscaling completed successfully",
            upscaled_url=result["upscaled_url"],
            original_url=str(request.image_url),
            scale_factor=request.scale_factor,
            created_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error in sync upscale: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upscale failed: {str(e)}")

async def process_upscale(task_id: str, image_url: str, scale_factor: int):
    """
    Background task to process image upscaling
    """
    try:
        logger.info(f"Processing upscale task {task_id}")
        
        # Update status to processing
        upscale_tasks[task_id]["status"] = "processing"
        
        # Run Replicate upscale
        result = await run_upscale_sync(image_url, scale_factor)
        
        # Update task with results
        upscale_tasks[task_id].update({
            "status": "completed",
            "upscaled_url": result["upscaled_url"],
            "completed_at": datetime.now().isoformat()
        })
        
        logger.info(f"Completed upscale task {task_id}")
        
    except Exception as e:
        logger.error(f"Error processing upscale task {task_id}: {str(e)}")
        upscale_tasks[task_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.now().isoformat()
        })

async def run_upscale_sync(image_url: str, scale_factor: int):
    """
    Run the actual upscaling using Replicate
    """
    try:
        # Check if REPLICATE_API_TOKEN is set
        if not os.getenv("REPLICATE_API_TOKEN"):
            raise ValueError("REPLICATE_API_TOKEN environment variable not set")
        
        # Prepare input for Replicate
        input_data = {
            "image": image_url
        }
        
        # Add scale factor if supported by the model
        if scale_factor and scale_factor != 4:
            # Note: The recraft-crisp-upscale model might have specific scale options
            # Check the model documentation for supported scale factors
            logger.info(f"Requested scale factor: {scale_factor}x (model default may override)")
        
        logger.info(f"Running Replicate upscale with input: {input_data}")
        
        # Run the upscaling model
        output = replicate.run(
            "recraft-ai/recraft-crisp-upscale",
            input=input_data
        )
        
        # Extract the URL from the output
        if hasattr(output, 'url'):
            upscaled_url = output.url()
        elif isinstance(output, str):
            upscaled_url = output
        elif isinstance(output, list) and len(output) > 0:
            upscaled_url = output[0] if isinstance(output[0], str) else output[0].url()
        else:
            raise ValueError(f"Unexpected output format from Replicate: {type(output)}")
        
        logger.info(f"Upscaling completed. Result URL: {upscaled_url}")
        
        return {
            "upscaled_url": upscaled_url,
            "original_url": image_url,
            "scale_factor": scale_factor
        }
        
    except Exception as e:
        logger.error(f"Replicate upscale error: {str(e)}")
        raise Exception(f"Upscaling failed: {str(e)}")

def get_status_message(status: str, error: Optional[str] = None) -> str:
    """
    Get human-readable status message
    """
    messages = {
        "processing": "Image is being upscaled. This may take 30-60 seconds...",
        "completed": "Image upscaling completed successfully!",
        "failed": f"Image upscaling failed: {error}" if error else "Image upscaling failed"
    }
    return messages.get(status, "Unknown status")

@router.get("/upscale/tasks")
async def list_upscale_tasks():
    """
    List all upscale tasks (for debugging/monitoring)
    """
    return {
        "total_tasks": len(upscale_tasks),
        "tasks": upscale_tasks
    }

@router.delete("/upscale/tasks/{task_id}")
async def delete_upscale_task(task_id: str):
    """
    Delete a completed upscale task
    """
    if task_id not in upscale_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    del upscale_tasks[task_id]
    return {"message": f"Task {task_id} deleted successfully"}

@router.post("/upscale/download")
async def download_upscaled_image(upscaled_url: HttpUrl):
    """
    Download and return the upscaled image
    """
    try:
        response = requests.get(str(upscaled_url))
        response.raise_for_status()
        
        # Return the image data
        return {
            "message": "Image downloaded successfully",
            "size_bytes": len(response.content),
            "content_type": response.headers.get("content-type", "image/webp")
        }
        
    except Exception as e:
        logger.error(f"Error downloading upscaled image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to download image: {str(e)}")

# Health check for upscale service
@router.get("/upscale/health")
async def upscale_health_check():
    """
    Health check for the upscale service
    """
    try:
        # Check if Replicate API token is available
        has_token = bool(os.getenv("REPLICATE_API_TOKEN"))
        
        return {
            "status": "healthy" if has_token else "warning",
            "service": "image-upscale",
            "replicate_configured": has_token,
            "active_tasks": len([t for t in upscale_tasks.values() if t["status"] == "processing"]),
            "total_tasks": len(upscale_tasks),
            "message": "Upscale service is ready" if has_token else "REPLICATE_API_TOKEN not configured"
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "image-upscale",
            "error": str(e)
        }
