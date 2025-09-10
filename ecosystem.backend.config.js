module.exports = {
  apps: [{
    name: 'static-ads-generator-backend',
    script: 'python',
    args: '-m uvicorn main:app --host 0.0.0.0 --port 8000',
    cwd: '/opt/static-ads-generator-backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      ENVIRONMENT: 'production',
      LOG_LEVEL: 'INFO',
      CORS_ORIGINS: 'https://your-domain.com,https://www.your-domain.com,https://api.your-domain.com',
      API_HOST: '0.0.0.0',
      API_PORT: 8000,
      REPLICATE_API_TOKEN: 'your-replicate-token',
      FLUX_MODEL: 'black-forest-labs/flux-schnell:latest'
    },
    env_production: {
      ENVIRONMENT: 'production',
      LOG_LEVEL: 'WARNING'
    },
    error_file: '/var/log/static-ads-generator/backend-error.log',
    out_file: '/var/log/static-ads-generator/backend-out.log',
    log_file: '/var/log/static-ads-generator/backend-combined.log',
    time: true
  }]
}
