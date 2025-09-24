#!/usr/bin/env python3
import sqlite3

# Connect to database
conn = sqlite3.connect('apps/frontend/prisma/dev.db')
cursor = conn.cursor()

# Update admin user with plain text password
cursor.execute("""
    UPDATE User 
    SET password = ? 
    WHERE email = 'info.kraftey@gmail.com'
""", ('admin123',))

conn.commit()
print("✅ Admin password updated to plain text: admin123")
conn.close()
