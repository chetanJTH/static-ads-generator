#!/bin/bash

# Management script for Static Ads Generator API

APP_NAME="static-ads-generator-backend"
APP_DIR="/var/www/$APP_NAME"
SERVICE_USER="www-data"

case "$1" in
    start)
        echo "🚀 Starting $APP_NAME..."
        sudo -u $SERVICE_USER pm2 start $APP_DIR/ecosystem.config.js --env production
        sudo -u $SERVICE_USER pm2 save
        ;;
    stop)
        echo "⏹️ Stopping $APP_NAME..."
        sudo -u $SERVICE_USER pm2 stop $APP_NAME
        ;;
    restart)
        echo "🔄 Restarting $APP_NAME..."
        sudo -u $SERVICE_USER pm2 restart $APP_NAME
        ;;
    status)
        echo "📊 Status of $APP_NAME:"
        sudo -u $SERVICE_USER pm2 status
        ;;
    logs)
        echo "📋 Logs for $APP_NAME:"
        sudo -u $SERVICE_USER pm2 logs $APP_NAME --lines 50
        ;;
    update)
        echo "🔄 Updating $APP_NAME..."
        cd $APP_DIR
        sudo -u $SERVICE_USER git pull
        sudo -u $SERVICE_USER ./venv/bin/pip install -r requirements.txt
        sudo -u $SERVICE_USER pm2 restart $APP_NAME
        ;;
    health)
        echo "🏥 Health check:"
        curl -f http://localhost:8000/health || echo "❌ Health check failed"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|update|health}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the application"
        echo "  stop    - Stop the application"
        echo "  restart - Restart the application"
        echo "  status  - Show application status"
        echo "  logs    - Show application logs"
        echo "  update  - Update and restart application"
        echo "  health  - Perform health check"
        exit 1
        ;;
esac
