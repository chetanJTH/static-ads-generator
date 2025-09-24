from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime
import sqlite3
from pathlib import Path

router = APIRouter(prefix="/blog", tags=["blog"])

# Database path - using the same SQLite database as frontend
DB_PATH = Path(__file__).parent.parent.parent / "frontend" / "prisma" / "prod.db"

# Pydantic models for API
class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    category: str
    tags: Optional[List[str]] = []
    author: str = "Kraftey Team"
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    internal_links: Optional[List[dict]] = []

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    author: Optional[str] = None
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    internal_links: Optional[List[dict]] = None
    status: Optional[str] = None

class BlogPostResponse(BaseModel):
    id: str
    title: str
    slug: str
    excerpt: str
    content: str
    category: str
    tags: List[str]
    author: str
    featured_image: Optional[str]
    status: str
    published_at: datetime
    created_at: datetime
    updated_at: datetime
    meta_title: Optional[str]
    meta_description: Optional[str]
    meta_keywords: Optional[str]
    view_count: int
    internal_links: List[dict]

def get_db_connection():
    """Get database connection"""
    if not DB_PATH.exists():
        raise HTTPException(status_code=500, detail="Database not found")
    return sqlite3.connect(str(DB_PATH))

@router.post("/posts", response_model=BlogPostResponse)
async def create_blog_post(post: BlogPostCreate):
    """Create a new blog post"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if slug already exists
        cursor.execute("SELECT id FROM BlogPost WHERE slug = ?", (post.slug,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Slug already exists")
        
        # Insert new blog post
        cursor.execute("""
            INSERT INTO BlogPost (
                title, slug, excerpt, content, category, tags, author,
                featuredImage, metaTitle, metaDescription, metaKeywords,
                internalLinks, publishedAt, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            post.title, post.slug, post.excerpt, post.content, post.category,
            json.dumps(post.tags), post.author, post.featured_image,
            post.meta_title, post.meta_description, post.meta_keywords,
            json.dumps(post.internal_links), datetime.now(), datetime.now(), datetime.now()
        ))
        
        post_id = cursor.lastrowid
        conn.commit()
        
        # Return the created post
        cursor.execute("SELECT * FROM BlogPost WHERE id = ?", (post_id,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=500, detail="Failed to create blog post")
        
        return BlogPostResponse(
            id=str(row[0]),
            title=row[1],
            slug=row[2],
            excerpt=row[3],
            content=row[4],
            category=row[5],
            tags=json.loads(row[6]) if row[6] else [],
            author=row[7],
            featured_image=row[8],
            status=row[9],
            published_at=datetime.fromisoformat(row[10]),
            created_at=datetime.fromisoformat(row[11]),
            updated_at=datetime.fromisoformat(row[12]),
            meta_title=row[13],
            meta_description=row[14],
            meta_keywords=row[15],
            view_count=row[16],
            internal_links=json.loads(row[18]) if row[18] else []
        )
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@router.get("/posts", response_model=List[BlogPostResponse])
async def get_blog_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    status: str = Query("published", regex="^(published|draft|archived)$")
):
    """Get paginated blog posts"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        query = """
            SELECT * FROM BlogPost 
            WHERE status = ?
        """
        params = [status]
        
        if category:
            query += " AND category = ?"
            params.append(category)
        
        query += " ORDER BY publishedAt DESC LIMIT ? OFFSET ?"
        params.extend([limit, skip])
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        posts = []
        for row in rows:
            posts.append(BlogPostResponse(
                id=str(row[0]),
                title=row[1],
                slug=row[2],
                excerpt=row[3],
                content=row[4],
                category=row[5],
                tags=json.loads(row[6]) if row[6] else [],
                author=row[7],
                featured_image=row[8],
                status=row[9],
                published_at=datetime.fromisoformat(row[10]),
                created_at=datetime.fromisoformat(row[11]),
                updated_at=datetime.fromisoformat(row[12]),
                meta_title=row[13],
                meta_description=row[14],
                meta_keywords=row[15],
                view_count=row[16],
                internal_links=json.loads(row[18]) if row[18] else []
            ))
        
        return posts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@router.get("/posts/{slug}", response_model=BlogPostResponse)
async def get_blog_post(slug: str):
    """Get a specific blog post by slug"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT * FROM BlogPost WHERE slug = ?", (slug,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Increment view count
        cursor.execute(
            "UPDATE BlogPost SET viewCount = viewCount + 1, lastViewedAt = ? WHERE slug = ?",
            (datetime.now(), slug)
        )
        conn.commit()
        
        return BlogPostResponse(
            id=str(row[0]),
            title=row[1],
            slug=row[2],
            excerpt=row[3],
            content=row[4],
            category=row[5],
            tags=json.loads(row[6]) if row[6] else [],
            author=row[7],
            featured_image=row[8],
            status=row[9],
            published_at=datetime.fromisoformat(row[10]),
            created_at=datetime.fromisoformat(row[11]),
            updated_at=datetime.fromisoformat(row[12]),
            meta_title=row[13],
            meta_description=row[14],
            meta_keywords=row[15],
            view_count=row[16] + 1,  # Incremented count
            internal_links=json.loads(row[18]) if row[18] else []
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@router.put("/posts/{slug}", response_model=BlogPostResponse)
async def update_blog_post(slug: str, post_update: BlogPostUpdate):
    """Update a blog post"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if post exists
        cursor.execute("SELECT id FROM BlogPost WHERE slug = ?", (slug,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Build update query dynamically
        update_fields = []
        params = []
        
        if post_update.title is not None:
            update_fields.append("title = ?")
            params.append(post_update.title)
        
        if post_update.excerpt is not None:
            update_fields.append("excerpt = ?")
            params.append(post_update.excerpt)
        
        if post_update.content is not None:
            update_fields.append("content = ?")
            params.append(post_update.content)
        
        if post_update.category is not None:
            update_fields.append("category = ?")
            params.append(post_update.category)
        
        if post_update.tags is not None:
            update_fields.append("tags = ?")
            params.append(json.dumps(post_update.tags))
        
        if post_update.author is not None:
            update_fields.append("author = ?")
            params.append(post_update.author)
        
        if post_update.featured_image is not None:
            update_fields.append("featuredImage = ?")
            params.append(post_update.featured_image)
        
        if post_update.meta_title is not None:
            update_fields.append("metaTitle = ?")
            params.append(post_update.meta_title)
        
        if post_update.meta_description is not None:
            update_fields.append("metaDescription = ?")
            params.append(post_update.meta_description)
        
        if post_update.meta_keywords is not None:
            update_fields.append("metaKeywords = ?")
            params.append(post_update.meta_keywords)
        
        if post_update.internal_links is not None:
            update_fields.append("internalLinks = ?")
            params.append(json.dumps(post_update.internal_links))
        
        if post_update.status is not None:
            update_fields.append("status = ?")
            params.append(post_update.status)
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_fields.append("updatedAt = ?")
        params.append(datetime.now())
        params.append(slug)
        
        query = f"UPDATE BlogPost SET {', '.join(update_fields)} WHERE slug = ?"
        cursor.execute(query, params)
        conn.commit()
        
        # Return updated post
        cursor.execute("SELECT * FROM BlogPost WHERE slug = ?", (slug,))
        row = cursor.fetchone()
        
        return BlogPostResponse(
            id=str(row[0]),
            title=row[1],
            slug=row[2],
            excerpt=row[3],
            content=row[4],
            category=row[5],
            tags=json.loads(row[6]) if row[6] else [],
            author=row[7],
            featured_image=row[8],
            status=row[9],
            published_at=datetime.fromisoformat(row[10]),
            created_at=datetime.fromisoformat(row[11]),
            updated_at=datetime.fromisoformat(row[12]),
            meta_title=row[13],
            meta_description=row[14],
            meta_keywords=row[15],
            view_count=row[16],
            internal_links=json.loads(row[18]) if row[18] else []
        )
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@router.delete("/posts/{slug}")
async def delete_blog_post(slug: str):
    """Delete a blog post"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM BlogPost WHERE slug = ?", (slug,))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        conn.commit()
        return {"message": "Blog post deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@router.get("/categories")
async def get_blog_categories():
    """Get all blog categories"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT DISTINCT category FROM BlogPost WHERE status = 'published'")
        categories = [row[0] for row in cursor.fetchall()]
        return {"categories": categories}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@router.get("/stats")
async def get_blog_stats():
    """Get blog statistics"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Total posts
        cursor.execute("SELECT COUNT(*) FROM BlogPost WHERE status = 'published'")
        total_posts = cursor.fetchone()[0]
        
        # Total views
        cursor.execute("SELECT SUM(viewCount) FROM BlogPost")
        total_views = cursor.fetchone()[0] or 0
        
        # Posts by category
        cursor.execute("""
            SELECT category, COUNT(*) as count 
            FROM BlogPost 
            WHERE status = 'published' 
            GROUP BY category 
            ORDER BY count DESC
        """)
        category_stats = [{"category": row[0], "count": row[1]} for row in cursor.fetchall()]
        
        return {
            "total_posts": total_posts,
            "total_views": total_views,
            "category_stats": category_stats
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()
