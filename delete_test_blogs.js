const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'apps', 'frontend', 'prisma', 'dev.db');

console.log('🗑️  Deleting test blogs from database...');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('✅ Connected to database');
});

// Delete test blogs (you can customize this query based on your test blog criteria)
const deleteTestBlogs = () => {
  // Delete blogs with titles containing "test" or "Test" (case insensitive)
  const query = `
    DELETE FROM BlogPost 
    WHERE LOWER(title) LIKE '%test%' 
    OR LOWER(title) LIKE '%demo%'
    OR LOWER(title) LIKE '%sample%'
    OR LOWER(content) LIKE '%test blog%'
    OR LOWER(content) LIKE '%this is a test%'
  `;
  
  db.run(query, function(err) {
    if (err) {
      console.error('❌ Error deleting test blogs:', err);
    } else {
      console.log(`✅ Deleted ${this.changes} test blog(s)`);
    }
    
    // List remaining blogs
    db.all('SELECT id, title, createdAt FROM BlogPost ORDER BY createdAt DESC', (err, rows) => {
      if (err) {
        console.error('Error fetching remaining blogs:', err);
      } else {
        console.log('\n📝 Remaining blogs:');
        if (rows.length === 0) {
          console.log('   No blogs found');
        } else {
          rows.forEach((blog, index) => {
            console.log(`   ${index + 1}. ${blog.title} (${blog.createdAt})`);
          });
        }
      }
      
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('\n✅ Database connection closed');
        }
      });
    });
  });
};

// Execute the deletion
deleteTestBlogs();
