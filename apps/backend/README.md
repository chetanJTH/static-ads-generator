# Static Ads Generator Backend

A FastAPI-based backend service for generating static ads with AI-powered features.

## Features

- Background removal using AI
- Design card generation
- Health monitoring
- CORS-enabled for frontend integration

## Quick Start

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. Run the development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.

## Environment Variables

- `CORS_ORIGINS`: Comma-separated list of allowed origins (default: "http://localhost:3000")
- `REPLICATE_API_TOKEN`: Your Replicate API token for AI services
- Other service-specific variables as needed

## Deployment

### Railway
The project is configured for Railway deployment with the included `Procfile` and `railway.json`.

### Heroku
Use the included `Procfile` for Heroku deployment.

### Docker
```bash
docker build -t static-ads-backend .
docker run -p 8000:8000 static-ads-backend
```

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /remove-bg` - Remove background from images
- `POST /design-card` - Generate design cards

## Development

The project uses FastAPI with automatic API documentation generation. Visit `/docs` for interactive API documentation.

