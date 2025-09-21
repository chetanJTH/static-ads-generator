from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import replicate
import os
import tempfile
import uuid
from services.cloud_storage import CloudStorageService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize cloud storage service
cloud_storage = CloudStorageService()

@router.post("/watermark-remover")
async def remove_watermark(file: UploadFile = File(...)):
    """
    Remove watermark from uploaded image using AI
    """
    try:
        logger.info(f"Received watermark removal request for file: {file.filename}")
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            logger.error(f"Invalid file type: {file.content_type}")
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Check file size (max 10MB)
        file_content = await file.read()
        file_size_mb = len(file_content) / (1024 * 1024)
        logger.info(f"File size: {file_size_mb:.2f}MB")
        
        if len(file_content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"watermark_input_{uuid.uuid4().hex}.{file_extension}"
        
        # Upload original image to Cloudinary first
        logger.info(f"Uploading original image to Cloudinary: {unique_filename}")
        try:
            original_image_url = await cloud_storage.upload_image_to_public_url(file_content, unique_filename)
            logger.info(f"Original image uploaded successfully: {original_image_url}")
        except Exception as e:
            logger.error(f"Cloudinary upload failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
        
        # Use Replicate to remove watermark
        logger.info("Starting watermark removal with Replicate...")
        logger.info(f"Using model: black-forest-labs/flux-kontext-dev")
        logger.info(f"Input image URL: {original_image_url}")
        
        try:
            # Use the simpler replicate.run method with timeout
            logger.info("Starting Replicate processing...")
            
            import asyncio
            import concurrent.futures
            
            def run_replicate():
                return replicate.run(
                    "black-forest-labs/flux-kontext-dev",
                    input={
                        "prompt": "remove watermark from image",
                        "go_fast": True,
                        "guidance": 2.5,
                        "input_image": original_image_url,
                        "aspect_ratio": "match_input_image",
                        "output_format": "jpg",
                        "output_quality": 80,
                        "num_inference_steps": 30
                    }
                )
            
            # Run with timeout
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(run_replicate)
                try:
                    # Wait up to 5 minutes for completion
                    output = future.result(timeout=300)
                    logger.info("Replicate processing completed successfully")
                except concurrent.futures.TimeoutError:
                    logger.error("Replicate processing timed out after 5 minutes")
                    raise HTTPException(status_code=408, detail="Processing timed out. Please try again with a smaller image.")
            
        except Exception as e:
            logger.error(f"Replicate processing failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
        
        # Get the processed image data
        try:
            logger.info("Getting processed image data...")
            logger.info(f"Output type: {type(output)}")
            logger.info(f"Output value: {output}")
            
            # Handle different output formats from Replicate
            if isinstance(output, str):
                # Output is a URL, download it
                import requests
                logger.info(f"Downloading from URL: {output}")
                response = requests.get(output)
                response.raise_for_status()
                processed_image_data = response.content
            elif hasattr(output, 'read'):
                # Output is a file-like object
                processed_image_data = output.read()
            elif hasattr(output, 'url'):
                # Output has a url attribute
                import requests
                logger.info(f"Downloading from URL: {output.url}")
                response = requests.get(output.url)
                response.raise_for_status()
                processed_image_data = response.content
            elif isinstance(output, bytes):
                # Output is already bytes
                processed_image_data = output
            else:
                logger.error(f"Unknown output format: {type(output)}")
                raise Exception(f"Unknown output format from Replicate: {type(output)}")
            
            logger.info(f"Downloaded {len(processed_image_data)} bytes")
            
        except Exception as e:
            logger.error(f"Failed to download processed image: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to download processed image: {str(e)}")
        
        # Upload processed image to Cloudinary
        processed_filename = f"watermark_removed_{uuid.uuid4().hex}.jpg"
        logger.info(f"Uploading processed image to Cloudinary: {processed_filename}")
        
        try:
            processed_image_url = await cloud_storage.upload_image_to_public_url(processed_image_data, processed_filename)
            logger.info(f"Processed image uploaded successfully: {processed_image_url}")
            
        except Exception as e:
            logger.error(f"Failed to upload processed image: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload processed image: {str(e)}")
        
        logger.info("Watermark removal process completed successfully")
        
        return JSONResponse(content={
            "success": True,
            "message": "Watermark removed successfully",
            "original_image": original_image_url,
            "processed_image": processed_image_url,
            "processing_time": "AI processing completed"
        })
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
        
    except replicate.exceptions.ReplicateError as e:
        logger.error(f"Replicate API error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
        
    except Exception as e:
        logger.error(f"Unexpected watermark removal error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")

@router.post("/watermark-remover/test")
async def test_watermark_endpoint(file: UploadFile = File(...)):
    """
    Simple test endpoint to check if file upload is working
    """
    try:
        logger.info(f"Test endpoint received file: {file.filename}")
        logger.info(f"Content type: {file.content_type}")
        
        file_content = await file.read()
        logger.info(f"File size: {len(file_content)} bytes")
        
        return JSONResponse(content={
            "success": True,
            "message": "File upload test successful",
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(file_content)
        })
        
    except Exception as e:
        logger.error(f"Test endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Test failed: {str(e)}")

@router.get("/watermark-remover/health")
async def watermark_remover_health():
    """
    Health check for watermark remover service
    """
    try:
        # Check if Replicate API token is configured
        replicate_token = os.getenv("REPLICATE_API_TOKEN")
        if not replicate_token:
            return JSONResponse(content={
                "status": "error",
                "message": "Replicate API token not configured"
            }, status_code=500)
        
        # Check if Cloudinary is configured
        cloudinary_configured = bool(os.getenv("CLOUDINARY_CLOUD_NAME"))
        if not cloudinary_configured:
            return JSONResponse(content={
                "status": "error", 
                "message": "Cloudinary not configured"
            }, status_code=500)
        
        return JSONResponse(content={
            "status": "healthy",
            "message": "Watermark remover service is ready",
            "model": "black-forest-labs/flux-kontext-dev",
            "replicate_configured": True,
            "cloudinary_configured": True
        })
        
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        return JSONResponse(content={
            "status": "error",
            "message": f"Health check failed: {str(e)}"
        }, status_code=500)
