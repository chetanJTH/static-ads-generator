module.exports = {
  apps: [
    {
      name: 'static-ads-generator-backend',
      script: 'python',
      args: '-m uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4',
      cwd: '/opt/hosting/kraftey-static-ads-backend',
      interpreter: '/opt/hosting/kraftey-static-ads-backend/venv/bin/python',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      env: {
        NODE_ENV: 'development',
        PORT: 8000,
        ENVIRONMENT: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000,
        ENVIRONMENT: 'production',
        HOST: '127.0.0.1'
      },
      error_file: '/var/log/pm2/static-ads-generator-error.log',
      out_file: '/var/log/pm2/static-ads-generator-out.log',
      log_file: '/var/log/pm2/static-ads-generator-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      kill_timeout: 5000,
      listen_timeout: 3000,
      restart_delay: 4000
    }
  ]
};
