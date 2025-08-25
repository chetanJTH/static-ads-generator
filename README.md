# Static Ads Generator - Minimal Demo

A minimal, production-quality demo for generating static ads with product photos and AI-generated backgrounds.

## Features

- **Single Page App**: Everything happens on one page with a single canvas
- **Upload & Remove Background**: Drag & drop image upload with automatic background removal
- **AI Background Generation**: Generate backgrounds from text prompts using Replicate FLUX
- **Smart Composition**: Auto-layout product and text based on prompt parsing
- **Real-time Preview**: Live canvas updates as you work
- **Export**: Download final designs as PNG

## Quick Start

1. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd apps/web && npm install
   
   # Install backend dependencies
   cd ../api && pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   ```bash
   # Frontend (.env in apps/web/)
   NEXT_PUBLIC_API_BASE=http://localhost:8000
   
   # Backend (.env in apps/api/)
   REPLICATE_API_TOKEN=your_token_here
   FLUX_MODEL=black-forest-labs/flux-schnell:latest
   USE_END_TO_END_POSTER=false
   CORS_ORIGINS=http://localhost:3000
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```

4. **Open your browser**: http://localhost:3000

## How to Use

1. **Upload Image**: Drag & drop a product image
2. **Remove Background**: Click "Remove Background" to get a transparent cutout
3. **Generate Design**: Click "Promy" and enter a prompt like:
   ```
   Headline: Big Monsoon Sale! 30% Off. CTA: Shop Now. Theme: modern, teal & white, soft gradient, clean.
   ```
4. **Download**: Click "Download PNG" to save your design

## API Endpoints

- `POST /remove-bg` - Remove background from image
- `POST /design-card` - Generate complete ad design
- `GET /health` - Health check

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, React Dropzone
- **Backend**: FastAPI, Python 3.11
- **Image Processing**: rembg, Pillow
- **AI Generation**: Replicate FLUX (with gradient fallback)
- **Canvas**: HTML5 Canvas for preview and export

## Keyboard Shortcuts

- `R` - Remove background
- `G` - Open prompt modal
- `Ctrl/Cmd + D` - Download PNG

## Project Structure

```
apps/
├── web/                 # Next.js frontend
│   ├── app/            # Single page app
│   ├── components/     # React components
│   └── lib/           # API client
└── api/               # FastAPI backend
    ├── routers/       # API endpoints
    └── services/      # Business logic
```

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_BASE` - Backend API URL

### Backend
- `REPLICATE_API_TOKEN` - Replicate API token (optional)
- `FLUX_MODEL` - FLUX model name
- `USE_END_TO_END_POSTER` - Enable end-to-end generation mode
- `CORS_ORIGINS` - Allowed CORS origins

## Development

```bash
# Start both servers
npm run dev

# Start frontend only
npm run dev:web

# Start backend only
npm run dev:api

# Build for production
npm run build
```

## License

MIT
