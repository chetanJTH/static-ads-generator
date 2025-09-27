module.exports = {
  apps: [
    {
      name: 'static-ads-frontend',
      cwd: '/opt/hosting/static-ads-generator/apps/frontend',
      script: 'npm',
      args: 'start',
      env_file: '.env',
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
      env_file: '.env',
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