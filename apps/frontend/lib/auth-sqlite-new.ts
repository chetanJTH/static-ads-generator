import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

// Direct SQLite authentication function with hardcoded path
export async function authenticateUser(email: string, password: string) {
  return new Promise((resolve, reject) => {
    // Use hardcoded absolute path to database
    const dbPath = 'C:\\Users\\cheta\\static-ads-generator\\apps\\frontend\\prisma\\dev.db';
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
        reject(new Error('Database connection failed'));
        return;
      }
    });
    db.get(
      'SELECT * FROM User WHERE email = ?',
      [email],
      async (err, row: any) => {
        if (err) {
          console.error('Database query error:', err);
          db.close();
          reject(new Error('Database query failed'));
          return;
        }
        
        if (!row) {
          db.close();
          reject(new Error('Invalid email or password'));
          return;
        }
        
        // Handle both plain text and hashed passwords
        let isPasswordValid = false;
        
        if (!row.password) {
          db.close();
          reject(new Error('Invalid email or password'));
          return;
        }
        
        try {
          // Check if password is hashed (starts with $2a$ or $2b$)
          if (row.password.startsWith('$2a$') || row.password.startsWith('$2b$')) {
            // Password is hashed, use bcrypt
            isPasswordValid = await bcrypt.compare(password, row.password);
          } else {
            // Password is plain text, direct comparison
            isPasswordValid = password === row.password;
          }
          
          if (!isPasswordValid) {
            db.close();
            reject(new Error('Invalid email or password'));
            return;
          }
          
          resolve({
            id: row.id,
            email: row.email,
            name: row.name || 'Admin User',
            image: row.image,
            subscriptionStatus: 'free',
            subscriptionPlan: 'free',
          });
        } catch (error) {
          console.error('Password verification error:', error);
          db.close();
          reject(new Error('Authentication failed'));
        }
        
        db.close();
      }
    );
  });
}
