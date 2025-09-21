/**
 * Deployment Configuration
 * 
 * This file contains deployment settings for different environments
 */

module.exports = {
  // Production deployment settings
  production: {
    server: {
      host: process.env.SERVER_HOST || 'your-server-ip',
      user: process.env.SERVER_USER || 'root',
      port: process.env.SERVER_PORT || 22,
      path: '/opt/hosting/static-ads-generator'
    },
    
    pm2: {
      ecosystem: 'ecosystem.config.js',
      apps: ['static-ads-frontend', 'static-ads-backend']
    },
    
    build: {
      frontend: {
        command: 'npm run build',
        directory: 'apps/frontend',
        outputDir: '.next'
      },
      backend: {
        command: 'pip3 install -r requirements.txt',
        directory: 'apps/backend'
      }
    },
    
    healthChecks: {
      frontend: {
        url: 'http://localhost:3000',
        timeout: 30000
      },
      backend: {
        url: 'http://localhost:8000/health',
        timeout: 10000
      }
    }
  },
  
  // Staging deployment settings
  staging: {
    server: {
      host: process.env.STAGING_SERVER_HOST,
      user: process.env.STAGING_SERVER_USER || 'root',
      port: process.env.STAGING_SERVER_PORT || 22,
      path: '/opt/staging/static-ads-generator'
    },
    
    pm2: {
      ecosystem: 'ecosystem.staging.config.js',
      apps: ['static-ads-frontend-staging', 'static-ads-backend-staging']
    }
  },
  
  // Development settings
  development: {
    build: {
      frontend: {
        command: 'npm run dev',
        directory: 'apps/frontend'
      },
      backend: {
        command: 'python -m uvicorn main:app --reload',
        directory: 'apps/backend'
      }
    }
  }
}
