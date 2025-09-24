#!/usr/bin/env python3
"""
Production Authentication Debug Script
This script helps debug authentication issues on the production server.
"""

import sqlite3
import os
import sys
from pathlib import Path

def check_database_connection():
    """Check if the database exists and is accessible"""
    print("🔍 Checking database connection...")
    
    # Try different possible database paths
    possible_paths = [
        "apps/frontend/prisma/dev.db",
        "prisma/dev.db", 
        "dev.db",
        "/var/www/static-ads-generator/apps/frontend/prisma/dev.db",
        "/home/ubuntu/static-ads-generator/apps/frontend/prisma/dev.db"
    ]
    
    db_path = None
    for path in possible_paths:
        if os.path.exists(path):
            db_path = path
            print(f"✅ Found database at: {path}")
            break
    
    if not db_path:
        print("❌ Database not found in any expected location")
        print("Expected locations:")
        for path in possible_paths:
            print(f"  - {path}")
        return None
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if User table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='User'")
        if not cursor.fetchone():
            print("❌ User table not found in database")
            conn.close()
            return None
        
        print("✅ User table exists")
        
        # Check if admin user exists
        cursor.execute("SELECT id, email, name, password FROM User WHERE email = 'info.kraftey@gmail.com'")
        user = cursor.fetchone()
        
        if not user:
            print("❌ Admin user 'info.kraftey@gmail.com' not found in database")
            conn.close()
            return None
        
        print(f"✅ Admin user found: {user[1]} (ID: {user[0]})")
        
        if not user[3]:  # password field
            print("❌ Admin user has no password set")
            conn.close()
            return None
        
        print("✅ Admin user has password set")
        conn.close()
        return db_path
        
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return None

def check_environment_variables():
    """Check if required environment variables are set"""
    print("\n🔍 Checking environment variables...")
    
    required_vars = [
        "NEXTAUTH_SECRET",
        "NEXTAUTH_URL", 
        "DATABASE_URL"
    ]
    
    optional_vars = [
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET"
    ]
    
    missing_required = []
    missing_optional = []
    
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_required.append(var)
            print(f"❌ {var}: Not set")
        else:
            # Don't print full values for security
            print(f"✅ {var}: Set (length: {len(value)})")
    
    for var in optional_vars:
        value = os.getenv(var)
        if not value:
            missing_optional.append(var)
            print(f"⚠️  {var}: Not set (optional)")
        else:
            print(f"✅ {var}: Set (length: {len(value)})")
    
    if missing_required:
        print(f"\n❌ Missing required environment variables: {', '.join(missing_required)}")
        return False
    
    if missing_optional:
        print(f"\n⚠️  Missing optional environment variables: {', '.join(missing_optional)}")
    
    return True

def create_admin_user():
    """Create admin user if it doesn't exist"""
    print("\n🔧 Creating admin user...")
    
    db_path = check_database_connection()
    if not db_path:
        print("❌ Cannot create admin user - database not accessible")
        return False
    
    try:
        import bcrypt
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT id FROM User WHERE email = 'info.kraftey@gmail.com'")
        existing_user = cursor.fetchone()
        
        if existing_user:
            print("✅ Admin user already exists")
            
            # Check if password is set
            cursor.execute("SELECT password FROM User WHERE email = 'info.kraftey@gmail.com'")
            password = cursor.fetchone()[0]
            
            if not password:
                print("🔧 Setting password for existing admin user...")
                hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
                cursor.execute(
                    "UPDATE User SET password = ? WHERE email = ?",
                    (hashed_password.decode('utf-8'), 'info.kraftey@gmail.com')
                )
                conn.commit()
                print("✅ Password set successfully")
            else:
                print("✅ Admin user already has password")
        else:
            print("🔧 Creating new admin user...")
            hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
            
            cursor.execute("""
                INSERT INTO User (id, email, name, password, emailVerified, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (
                f"admin_{int(__import__('time').time())}",
                'info.kraftey@gmail.com',
                'Kraftey Admin',
                hashed_password.decode('utf-8'),
                datetime.now().isoformat()
            ))
            conn.commit()
            print("✅ Admin user created successfully")
        
        conn.close()
        return True
        
    except ImportError:
        print("❌ bcrypt not installed. Install with: pip install bcrypt")
        return False
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        return False

def main():
    print("🚀 Production Authentication Debug Script")
    print("=" * 50)
    
    # Check environment variables
    env_ok = check_environment_variables()
    
    # Check database
    db_ok = check_database_connection()
    
    # Create admin user if needed
    if db_ok:
        create_admin_user()
    
    print("\n" + "=" * 50)
    print("📋 Summary:")
    print(f"Environment Variables: {'✅ OK' if env_ok else '❌ Issues'}")
    print(f"Database Connection: {'✅ OK' if db_ok else '❌ Issues'}")
    
    if not env_ok:
        print("\n🔧 To fix environment variables:")
        print("1. Set NEXTAUTH_SECRET (generate with: openssl rand -base64 32)")
        print("2. Set NEXTAUTH_URL=https://kraftey.com")
        print("3. Set DATABASE_URL=file:./apps/frontend/prisma/dev.db")
    
    if not db_ok:
        print("\n🔧 To fix database issues:")
        print("1. Run: npx prisma db push")
        print("2. Or run this script to create admin user")
    
    print("\n🔧 Test authentication with:")
    print("Email: info.kraftey@gmail.com")
    print("Password: admin123")

if __name__ == "__main__":
    main()
