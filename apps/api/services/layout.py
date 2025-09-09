from typing import Dict, Tuple, List
from models.recipe import LayoutRecipe, TextBlock

class LayoutService:
    """Service for managing layout presets and calculations"""
    
    # Layout presets with safe zones and positioning
    LAYOUT_PRESETS = {
        "text_left": {
            "productScale": 0.7,
            "productOffsetX": 0.6,
            "productOffsetY": 0.5,
            "textZones": [
                {"kind": "headline", "x": 0.08, "y": 0.2, "maxWidth": 0.4, "align": "left"},
                {"kind": "sub", "x": 0.08, "y": 0.4, "maxWidth": 0.4, "align": "left"},
                {"kind": "cta", "x": 0.08, "y": 0.7, "maxWidth": 0.4, "align": "left"}
            ]
        },
        "text_right": {
            "productScale": 0.7,
            "productOffsetX": 0.4,
            "productOffsetY": 0.5,
            "textZones": [
                {"kind": "headline", "x": 0.52, "y": 0.2, "maxWidth": 0.4, "align": "left"},
                {"kind": "sub", "x": 0.52, "y": 0.4, "maxWidth": 0.4, "align": "left"},
                {"kind": "cta", "x": 0.52, "y": 0.7, "maxWidth": 0.4, "align": "left"}
            ]
        },
        "top_bar": {
            "productScale": 0.6,
            "productOffsetX": 0.5,
            "productOffsetY": 0.6,
            "textZones": [
                {"kind": "headline", "x": 0.08, "y": 0.08, "maxWidth": 0.84, "align": "center"},
                {"kind": "cta", "x": 0.08, "y": 0.85, "maxWidth": 0.3, "align": "left"}
            ]
        },
        "bottom_bar": {
            "productScale": 0.6,
            "productOffsetX": 0.5,
            "productOffsetY": 0.4,
            "textZones": [
                {"kind": "headline", "x": 0.08, "y": 0.08, "maxWidth": 0.84, "align": "center"},
                {"kind": "sub", "x": 0.08, "y": 0.85, "maxWidth": 0.84, "align": "center"},
                {"kind": "cta", "x": 0.08, "y": 0.92, "maxWidth": 0.3, "align": "left"}
            ]
        }
    }
    
    @classmethod
    def get_layout_preset(cls, preset_name: str) -> Dict:
        """Get layout preset configuration"""
        if preset_name not in cls.LAYOUT_PRESETS:
            raise ValueError(f"Unknown layout preset: {preset_name}")
        return cls.LAYOUT_PRESETS[preset_name]
    
    @classmethod
    def create_text_blocks(cls, preset_name: str, text_data: Dict) -> List[TextBlock]:
        """Create text blocks based on layout preset and text data"""
        preset = cls.get_layout_preset(preset_name)
        text_blocks = []
        
        for zone in preset["textZones"]:
            kind = zone["kind"]
            if kind in text_data and text_data[kind].strip():
                text_block = TextBlock(
                    kind=kind,
                    text=text_data[kind],
                    x=zone["x"],
                    y=zone["y"],
                    maxWidth=zone["maxWidth"],
                    align=zone["align"]
                )
                text_blocks.append(text_block)
        
        return text_blocks
    
    @classmethod
    def calculate_product_position(cls, preset_name: str, canvas_width: int, canvas_height: int, product_width: int, product_height: int) -> Tuple[int, int, int, int]:
        """Calculate product position and size based on layout preset"""
        preset = cls.get_layout_preset(preset_name)
        
        # Calculate scaled product size
        target_height = int(canvas_height * preset["productScale"])
        scale_factor = target_height / product_height
        scaled_width = int(product_width * scale_factor)
        
        # Calculate position
        x = int(canvas_width * preset["productOffsetX"] - scaled_width / 2)
        y = int(canvas_height * preset["productOffsetY"] - target_height / 2)
        
        return x, y, scaled_width, target_height
