import sqlite3 from 'sqlite3';
import path from 'path';

// Direct SQLite authentication function with hardcoded path
export async function authenticateUser(email: string, password: string) {
  return new Promise((resolve, reject) => {
    // Use environment-aware database path
    const dbPath = process.env.NODE_ENV === 'production' 
      ? path.join(process.cwd(), 'prisma', 'dev.db')
      : 'C:\\Users\\cheta\\static-ads-generator\\apps\\frontend\\prisma\\dev.db';
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
        
        // Simple password comparison - no hashing complexity
        if (!row.password || row.password !== password) {
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
        
        db.close();
      }
    );
  });
}
