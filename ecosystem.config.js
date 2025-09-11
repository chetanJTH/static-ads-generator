module.exports = {
  apps: [
    {
      name: 'static-ads-frontend',
      cwd: '/opt/hosting/static-ads-generator/apps/frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_BASE: 'https://staticapi.kraftey.com',
        NEXTAUTH_URL: 'https://kraftey.com',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-production-secret',
        NEXT_PUBLIC_APP_NAME: 'Static Ads Generator',
        NEXT_PUBLIC_BASE_URL: 'https://kraftey.com'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: '/root/.pm2/logs/static-ads-frontend-error.log',
      out_file: '/root/.pm2/logs/static-ads-frontend-out.log',
      log_file: '/root/.pm2/logs/static-ads-frontend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'static-ads-backend',
      cwd: '/opt/hosting/static-ads-generator/apps/backend',
      script: 'python3',
      args: '-m uvicorn main:app --host 0.0.0.0 --port 8000',
      env: {
        ENVIRONMENT: 'production',
        LOG_LEVEL: 'INFO',
        CORS_ORIGINS: 'https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com',
        API_HOST: '0.0.0.0',
        API_PORT: 8000,
        REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN || '',
        FLUX_MODEL: 'black-forest-labs/flux-schnell:latest'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: '/root/.pm2/logs/static-ads-backend-error.log',
      out_file: '/root/.pm2/logs/static-ads-backend-out.log',
      log_file: '/root/.pm2/logs/static-ads-backend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};