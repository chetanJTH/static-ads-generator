import os
import replicate
from PIL import Image, ImageDraw
import random
import re

def generate_background(prompt: str, width: int, height: int) -> Image.Image:
    """
    Generate background from prompt using Replicate FLUX or fallback gradient
    """
    api_token = os.getenv("REPLICATE_API_TOKEN")
    model_name = os.getenv("FLUX_MODEL", "black-forest-labs/flux-schnell:latest")
    
    if api_token:
        try:
            return generate_with_replicate(prompt, width, height, model_name)
        except Exception as e:
            print(f"Replicate generation failed: {e}")
            return generate_gradient_fallback(prompt, width, height)
    else:
        return generate_gradient_fallback(prompt, width, height)

def generate_with_replicate(prompt: str, width: int, height: int, model_name: str) -> Image.Image:
    """Generate background using Replicate FLUX"""
    output = replicate.run(
        model_name,
        input={
            "prompt": prompt,
            "width": width,
            "height": height,
            "num_frames": 1
        }
    )
    
    # Download the generated image
    import requests
    response = requests.get(output[0])
    image = Image.open(requests.get(output[0], stream=True).raw)
    return image.convert('RGBA')

def generate_gradient_fallback(prompt: str, width: int, height: int) -> Image.Image:
    """Generate a gradient background based on prompt keywords"""
    # Extract colors from prompt
    colors = extract_colors_from_prompt(prompt)
    
    # Create gradient
    image = Image.new('RGBA', (width, height))
    draw = ImageDraw.Draw(image)
    
    if len(colors) >= 2:
        # Create gradient between two colors
        for y in range(height):
            ratio = y / height
            r = int(colors[0][0] * (1 - ratio) + colors[1][0] * ratio)
            g = int(colors[0][1] * (1 - ratio) + colors[1][1] * ratio)
            b = int(colors[0][2] * (1 - ratio) + colors[1][2] * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
    else:
        # Single color background
        color = colors[0] if colors else (100, 150, 200)
        draw.rectangle([0, 0, width, height], fill=(*color, 255))
    
    return image

def extract_colors_from_prompt(prompt: str) -> list:
    """Extract colors from prompt text"""
    color_map = {
        'red': (255, 0, 0),
        'green': (0, 255, 0),
        'blue': (0, 0, 255),
        'yellow': (255, 255, 0),
        'purple': (128, 0, 128),
        'orange': (255, 165, 0),
        'pink': (255, 192, 203),
        'teal': (0, 128, 128),
        'gold': (255, 215, 0),
        'black': (0, 0, 0),
        'white': (255, 255, 255),
        'gray': (128, 128, 128),
        'grey': (128, 128, 128),
    }
    
    colors = []
    prompt_lower = prompt.lower()
    
    for color_name, rgb in color_map.items():
        if color_name in prompt_lower:
            colors.append(rgb)
    
    # If no colors found, return some defaults
    if not colors:
        colors = [(100, 150, 200), (200, 150, 100)]
    
    return colors[:2]  # Return max 2 colors for gradient
