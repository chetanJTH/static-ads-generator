[1mdiff --git a/apps/api/ecosystem.config.js b/apps/api/ecosystem.config.js[m
[1mindex 324f557..57dfcfb 100644[m
[1m--- a/apps/api/ecosystem.config.js[m
[1m+++ b/apps/api/ecosystem.config.js[m
[36m@@ -1,7 +1,8 @@[m
 module.exports = {[m
   apps: [{[m
     name: 'static-ads-backend',[m
[31m-    script: 'main.py',[m
[32m+[m[32m    script: 'uvicorn',[m
[32m+[m[32m    args: 'main:app --host 0.0.0.0 --port 8000 --workers 1',[m
     interpreter: 'python3',[m
     cwd: '/root/static-ads-generator/apps/api',[m
     instances: 1,[m
[36m@@ -9,10 +10,10 @@[m [mmodule.exports = {[m
     watch: false,[m
     max_memory_restart: '1G',[m
     env: {[m
[31m-      NODE_ENV: 'development'[m
[32m+[m[32m      ENVIRONMENT: 'development'[m
     },[m
     env_production: {[m
[31m-      NODE_ENV: 'production',[m
[32m+[m[32m      ENVIRONMENT: 'production',[m
       PORT: 8000,[m
       HOST: '0.0.0.0'[m
     },[m
[1mdiff --git a/apps/api/models/__init__.py b/apps/api/models/__init__.py[m
[1mnew file mode 100644[m
[1mindex 0000000..f3d9f4b[m
[1m--- /dev/null[m
[1m+++ b/apps/api/models/__init__.py[m
[36m@@ -0,0 +1 @@[m
[32m+[m[32m# Models package[m
[1mdiff --git a/apps/api/models/recipe.py b/apps/api/models/recipe.py[m
[1mnew file mode 100644[m
[1mindex 0000000..80dbb68[m
[1m--- /dev/null[m
[1m+++ b/apps/api/models/recipe.py[m
[36m@@ -0,0 +1,58 @@[m
[32m+[m[32mfrom pydantic import BaseModel[m
[32m+[m[32mfrom typing import List, Tuple, Literal, Optional[m
[32m+[m
[32m+[m[32mclass TextBlock(BaseModel):[m
[32m+[m[32m    kind: Literal["headline", "sub", "cta"][m
[32m+[m[32m    text: str[m
[32m+[m[32m    x: float  # 0..1 normalized[m
[32m+[m[32m    y: float  # 0..1 normalized[m
[32m+[m[32m    maxWidth: float  # 0..1[m
[32m+[m[32m    align: Literal["left", "center", "right"][m
[32m+[m
[32m+[m[32mclass LayoutRecipe(BaseModel):[m
[32m+[m[32m    preset: Literal["text_left", "text_right", "top_bar", "bottom_bar"][m
[32m+[m[32m    productScale: float  # 0..1 of canvas height[m
[32m+[m[32m    productOffsetX: float[m
[32m+[m[32m    productOffsetY: float[m
[32m+[m
[32m+[m[32mclass Palette(BaseModel):[m
[32m+[m[32m    fg: str[m
[32m+[m[32m    bg: str[m
[32m+[m[32m    accent: str[m
[32m+[m
[32m+[m[32mclass CreativeRecipe(BaseModel):[m
[32m+[m[32m    bgUrl: Optional[str] = None[m
[32m+[m[32m    bgBase64: Optional[str] = None[m
[32m+[m[32m    cutoutBase64: str[m
[32m+[m[32m    size: Tuple[int, int]  # width, height[m
[32m+[m[32m    textBlocks: List[TextBlock][m
[32m+[m[32m    layout: LayoutRecipe[m
[32m+[m[32m    palette: Optional[Palette] = None[m
[32m+[m[32m    fontFamily: str = "Inter"[m
[32m+[m
[32m+[m[32mclass RemoveBgRequest(BaseModel):[m
[32m+[m[32m    file: bytes[m
[32m+[m
[32m+[m[32mclass GenBgRequest(BaseModel):[m
[32m+[m[32m    prompt: str[m
[32m+[m[32m    width: int = 1080[m
[32m+[m[32m    height: int = 1080[m
[32m+[m
[32m+[m[32mclass ComposeRequest(BaseModel):[m
[32m+[m[32m    bg_url: Optional[str] = None[m
[32m+[m[32m    bg_base64: Optional[str] = None[m
[32m+[m[32m    cutout_base64: str[m
[32m+[m[32m    text: dict  # Simplified text structure[m
[32m+[m[32m    layout_preset: str[m
[32m+[m[32m    palette: Optional[dict] = None[m
[32m+[m
[32m+[m[32mclass ExportPackRequest(BaseModel):[m
[32m+[m[32m    recipe: CreativeRecipe[m
[32m+[m
[32m+[m[32mclass SaveRequest(BaseModel):[m
[32m+[m[32m    recipe: CreativeRecipe[m
[32m+[m[32m    thumb_base64: Optional[str] = None[m
[32m+[m
[32m+[m[32mclass CloneRequest(BaseModel):[m
[32m+[m[32m    creative_id: Optional[str] = None[m
[32m+[m[32m    share_slug: Optional[str] = None[m
