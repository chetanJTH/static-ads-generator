export interface TextBlock {
    kind: "headline" | "sub" | "cta";
    text: string;
    x: number;
    y: number;
    maxWidth: number;
    align: "left" | "center" | "right";
}
export interface LayoutRecipe {
    preset: "text_left" | "text_right" | "top_bar" | "bottom_bar";
    productScale: number;
    productOffsetX: number;
    productOffsetY: number;
}
export interface Palette {
    fg: string;
    bg: string;
    accent: string;
}
export interface CreativeRecipe {
    bgUrl?: string;
    bgBase64?: string;
    cutoutBase64: string;
    size: [number, number];
    textBlocks: TextBlock[];
    layout: LayoutRecipe;
    palette?: Palette;
    fontFamily?: string;
}
export interface Creative {
    id: string;
    projectId: string;
    templateId?: string;
    recipeJson: string;
    thumbUrl?: string;
    createdAt: Date;
    versions: Version[];
}
export interface Version {
    id: string;
    creativeId: string;
    recipeJson: string;
    exportSquareUrl?: string;
    exportStoryUrl?: string;
    exportLinkUrl?: string;
    createdAt: Date;
}
export interface Share {
    id: string;
    creativeId: string;
    slug: string;
    expiresAt?: Date;
}
export interface Project {
    id: string;
    name: string;
    brandKitId?: string;
    creatives: Creative[];
}
export interface RemoveBgResponse {
    png_base64: string;
}
export interface GenBgResponse {
    image_url: string;
}
export interface ComposeResponse {
    png_base64: string;
}
export interface ExportPackResponse {
    square_url: string;
    story_url: string;
    link_url: string;
}
export interface SaveResponse {
    creative_id: string;
    version_id: string;
}
export interface CloneResponse {
    recipe: CreativeRecipe;
}
export interface HealthResponse {
    ok: boolean;
}
