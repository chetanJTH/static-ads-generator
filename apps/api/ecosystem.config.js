module.exports = {
  apps: [{
    name: 'static-ads-backend',
    script: 'uvicorn',
    args: 'main:app --host 0.0.0.0 --port 8000 --workers 1',
    interpreter: '/root/static-ads-generator/apps/api/venv/bin/python',
    cwd: '/root/static-ads-generator/apps/api',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      ENVIRONMENT: 'development'
    },
    env_production: {
      ENVIRONMENT: 'production',
      PORT: 8000,
      HOST: '0.0.0.0'
    },
    error_file: '/root/static-ads-generator/logs/backend-error.log',
    out_file: '/root/static-ads-generator/logs/backend-out.log',
    log_file: '/root/static-ads-generator/logs/backend-combined.log',
    time: true
  }]
};



