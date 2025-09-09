module.exports = {
  apps: [{
    name: 'static-ads-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/static-ads-generator/apps/web',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/ubuntu/static-ads-generator/logs/frontend-error.log',
    out_file: '/home/ubuntu/static-ads-generator/logs/frontend-out.log',
    log_file: '/home/ubuntu/static-ads-generator/logs/frontend-combined.log',
    time: true
  }]
};




