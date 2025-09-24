#!/usr/bin/env python3
"""
Complete migration script for all existing blog posts
"""

import os
import json
import sqlite3
from datetime import datetime
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent / "apps" / "frontend" / "prisma" / "dev.db"

# All blog posts to migrate
ALL_BLOG_POSTS = [
    {
        "slug": "best-ai-image-editing-tools-2025-comprehensive-guide",
        "title": "Best AI Image Editing Tools 2025: Complete Guide for Creators",
        "excerpt": "Discover the top AI image editing tools of 2025. From background removal to image upscaling, find the perfect AI tools for your creative workflow.",
        "content": "Complete guide to the best AI image editing tools of 2025...",
        "category": "AI Tools",
        "tags": ["ai tools", "image editing", "2025", "creators", "review"],
        "author": "Kraftey Team",
        "status": "published"
    },
    {
        "slug": "content-creation-strategies-for-small-businesses",
        "title": "Content Creation Strategies for Small Businesses",
        "excerpt": "Learn effective content creation strategies that help small businesses grow their online presence and engage with customers.",
        "content": "Content creation strategies for small businesses...",
        "category": "Business",
        "tags": ["content creation", "small business", "marketing", "strategy"],
        "author": "Kraftey Team",
        "status": "published"
    },
    {
        "slug": "creating-transparent-images-for-web-design",
        "title": "Creating Transparent Images for Web Design",
        "excerpt": "Learn how to create and use transparent images effectively in web design for better visual appeal and user experience.",
        "content": "Guide to creating transparent images for web design...",
        "category": "Design",
        "tags": ["transparent images", "web design", "PNG", "background removal"],
        "author": "Kraftey Team",
        "status": "published"
    },
    {
        "slug": "how-to-edit-images-for-different-social-media-platforms",
        "title": "How to Edit Images for Different Social Media Platforms",
        "excerpt": "Learn how to edit images for different social media platforms. Complete guide covering optimal dimensions, formats, and editing techniques.",
        "content": "Complete guide to editing images for social media platforms...",
        "category": "Social Media",
        "tags": ["social media", "image editing", "Instagram", "Facebook", "Twitter"],
        "author": "Kraftey Team",
        "status": "published"
    },
    {
        "slug": "how-to-optimize-images-for-better-seo-rankings",
        "title": "How to Optimize Images for Better SEO Rankings",
        "excerpt": "Learn how to optimize images for better SEO rankings. Complete guide covering image optimization techniques and best practices.",
        "content": "Guide to optimizing images for SEO...",
        "category": "SEO",
        "tags": ["SEO", "image optimization", "search rankings", "performance"],
        "author": "Kraftey Team",
        "status": "published"
    },
    {
        "slug": "how-to-remove-watermarks-from-images-ai-guide-2025",
        "title": "How to Remove Watermarks from Images: AI Guide 2025",
        "excerpt": "Learn how to remove watermarks from images using AI tools. Complete guide covering legal considerations and best practices.",
        "content": "Complete guide to removing watermarks from images...",
        "category": "AI Tools",
        "tags": ["watermark removal", "AI tools", "image editing", "legal"],
        "author": "Kraftey Team",
        "status": "published"
    },
    {
        "slug": "image-quality-enhancement-ai-techniques-2025",
        "title": "Image Quality Enhancement: AI Techniques 2025",
        "excerpt": "Discover the latest AI techniques for image quality enhancement. Learn how to improve image resolution, clarity, and overall quality.",
        "content": "Guide to AI-powered image quality enhancement...",
        "category": "AI Tools",
        "tags": ["image enhancement", "AI", "quality improvement", "upscaling"],
        "author": "Kraftey Team",
        "status": "published"
    },
    {
        "slug": "top-5-free-background-removal-tools-2025",
        "title": "Top 5 Free Online Tools to Remove Image Backgrounds (2025)",
        "excerpt": "Discover the best free tools for background removal in 2025. Compare AI-powered solutions and find the perfect tool for your needs.",
        "content": "Complete guide to free background removal tools...",
        "category": "AI Tools",
        "tags": ["background removal", "free tools", "AI", "image editing"],
        "author": "Kraftey Team",
        "status": "published"
    }
]

def migrate_all_blogs():
    """Migrate all existing blog posts to database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        print("Starting complete blog migration...")
        migrated_count = 0
        
        for post in ALL_BLOG_POSTS:
            # Check if post already exists
            cursor.execute("SELECT id FROM BlogPost WHERE slug = ?", (post["slug"],))
            if cursor.fetchone():
                print(f"Post '{post['slug']}' already exists, skipping...")
                continue
            
            # Insert blog post
            cursor.execute("""
                INSERT INTO BlogPost (
                    title, slug, excerpt, content, category, tags, author,
                    featuredImage, status, publishedAt, createdAt, updatedAt,
                    metaTitle, metaDescription, metaKeywords, viewCount, lastViewedAt, internalLinks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                post["title"],
                post["slug"],
                post["excerpt"],
                post["content"],
                post["category"],
                json.dumps(post["tags"]),
                post["author"],
                None,  # featuredImage
                post["status"],
                datetime.now(),
                datetime.now(),
                datetime.now(),
                post["title"],  # meta_title
                post["excerpt"],  # meta_description
                ", ".join(post["tags"]),  # meta_keywords
                0,  # viewCount
                None,  # lastViewedAt
                json.dumps([])  # internalLinks
            ))
            
            migrated_count += 1
            print(f"✅ Migrated: {post['title']}")
        
        conn.commit()
        conn.close()
        
        print(f"\n🎉 Migration completed! Migrated {migrated_count} blog posts.")
        print("All old blog posts are now in the database and visible in admin panel.")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")

if __name__ == "__main__":
    migrate_all_blogs()
