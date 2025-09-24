#!/usr/bin/env python3
"""
Migration script to move existing blog posts from file-based system to database
"""

import os
import json
import sqlite3
from datetime import datetime
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent / "apps" / "frontend" / "prisma" / "dev.db"

# Blog posts to migrate
BLOG_POSTS = [
    {
        "slug": "best-ai-image-editing-tools-2025-comprehensive-guide",
        "title": "Best AI Image Editing Tools 2025: Complete Guide for Creators",
        "excerpt": "Discover the top AI image editing tools of 2025. From background removal to image upscaling, find the perfect AI tools for your creative workflow.",
        "content": """# Best AI Image Editing Tools 2025: Complete Guide for Creators

The world of AI image editing has exploded in 2025, offering creators powerful tools that were unimaginable just a few years ago. Whether you're a content creator, marketer, or designer, these AI tools can revolutionize your workflow.

## Top AI Image Editing Tools

### 1. Kraftey - All-in-One AI Platform
- **Background Removal**: Instant, precise background removal
- **Image Upscaling**: Enhance image quality up to 4x
- **Watermark Removal**: Clean, professional results
- **Batch Processing**: Handle multiple images at once

### 2. Adobe Firefly
- **Generative Fill**: AI-powered content creation
- **Style Transfer**: Apply artistic styles instantly
- **Object Removal**: Clean removal of unwanted elements

### 3. Canva AI
- **Magic Design**: AI-generated layouts
- **Background Remover**: One-click background removal
- **Text to Image**: Generate images from descriptions

## Key Features to Look For

1. **Ease of Use**: Intuitive interfaces for all skill levels
2. **Quality Output**: High-resolution, professional results
3. **Speed**: Fast processing times
4. **Batch Processing**: Handle multiple images efficiently
5. **Integration**: Works with your existing workflow

## Best Practices

- Always backup original images
- Use high-quality source images for best results
- Experiment with different AI tools to find your favorites
- Consider subscription plans for regular use

## Conclusion

AI image editing tools in 2025 offer unprecedented capabilities for creators. Choose tools that fit your specific needs and workflow for the best results.""",
        "category": "AI Tools",
        "tags": ["ai tools", "image editing", "2025", "creators", "review"],
        "author": "Kraftey Team",
        "status": "published",
        "meta_title": "Best AI Image Editing Tools 2025: Complete Guide for Creators | Kraftey",
        "meta_description": "Discover the top AI image editing tools of 2025. From background removal to image upscaling, find the perfect AI tools for your creative workflow.",
        "meta_keywords": "AI image editing, best AI tools 2025, image enhancement, AI photo editor, background removal, image upscaling, creative tools"
    },
    {
        "slug": "content-creation-strategies-for-small-businesses",
        "title": "Content Creation Strategies for Small Businesses",
        "excerpt": "Learn effective content creation strategies that help small businesses grow their online presence and engage with customers.",
        "content": """# Content Creation Strategies for Small Businesses

Small businesses need to be strategic about content creation to compete effectively online. Here are proven strategies that work.

## Understanding Your Audience

Before creating content, you need to understand who your customers are:
- Demographics and psychographics
- Pain points and challenges
- Preferred content formats
- Online behavior patterns

## Content Types That Work

### 1. Educational Content
- How-to guides and tutorials
- Industry insights and tips
- Problem-solving content

### 2. Behind-the-Scenes Content
- Company culture and values
- Product development process
- Team member spotlights

### 3. User-Generated Content
- Customer testimonials
- Reviews and case studies
- Social media mentions

## Content Planning

1. **Content Calendar**: Plan content in advance
2. **Consistency**: Regular posting schedule
3. **Quality over Quantity**: Focus on valuable content
4. **Repurposing**: Use content across multiple platforms

## Tools and Resources

- **AI Tools**: Use AI for content generation and editing
- **Design Tools**: Create professional visuals
- **Analytics**: Track performance and engagement
- **Scheduling**: Automate content distribution

## Measuring Success

- Engagement rates
- Website traffic
- Lead generation
- Sales conversions

## Conclusion

Effective content creation for small businesses requires strategy, consistency, and understanding your audience. Focus on providing value and building relationships with your customers.""",
        "category": "Business",
        "tags": ["content creation", "small business", "marketing", "strategy"],
        "author": "Kraftey Team",
        "status": "published",
        "meta_title": "Content Creation Strategies for Small Businesses | Kraftey",
        "meta_description": "Learn effective content creation strategies that help small businesses grow their online presence and engage with customers.",
        "meta_keywords": "content creation, small business, marketing strategy, online presence, customer engagement"
    },
    {
        "slug": "creating-transparent-images-for-web-design",
        "title": "Creating Transparent Images for Web Design",
        "excerpt": "Learn how to create and use transparent images effectively in web design for better visual appeal and user experience.",
        "content": """# Creating Transparent Images for Web Design

Transparent images are essential for modern web design, allowing for seamless integration of graphics and better visual hierarchy.

## What Are Transparent Images?

Transparent images have transparent backgrounds, allowing them to blend seamlessly with any background color or pattern. The most common format is PNG with alpha channel support.

## Benefits of Transparent Images

1. **Flexibility**: Work with any background
2. **Professional Look**: Clean, polished appearance
3. **Brand Consistency**: Maintain visual identity
4. **Better UX**: Improved visual hierarchy

## Creating Transparent Images

### Using AI Tools
- **Kraftey**: Instant background removal
- **Remove.bg**: Automated background removal
- **Adobe Express**: Professional editing tools

### Manual Methods
- **Photoshop**: Advanced editing capabilities
- **GIMP**: Free alternative to Photoshop
- **Canva**: User-friendly design tool

## Best Practices

1. **File Formats**: Use PNG for transparency
2. **File Size**: Optimize for web performance
3. **Quality**: Maintain high resolution
4. **Consistency**: Use consistent styling

## Common Use Cases

- **Logos**: Brand elements that work anywhere
- **Icons**: UI elements and navigation
- **Product Images**: E-commerce applications
- **Graphics**: Decorative elements

## Technical Considerations

- **Browser Support**: Ensure compatibility
- **Performance**: Optimize file sizes
- **Accessibility**: Include alt text
- **Responsive Design**: Scale appropriately

## Conclusion

Transparent images are a powerful tool in web design. Use AI tools for quick results or manual methods for precise control. Always optimize for performance and accessibility.""",
        "category": "Design",
        "tags": ["transparent images", "web design", "PNG", "background removal", "design"],
        "author": "Kraftey Team",
        "status": "published",
        "meta_title": "Creating Transparent Images for Web Design | Kraftey",
        "meta_description": "Learn how to create and use transparent images effectively in web design for better visual appeal and user experience.",
        "meta_keywords": "transparent images, web design, PNG, background removal, design, graphics"
    }
]

def migrate_blogs():
    """Migrate existing blog posts to database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        print("Starting blog migration...")
        
        for post in BLOG_POSTS:
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
                post["meta_title"],
                post["meta_description"],
                post["meta_keywords"],
                0,  # viewCount
                None,  # lastViewedAt
                json.dumps([])  # internalLinks
            ))
            
            print(f"✅ Migrated: {post['title']}")
        
        conn.commit()
        conn.close()
        
        print(f"\n🎉 Migration completed! Migrated {len(BLOG_POSTS)} blog posts.")
        print("The old file-based blog posts are now in the database.")
        print("You can safely remove the old blog folders after testing.")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")

if __name__ == "__main__":
    migrate_blogs()
