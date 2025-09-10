from pydantic import BaseModel
from typing import List, Tuple, Literal, Optional

class TextBlock(BaseModel):
    kind: Literal["headline", "sub", "cta"]
    text: str
    x: float  # 0..1 normalized
    y: float  # 0..1 normalized
    maxWidth: float  # 0..1
    align: Literal["left", "center", "right"]

class LayoutRecipe(BaseModel):
    preset: Literal["text_left", "text_right", "top_bar", "bottom_bar"]
    productScale: float  # 0..1 of canvas height
    productOffsetX: float
    productOffsetY: float

class Palette(BaseModel):
    fg: str
    bg: str
    accent: str

class CreativeRecipe(BaseModel):
    bgUrl: Optional[str] = None
    bgBase64: Optional[str] = None
    cutoutBase64: str
    size: Tuple[int, int]  # width, height
    textBlocks: List[TextBlock]
    layout: LayoutRecipe
    palette: Optional[Palette] = None
    fontFamily: str = "Inter"

class RemoveBgRequest(BaseModel):
    file: bytes

class GenBgRequest(BaseModel):
    prompt: str
    width: int = 1080
    height: int = 1080

class ComposeRequest(BaseModel):
    bg_url: Optional[str] = None
    bg_base64: Optional[str] = None
    cutout_base64: str
    text: dict  # Simplified text structure
    layout_preset: str
    palette: Optional[dict] = None

class ExportPackRequest(BaseModel):
    recipe: CreativeRecipe

class SaveRequest(BaseModel):
    recipe: CreativeRecipe
    thumb_base64: Optional[str] = None

class CloneRequest(BaseModel):
    creative_id: Optional[str] = None
    share_slug: Optional[str] = None
