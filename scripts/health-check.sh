#!/bin/bash

# Health Check Script
# Verifies that all services are running properly after deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Configuration
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:8000/health"
PUBLIC_FRONTEND="https://kraftey.com"
PUBLIC_BACKEND="https://staticapi.kraftey.com/health"
MAX_RETRIES=5
RETRY_DELAY=10

# Function to check URL with retries
check_url() {
    local url=$1
    local service_name=$2
    local retries=0
    
    print_status "Checking $service_name at $url..."
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -f -s --max-time 10 "$url" > /dev/null 2>&1; then
            print_success "$service_name is responding"
            return 0
        else
            retries=$((retries + 1))
            if [ $retries -lt $MAX_RETRIES ]; then
                print_warning "$service_name not responding, retrying in ${RETRY_DELAY}s... ($retries/$MAX_RETRIES)"
                sleep $RETRY_DELAY
            fi
        fi
    done
    
    print_error "$service_name failed to respond after $MAX_RETRIES attempts"
    return 1
}

# Function to check PM2 status
check_pm2() {
    print_status "Checking PM2 services..."
    
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 is not installed"
        return 1
    fi
    
    local pm2_output=$(pm2 jlist)
    local frontend_status=$(echo "$pm2_output" | jq -r '.[] | select(.name=="static-ads-frontend") | .pm2_env.status')
    local backend_status=$(echo "$pm2_output" | jq -r '.[] | select(.name=="static-ads-backend") | .pm2_env.status')
    
    if [ "$frontend_status" = "online" ]; then
        print_success "Frontend PM2 service is online"
    else
        print_error "Frontend PM2 service is not online (status: $frontend_status)"
        return 1
    fi
    
    if [ "$backend_status" = "online" ]; then
        print_success "Backend PM2 service is online"
    else
        print_error "Backend PM2 service is not online (status: $backend_status)"
        return 1
    fi
}

# Function to check disk space
check_disk_space() {
    print_status "Checking disk space..."
    
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -gt 90 ]; then
        print_error "Disk usage is critically high: ${disk_usage}%"
        return 1
    elif [ "$disk_usage" -gt 80 ]; then
        print_warning "Disk usage is high: ${disk_usage}%"
    else
        print_success "Disk usage is normal: ${disk_usage}%"
    fi
}

# Function to check memory usage
check_memory() {
    print_status "Checking memory usage..."
    
    local memory_info=$(free -m)
    local total_memory=$(echo "$memory_info" | awk 'NR==2{print $2}')
    local used_memory=$(echo "$memory_info" | awk 'NR==2{print $3}')
    local memory_percentage=$((used_memory * 100 / total_memory))
    
    if [ "$memory_percentage" -gt 90 ]; then
        print_error "Memory usage is critically high: ${memory_percentage}%"
        return 1
    elif [ "$memory_percentage" -gt 80 ]; then
        print_warning "Memory usage is high: ${memory_percentage}%"
    else
        print_success "Memory usage is normal: ${memory_percentage}%"
    fi
}

# Main health check
main() {
    print_status "🏥 Starting health check..."
    echo ""
    
    local exit_code=0
    
    # Check PM2 services
    if ! check_pm2; then
        exit_code=1
    fi
    
    echo ""
    
    # Check local endpoints
    if ! check_url "$FRONTEND_URL" "Frontend (local)"; then
        exit_code=1
    fi
    
    if ! check_url "$BACKEND_URL" "Backend (local)"; then
        exit_code=1
    fi
    
    echo ""
    
    # Check public endpoints
    if ! check_url "$PUBLIC_FRONTEND" "Frontend (public)"; then
        print_warning "Public frontend check failed - might be DNS/proxy issue"
    fi
    
    if ! check_url "$PUBLIC_BACKEND" "Backend (public)"; then
        print_warning "Public backend check failed - might be DNS/proxy issue"
    fi
    
    echo ""
    
    # Check system resources
    if ! check_disk_space; then
        exit_code=1
    fi
    
    if ! check_memory; then
        exit_code=1
    fi
    
    echo ""
    
    # Final status
    if [ $exit_code -eq 0 ]; then
        print_success "🎉 All health checks passed!"
        
        # Display service info
        print_status "Service Information:"
        echo "• Frontend: $PUBLIC_FRONTEND"
        echo "• Backend API: $PUBLIC_BACKEND"
        echo "• PM2 Status: pm2 list"
        echo "• Logs: pm2 logs"
        
    else
        print_error "❌ Some health checks failed!"
        echo ""
        print_status "Troubleshooting steps:"
        echo "1. Check PM2 logs: pm2 logs"
        echo "2. Check PM2 status: pm2 list"
        echo "3. Restart services: pm2 restart ecosystem.config.js"
        echo "4. Check system resources: df -h && free -h"
    fi
    
    exit $exit_code
}

# Run health check
main "$@"
