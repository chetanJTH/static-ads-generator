#!/bin/bash

# Blog Database Setup Script
# Creates the blog tables in the existing SQLite database

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

print_status "🗄️  Setting up Blog Database"
echo ""

# Check if we're in the right directory
if [ ! -f "ecosystem.config.js" ]; then
    print_error "Not in the correct directory. Please run from project root."
    exit 1
fi

# Database path
DB_PATH="apps/frontend/prisma/prod.db"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    print_warning "Database file not found at $DB_PATH"
    print_status "Creating database file..."
    touch "$DB_PATH"
    chmod 666 "$DB_PATH"
    print_success "Database file created"
fi

print_status "Creating blog tables..."

# Create blog tables
sqlite3 "$DB_PATH" << 'EOF'
-- Blog System Tables

-- BlogPost table
CREATE TABLE IF NOT EXISTS BlogPost (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT, -- JSON array of tags
    author TEXT DEFAULT 'Kraftey Team',
    featuredImage TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    metaTitle TEXT,
    metaDescription TEXT,
    metaKeywords TEXT,
    viewCount INTEGER DEFAULT 0,
    lastViewedAt DATETIME,
    internalLinks TEXT -- JSON array of internal links
);

-- BlogCategory table
CREATE TABLE IF NOT EXISTS BlogCategory (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT, -- Hex color for UI
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- BlogTag table
CREATE TABLE IF NOT EXISTS BlogTag (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogpost_slug ON BlogPost(slug);
CREATE INDEX IF NOT EXISTS idx_blogpost_category ON BlogPost(category);
CREATE INDEX IF NOT EXISTS idx_blogpost_status_published ON BlogPost(status, publishedAt);
CREATE INDEX IF NOT EXISTS idx_blogpost_published ON BlogPost(publishedAt);
CREATE INDEX IF NOT EXISTS idx_blogcategory_slug ON BlogCategory(slug);
CREATE INDEX IF NOT EXISTS idx_blogtag_slug ON BlogTag(slug);

-- Insert default categories
INSERT OR IGNORE INTO BlogCategory (name, slug, description, color) VALUES
('AI Tools', 'ai-tools', 'Articles about AI-powered tools and technologies', '#3B82F6'),
('Background Removal', 'background-removal', 'Tips and tutorials for background removal', '#10B981'),
('eCommerce', 'ecommerce', 'eCommerce photography and marketing strategies', '#F59E0B'),
('Photography', 'photography', 'Photography tips and techniques', '#8B5CF6'),
('Marketing', 'marketing', 'Marketing strategies and content creation', '#EF4444'),
('Tutorial', 'tutorial', 'Step-by-step tutorials and guides', '#06B6D4'),
('Design', 'design', 'Design tips and best practices', '#84CC16'),
('Social Media', 'social-media', 'Social media content creation', '#F97316'),
('SEO', 'seo', 'SEO optimization and strategies', '#6366F1'),
('Business', 'business', 'Business growth and strategies', '#EC4899');

print_success "Blog tables created successfully"
EOF

if [ $? -eq 0 ]; then
    print_success "Blog database setup completed successfully!"
    echo ""
    echo "📋 Summary:"
    echo "✅ BlogPost table created with indexes"
    echo "✅ BlogCategory table created with default categories"
    echo "✅ BlogTag table created"
    echo "✅ Performance indexes added"
    echo ""
    echo "🔧 Next Steps:"
    echo "1. Run Prisma migration: cd apps/frontend && npx prisma db push"
    echo "2. Test the blog API: curl http://localhost:8000/blog/posts"
    echo "3. Start using the blog system!"
    echo ""
    print_success "🎉 Blog database is ready!"
else
    print_error "Failed to create blog tables"
    exit 1
fi
