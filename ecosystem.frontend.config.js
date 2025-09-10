module.exports = {
  apps: [{
    name: 'static-ads-generator-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/opt/static-ads-generator-frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_API_BASE: 'https://api.your-domain.com',
      NEXTAUTH_URL: 'https://your-domain.com',
      NEXTAUTH_SECRET: 'your-production-secret',
      NEXT_PUBLIC_APP_NAME: 'Static Ads Generator',
      NEXT_PUBLIC_BASE_URL: 'https://your-domain.com'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/static-ads-generator/frontend-error.log',
    out_file: '/var/log/static-ads-generator/frontend-out.log',
    log_file: '/var/log/static-ads-generator/frontend-combined.log',
    time: true
  }]
}
