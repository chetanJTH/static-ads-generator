module.exports = {
  apps: [{
    name: 'static-ads-frontend',
    script: 'server.js',
    cwd: '/opt/static-ads-frontend/current',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '/opt/static-ads-frontend/.env.production',
    log_file: '/opt/static-ads-frontend/logs/combined.log',
    out_file: '/opt/static-ads-frontend/logs/out.log',
    error_file: '/opt/static-ads-frontend/logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    merge_logs: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
