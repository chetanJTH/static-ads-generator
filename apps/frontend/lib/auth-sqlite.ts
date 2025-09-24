import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

// Direct SQLite authentication function
export async function authenticateUser(email: string, password: string) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('apps/frontend/prisma/dev.db');
    
    db.get(
      'SELECT * FROM User WHERE email = ?',
      [email],
      async (err, row: any) => {
        if (err) {
          console.error('🔐 [AUTH DEBUG] Database error:', err);
          reject(err);
          return;
        }
        
        console.log('🔐 [AUTH DEBUG] User found:', { 
          exists: !!row, 
          hasPassword: !!row?.password,
          userId: row?.id,
          userEmail: row?.email 
        });
        
        if (!row || !row.password) {
          console.log('🔐 [AUTH DEBUG] User not found or no password');
          reject(new Error('Invalid email or password'));
          return;
        }
        
        try {
          console.log('🔐 [AUTH DEBUG] Verifying password...');
          // Simple password comparison without bcrypt
          const isPasswordValid = password === row.password;
          console.log('🔐 [AUTH DEBUG] Password verification result:', isPasswordValid);
          
          if (!isPasswordValid) {
            console.log('🔐 [AUTH DEBUG] Password verification failed');
            reject(new Error('Invalid email or password'));
            return;
          }
          
          console.log('🔐 [AUTH DEBUG] Authentication successful');
          resolve({
            id: row.id,
            email: row.email,
            name: row.name,
            image: row.image,
            subscriptionStatus: 'free',
            subscriptionPlan: 'free',
          });
        } catch (error) {
          console.error('🔐 [AUTH DEBUG] Password verification error:', error);
          reject(error);
        }
        
        db.close();
      }
    );
  });
}
