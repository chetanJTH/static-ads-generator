from PIL import Image
import numpy as np
from typing import Tuple, List
import colorsys

class ColorService:
    """Service for color analysis and contrast calculations"""
    
    @staticmethod
    def get_dominant_colors(image: Image.Image, num_colors: int = 5) -> List[Tuple[int, int, int]]:
        """Extract dominant colors from image using simple quantization"""
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize for faster processing
        small_image = image.resize((150, 150))
        pixels = np.array(small_image)
        
        # Reshape to list of pixels
        pixels = pixels.reshape(-1, 3)
        
        # Simple k-means clustering
        from sklearn.cluster import KMeans
        kmeans = KMeans(n_clusters=num_colors, random_state=42, n_init=10)
        kmeans.fit(pixels)
        
        # Get cluster centers (colors)
        colors = kmeans.cluster_centers_.astype(int)
        
        # Sort by frequency
        labels = kmeans.labels_
        color_counts = np.bincount(labels)
        sorted_indices = np.argsort(color_counts)[::-1]
        
        return [tuple(colors[i]) for i in sorted_indices]
    
    @staticmethod
    def rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
        """Convert RGB tuple to hex string"""
        return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
    
    @staticmethod
    def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
        """Convert hex string to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    @staticmethod
    def get_luminance(rgb: Tuple[int, int, int]) -> float:
        """Calculate relative luminance of RGB color"""
        r, g, b = rgb
        r = r / 255.0
        g = g / 255.0
        b = b / 255.0
        
        # Apply gamma correction
        r = r ** 2.2 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
        g = g ** 2.2 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
        b = b ** 2.2 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    
    @staticmethod
    def get_contrast_ratio(color1: Tuple[int, int, int], color2: Tuple[int, int, int]) -> float:
        """Calculate contrast ratio between two colors"""
        lum1 = ColorService.get_luminance(color1)
        lum2 = ColorService.get_luminance(color2)
        
        lighter = max(lum1, lum2)
        darker = min(lum1, lum2)
        
        return (lighter + 0.05) / (darker + 0.05)
    
    @staticmethod
    def is_wcag_compliant(color1: Tuple[int, int, int], color2: Tuple[int, int, int], level: str = "AA") -> bool:
        """Check if contrast ratio meets WCAG guidelines"""
        ratio = ColorService.get_contrast_ratio(color1, color2)
        
        if level == "AA":
            return ratio >= 4.5
        elif level == "AAA":
            return ratio >= 7.0
        else:
            return ratio >= 3.0  # Level A
    
    @staticmethod
    def generate_palette(dominant_colors: List[Tuple[int, int, int]]) -> dict:
        """Generate a palette from dominant colors"""
        if not dominant_colors:
            # Default palette
            return {
                "fg": "#000000",
                "bg": "#FFFFFF",
                "accent": "#3B82F6"
            }
        
        # Use the most dominant color as background
        bg_color = dominant_colors[0]
        bg_hex = ColorService.rgb_to_hex(bg_color)
        
        # Find a good foreground color
        fg_color = ColorService.find_contrasting_color(bg_color, dominant_colors)
        fg_hex = ColorService.rgb_to_hex(fg_color)
        
        # Use second most dominant as accent
        accent_color = dominant_colors[1] if len(dominant_colors) > 1 else dominant_colors[0]
        accent_hex = ColorService.rgb_to_hex(accent_color)
        
        return {
            "fg": fg_hex,
            "bg": bg_hex,
            "accent": accent_hex
        }
    
    @staticmethod
    def find_contrasting_color(background: Tuple[int, int, int], candidates: List[Tuple[int, int, int]]) -> Tuple[int, int, int]:
        """Find the best contrasting color from candidates"""
        best_contrast = 0
        best_color = (0, 0, 0)  # Default to black
        
        for candidate in candidates:
            contrast = ColorService.get_contrast_ratio(background, candidate)
            if contrast > best_contrast:
                best_contrast = contrast
                best_color = candidate
        
        # If no good contrast found, use black or white
        if best_contrast < 3.0:
            bg_luminance = ColorService.get_luminance(background)
            if bg_luminance > 0.5:
                return (0, 0, 0)  # Black text on light background
            else:
                return (255, 255, 255)  # White text on dark background
        
        return best_color
