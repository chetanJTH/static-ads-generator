module.exports = {
  apps: [{
    name: 'static-ads-backend',
    script: 'main.py',
    interpreter: 'python3',
    cwd: '/home/ubuntu/static-ads-generator/apps/api',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000,
      HOST: '0.0.0.0'
    },
    error_file: '/home/ubuntu/static-ads-generator/logs/backend-error.log',
    out_file: '/home/ubuntu/static-ads-generator/logs/backend-out.log',
    log_file: '/home/ubuntu/static-ads-generator/logs/backend-combined.log',
    time: true
  }]
};



