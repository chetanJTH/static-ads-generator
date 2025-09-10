import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import math

def compose_card(bg_image: Image.Image, cutout_base64: str, parsed: dict, size: tuple) -> Image.Image:
    """
    Compose final ad card with background, product cutout, and text
    """
    width, height = size
    
    # Create final image
    final_image = bg_image.copy()
    final_image = final_image.resize((width, height))
    
    # Load and position product cutout
    cutout_image = load_cutout(cutout_base64)
    if cutout_image:
        final_image = place_product(final_image, cutout_image)
    
    # Add text overlays
    final_image = add_text_overlays(final_image, parsed)
    
    return final_image

def load_cutout(cutout_base64: str) -> Image.Image:
    """Load cutout from base64"""
    try:
        image_data = base64.b64decode(cutout_base64)
        image = Image.open(BytesIO(image_data))
        return image.convert('RGBA')
    except Exception as e:
        print(f"Failed to load cutout: {e}")
        return None

def place_product(background: Image.Image, cutout: Image.Image) -> Image.Image:
    """Place product cutout on background"""
    bg_width, bg_height = background.size
    
    # Scale cutout to ~60% of canvas height
    target_height = int(bg_height * 0.6)
    aspect_ratio = cutout.width / cutout.height
    target_width = int(target_height * aspect_ratio)
    
    # Resize cutout
    cutout_resized = cutout.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Position on right side with some margin
    margin = int(bg_width * 0.05)
    x = bg_width - target_width - margin
    y = (bg_height - target_height) // 2
    
    # Create new image with cutout
    result = background.copy()
    result.paste(cutout_resized, (x, y), cutout_resized)
    
    return result

def add_text_overlays(image: Image.Image, parsed: dict) -> Image.Image:
    """Add text overlays to image"""
    draw = ImageDraw.Draw(image)
    width, height = image.size
    
    # Try to load a font, fall back to default
    try:
        # Try to use a system font
        font_large = ImageFont.truetype("arial.ttf", int(width * 0.06))
        font_medium = ImageFont.truetype("arial.ttf", int(width * 0.04))
        font_small = ImageFont.truetype("arial.ttf", int(width * 0.025))
    except:
        # Fall back to default font
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Colors
    fg_color = hex_to_rgb(parsed['colors']['fg'])
    accent_color = hex_to_rgb(parsed['colors']['accent'])
    
    # Add headline
    if parsed['headline']:
        x = int(width * 0.05)
        y = int(height * 0.1)
        draw_text_with_shadow(draw, parsed['headline'], (x, y), font_large, fg_color)
    
    # Add subline
    if parsed['subline']:
        x = int(width * 0.05)
        y = int(height * 0.25)
        draw_text_with_shadow(draw, parsed['subline'], (x, y), font_medium, fg_color)
    
    # Add CTA button
    if parsed['cta']:
        x = int(width * 0.05)
        y = int(height * 0.8)
        draw_cta_button(draw, parsed['cta'], (x, y), font_medium, accent_color)
    
    return image

def draw_text_with_shadow(draw: ImageDraw.Draw, text: str, pos: tuple, font: ImageFont.FreeTypeFont, color: tuple):
    """Draw text with shadow effect"""
    x, y = pos
    
    # Draw shadow
    shadow_offset = 3
    draw.text((x + shadow_offset, y + shadow_offset), text, font=font, fill=(0, 0, 0, 128))
    
    # Draw main text
    draw.text((x, y), text, font=font, fill=color)

def draw_cta_button(draw: ImageDraw.Draw, text: str, pos: tuple, font: ImageFont.FreeTypeFont, color: tuple):
    """Draw CTA button"""
    x, y = pos
    
    # Get text size
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Button padding
    padding_x = 20
    padding_y = 10
    
    # Button rectangle
    button_width = text_width + padding_x * 2
    button_height = text_height + padding_y * 2
    button_rect = [x, y, x + button_width, y + button_height]
    
    # Draw button background
    draw.rounded_rectangle(button_rect, radius=10, fill=color)
    
    # Draw text
    text_x = x + padding_x
    text_y = y + padding_y
    draw.text((text_x, text_y), text, font=font, fill=(255, 255, 255))

def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
