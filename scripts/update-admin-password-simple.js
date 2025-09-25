const sqlite3 = require('sqlite3');
const path = require('path');

// Simple script to update admin password to plain text
const dbPath = path.join(__dirname, '..', 'apps', 'frontend', 'prisma', 'dev.db');
const newPassword = 'admin123'; // Simple plain text password

console.log('🔧 Updating admin password to plain text...');
console.log('Database path:', dbPath);
console.log('New password:', newPassword);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
  console.log('✅ Connected to database');
});

// Update the admin user password to plain text
const updateQuery = `
  UPDATE User 
  SET password = ? 
  WHERE email = 'info.kraftey@gmail.com'
`;

db.run(updateQuery, [newPassword], function(err) {
  if (err) {
    console.error('❌ Password update error:', err);
    process.exit(1);
  }

  console.log('✅ Admin password updated successfully!');
  console.log('Rows affected:', this.changes);
  
  // Verify the update
  db.get(
    'SELECT email, password FROM User WHERE email = ?',
    ['info.kraftey@gmail.com'],
    (err, row) => {
      if (err) {
        console.error('❌ Verification error:', err);
        process.exit(1);
      }

      if (row) {
        console.log('✅ Verification successful:');
        console.log('Email:', row.email);
        console.log('Password:', row.password);
        console.log('✅ Admin can now login with:');
        console.log('   Email: info.kraftey@gmail.com');
        console.log('   Password: admin123');
      } else {
        console.log('❌ Admin user not found');
      }

      db.close((err) => {
        if (err) {
          console.error('Database close error:', err);
        } else {
          console.log('✅ Database connection closed');
        }
        process.exit(0);
      });
    }
  );
});
