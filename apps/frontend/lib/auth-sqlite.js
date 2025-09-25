const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function authenticateUser(email, password) {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(process.cwd(), 'apps/frontend/prisma/dev.db');
    console.log('🔐 [AUTH DEBUG] Database path:', dbPath);
    
    const db = new sqlite3.Database(dbPath);
    
    db.get('SELECT * FROM User WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error('🔐 [AUTH DEBUG] Database error:', err);
        reject(err);
        return;
      }
      
      console.log('🔐 [AUTH DEBUG] User found:', { 
        exists: !!row, 
        hasPassword: !!row?.password,
        userId: row?.id,
        userEmail: row?.email,
        storedPassword: row?.password
      });
      
      if (!row || !row.password) {
        console.log('🔐 [AUTH DEBUG] User not found or no password');
        reject(new Error('Invalid email or password'));
        return;
      }
      
      console.log('🔐 [AUTH DEBUG] Verifying password...');
      console.log('🔐 [AUTH DEBUG] Input password:', password);
      console.log('🔐 [AUTH DEBUG] Stored password:', row.password);
      
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
      
      db.close();
    });
  });
}

module.exports = { authenticateUser };

