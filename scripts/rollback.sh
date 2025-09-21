#!/bin/bash

# Rollback Script
# Quickly rollback to previous deployment in case of issues

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

# Function to show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -c, --commit HASH    Rollback to specific commit hash"
    echo "  -p, --previous       Rollback to previous commit (default)"
    echo "  -l, --list          List recent commits"
    echo "  -h, --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                   # Rollback to previous commit"
    echo "  $0 -c abc123         # Rollback to specific commit"
    echo "  $0 -l                # List recent commits"
}

# Function to list recent commits
list_commits() {
    print_status "Recent commits:"
    git log --oneline -10
}

# Function to rollback to specific commit
rollback_to_commit() {
    local target_commit=$1
    
    if [ -z "$target_commit" ]; then
        print_error "No commit specified for rollback"
        return 1
    fi
    
    print_status "Rolling back to commit: $target_commit"
    
    # Verify commit exists
    if ! git rev-parse --verify "$target_commit" >/dev/null 2>&1; then
        print_error "Commit $target_commit does not exist"
        return 1
    fi
    
    # Show what commit we're rolling back to
    local commit_info=$(git log --oneline -1 "$target_commit")
    print_status "Target commit: $commit_info"
    
    # Confirm rollback
    echo ""
    read -p "Are you sure you want to rollback to this commit? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Rollback cancelled"
        return 0
    fi
    
    # Stop PM2 services
    print_status "Stopping PM2 services..."
    pm2 stop ecosystem.config.js || print_warning "Some services were not running"
    
    # Checkout the target commit
    print_status "Checking out commit $target_commit..."
    git checkout "$target_commit"
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    cd apps/backend
    pip3 install -r requirements.txt
    cd ..
    
    print_status "Installing frontend dependencies..."
    cd apps/frontend
    npm ci
    
    # Clean and rebuild
    print_status "Cleaning previous build..."
    rm -rf .next
    rm -rf node_modules/.cache || true
    
    print_status "Building frontend..."
    mkdir -p .next
    chmod 755 .next
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Frontend build failed during rollback!"
        print_status "Attempting to restore to main branch..."
        git checkout main
        return 1
    fi
    
    cd ../..
    
    # Restart PM2 services
    print_status "Restarting PM2 services..."
    pm2 start ecosystem.config.js
    pm2 save
    
    # Health check
    print_status "Waiting for services to start..."
    sleep 10
    
    if ./scripts/health-check.sh; then
        print_success "🎉 Rollback completed successfully!"
        print_status "Current commit: $(git log --oneline -1)"
    else
        print_error "❌ Rollback completed but health checks failed"
        print_status "Check logs: pm2 logs"
        return 1
    fi
}

# Function to rollback to previous commit
rollback_previous() {
    local previous_commit=$(git log --oneline -2 | tail -1 | cut -d' ' -f1)
    
    if [ -z "$previous_commit" ]; then
        print_error "Could not find previous commit"
        return 1
    fi
    
    print_status "Previous commit found: $previous_commit"
    rollback_to_commit "$previous_commit"
}

# Main function
main() {
    # Check if we're in the right directory
    if [ ! -f "ecosystem.config.js" ]; then
        print_error "Not in the correct directory. Please run from project root."
        exit 1
    fi
    
    # Parse command line arguments
    case "${1:-}" in
        -c|--commit)
            if [ -z "$2" ]; then
                print_error "Commit hash required with -c option"
                usage
                exit 1
            fi
            rollback_to_commit "$2"
            ;;
        -p|--previous|"")
            rollback_previous
            ;;
        -l|--list)
            list_commits
            ;;
        -h|--help)
            usage
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
